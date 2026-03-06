-- 20260306000000_expand_materiales_catalog.sql
-- Ampliación del catálogo de materiales con datos reales del negocio
-- Familia: impresion → vinilos, lonas, textil, papel
-- Familia: vinilo_corte → económico, estándar, premium, reflectante, especial

-- ─── IMPRESIÓN DIGITAL ───────────────────────────────────────────────────────

-- Vinilo Monomérico (clase = 'VINILO MONOMERICO')
INSERT INTO materiales (id, familia, clase, nombre, unidad, grosor, tamano_plancha, precio, merma, activo) VALUES
  ('VM-PER',   'impresion', 'VINILO MONOMERICO', 'Permanente (3-5 años)',          'm2', NULL, '137cm', 1.35, 0.68, true),
  ('VM-REM',   'impresion', 'VINILO MONOMERICO', 'Removible (1-3 años)',           'm2', NULL, '137cm', 1.55, 0.68, true),
  ('VM-CRYO',  'impresion', 'VINILO MONOMERICO', 'Para congelados / frigorífico',  'm2', NULL, '137cm', 1.75, 0.68, true),
  ('VM-SUELO', 'impresion', 'VINILO MONOMERICO', 'Para suelos antideslizante',     'm2', NULL, '137cm', 1.90, 0.68, true)
ON CONFLICT (id) DO UPDATE SET
  familia = EXCLUDED.familia,
  clase   = EXCLUDED.clase,
  nombre  = EXCLUDED.nombre,
  precio  = EXCLUDED.precio,
  activo  = EXCLUDED.activo;

-- Vinilo Polimérico (clase = 'VINILO POLIMERICO')
INSERT INTO materiales (id, familia, clase, nombre, unidad, grosor, tamano_plancha, precio, merma, activo) VALUES
  ('VP-PERM',  'impresion', 'VINILO POLIMERICO', 'Permanente (5-7 años)',          'm2', NULL, '137cm', 2.10, 0.68, true),
  ('VP-REPO',  'impresion', 'VINILO POLIMERICO', 'Reposicionable',                 'm2', NULL, '137cm', 2.45, 0.68, true),
  ('VP-ALTA',  'impresion', 'VINILO POLIMERICO', 'Alta temperatura / exterior',    'm2', NULL, '137cm', 2.80, 0.68, true)
ON CONFLICT (id) DO UPDATE SET
  familia = EXCLUDED.familia,
  clase   = EXCLUDED.clase,
  nombre  = EXCLUDED.nombre,
  precio  = EXCLUDED.precio,
  activo  = EXCLUDED.activo;

-- Vinilo Especial (clase = 'VINILO ESPECIAL')
INSERT INTO materiales (id, familia, clase, nombre, unidad, grosor, tamano_plancha, precio, merma, activo) VALUES
  ('VE-BACK',  'impresion', 'VINILO ESPECIAL', 'Retroiluminado (backlit)',         'm2', NULL, '137cm', 3.80, 0.70, true),
  ('VE-MICRO', 'impresion', 'VINILO ESPECIAL', 'Microperforado (cristales)',       'm2', NULL, '137cm', 4.20, 0.70, true),
  ('VE-CROM',  'impresion', 'VINILO ESPECIAL', 'Chrome / Espejo metálico',        'm2', NULL, '137cm', 5.20, 0.70, true),
  ('VE-STA',   'impresion', 'VINILO ESPECIAL', 'Estático sin adhesivo',            'm2', NULL, '137cm', 3.50, 0.70, true)
ON CONFLICT (id) DO UPDATE SET
  familia = EXCLUDED.familia,
  clase   = EXCLUDED.clase,
  nombre  = EXCLUDED.nombre,
  precio  = EXCLUDED.precio,
  activo  = EXCLUDED.activo;

-- Lona (clase = 'LONA')
INSERT INTO materiales (id, familia, clase, nombre, unidad, grosor, tamano_plancha, precio, merma, activo) VALUES
  ('LO-380',   'impresion', 'LONA', 'Frontlit 380gr (exterior)',                  'm2', NULL, '320cm', 1.10, 0.65, true),
  ('LO-500',   'impresion', 'LONA', 'Backlit 500gr (cajas de luz)',               'm2', NULL, '320cm', 1.65, 0.65, true),
  ('LO-MESH',  'impresion', 'LONA', 'Mesh 300gr (vallas / viento)',               'm2', NULL, '320cm', 1.45, 0.65, true),
  ('LO-FLAG',  'impresion', 'LONA', 'Tela bandera (manga de viento)',             'm2', NULL, '160cm', 1.80, 0.65, true)
ON CONFLICT (id) DO UPDATE SET
  familia = EXCLUDED.familia,
  clase   = EXCLUDED.clase,
  nombre  = EXCLUDED.nombre,
  precio  = EXCLUDED.precio,
  activo  = EXCLUDED.activo;

-- Textil (clase = 'TEXTIL')
INSERT INTO materiales (id, familia, clase, nombre, unidad, grosor, tamano_plancha, precio, merma, activo) VALUES
  ('TX-SUB',   'impresion', 'TEXTIL', 'Sublimación polyéster blanco',             'm2', NULL, '160cm', 4.20, 0.72, true),
  ('TX-BANN',  'impresion', 'TEXTIL', 'Banner textil (exposición)',               'm2', NULL, '160cm', 3.80, 0.72, true)
ON CONFLICT (id) DO UPDATE SET
  familia = EXCLUDED.familia,
  clase   = EXCLUDED.clase,
  nombre  = EXCLUDED.nombre,
  precio  = EXCLUDED.precio,
  activo  = EXCLUDED.activo;

-- Papel Fotográfico (clase = 'PAPEL FOTOGRAFICO')
INSERT INTO materiales (id, familia, clase, nombre, unidad, grosor, tamano_plancha, precio, merma, activo) VALUES
  ('PP-BRI',   'impresion', 'PAPEL FOTOGRAFICO', 'Brillo 260gr',                  'm2', NULL, '137cm', 1.90, 0.70, true),
  ('PP-SAT',   'impresion', 'PAPEL FOTOGRAFICO', 'Satinado 260gr',                'm2', NULL, '137cm', 1.90, 0.70, true),
  ('PP-CANV',  'impresion', 'PAPEL FOTOGRAFICO', 'Canvas / lienzo artístico',     'm2', NULL, '137cm', 3.20, 0.70, true)
ON CONFLICT (id) DO UPDATE SET
  familia = EXCLUDED.familia,
  clase   = EXCLUDED.clase,
  nombre  = EXCLUDED.nombre,
  precio  = EXCLUDED.precio,
  activo  = EXCLUDED.activo;


-- ─── VINILO DE CORTE ─────────────────────────────────────────────────────────

-- Vinilo Económico 1-3 años (clase = 'VINILO CORTE ECONOMICO')
INSERT INTO materiales (id, familia, clase, nombre, unidad, grosor, tamano_plancha, precio, merma, activo) VALUES
  ('VC1-BL',   'vinilo_corte', 'VINILO CORTE ECONOMICO', 'Blanco Brillo',         'm2', NULL, NULL, 1.80, 0.0, true),
  ('VC1-NG',   'vinilo_corte', 'VINILO CORTE ECONOMICO', 'Negro Brillo',          'm2', NULL, NULL, 1.80, 0.0, true),
  ('VC1-COL',  'vinilo_corte', 'VINILO CORTE ECONOMICO', 'Colores básicos',       'm2', NULL, NULL, 1.95, 0.0, true),
  ('VC1-TRA',  'vinilo_corte', 'VINILO CORTE ECONOMICO', 'Transparente',          'm2', NULL, NULL, 2.10, 0.0, true)
ON CONFLICT (id) DO UPDATE SET
  familia = EXCLUDED.familia,
  clase   = EXCLUDED.clase,
  nombre  = EXCLUDED.nombre,
  precio  = EXCLUDED.precio,
  activo  = EXCLUDED.activo;

-- Vinilo Estándar 3-5 años (clase = 'VINILO CORTE 3-5 AÑOS')
INSERT INTO materiales (id, familia, clase, nombre, unidad, grosor, tamano_plancha, precio, merma, activo) VALUES
  ('VC3-BRBN',  'vinilo_corte', 'VINILO CORTE 3-5 AÑOS', 'Blanco/Negro Brillo',  'm2', NULL, NULL, 3.40, 0.0, true),
  ('VC3-BRMT',  'vinilo_corte', 'VINILO CORTE 3-5 AÑOS', 'Blanco/Negro Mate',    'm2', NULL, NULL, 3.40, 0.0, true),
  ('VC3-COL',   'vinilo_corte', 'VINILO CORTE 3-5 AÑOS', 'Colores Pantone',      'm2', NULL, NULL, 3.65, 0.0, true),
  ('VC3-TRA',   'vinilo_corte', 'VINILO CORTE 3-5 AÑOS', 'Transparente Brillo',  'm2', NULL, NULL, 3.80, 0.0, true),
  ('VC3-DO',    'vinilo_corte', 'VINILO CORTE 3-5 AÑOS', 'Dorado / Plateado',    'm2', NULL, NULL, 4.20, 0.0, true)
ON CONFLICT (id) DO UPDATE SET
  familia = EXCLUDED.familia,
  clase   = EXCLUDED.clase,
  nombre  = EXCLUDED.nombre,
  precio  = EXCLUDED.precio,
  activo  = EXCLUDED.activo;

-- Vinilo Premium 7+ años (clase = 'VINILO CORTE PREMIUM')
INSERT INTO materiales (id, familia, clase, nombre, unidad, grosor, tamano_plancha, precio, merma, activo) VALUES
  ('VCP-BL',   'vinilo_corte', 'VINILO CORTE PREMIUM', 'Blanco Opaco Premium',   'm2', NULL, NULL, 5.10, 0.0, true),
  ('VCP-COL',  'vinilo_corte', 'VINILO CORTE PREMIUM', 'Colores Premium',        'm2', NULL, NULL, 5.50, 0.0, true),
  ('VCP-MAT',  'vinilo_corte', 'VINILO CORTE PREMIUM', 'Mate efecto tiza',       'm2', NULL, NULL, 5.80, 0.0, true),
  ('VCP-BRUS', 'vinilo_corte', 'VINILO CORTE PREMIUM', 'Cepillado metálico',     'm2', NULL, NULL, 6.20, 0.0, true)
ON CONFLICT (id) DO UPDATE SET
  familia = EXCLUDED.familia,
  clase   = EXCLUDED.clase,
  nombre  = EXCLUDED.nombre,
  precio  = EXCLUDED.precio,
  activo  = EXCLUDED.activo;

-- Vinilo Reflectante (clase = 'VINILO REFLECTANTE')
INSERT INTO materiales (id, familia, clase, nombre, unidad, grosor, tamano_plancha, precio, merma, activo) VALUES
  ('VR-BLA',   'vinilo_corte', 'VINILO REFLECTANTE', 'Reflectante Blanco',        'm2', NULL, NULL,  8.50, 0.0, true),
  ('VR-AMA',   'vinilo_corte', 'VINILO REFLECTANTE', 'Reflectante Amarillo',      'm2', NULL, NULL,  8.50, 0.0, true),
  ('VR-ROJ',   'vinilo_corte', 'VINILO REFLECTANTE', 'Reflectante Rojo',          'm2', NULL, NULL,  8.50, 0.0, true),
  ('VR-ALTA',  'vinilo_corte', 'VINILO REFLECTANTE', 'Alta Intensidad (DG3)',     'm2', NULL, NULL, 12.80, 0.0, true)
ON CONFLICT (id) DO UPDATE SET
  familia = EXCLUDED.familia,
  clase   = EXCLUDED.clase,
  nombre  = EXCLUDED.nombre,
  precio  = EXCLUDED.precio,
  activo  = EXCLUDED.activo;

-- Vinilo Especial de Corte (clase = 'VINILO CORTE ESPECIAL')
INSERT INTO materiales (id, familia, clase, nombre, unidad, grosor, tamano_plancha, precio, merma, activo) VALUES
  ('VE-PIZA',  'vinilo_corte', 'VINILO CORTE ESPECIAL', 'Efecto pizarra',         'm2', NULL, NULL, 6.80, 0.0, true),
  ('VE-SAND',  'vinilo_corte', 'VINILO CORTE ESPECIAL', 'Efecto arena / esmerilado', 'm2', NULL, NULL, 6.20, 0.0, true),
  ('VE-FLOC',  'vinilo_corte', 'VINILO CORTE ESPECIAL', 'Flock / terciopelo',     'm2', NULL, NULL, 7.50, 0.0, true),
  ('VE-FLUO',  'vinilo_corte', 'VINILO CORTE ESPECIAL', 'Fluorescente',           'm2', NULL, NULL, 5.90, 0.0, true)
ON CONFLICT (id) DO UPDATE SET
  familia = EXCLUDED.familia,
  clase   = EXCLUDED.clase,
  nombre  = EXCLUDED.nombre,
  precio  = EXCLUDED.precio,
  activo  = EXCLUDED.activo;
