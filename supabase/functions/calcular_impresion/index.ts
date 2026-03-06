import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

serve(async (req) => {
    const {
        material_id,
        ancho,
        alto,
        laminado_id,
        troquelado,
        complejidad = "MEDIA",
        tipo_cliente = "cliente_final"
    } = await req.json()

    const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 1. Obtener Datos de Materiales (para precios base si son dinámicos, aunque la guía da fijos)
    const { data: material } = await supabase.from('materiales').select('*').eq('id', material_id).single()
    const { data: laminado } = laminado_id ? await supabase.from('materiales').select('*').eq('id', laminado_id).single() : { data: null }

    // 2. Definir Constantes Oficiales (Guía para Agente IA)
    const CONST = {
        IMP_ESTRUCTURAL: 10.14,
        IMP_FIJO: 3.74,
        IMP_PREP_MEDIA: 4.48,
        IMP_PREP_BAJA: 1.49,
        IMP_PREP_ALTA: 8.97,

        LAM_ESTRUCTURAL: 2.83,
        LAM_MATERIAL: 1.66,
        LAM_FIJO: 2.50,

        CORTE_ESTRUCTURAL: 2.91,
        CORTE_FIJO: 3.25,
        CORTE_TRAZADO_MEDIO: 2.99,
        CORTE_TRAZADO_BAJO: 1.49,
        CORTE_TRAZADO_ALTO: 8.97
    }

    // 3. Cálculos de Superficie
    const m2_reales = (ancho / 100) * (alto / 100)
    const m2_cobrables = Math.max(m2_reales, 1.0) // Mínimo 1m2 según lógica estándar

    // 4. CÁLCULO DE COSTES (Siguiendo Algoritmo de la Guía)
    let coste_total = 0

    // A. Impresión HP Latex (Siempre se incluye en esta función)
    coste_total += m2_reales * CONST.IMP_ESTRUCTURAL
    coste_total += m2_reales * (material?.precio || 1.35) // Precio del material (ya incluye merma)
    coste_total += CONST.IMP_FIJO

    // Preparación Archivo
    if (complejidad === "BAJA") coste_total += CONST.IMP_PREP_BAJA
    else if (complejidad === "ALTA") coste_total += CONST.IMP_PREP_ALTA
    else coste_total += CONST.IMP_PREP_MEDIA // MEDIA por defecto

    // B. Laminado (Opcional)
    if (laminado_id) {
        coste_total += m2_reales * CONST.LAM_ESTRUCTURAL
        coste_total += m2_reales * (laminado?.precio || CONST.LAM_MATERIAL)
        coste_total += CONST.LAM_FIJO
    }

    // C. Corte de Contorno (Opcional - Summa Plotter)
    if (troquelado === "SÍ" || troquelado === true) {
        coste_total += m2_reales * CONST.CORTE_ESTRUCTURAL
        coste_total += CONST.CORTE_FIJO

        if (complejidad === "BAJA") coste_total += CONST.CORTE_TRAZADO_BAJO
        else if (complejidad === "ALTA") coste_total += CONST.CORTE_TRAZADO_ALTO
        else coste_total += CONST.CORTE_TRAZADO_MEDIO
    }

    // 5. Aplicar Margen (Recuperar de la DB según m2)
    const { data: margen } = await supabase.from('margenes')
        .select(tipo_cliente === 'agencia' ? 'margen_agencia' : 'margen_cliente_final')
        .lte('desde_m2', m2_cobrables)
        .gt('hasta_m2', m2_cobrables)
        .single()

    const factor_margen = margen ? (tipo_cliente === 'agencia' ? margen.margen_agencia : margen.margen_cliente_final) : 0.60
    const pvp = coste_total / (1 - factor_margen)

    return new Response(
        JSON.stringify({
            coste_total: coste_total.toFixed(2),
            precio_venta: pvp.toFixed(2),
            margen_aplicado: (factor_margen * 100).toFixed(0) + "%",
            m2_reales: m2_reales.toFixed(2),
            m2_cobrados: m2_cobrables.toFixed(2),
            desglose: {
                impresion: (m2_reales * (CONST.IMP_ESTRUCTURAL + (material?.precio || 1.35))).toFixed(2),
                fijos_y_prep: (CONST.IMP_FIJO + CONST.IMP_PREP_MEDIA).toFixed(2),
                laminado: laminado_id ? (m2_reales * (CONST.LAM_ESTRUCTURAL + (laminado?.precio || CONST.LAM_MATERIAL)) + CONST.LAM_FIJO).toFixed(2) : "0.00",
                corte: (troquelado === "SÍ" || troquelado === true) ? (m2_reales * CONST.CORTE_ESTRUCTURAL + CONST.CORTE_FIJO + CONST.CORTE_TRAZADO_MEDIO).toFixed(2) : "0.00"
            }
        }),
        { headers: { "Content-Type": "application/json" } }
    )
})
