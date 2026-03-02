import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

serve(async (req) => {
    const { material_id, ancho, alto, cantidad, tipo_cliente } = await req.json()

    // 1. Conexión con la despensa (Base de Datos)
    const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 2. Traer ingredientes (Datos de tablas)
    const { data: material } = await supabase.from('materiales_unificados').select('*').eq('id', material_id).single()
    const { data: config } = await supabase.from('configuracion_global').select('*').single()
    const { data: maquina } = await supabase.from('maquinas').select('*').eq('id', 'hp_latex').single()

    if (!material || !config || !maquina) {
        return new Response(JSON.stringify({ error: "Datos de configuración incompletos" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        })
    }

    // 3. LA LÓGICA DE EXCEL (Cálculos infalibles)
    const m2_reales = (ancho / 100) * (alto / 100) * (cantidad || 1)
    const m2_cobrables = Math.max(m2_reales, config.minimo_m2_cobrable)

    // Coste de Material + Merma
    const coste_material = m2_reales * material.precio * (1 + (material.merma || 0))

    // Coste de Energía y Desgaste (Amortización)
    const coste_luz = (maquina.consumo_electrico * config.precio_kwh) * (maquina.minutos_m2 / 60) * m2_reales
    const coste_maquina = (maquina.valor_reposicion / (maquina.vida_util * 220 * 8)) * (maquina.minutos_m2 / 60) * m2_reales

    const coste_total_produccion = coste_material + coste_luz + coste_maquina

    // 4. Aplicar Margen comercial
    const query = supabase.from('margenes')
        .select(tipo_cliente === 'agencia' ? 'margen_agencia' : 'margen_cliente_final')
        .lte('desde_m2', m2_cobrables)
        .gt('hasta_m2', m2_cobrables)
        .single()

    const { data: margen } = await query

    const factor_margen = margen ? (tipo_cliente === 'agencia' ? margen.margen_agencia : margen.margen_cliente_final) : 0.5; // Default if not found
    const pvp_final = coste_total_produccion / (1 - factor_margen)

    // 5. Resultado para el Agente
    return new Response(
        JSON.stringify({
            pvp: pvp_final.toFixed(2),
            detalles: {
                coste: coste_total_produccion.toFixed(2),
                m2: m2_reales.toFixed(2)
            }
        }),
        { headers: { "Content-Type": "application/json" } }
    )
})
