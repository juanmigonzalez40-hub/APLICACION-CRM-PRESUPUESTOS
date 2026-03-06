---
name: Mobiliario D-Uñas
description: Reglas de cálculo y catálogo de mobiliario para la franquicia D-Uñas.
---

# SKILL: Mobiliario D-Uñas

Esta Skill define las reglas comerciales para el mobiliario de D-Uñas. A diferencia del mobiliario general, D-Uñas utiliza márgenes pactados por referencia individual.

## 📋 Reglas de Margen
- **Margen Pactado**: Se utiliza el valor de la columna `margen_pactado` de la tabla `muebles_duñas`.
- **Fórmula**: `PVP = Coste / (1 - Margen_Pactado)`
- **Excepciones**: No se aplican los márgenes por m2 de la tabla general de la aplicación.

## 🗃️ Catálogo de Referencia (Extracto)
| ID | Nombre | Coste (€) | Margen |
|----|--------|-----------|--------|
| CAT-DUN-001 | VINILOS CRISTALERA | 89.13 | 54.16% |
| CAT-DUN-004 | MOSTRADOR 100 | 410.00 | 30.11% |
| CAT-DUN-007 | ALTOS 5P | 1120.00 | 40.17% |

## 🛠️ Procedimiento de Cálculo
1. Consultar la tabla `muebles_duñas`.
2. Extraer el `coste` y el `margen_pactado`.
3. Aplicar el divisor para obtener el PVP.
4. Si el margen no está definido, contactar con el administrador.
