# SKILL: MÁRGENES
---
Versión 2.1 — Siempre activa — Thin Agent

## PROPÓSITO
Esta Skill define cómo el agente interactúa con `invoke_aplicar_margen` y cómo presenta los resultados finales. El cálculo real lo realiza el backend.

## PASO 1 — RECOPILAR: TIPO DE CLIENTE
Prioridad de obtención:
1.  **Presupuesto activo**: `SELECT c.tipo_cliente FROM presupuestos p JOIN clientes c ON p.cliente_id = c.id WHERE p.id = '...'`
2.  **Consulta rápida**: Preguntar "¿Es para cliente final o agencia?"
3.  **Memoria**: Usar valor indicado en este turno.
Valores válidos: `cliente_final` | `agencia`.

## PASO 2 — INVOCAR: invoke_aplicar_margen
Payload:
```json
{
  "coste_total": [número],
  "m2_totales": [m2 o 0 if not applicable],
  "tipo_cliente": "cliente_final" | "agencia",
  "extra_premium": [puntos o 0],
  "descuento": [porcentaje o 0]
}
```

## PASO 3 — PRESENTAR: FORMATO DE SALIDA
Si el backend devuelve `alerta_minimo`, mostrarla **PRIMERO**:
⚠️ **ALERTA DE MARGEN**: [texto exacto]

**Bloque de resultados:**
- Superficie total: X,XX m²
- Tramo aplicado: [nombre_tramo]
- Tipo de cliente: [tipo]
- Margen base: XX%
- Extra premium: +X% (omitir si 0)
- Descuento: -X% (omitir si 0)
- ─────────────────────────────────────────────
- Coste total: XX,XX €
- Precio de venta: XX,XX €
- Margen final: XX%
- ─────────────────────────────────────────────
- Base imponible: XX,XX €
- IVA 21%: XX,XX €
- **TOTAL: XX,XX €**

## AJUSTES ADICIONALES
- **Extra Premium**: Preguntar "¿Cuántos puntos de margen adicional quieres aplicar?"
- **Descuento**: Preguntar "¿Qué porcentaje de descuento sobre el precio final?". Nunca aplicar sobre el coste.

## POST-PRESENTACIÓN
Ofrecer: "¿Quieres añadir esta partida al presupuesto o ajustar algún parámetro?"
1. **Añadir**: Cargar `skill-presupuestos.md`.
2. **Ajustar**: Recoger parámetro y re-invocar flujo.
