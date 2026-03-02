import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

serve(async (req) => {
    const { montador, desplazamiento, dietas, alojamiento, mercancias_cajas, extras } = await req.json()

    const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 1. Obtener Datos Base
    const { data: config } = await supabase.from('configuracion_global').select('*').single()
    const { data: montador_db } = await supabase.from('montajes').select('*').eq('id', montador.tipo_id).single()
    const { data: vehiculo_db } = await supabase.from('montajes').select('*').eq('tipo', `KM ${desplazamiento.vehiculo.replace('_', ' ').toUpperCase()}`).single()

    // 2. Cálculo de Personal
    const horas_reales = Math.max(montador.horas, montador_db?.minimo_horas || 0)
    let precio_hora = montador_db?.precio || 22.0

    // Recargos Horarios (Simplificado)
    if (montador.tipo_hora !== 'normal') precio_hora *= 1.5

    const coste_personal = horas_reales * precio_hora * montador.personas

    // 3. Logística (Desplazamiento)
    const zona_precios = { 0: 0, 1: 150, 2: 350, 3: 550 }
    const coste_zona = zona_precios[desplazamiento.zona] || 0
    const coste_km = desplazamiento.km * (vehiculo_db?.precio || 0.50)

    const coste_logistica = coste_zona + coste_km

    // 4. Dietas y Alojamientos
    const coste_dietas = dietas.dias * dietas.personas * 50.0 // Tarifa fija 50€/día
    const coste_alojamiento = alojamiento.dias * alojamiento.personas * 80.0 // Tarifa fija 80€/noche

    // 5. Mercancías
    let coste_mercancias = 0
    if (mercancias_cajas > config.mercancias_cajas_gratis) {
        coste_mercancias = (mercancias_cajas - config.mercancias_cajas_gratis) * config.mercancias_precio_caja
    }

    // 6. Extras
    const coste_extras = extras.andamio_dias * 45.0 + (extras.grua_precio || 0)

    const coste_total = coste_personal + coste_logistica + coste_dietas + coste_alojamiento + coste_mercancias + coste_extras

    return new Response(
        JSON.stringify({
            coste_total: coste_total.toFixed(2),
            horas_facturadas: horas_reales,
            desglose: {
                personal: coste_personal.toFixed(2),
                logistica: coste_logistica.toFixed(2),
                dietas: (coste_dietas + coste_alojamiento).toFixed(2),
                mercancias: coste_mercancias.toFixed(2),
                extras: coste_extras.toFixed(2)
            },
            alertas: horas_reales > montador.horas ? [`Se ha aplicado el mínimo de ${montador_db.minimo_horas} horas.`] : []
        }),
        { headers: { "Content-Type": "application/json" } }
    )
})
