# SKILL: MONTAJES E INSTALACIÓN
---
Versión 2.1 — Familia 5 — Thin Agent

## PROPÓSITO
Gestión de servicios de montaje e instalación. Delegar a `invoke_calcular_montaje`.

## PASO 1 — RECOPILAR: BLOQUES CONVERSACIONALES
1.  **Montador**: Tipo (Plantilla, Autónomo, Electricista). Buscar ID en `montajes`. Preguntar Horas y Personas.
2.  **Horario**: normal / extra / nocturna / festiva / festiva_nocturna / festiva_autonomo.
3.  **Logística**: Zona (0-3), Km (ida/vuelat), Vehículo (furgo_pequena / grande / carrozado).
4.  **Alojamiento/Dietas**: Días y personas.
5.  **Mercancía**: ¿Cuántas cajas? (SIEMPRE preguntar).
6.  **Extras**: Andamio (días), Grúa (precio manual), Zona restringida (días).

## PASO 2 — CONSTRUIR PAYLOAD TÉCNICO
```json
{
  "montador": { "tipo_id": "[ID]", "horas": [num], "tipo_hora": "...", "personas": [num] },
  "desplazamiento": { "zona": 0|1|2|3, "km": [num], "vehiculo": "..." },
  "dietas": { "dias": [num], "personas": [num] },
  "alojamiento": { "dias": [num], "personas": [num] },
  "mercancias_cajas": [num],
  "extras": { "andamio_dias": [num], "grua_precio": [num] | null, ... }
}
```

## PASO 3 — FLUJO DE INVOCACIÓN
1. `invoke_calcular_montaje`.
2. `invoke_aplicar_margen` con `coste_total` y `m2_totales: 0`.

## PASO 4 — PRESENTACIÓN
1. Alertas (ej: aplicado mínimo de horas).
2. Desglose técnico (Horas facturadas vs solicitadas, Recargos, Logística).
3. Bloque de precio final (vía Skill Márgenes).

## PASO 5 — GUARDAR
Insertar en `partidas` con `cantidad = horas_facturadas` y descripción de zona/kilómetros.
