-- ============================================================
-- 20260306100000_full_catalog_from_excel.sql
-- Catálogo completo de materiales extraído del Excel costes_corregido.xlsx
-- Incluye: Impresión, Laminados, Vinilo Corte, Rígidos, Electricidad,
--           Perfilería, Complementos, Manipulados, Montajes, Márgenes
-- ============================================================

-- ─── LIMPIAR DATOS ANTERIORES Y REEMPLAZAR ────────────────────────────────
-- Usamos ON CONFLICT para actualizar sin borrar lo que no cambie

-- ─── MÁRGENES (tabla margenes) ────────────────────────────────────────────
-- Columnas: desde_m2, hasta_m2, margen_cliente_final, margen_agencia
DELETE FROM margenes;
INSERT INTO margenes (desde_m2, hasta_m2, margen_cliente_final, margen_agencia) VALUES
  (0,   1,      0.60, 0.45),
  (1,   5,      0.58, 0.42),
  (5,   20,     0.55, 0.40),
  (20,  50,     0.50, 0.35),
  (50,  150,    0.45, 0.30),
  (150, 999999, 0.40, 0.25);


-- ─── MATERIALES: IMPRESIÓN (familia = 'impresion') ────────────────────────
-- clase = VINILO MONOMERICO 100 Micras → agrupa soportes monoméricos
INSERT INTO materiales (id, familia, clase, nombre, unidad, grosor, tamano_plancha, precio, merma, activo) VALUES
  ('VM-PER',   'impresion', 'VINILO MONOMERICO', 'Monomérico Permanente',          'm2', NULL, '137cm', 1.35, 0.68, true),
  ('VM-REM',   'impresion', 'VINILO MONOMERICO', 'Monomérico Removible',            'm2', NULL, '137cm', 1.40, 0.68, true),
  ('VM-TRANS', 'impresion', 'VINILO MONOMERICO', 'Monomérico Transparente',         'm2', NULL, '137cm', 1.40, 0.68, true),
  ('VM-HT',    'impresion', 'VINILO MONOMERICO', 'Monomérico HT/Pared',            'm2', NULL, '137cm', 2.25, 0.68, true),
  ('VM-MIC',   'impresion', 'VINILO MONOMERICO', 'Microperforado ONE VISION',      'm2', NULL, '137cm', 3.83, 0.68, true),
  ('VM-MICH',  'impresion', 'VINILO MONOMERICO', 'Microperforado Homologado',       'm2', NULL, '137cm', 7.23, 0.68, true)
ON CONFLICT (id) DO UPDATE SET
  familia = EXCLUDED.familia, clase = EXCLUDED.clase, nombre = EXCLUDED.nombre,
  precio = EXCLUDED.precio, merma = EXCLUDED.merma, activo = EXCLUDED.activo;

INSERT INTO materiales (id, familia, clase, nombre, unidad, grosor, tamano_plancha, precio, merma, activo) VALUES
  ('VP-PER',   'impresion', 'VINILO POLIMERICO', 'Polimérico Permanente',           'm2', NULL, '137cm', 3.60, 0.68, true),
  ('VP-REM',   'impresion', 'VINILO POLIMERICO', 'Polimérico Removible',            'm2', NULL, '137cm', 3.60, 0.68, true),
  ('VP-TRANS', 'impresion', 'VINILO POLIMERICO', 'Polimérico Transparente',         'm2', NULL, '137cm', 2.94, 0.68, true),
  ('VP-HT',    'impresion', 'VINILO POLIMERICO', 'Polimérico HT/Pared',            'm2', NULL, '137cm', 2.79, 0.68, true),
  ('VP-BO',    'impresion', 'VINILO POLIMERICO', 'Polimérico Block-Out',            'm2', NULL, '137cm', 4.71, 0.68, true)
ON CONFLICT (id) DO UPDATE SET
  familia = EXCLUDED.familia, clase = EXCLUDED.clase, nombre = EXCLUDED.nombre,
  precio = EXCLUDED.precio, merma = EXCLUDED.merma, activo = EXCLUDED.activo;

INSERT INTO materiales (id, familia, clase, nombre, unidad, grosor, tamano_plancha, precio, merma, activo) VALUES
  ('VAC-01',   'impresion', 'VINILO ESPECIAL', 'Vinilo Ácido',                      'm2', NULL, '137cm', 4.42, 0.68, true),
  ('VMC-BN',   'impresion', 'VINILO ESPECIAL', 'Microventosa Blanco',               'm2', NULL, '137cm', 3.62, 0.68, true),
  ('VMC-TR',   'impresion', 'VINILO ESPECIAL', 'Microventosa Transparente',         'm2', NULL, '137cm', 3.62, 0.68, true)
ON CONFLICT (id) DO UPDATE SET
  familia = EXCLUDED.familia, clase = EXCLUDED.clase, nombre = EXCLUDED.nombre,
  precio = EXCLUDED.precio, merma = EXCLUDED.merma, activo = EXCLUDED.activo;

INSERT INTO materiales (id, familia, clase, nombre, unidad, grosor, tamano_plancha, precio, merma, activo) VALUES
  ('PAP-01',   'impresion', 'PAPEL', 'Papel fotográfico',                           'm2', NULL, '137cm', 1.86, 0.68, true),
  ('FBK-01',   'impresion', 'PAPEL', 'Film Backlite',                               'm2', NULL, '137cm', 6.07, 0.68, true)
ON CONFLICT (id) DO UPDATE SET
  familia = EXCLUDED.familia, clase = EXCLUDED.clase, nombre = EXCLUDED.nombre,
  precio = EXCLUDED.precio, merma = EXCLUDED.merma, activo = EXCLUDED.activo;

INSERT INTO materiales (id, familia, clase, nombre, unidad, grosor, tamano_plancha, precio, merma, activo) VALUES
  ('LO-FL',    'impresion', 'LONA / TEXTIL', 'Lona Frontlite 510gr',               'm2', NULL, '320cm', 1.75, 0.68, true),
  ('LO-BL',    'impresion', 'LONA / TEXTIL', 'Lona Backlite',                       'm2', NULL, '320cm', 3.50, 0.68, true),
  ('LO03-MIC', 'impresion', 'LONA / TEXTIL', 'Lona Microperforada',                'm2', NULL, '320cm', 2.25, 0.68, true),
  ('TE01-BL',  'impresion', 'LONA / TEXTIL', 'Tela Backlite',                      'm2', NULL, '160cm', 2.85, 1.36, true),
  ('LI-01',    'impresion', 'LONA / TEXTIL', 'Lienzo poliéster',                   'm2', NULL, '160cm', 4.76, 0.68, true),
  ('LO-BO',    'impresion', 'LONA / TEXTIL', 'Lona Blockout',                       'm2', NULL, '320cm', 3.60, 1.36, true)
ON CONFLICT (id) DO UPDATE SET
  familia = EXCLUDED.familia, clase = EXCLUDED.clase, nombre = EXCLUDED.nombre,
  precio = EXCLUDED.precio, merma = EXCLUDED.merma, activo = EXCLUDED.activo;


-- ─── MATERIALES: LAMINADOS (familia = 'laminado') ─────────────────────────
INSERT INTO materiales (id, familia, clase, nombre, unidad, grosor, tamano_plancha, precio, merma, activo) VALUES
  ('LM-MA',     'laminado', 'LAMINADO MONOMERICO', 'Laminado monomérico mate',     'm2', NULL, NULL, 1.66, 0.28, true),
  ('LM-BR',     'laminado', 'LAMINADO MONOMERICO', 'Laminado monomérico brillo',   'm2', NULL, NULL, 1.66, 0.28, true),
  ('LP-MA',     'laminado', 'LAMINADO POLIMERICO', 'Laminado polimérico mate',     'm2', NULL, NULL, 2.74, 0.28, true),
  ('LP-BR',     'laminado', 'LAMINADO POLIMERICO', 'Laminado polimérico brillo',   'm2', NULL, NULL, 2.74, 0.28, true),
  ('LS01-Ant',  'laminado', 'LAMINADO SUELO',      'Laminado antideslizante suelo','m2', NULL, NULL, 3.75, 0.28, true),
  ('LB01',      'laminado', 'LAMINADO BLANCO',     'Laminado blanco',               'm2', NULL, NULL, 1.95, 0.28, true),
  ('LHT',       'laminado', 'LAMINADO BLANCO',     'Laminado HT',                  'm2', NULL, NULL, 2.25, 0.28, true),
  ('LVEL-BL',   'laminado', 'LAMINADO VELEDA',     'Veleda Blanco',                 'm2', NULL, NULL, 8.50, 0.28, true),
  ('LVEL-TR',   'laminado', 'LAMINADO VELEDA',     'Veleda Transparente',           'm2', NULL, NULL, 8.50, 0.28, true)
ON CONFLICT (id) DO UPDATE SET
  familia = EXCLUDED.familia, clase = EXCLUDED.clase, nombre = EXCLUDED.nombre,
  precio = EXCLUDED.precio, merma = EXCLUDED.merma, activo = EXCLUDED.activo;


-- ─── MATERIALES: VINILO DE CORTE (familia = 'vinilo_corte') ──────────────
INSERT INTO materiales (id, familia, clase, nombre, unidad, grosor, tamano_plancha, precio, merma, activo) VALUES
  ('VC3-BRbn',  'vinilo_corte', 'VINILO CORTE 3-5 AÑOS', 'Blanco/Negro Brillo',    'm2', NULL, NULL, 3.40, 0.0, true),
  ('VC3-Brco',  'vinilo_corte', 'VINILO CORTE 3-5 AÑOS', 'Colores Brillo',         'm2', NULL, NULL, 3.76, 0.0, true),
  ('VC3-BRmt',  'vinilo_corte', 'VINILO CORTE 3-5 AÑOS', 'Metalizado Brillo',      'm2', NULL, NULL, 4.97, 0.0, true),
  ('VC3-MTbn',  'vinilo_corte', 'VINILO CORTE 3-5 AÑOS', 'Blanco/Negro Mate',      'm2', NULL, NULL, 3.56, 0.0, true),
  ('VC3-Mtco',  'vinilo_corte', 'VINILO CORTE 3-5 AÑOS', 'Colores Mate',           'm2', NULL, NULL, 5.12, 0.0, true),
  ('VC3-Mtmet', 'vinilo_corte', 'VINILO CORTE 3-5 AÑOS', 'Metalizado Mate',        'm2', NULL, NULL, 3.97, 0.0, true)
ON CONFLICT (id) DO UPDATE SET
  familia = EXCLUDED.familia, clase = EXCLUDED.clase, nombre = EXCLUDED.nombre,
  precio = EXCLUDED.precio, merma = EXCLUDED.merma, activo = EXCLUDED.activo;

INSERT INTO materiales (id, familia, clase, nombre, unidad, grosor, tamano_plancha, precio, merma, activo) VALUES
  ('VC6-BRbn',  'vinilo_corte', 'VINILO CORTE 6 AÑOS', 'Blanco/Negro Brillo',      'm2', NULL, NULL, 4.87, 0.0, true),
  ('VC6-Brco',  'vinilo_corte', 'VINILO CORTE 6 AÑOS', 'Colores Brillo',           'm2', NULL, NULL, 6.09, 0.0, true),
  ('VC6-Brmet', 'vinilo_corte', 'VINILO CORTE 6 AÑOS', 'Metalizado Brillo',        'm2', NULL, NULL, 7.76, 0.0, true),
  ('VC6-MTbn',  'vinilo_corte', 'VINILO CORTE 6 AÑOS', 'Blanco/Negro Mate',        'm2', NULL, NULL, 5.13, 0.0, true),
  ('VC6-Mtco',  'vinilo_corte', 'VINILO CORTE 6 AÑOS', 'Colores Mate',             'm2', NULL, NULL, 5.49, 0.0, true),
  ('VC6-Mtmet', 'vinilo_corte', 'VINILO CORTE 6 AÑOS', 'Metalizado Mate',          'm2', NULL, NULL, 6.09, 0.0, true)
ON CONFLICT (id) DO UPDATE SET
  familia = EXCLUDED.familia, clase = EXCLUDED.clase, nombre = EXCLUDED.nombre,
  precio = EXCLUDED.precio, merma = EXCLUDED.merma, activo = EXCLUDED.activo;

INSERT INTO materiales (id, familia, clase, nombre, unidad, grosor, tamano_plancha, precio, merma, activo) VALUES
  ('VC10-BRbn',  'vinilo_corte', 'VINILO CORTE 10 AÑOS', 'Blanco/Negro Brillo',    'm2', NULL, NULL, 6.41, 0.0, true),
  ('VC10-Brco',  'vinilo_corte', 'VINILO CORTE 10 AÑOS', 'Colores Brillo',         'm2', NULL, NULL, 7.76, 0.0, true),
  ('VC10-Brmet', 'vinilo_corte', 'VINILO CORTE 10 AÑOS', 'Metalizado Brillo',      'm2', NULL, NULL, 6.09, 0.0, true),
  ('VC10-MTbn',  'vinilo_corte', 'VINILO CORTE 10 AÑOS', 'Blanco/Negro Mate',      'm2', NULL, NULL, 7.65, 0.0, true),
  ('VC10-Mtco',  'vinilo_corte', 'VINILO CORTE 10 AÑOS', 'Colores Mate',           'm2', NULL, NULL, 7.86, 0.0, true),
  ('VC10-Mtmet', 'vinilo_corte', 'VINILO CORTE 10 AÑOS', 'Metalizado Mate',        'm2', NULL, NULL, 8.56, 0.0, true),
  ('VC-TR',      'vinilo_corte', 'VINILO CORTE TRASLUCIDO', 'Traslúcido',          'm2', NULL, NULL, 8.29, 0.0, true),
  ('TRS',        'vinilo_corte', 'TRANSPORTADORA',          'Transportador HT',     'm2', NULL, NULL, 1.16, 0.0, true)
ON CONFLICT (id) DO UPDATE SET
  familia = EXCLUDED.familia, clase = EXCLUDED.clase, nombre = EXCLUDED.nombre,
  precio = EXCLUDED.precio, merma = EXCLUDED.merma, activo = EXCLUDED.activo;


-- ─── MATERIALES: RÍGIDOS / CNC (familia = 'rigido') ──────────────────────
INSERT INTO materiales (id, familia, clase, nombre, unidad, grosor, tamano_plancha, precio, merma, activo) VALUES
  ('M01-MDF5',    'rigido', 'MADERA', 'DM 5mm',                   'm2', '5mm',  '244x122cm', 5.83,  NULL, true),
  ('M01-MDF10',   'rigido', 'MADERA', 'DM 10mm',                  'm2', '10mm', '245x122cm', 7.45,  NULL, true),
  ('M01-MDF19',   'rigido', 'MADERA', 'DM 19mm',                  'm2', '19mm', '246x122cm', 13.80, NULL, true),
  ('M01-MDF30',   'rigido', 'MADERA', 'DM 30mm',                  'm2', '30mm', '247x122cm', 20.28, NULL, true),
  ('M02-ALI50',   'rigido', 'MADERA', 'Aligerado Blanco 50mm',    'm2', '50mm', '285x210cm', 51.75, NULL, true),
  ('AG01-CR19',   'rigido', 'MADERA', 'Aglomerado 19mm',          'm2', '19mm', '244x122cm', 7.77,  NULL, true),
  ('M03-MEL10B',  'rigido', 'MADERA', 'Melamina Blanca 10mm',     'm2', '10mm', '285x210cm', 8.35,  NULL, true),
  ('M03-MEL19B',  'rigido', 'MADERA', 'Melamina Blanca 19mm',     'm2', '19mm', '285x210cm', 10.32, NULL, true),
  ('M04-MELDIS10','rigido', 'MADERA', 'Melamina Diseño 10mm',     'm2', '10mm', '285x210cm', 14.16, NULL, true),
  ('M04-MELDIS19','rigido', 'MADERA', 'Melamina Diseño 19mm',     'm2', '19mm', '285x210cm', 17.15, NULL, true),
  ('LAM01B',      'rigido', 'MADERA', 'Fórmica Blanca',           'm2', NULL,   '305x130cm', 12.18, NULL, true),
  ('LAM01DIS',    'rigido', 'MADERA', 'Fórmica Diseño',           'm2', NULL,   '305x130cm', 23.92, NULL, true),
  ('TAB-B5',      'rigido', 'MADERA', 'Tablex Blanco 5mm',        'm2', '5mm',  '244x122cm', 5.37,  NULL, true),
  ('TAB-DIS5',    'rigido', 'MADERA', 'Tablex Diseño 5mm',        'm2', '5mm',  '244x122cm', 5.37,  NULL, true)
ON CONFLICT (id) DO UPDATE SET
  familia = EXCLUDED.familia, clase = EXCLUDED.clase, nombre = EXCLUDED.nombre,
  precio = EXCLUDED.precio, grosor = EXCLUDED.grosor, tamano_plancha = EXCLUDED.tamano_plancha, activo = EXCLUDED.activo;

-- Cantos y listones (unidad ml)
INSERT INTO materiales (id, familia, clase, nombre, unidad, grosor, tamano_plancha, precio, merma, activo) VALUES
  ('CAN01-B22',   'rigido', 'CANTO',   'Canto Blanco 22mm',       'ml', '22mm', '150m',  0.82, NULL, true),
  ('CAN01-DIS22', 'rigido', 'CANTO',   'Canto Diseño 22mm',       'ml', '22mm', '150m',  0.70, NULL, true),
  ('CAN01-DIS50', 'rigido', 'CANTO',   'Canto Diseño 50mm',       'ml', '50mm', '150m',  1.30, NULL, true),
  ('LIS01-PI',    'rigido', 'LISTON',  'Listón Pino 30x30mm',     'liston', '30mm', '300cm', 1.33, NULL, true),
  ('LIS02-SAM',   'rigido', 'LISTON',  'Listón Samba 30x30mm',    'liston', '30mm', '305cm', 1.80, NULL, true)
ON CONFLICT (id) DO UPDATE SET
  familia = EXCLUDED.familia, clase = EXCLUDED.clase, nombre = EXCLUDED.nombre,
  precio = EXCLUDED.precio, grosor = EXCLUDED.grosor, tamano_plancha = EXCLUDED.tamano_plancha, activo = EXCLUDED.activo;


-- ─── MANIPULADOS ─────────────────────────────────────────────────────────
DELETE FROM manipulados;
INSERT INTO manipulados (id, clase, nombre, unidad, precio, activo) VALUES
  ('MD-PEG',  'MADERA',   'Pegado de tablero',  'm2', 5.99, true),
  ('MD-CORT', 'MADERA',   'Corte de tablero',   'm2', 0.85, true),
  ('MD-CANT', 'MADERA',   'Canteado',           'ml', 0.90, true),
  ('MD-MEC',  'MADERA',   'Mecanizado',         'ml', 20.00, true),
  ('EMB',     'EMBALAJE', 'Embalaje',           'ud', 3.00, true)
ON CONFLICT (id) DO NOTHING;


-- ─── COMPLEMENTOS ─────────────────────────────────────────────────────────
DELETE FROM complementos;
INSERT INTO complementos (id, clase, nombre, unidad, precio, activo) VALUES
  ('CBC',  'LONAS',    'Cinta unión doble cara', 'ml',   1.14, true),
  ('CH',   'LONAS',    'Cincha',                 'ud',   1.03, true),
  ('OLL',  'LONAS',    'Ollados',                'ud',   0.04, true),
  ('VCR',  'LONAS',    'Velcro',                 'ud',   0.69, true),
  ('DC',   'ADHESIVOS','Doble cara',             'ml',   0.17, true),
  ('DCM',  'ADHESIVOS','Doble cara moco',        'ml',   1.93, true),
  ('ADM',  'ADHESIVOS','Adhesivo montaje',       'bote', 7.70, true),
  ('SIL',  'ADHESIVOS','Silicona',               'bote', 4.90, true),
  ('HT',   'TRANSPORTADORA','Transportadora HT', 'm2',   1.16, true)
ON CONFLICT (id) DO NOTHING;


-- ─── MONTAJES (tabla montajes) ────────────────────────────────────────────
DELETE FROM montajes;
INSERT INTO montajes (concepto, tipo, unidad, precio, minimo_horas, activo) VALUES
  ('MONTADORES', 'MONTADOR ROTULACIÓN',            'h',   22.0,  2, true),
  ('MONTADORES', 'MONTADOR MOBILIARIO',             'h',   36.0,  4, true),
  ('MONTADORES', 'AUTÓNOMO ROTULISTA',              'h',   25.0,  2, true),
  ('MONTADORES', 'AUTÓNOMO MOBILIARIO',             'h',   30.0,  4, true),
  ('MONTADORES', 'ELECTRICISTA',                    'h',   50.0,  1, true),
  ('HORAS EXTRAS','HORAS EXTRAS',                   'h',   15.0,  0, true),
  ('HORAS EXTRAS','HORAS EXTRAS NOCTURNAS',         'h',   17.0,  0, true),
  ('HORAS EXTRAS','HORAS EXTRAS FESTIVAS',          'h',   17.0,  0, true),
  ('HORAS EXTRAS','HORAS EXTRAS FESTIVAS NOCTURNAS','h',   20.0,  0, true),
  ('HORAS EXTRAS','HORAS FESTIVAS/NOCT AUTÓNOMO',   'h',   45.0,  0, true),
  ('VIAJES',      'HORAS DESPLAZAMIENTO Plantilla', 'h',   10.0,  0, true),
  ('VIAJES',      'HORAS DESPLAZAMIENTO Autónomos', 'h',   20.0,  0, true),
  ('DIETAS',      'DIETAS',                         'dia', 50.0,  0, true),
  ('ALOJAMIENTO', 'ALOJAMIENTO',                    'dia', 100.0, 0, true),
  ('KILOMETRAJE', 'KM FURGO PEQUEÑA',               'km',  0.5,   0, true),
  ('KILOMETRAJE', 'KM FURGO GRANDE',                'km',  0.8,   0, true),
  ('KILOMETRAJE', 'KM CAMIÓN CARROZADO',            'km',  0.85,  0, true),
  ('EXTRA',       'ALQUILER CARROZADO',             'dia', 184.0, 0, true),
  ('EXTRA',       'ANDAMIO',                        'dia', 30.0,  0, true),
  ('EXTRA',       'MERCANCÍA EXTERNA (caja)',        'caja',3.0,   0, true),
  ('EXTRA',       'ZONA RESTRINGIDA/CENTRO CIUDAD', 'dia', 110.0, 0, true)
ON CONFLICT DO NOTHING;


-- ─── CONFIGURACIÓN GLOBAL ─────────────────────────────────────────────────
UPDATE configuracion_global SET
  precio_kwh = 0.45,
  amortizacion_activa = true,
  retal_min_ancho_cm = 50,
  retal_min_alto_cm = 30,
  minimo_m2_cobrable = 1.0,
  margen_min_cliente_final = 0.40,
  margen_min_agencia = 0.25,
  mercancias_cajas_gratis = 3,
  mercancias_precio_caja = 3.0,
  bobina_max_laminado_cm = 140,
  bobina_ancho_1_cm = 137,
  bobina_ancho_2_cm = 160
WHERE id = 1;
