import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

serve(async (req) => {
    // Recibimos el ID y el nombre de la tabla (muebles_exm, muebles_nail, o muebles_duñas)
    const { item_id, table_name = 'muebles_catalogo' } = await req.json()

    const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 1. Buscamos el mueble en la tabla especificada
    const { data: mueble, error } = await supabase
        .from(table_name)
        .select('*')
        .eq('id', item_id)
        .single()

    if (error || !mueble) {
        return new Response(JSON.stringify({ error: `Mueble no encontrado en ${table_name}` }), {
            status: 404,
            headers: { "Content-Type": "application/json" }
        })
    }

    // 2. Aplicamos la fórmula de contrato: PVP = Coste / (1 - Margen Pactado)
    const pvp_final = mueble.coste / (1 - (mueble.margen_pactado || 0))

    // 3. Devolvemos el precio exacto
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
