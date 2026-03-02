import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

serve(async (req) => {
    const { muebles } = await req.json()

    const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { data: personal } = await supabase.from('personal').select('*').eq('id', 'p5p6_ensamblaje').single()

    let total_coste_proyecto = 0
    const resultados_muebles = await Promise.all(muebles.map(async (m: any) => {
        if (m.catalogo) {
            // Mueble de Catálogo
            const { data: mueble_cat } = await supabase.from('muebles_catalogo').select('*').eq('id', m.catalogo_datos.mueble_id).single()
            const coste = mueble_cat?.coste || 0
            total_coste_proyecto += coste
            return {
                id_mueble: m.id_mueble,
                descripcion: mueble_cat?.nombre || "Mueble Catálogo",
                coste_mueble: coste,
                catalogo: true
            }
        } else {
            // Mueble a Medida
            const { data: material } = await supabase.from('materiales').select('*').eq('id', m.material_principal_id).single()
            const { frente_cm, fondo_cm, alto_cm } = m.medidas

            // Cálculo de superficies (m2)
            const s_costados = 2 * (fondo_cm / 100) * (alto_cm / 100)
            const s_techo_suelo = 2 * (frente_cm / 100) * (fondo_cm / 100)
            const s_trasera = (frente_cm / 100) * (alto_cm / 100)

            let m2_total = s_costados + s_techo_suelo + s_trasera

            // Baldas
            if (m.estructura.baldas_fijas?.cantidad) m2_total += m.estructura.baldas_fijas.cantidad * (frente_cm / 100) * (fondo_cm / 100)

            const coste_material = m2_total * (material?.precio || 0) * 1.15 // 15% merma carpintería
            const coste_ensamblaje = m.mano_obra.horas * (personal?.coste_hora_productiva || 40)

            // Extras
            let coste_extras = 0
            if (m.estructura.puertas_abatibles?.cantidad) coste_extras += m.estructura.puertas_abatibles.cantidad * 8.50 // Precio bisagra + mecanizado
            if (m.electricidad?.length) coste_extras += m.electricidad.length * 25.0 // Precio base por punto luz

            const coste_mueble = coste_material + coste_ensamblaje + coste_extras
            total_coste_proyecto += coste_mueble

            return {
                id_mueble: m.id_mueble,
                descripcion: m.descripcion,
                coste_mueble: coste_mueble,
                catalogo: false,
                desglose: {
                    material: coste_material,
                    ensamblaje: coste_ensamblaje,
                    extras: coste_extras
                }
            }
        }
    }))

    return new Response(
        JSON.stringify({
            muebles: resultados_muebles,
            coste_total_proyecto: total_coste_proyecto.toFixed(2)
        }),
        { headers: { "Content-Type": "application/json" } }
    )
})
