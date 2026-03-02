# SKILL: IMPRESIÓN DIGITAL
---
Versión 2.1 — Familia 1 — Thin Agent

## PROPÓSITO
Orquestar la recogida de datos para impresión digital y laminación. Los cálculos se delegan a `invoke_calcular_impresion` y `skill-margenes.md`.

## PASO 1 — RECOPILAR: PREGUNTAS OBLIGATORIAS
1.  **Material**: "¿En qué material necesitas la impresión?". Buscar en DB: `SELECT id, nombre FROM materiales WHERE familia = 'impresion' AND nombre ILIKE '%...%'`. Clarificar si hay múltiples opciones.
2.  **Dimensiones**: "¿Cuál es el ancho y el alto en cm?". Preguntar también por **Unidades** si aplica.
3.  **Laminado**: "¿Lleva laminado protector? Si sí: ¿Brillo, mate o Veleda?". Buscar ID en DB con `familia = 'laminado'`.
4.  **Troquelado**: "¿Necesita troquelado o contorno de corte?" (SI/NO).
5.  **Soporte Rígido**: Si el usuario indica que va sobre rígido, preguntar material/grosor y buscar ID en `familia = 'rigido'`.

## PASO 2 — CONSTRUIR PAYLOAD TÉCNICO
```json
{
  "material_id": "[ID]",
  "ancho_cm": [número],
  "alto_cm": [número],
  "unidades": [número o 1],
  "laminado_id": "[ID]" | null,
  "troquelado": true | false,
  "soporte_rigido_id": "[ID]" | null,
  "complejidad": "BAJO" | "MEDIO" | "ALTO"
}
```

## PASO 3 — FLUJO DE INVOCACIÓN
1. Llamar a `invoke_calcular_impresion`.
2. Inmediatamente llamar a `invoke_aplicar_margen` (Skill Márgenes) usando el `coste_total` devuelto.

## PASO 4 — PRESENTACIÓN
Mostrar alertas del backend -> Desglose técnico -> Bloque de precio final (vía Skill Márgenes).

## PASO 5 — GUARDAR
Confirmar y guardar en `partidas` incluyendo el payload y respuesta en `metadatos_calculo`.
