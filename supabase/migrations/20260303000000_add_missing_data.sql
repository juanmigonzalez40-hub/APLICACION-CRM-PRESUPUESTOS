-- Migration to add missing cost components
INSERT INTO complementos (id, clase, nombre, unidad, precio, activo)
VALUES ('HT', 'TRANSPORTADORA', 'Cinta transportadora / Aplicador', 'm2', 3.50, true)
ON CONFLICT (id) DO UPDATE SET precio = EXCLUDED.precio;

-- Update md-cant price to be consistent if needed (optional, keeping current 0.9 from previous migration)
