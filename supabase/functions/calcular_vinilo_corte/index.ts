import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

serve(async (req) => {
    const { material_id, ancho_cm, alto_cm, m2, pelado, vectorizado, superficie } = await req.json()

    const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 1. Obtener Datos Base
    const { data: material } = await supabase.from('materiales').select('*').eq('id', material_id).single()
    const { data: config } = await supabase.from('configuracion_global').select('*').single()
    const { data: maquina } = await supabase.from('maquinas').select('*').eq('id', 'plotter_summa').single()
    const { data: personal } = await supabase.from('personal').select('*').eq('id', 'p1_admin').single()

    if (!material || !config || !maquina || !personal) {
        return new Response(JSON.stringify({ error: "Datos de configuración incompletos (material/maquina/personal)" }), { status: 500 })
    }

    // 2. Cálculos Físicos
    const m2_reales = m2 || (ancho_cm / 100) * (alto_cm / 100)
    const m2_cobrables = Math.max(m2_reales, config.minimo_m2_cobrable)

    // 3. Tiempos de Mano de Obra (en Minutos)
    let tiempo_pelado = 0
    const pelado_map = { "BAJO": 15, "MEDIO": 45, "ALTO": 120 }
    tiempo_pelado = (pelado_map[pelado] || 15) * m2_reales

    let tiempo_vectorizado = 0
    const vectorizado_map = { "No": 0, "BAJO": 30, "MEDIO": 60, "ALTO": 150 }
    tiempo_vectorizado = (vectorizado_map[vectorizado] || 0)

    const tiempo_computadora = tiempo_vectorizado + (5 * m2_reales) // 5 min setup por m2
    const tiempo_plotter = maquina.minutos_m2 * m2_reales
    const tiempo_total_min = tiempo_pelado + tiempo_computadora + tiempo_plotter
    const tiempo_total_h = tiempo_total_min / 60

    // 4. Costes Técnicos
    const coste_material = m2_creales * material.precio * (1 + (material.merma || 0.1))

    // Amortización y Energía
    const coste_amortizacion = (maquina.valor_reposicion / (maquina.vida_util * 220 * 8)) * (tiempo_plotter / 60)
    const coste_energia = maquina.consumo_electrico * config.precio_kwh * (tiempo_plotter / 60)
    const coste_maquina_total = coste_amortizacion + coste_energia

    // Mano de Obra
    const coste_mano_obra = tiempo_total_h * personal.coste_hora_productiva

    // Transportadora (HT) - Si es necesario (casi siempre en vinilo de corte)
    const coste_ht = m2_reales * 3.50 // Precio estimado HT

    const coste_total = coste_material + coste_maquina_total + coste_mano_obra + coste_ht

    return new Response(
        JSON.stringify({
            coste_total: coste_total.toFixed(2),
            m2_facturados: m2_cobrables.toFixed(2),
            desglose: {
                material: coste_material.toFixed(2),
                maquina: coste_maquina_total.toFixed(2),
                mano_obra: coste_mano_obra.toFixed(2),
                ht: coste_ht.toFixed(2),
                tiempo_total_min: tiempo_total_min.toFixed(0)
            }
        }),
        { headers: { "Content-Type": "application/json" } }
    )
})
