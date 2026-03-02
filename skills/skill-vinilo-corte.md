# SKILL: VINILOS DE CORTE
---
Versión 2.2 — Familia 2 — Thin Agent

## PROPÓSITO
Recogida de datos para vinilo de corte (plotter) sin impresión. Delegar a `invoke_calcular_vinilo_corte`.

## PASO 1 — RECOPILAR: PREGUNTAS OBLIGATORIAS
1.  **Material**: "¿Qué tipo de vinilo de corte necesitas?". Buscar en DB: `SELECT id, nombre FROM materiales WHERE familia = 'vinilo_corte' AND nombre ILIKE '%...%'`.
2.  **Dimensiones**: Ancho y alto en cm o m² directos.
3.  **Pelado**: ¿Complejidad? (BAJO / MEDIO / ALTO).
4.  **Vectorizado**: ¿Requiere vectorizado? (No / BAJO / MEDIO / ALTO).
5.  **Superficie**: "¿Donde va aplicado?" (Pared / Cristal / Vehículo / Suelo / Otro). El backend gestiona si requiere HT.

## PASO 2 — CONSTRUIR PAYLOAD TÉCNICO
```json
{
  "material_id": "[ID]",
  "ancho_cm": [num] | null,
  "alto_cm": [num] | null,
  "m2": [num] | null,
  "pelado": "BAJO" | "MEDIO" | "ALTO",
  "vectorizado": "No" | "BAJO" | "MEDIO" | "ALTO",
  "superficie": "pared" | "cristal" | "vehiculo" | "suelo" | "otro"
}
```

## PASO 3 — FLUJO DE INVOCACIÓN
1. `invoke_calcular_vinilo_corte`.
2. `invoke_aplicar_margen` con `coste_total` y `m2_facturados`.

## PASO 4 — PRESENTACIÓN
1. Alertas: ℹ️ [texto]
2. Desglose técnico (Material, Medidas, Pelado, Vectorizado, HT/Laminado HT añadido automáticamente).
3. Desglose de costes (Summa, Vinilo, Pelado, Transportadora, etc.).
4. Bloque de precio final (vía Skill Márgenes).

## PASO 5 — GUARDAR
Insertar en `partidas` con descripción detallada y todos los metadatos de cálculo.
