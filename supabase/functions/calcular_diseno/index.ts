// @ts-ignore: Deno module
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
// @ts-ignore: Deno module
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

declare const Deno: { env: { get(key: string): string | undefined } }

serve(async (req: Request) => {
    const { pack, zona, m2, planos_cad, branding, naming, horas_extra, proyecto_retail_asociado } = await req.json()

    const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 1. Pack Base
    const pack_precios: Record<string, number> = { "impacto": 1700.0, "reactiva": 2800.0, "conceptual": 4500.0 }
    let coste_total = pack_precios[pack] || 1700.0
    let desglose: Record<string, number> = { pack_base: coste_total }

    // 2. Suplemento m2 (>60m2)
    if (pack !== 'impacto' && m2 > 60) {
        const extra_m2 = m2 - 60
        const coste_m2 = extra_m2 * 12.0
        coste_total += coste_m2
        desglose.suplemento_m2 = coste_m2
    }

    // 3. Suplemento Sin CAD (+15%)
    if (pack !== 'impacto' && !planos_cad) {
        const recargo_cad = coste_total * 0.15
        coste_total += recargo_cad
        desglose.suplemento_sin_cad = recargo_cad
    }

    // 4. Branding y Naming
    const branding_precios: Record<string, number> = { "express": 400.0, "standard": 800.0, "pro": 1500.0, "premium": 3000.0 }
    const naming_precios: Record<string, number> = { "basico": 300.0, "avanzado": 600.0 }

    let coste_identidad = (branding_precios[branding] || 0) + (naming_precios[naming] || 0)

    // Descuento Doble Impacto (-15% en identidad)
    if (proyecto_retail_asociado && coste_identidad > 0) {
        const descuento = coste_identidad * 0.15
        coste_identidad -= descuento
        desglose.descuento_doble_impacto = -descuento
    }

    coste_total += coste_identidad
    desglose.branding_naming = coste_identidad

    // 5. Horas Extra
    if (horas_extra) {
        const { data: personal } = await supabase.from('personal').select('*').eq('id', 'p2_diseno').single()
        const coste_horas = horas_extra * (personal?.coste_hora_productiva || 40.0)
        coste_total += coste_horas
        desglose.horas_extra = coste_horas
    }

    // 6. Logística
    const zona_precios: Record<number, number> = { 0: 0, 1: 150, 2: 350, 3: 550 }
    coste_total += zona_precios[zona] || 0
    desglose.logistica = zona_precios[zona] || 0

    return new Response(
        JSON.stringify({
            coste_total: coste_total.toFixed(2),
            desglose: desglose,
            condiciones: [
                "Pago 100% por adelantado.",
                "Validez del presupuesto: 15 días naturales.",
                "Cashback: 50% del coste de diseño descontado de producción (si aplica)."
            ]
        }),
        { headers: { "Content-Type": "application/json" } }
    )
})
