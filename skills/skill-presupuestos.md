# SKILL: PRESUPUESTOS
---
Versión 2.1 — Transversal — Thin Agent

## PROPÓSITO
Gestión del ciclo de vida del presupuesto. PostgreSQL maneja sumatorios, IVA y referencias vía Triggers/Sequences.

## MÓDULO 1 — GESTIÓN DE CLIENTES
1.  **Selección**: `SELECT id, nombre, empresa, tipo_cliente FROM clientes WHERE activo = true`.
2.  **Creación**: Recoger Nombre, Empresa, Teléfono, Email, Tipo. `supabase_insert` en `clientes`.

## MÓDULO 2 — CREAR PRESUPUESTO
`supabase_insert` en `presupuestos` enviando solo `cliente_id` y `estado: 'borrador'`. La DB genera la `referencia`, `fecha_creacion` y `fecha_validez`.

## MÓDULO 3 — GESTIÓN DE PARTIDAS
`supabase_insert` en `partidas`. La DB recalcula totales en `presupuestos` mediante Trigger.
**Verificación de totales**: `SELECT base_imponible, iva, total FROM presupuestos WHERE id = '...'`.

## MÓDULO 4 — NOTAS
1. **Diseño**: Si hay partidas de familia `diseno`, actualizar `notas` con condiciones de diseño.
2. **SVG**: Si hay rótulos con SVG pendiente, añadir nota "SVG vectorizado pendiente".

## MÓDULO 5 — GENERAR PDF
1. Verificar cliente y partidas activas.
2. `invoke_generar_pdf({ "presupuesto_id": "..." })`.
3. `supabase_update` en `presupuestos` con la `pdf_url` devuelta.

## MÓDULO 6 — ESTADOS
Estados: `borrador` -> `enviado` -> `aceptado` | `rechazado`.
Si pasa a `enviado`, actualizar `fecha_envio`.

## MÓDULO 7 — HISTORIAL
`SELECT p.referencia, p.estado, p.total, c.nombre FROM presupuestos p JOIN clientes c ON p.cliente_id = c.id ORDER BY p.fecha_creacion DESC LIMIT 10`.
Presentar en formato tabla.
