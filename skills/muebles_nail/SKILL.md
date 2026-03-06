# SKILL: Mobiliario NAIL (Nails Factory)

Esta Skill define las reglas comerciales para el mobiliario de la línea NAIL (Nails Factory).

## 📋 Reglas de Margen
- **Margen Pactado**: Se utiliza el valor de la columna `margen_pactado` de la tabla `muebles_nail`.
- **Fórmula**: `PVP = Coste / (1 - Margen_Pactado)`
- **Independencia**: NAIL gestiona sus propios costes logísticos.

## 🗃️ Catálogo de Referencia (Extracto)
| ID | Nombre | Coste (€) | Margen |
|----|--------|-----------|--------|
| CAT-NF-069 | Puesto alto 58x26 | 134.68 | 76.74% |
| CAT-NF-071 | Caja de 75 | 215.80 | 69.69% |
| CAT-NF-077 | Montaje vinilos | 80.00 | 60.44% |

## 🛠️ Procedimiento de Cálculo
1. Consultar la tabla `muebles_nail`.
2. Aplicar el margen específico de Nails Factory.
