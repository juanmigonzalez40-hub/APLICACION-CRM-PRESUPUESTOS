import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

serve(async (req) => {
    // Recibimos el ID del mueble que el Agente ha identificado
    const { item_id } = await req.json()

    const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 1. Buscamos el mueble en tu tabla de catálogo
    const { data: mueble, error } = await supabase
        .from('muebles_catalogo')
        .select('*')
        .eq('id', item_id)
        .single()

    if (error || !mueble) {
        return new Response(JSON.stringify({ error: "Mueble no encontrado" }), {
            status: 404,
            headers: { "Content-Type": "application/json" }
        })
    }

    // 2. Aplicamos la fórmula de contrato: PVP = Coste / (1 - Margen Pactado)
    // Nota: Si el margen es 0.54, el divisor es 0.46
    const pvp_final = mueble.coste / (1 - mueble.margen_pactado)

    // 3. Devolvemos el precio exacto al Agente
    return new Response(
        JSON.stringify({
            nombre: mueble.nombre,
            marca: mueble.marca,
            pvp: pvp_final.toFixed(2),
            coste_base: mueble.coste
        }),
        { headers: { "Content-Type": "application/json" } }
    )
})
