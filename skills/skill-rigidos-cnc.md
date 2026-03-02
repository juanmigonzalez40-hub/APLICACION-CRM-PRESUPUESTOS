# SKILL: MATERIALES RÍGIDOS + CNC
---
Versión 2.1 — Familia 3 — Thin Agent

## PROPÓSITO
Recogida de datos para corte y mecanizado CNC de materiales rígidos. Delegar a `invoke_calcular_rigidos_cnc`.

## PASO 1 — RECOPILAR: PREGUNTAS OBLIGATORIAS
1.  **Material**: "¿Qué material rígido necesitas y de qué grosor?". Buscar en DB: `SELECT id, nombre, tamano_plancha FROM materiales WHERE familia = 'rigido' AND nombre ILIKE '%...%'`.
2.  **Dimensiones**: Ancho y alto en cm. Recoger múltiples piezas si aplica (array).
3.  **Mecanizado CNC**: ¿Fresa BARATA o CARA? ¿Complejidad (BAJO / MEDIO / ALTO)? ¿Personas (1 o 2)?
4.  **Canteado**: ¿Cuántos metros lineales?
5.  **Laminado**: ¿Tipo de laminado/chapado? Buscar ID en `familia = 'laminado'`.

## PASO 2 — CONSTRUIR PAYLOAD TÉCNICO
```json
{
  "piezas": [ { "material_id": "[ID]", "ancho_cm": [num], "alto_cm": [num] } ],
  "cnc": { "activo": true, "fresa": "BARATA" | "CARA", "complejidad_cam": "BAJO" | "MEDIO" | "ALTO", "personas": 1 | 2 },
  "canteado_ml": [num] | null,
  "laminado_id": "[ID]" | null
}
```

## PASO 3 — FLUJO DE INVOCACIÓN
1. `invoke_calcular_rigidos_cnc`.
2. `invoke_aplicar_margen` con `coste_total` y `m2_facturados` acumulados.

## PASO 4 — PRESENTACIÓN
1. Mostrar alertas del backend.
2. Desglose por pieza (m2 real, m2 facturados, criterio de facturación).
3. Desglose de costes CNC (tiempo, pasadas, máquina, operario, etc.).
4. Bloque de precio final (vía Skill Márgenes).

## PASO 5 — GUARDAR
Insertar en `partidas` con descripción de material, dimensiones y metadatos completos.
