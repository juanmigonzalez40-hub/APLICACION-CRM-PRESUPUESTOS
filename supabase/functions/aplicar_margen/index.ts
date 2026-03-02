import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

serve(async (req) => {
    const { coste_total, m2_totales, tipo_cliente, extra_premium, descuento, margen_manual } = await req.json()

    const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 1. Obtener márgenes configurados
    const m2 = m2_totales || 0
    let factor_margen = 0

    if (margen_manual !== undefined && margen_manual !== null) {
        factor_margen = parseFloat(margen_manual)
    } else {
        const { data: margen } = await supabase.from('margenes')
            .select(tipo_cliente === 'agencia' ? 'margen_agencia' : 'margen_cliente_final')
            .lte('desde_m2', m2)
            .gt('hasta_m2', m2)
            .single()

        factor_margen = margen ? (tipo_cliente === 'agencia' ? margen.margen_agencia : margen.margen_cliente_final) : 0.5
    }

    // 2. Aplicar Extra Premium (puntos porcentuales)
    if (extra_premium) {
        factor_margen += (extra_premium / 100)
    }

    // 3. Calcular Precio de Venta (PVP)
    // Fórmula: PVP = Coste / (1 - Margen)
    let pvp = coste_total / (1 - factor_margen)

    // 4. Aplicar Descuento Final (sobre el PVP)
    if (descuento) {
        pvp = pvp * (1 - (descuento / 100))
    }

    const base_imponible = pvp
    const iva = base_imponible * 0.21
    const total = base_imponible + iva

    return new Response(
        JSON.stringify({
            margen_final: factor_margen.toFixed(4),
            precio_venta: pvp.toFixed(2),
            base_imponible: base_imponible.toFixed(2),
            iva: iva.toFixed(2),
            total: total.toFixed(2),
            alerta_minimo: factor_margen < 0.25 ? "Margen por debajo del mínimo de seguridad (25%)" : null
        }),
        { headers: { "Content-Type": "application/json" } }
    )
})
