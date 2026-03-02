import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

serve(async (req) => {
    const { piezas, cnc, canteado_ml, laminado_id } = await req.json()

    const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 1. Obtener Datos
    const { data: config } = await supabase.from('configuracion_global').select('*').single()
    const { data: maquina } = await supabase.from('maquinas').select('*').eq('id', 'cnc').single()
    const { data: personal } = await supabase.from('personal').select('*').eq('id', 'p3p4_carpinteria').single()

    if (!config || !maquina || !personal) {
        return new Response(JSON.stringify({ error: "Configuración de CNC incompleta" }), { status: 500 })
    }

    const tiempos_material = maquina.parametros_extra?.tiempos_material || {}

    // 2. Cálculos por Pieza
    let total_coste_material = 0
    let total_m2_real = 0
    let total_m2_facturado = 0
    let total_tiempo_cnc_min = 0

    const piezas_con_coste = await Promise.all(piezas.map(async (p: any) => {
        const { data: material } = await supabase.from('materiales').select('*').eq('id', p.material_id).single()
        const m2_pieza = (p.ancho_cm / 100) * (p.alto_cm / 100)
        const m2_facturado = Math.max(m2_pieza, 1.0) // Mínimo 1m2 por pieza según regla general

        total_coste_material += m2_pieza * (material?.precio || 0) * (1 + (material?.merma || 0.1))
        total_m2_real += m2_pieza
        total_m2_facturado += m2_facturado

        // Tiempo CNC (minutos)
        const material_nombre_simon = material?.nombre?.toLowerCase() || ""
        let speed = 200 // Default dibond
        if (material_nombre_simon.includes("mdf") || material_nombre_simon.includes("dm") || material_nombre_simon.includes("madera")) speed = 132
        if (material_nombre_simon.includes("metacrilato")) speed = 400
        if (material_nombre_simon.includes("aluminio")) speed = 800

        total_tiempo_cnc_min += m2_pieza * speed

        return { ...p, m2_real: m2_pieza, m2_facturado }
    }))

    // 3. Ajustes por Complejidad
    const complexity_map = { "BAJO": 1.0, "MEDIO": 1.5, "ALTO": 3.0 }
    const factor_complejidad = complexity_map[cnc.complejidad_cam] || 1.0
    const tiempo_operario_min = total_tiempo_cnc_min * factor_complejidad

    // 4. Costes de Máquina y Personal
    const coste_amortizacion = (maquina.valor_reposicion / (maquina.vida_util * 220 * 8)) * (total_tiempo_cnc_min / 60)
    const coste_energia = maquina.consumo_electrico * config.precio_kwh * (total_tiempo_cnc_min / 60)
    const coste_operario = (tiempo_operario_min / 60) * (personal.coste_hora_productiva / (personal.n_personas || 1))

    // 5. Canteado y Laminado
    let coste_canteado = 0
    if (canteado_ml) {
        coste_canteado = canteado_ml * 2.50 // Coste estimado por metro
    }

    const coste_total = total_coste_material + coste_amortizacion + coste_energia + coste_operario + coste_canteado

    return new Response(
        JSON.stringify({
            coste_total: coste_total.toFixed(2),
            m2_totales: total_m2_facturado.toFixed(2),
            piezas: piezas_con_coste,
            cnc: {
                tiempo_min: total_tiempo_cnc_min.toFixed(1),
                coste_maquina: (coste_amortizacion + coste_energia).toFixed(2),
                coste_operario: coste_operario.toFixed(2)
            },
            canteado: { cost: coste_canteado.toFixed(2) }
        }),
        { headers: { "Content-Type": "application/json" } }
    )
})
