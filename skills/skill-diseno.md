# SKILL: DISEÑO / INTERIORISMO
---
Versión 2.1 — Familia 8 — Thin Agent

## PROPÓSITO
Tarificación de diseño y branding. Delegar a `invoke_calcular_diseno`.

## PASO 1 — RECOPILAR: PREGUNTAS OBLIGATORIAS
1. **Pack y Zona**: IMPACTO / REACTIVA / CONCEPTUAL y Zona 0-3.
2. **Superficie/Planos**: Si pack > Impacto -> m2 y si aporta planos CAD (Recargo +15% si no).
3. **Branding/Naming**: Opcionales (Express, Standard, Pro, Premium / Básico, Avanzado).
4. **Horas Extra**: Cantidad manual.
5. **Doble Impacto**: `SELECT count(*) FROM partidas WHERE presupuesto_id = '...' AND familia IN ('mobiliario', 'rigidos')`. `proyecto_retail_asociado = true` si count > 0.

## PASO 2 — CONSTRUIR PAYLOAD TÉCNICO
`pack, zona, m2, planos_cad, branding, naming, horas_extra, proyecto_retail_asociado`.

## PASO 3 — FLUJO DE INVOCACIÓN
1. `invoke_calcular_diseno`.
2. `invoke_aplicar_margen` con `coste_total` y `m2_totales: 0`.

## PASO 4 — PRESENTACIÓN
1. Alertas (Suplementos, Doble Impacto).
2. Desglose detallado (Pack base, suplementos, Branding/Naming con descuentos).
3. Bloque de precio final (vía Skill Márgenes).
4. **Condiciones**: Listar array de condiciones del backend (Cashback, Pago 100% adelanto, etc.).

## PASO 5 — GUARDAR
Insertar en `partidas` con descripción del pack y condiciones en `metadatos_calculo`.
