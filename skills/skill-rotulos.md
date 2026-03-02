# SKILL: RÓTULOS
---
Versión 2.2 — Familia 7 — Thin Agent

## PROPÓSITO
Gestión para fabricación externa (rotulatumismo.com). Sin cálculo técnico propio.

## PASO 1 — GUIAR AL CONFIGURADOR EXTERNO
Informar sobre https://www.rotulatumismo.com. El usuario debe obtener el coste sin IVA antes de proceder.

## PASO 2 — RECOPILAR: DATOS OBLIGATORIOS
1. **Descripción**: ¿Cómo se describe el rótulo?
2. **Precio de coste**: Coste exacto del proveedor (sin IVA).
3. **Margen**: 50% a 80% (65% por defecto).
4. **SVG**: ¿Vectorizado adjunto o pendiente?

## PASO 3 — INVOCAR MÁRGENES
Construir payload directo para `invoke_aplicar_margen`:
```json
{
  "coste_total": [coste proveedor],
  "m2_totales": 0,
  "tipo_cliente": "...",
  "margen_manual": [0.XX],
  "extra_premium": 0,
  "descuento": 0
}
```

## PASO 4 — PRESENTACIÓN
1. Alertas: ⚠️ Alerta de margen bajo si aplica.
2. Estado SVG: Si pendiente, aviso 📎 ⚠️ "SVG pendiente".
3. Bloque de precio final (vía Skill Márgenes).

## PASO 5 — GUARDAR
Insertar en `partidas` con `familia: rotulos` y metadatos de margen.
