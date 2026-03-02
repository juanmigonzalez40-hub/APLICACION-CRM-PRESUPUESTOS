# SKILL: MOBILIARIO COMERCIAL
---
Versión 2.2 — Familia 4 — Thin Agent

## PROPÓSITO
Estructurar la recogida de datos para muebles a medida o de catálogo. Delegar a `invoke_calcular_mobiliario`.

## PASO 1 — RECOPILAR: ESTRUCTURA POR MUEBLE
Preguntar cuántos muebles distintos se presupuestan. Trabajar mueble por mueble.

### BIFURCACIÓN 1: CATÁLOGO ESTÁNDAR
1. Marca/Franquicia (D-uñas, Nails Factory, EXM).
2. `SELECT id, nombre, coste FROM muebles_catalogo WHERE marca ILIKE '%...%'`.
3. Usuario elige el mueble exacto.

### BIFURCACIÓN 2: A MEDIDA
1. Medidas (Frente x Fondo x Alto cm).
2. Material Principal (ID vía `materiales` familia `rigido`).
3. Estructura: Costados, techo/suelo, trasera (ID), puertas (abatibles/correderas + tipo bisagra), baldas (fijas/extraíbles), cajones.
4. Extras: Electricidad, perfilería, complementos, manipulados.
5. Mano de obra: Horas y personas (1 o 2).

## PASO 2 — CONSTRUIR PAYLOAD TÉCNICO
Array `muebles` conteniendo objetos según tipo (catalogo: true/false).

## PASO 3 — FLUJO DE INVOCACIÓN
1. `invoke_calcular_mobiliario`.
2. `invoke_aplicar_margen` con `coste_total_proyecto` y `m2_totales: 0`.

## PASO 4 — PRESENTACIÓN
1. Alertas por mueble.
2. Desglose detallado por cada mueble (medidas, material, estructura, costes).
3. Resumen técnico global.
4. Bloque de precio final (vía Skill Márgenes).

## PASO 5 — GUARDAR (REPARTO PROPORCIONAL)
**CRITICAL**: Insertar una partida por CADA mueble.
- `precio_venta_unitario = (coste_mueble / coste_total_proyecto) * precio_venta_global`
- `precio_final = (coste_mueble / coste_total_proyecto) * total_con_iva_global`
Incluir metadatos específicos del mueble.
