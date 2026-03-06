import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

/**
 * TIPOS DE TRABAJO (según correccion_plotters.md):
 * - TIPO 4: Vinilo de corte sin imprimir → PLOTER_Corte
 *   Incluye: vinilo + corte + pelado + transportador + fijos + vectorizado
 *
 * NOTA: Los tipos 1, 2 y 3 (con impresión HP Latex) se calculan en calcular_impresion.
 */

const CORSHEADERS = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
}

serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "*" } })
    }

    try {
        const {
            material_id,
            ancho_cm,
            alto_cm,
            m2,
            complejidad = "MEDIA",   // BAJA | MEDIA | ALTA
            vectorizado = "No",      // No | BAJA | MEDIA | ALTA
            con_pelado = true,
            con_transportador = true,
            unidades = 1,
            tipo_cliente = "cliente_final"
        } = await req.json()

        const supabase = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        // ── 1. Datos de configuración y material ───────────────────────────
        const [{ data: material }, { data: config }, { data: maquina_corte }, { data: personal }] = await Promise.all([
            supabase.from('materiales').select('*').eq('id', material_id).single(),
            supabase.from('configuracion_global').select('*').single(),
            // Para el PLOTER_Corte (vinilo sin imprimir) buscamos la máquina de corte
            // Si no existe 'ploter_corte' en BD, usamos 'plotter_summa' (misma mecánica de corte)
            supabase.from('maquinas').select('*').eq('id', 'plotter_summa').single(),
            supabase.from('personal').select('*').eq('id', 'p1_admin').single()
        ])

        if (!material || !config) {
            return new Response(JSON.stringify({ error: "Datos de configuración incompletos" }), { status: 500, headers: CORSHEADERS })
        }

        // ── 2. Superficie ──────────────────────────────────────────────────
        const m2_reales = m2 || ((ancho_cm / 100) * (alto_cm / 100)) * (unidades || 1)
        const m2_cobrables = Math.max(m2_reales, config.minimo_m2_cobrable || 0.5)

        // ── 3. Constantes del proceso PLOTER_Corte ────────────────────────
        // Basadas en la guía correccion_plotters.md (son costes estructurales validados)
        const COST = {
            // Material: precio del vinilo de corte (de la BD)
            vinilo_m2: material.precio || 3.40,     // VC3-BRBN = 3.40 €/m² en BD

            // Proceso de corte
            corte_m2: 2.91,   // Coste corte plotter por m²
            fijos_corte: 3.25,   // Coste fijo por trabajo (arranque máquina)

            // Pelado (quitar sobrantes) — según complejidad
            pelado_m2: {
                BAJA: 1.25,
                MEDIA: 4.99,
                ALTA: 11.23,
            },

            // Transportador (HT)
            transportador_m2: 1.31,

            // Vectorizado (coste fijo por trabajo)
            vectorizado: {
                No: 0,
                BAJA: 1.49,
                MEDIA: 5.98,
                ALTA: 13.45,
            }
        }

        // ── 4. Cálculo de costes (TIPO 4: Vinilo de corte sin imprimir) ──
        const coste_vinilo = m2_reales * COST.vinilo_m2
        const coste_corte = m2_reales * COST.corte_m2
        const coste_fijos = COST.fijos_corte
        const coste_pelado = con_pelado ? m2_reales * (COST.pelado_m2[complejidad] ?? COST.pelado_m2.MEDIA) : 0
        const coste_transportador = con_transportador ? m2_reales * COST.transportador_m2 : 0
        const coste_vectorizado = COST.vectorizado[vectorizado] ?? 0

        // También añadimos amortización y energía de la máquina si disponemos de datos
        let coste_maquina = 0
        if (maquina_corte && personal) {
            const tiempo_plotter_h = (maquina_corte.minutos_m2 * m2_reales) / 60
            const amortizacion = (maquina_corte.valor_reposicion / (maquina_corte.vida_util * 220 * 8)) * tiempo_plotter_h
            const energia = maquina_corte.consumo_electrico * (config.precio_kwh || 0.45) * tiempo_plotter_h
            coste_maquina = amortizacion + energia
        }

        const coste_total = coste_vinilo + coste_corte + coste_fijos + coste_pelado + coste_transportador + coste_vectorizado + coste_maquina

        // ── 5. Margen y PVP ───────────────────────────────────────────────
        const { data: margenData } = await supabase.from('margenes')
            .select(tipo_cliente === 'agencia' ? 'margen_agencia' : 'margen_cliente_final')
            .lte('desde_m2', m2_cobrables)
            .gt('hasta_m2', m2_cobrables)
            .single()

        const factor_margen = margenData
            ? (tipo_cliente === 'agencia' ? margenData.margen_agencia : margenData.margen_cliente_final)
            : 0.60
        const precio_venta = coste_total / (1 - factor_margen)

        // ── 6. Respuesta ──────────────────────────────────────────────────
        return new Response(
            JSON.stringify({
                tipo_trabajo: "TIPO_4_VINILO_CORTE",
                coste_total: coste_total.toFixed(2),
                precio_venta: precio_venta.toFixed(2),
                margen_aplicado: (factor_margen * 100).toFixed(0) + "%",
                m2_reales: m2_reales.toFixed(3),
                m2_cobrados: m2_cobrables.toFixed(2),
                desglose: {
                    vinilo: coste_vinilo.toFixed(2),
                    corte: coste_corte.toFixed(2),
                    fijos_arranque: coste_fijos.toFixed(2),
                    pelado: coste_pelado.toFixed(2),
                    transportador: coste_transportador.toFixed(2),
                    vectorizado: coste_vectorizado.toFixed(2),
                    maquina_amort: coste_maquina.toFixed(2),
                },
                parametros: {
                    complejidad,
                    vectorizado,
                    con_pelado,
                    con_transportador,
                }
            }),
            { headers: CORSHEADERS }
        )

    } catch (err) {
        return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: CORSHEADERS })
    }
})
