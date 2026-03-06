---
name: Mobiliario EXM
description: Reglas de cálculo y catálogo de mobiliario para la línea EXM.
---

# SKILL: Mobiliario EXM

Esta Skill define las reglas comerciales para el mobiliario de la línea EXM.

## 📋 Reglas de Margen
- **Margen Pactado**: Se utiliza el valor de la columna `margen_pactado` de la tabla `muebles_exm`.
- **Fórmula**: `PVP = Coste / (1 - Margen_Pactado)`
- **Excepciones**: Si el margen es 0.0 o no está definido, se debe consultar el escalado de volumen de EXM (Pendiente de definir).

## 🗃️ Catálogo de Referencia (Extracto)
| ID | Nombre | Coste (€) | Margen |
|----|--------|-----------|--------|
| CAT-EXM-043 | ROTULO SOLO TEXTO | 723.82 | 68.55% |
| CAT-EXM-047 | MOSTRADOR 155 + LOGO | 374.43 | 53.15% |
| CAT-EXM-048 | MOSTRADOR 100 + LOGO | 354.80 | 54.54% |

## 🛠️ Procedimiento de Cálculo
1. Consultar la tabla `muebles_exm`.
2. Aplicar el margen por referencia.
3. El PVP resultante es el precio final antes de transporte e instalación.
