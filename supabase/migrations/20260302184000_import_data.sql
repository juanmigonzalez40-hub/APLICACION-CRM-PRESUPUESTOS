-- 20260302184000_import_data.sql
-- Migration to populate initial business data

TRUNCATE TABLE electricidad CASCADE;
TRUNCATE TABLE personal CASCADE;
TRUNCATE TABLE muebles_catalogo CASCADE;
TRUNCATE TABLE montajes CASCADE;
TRUNCATE TABLE materiales CASCADE;
TRUNCATE TABLE margenes CASCADE;
TRUNCATE TABLE maquinas CASCADE;
TRUNCATE TABLE configuracion_global CASCADE;

INSERT INTO configuracion_global (precio_kwh, amortizacion_activa, retal_min_ancho_cm, retal_min_alto_cm, minimo_m2_cobrable, margen_min_cliente_final, margen_min_agencia, mercancias_cajas_gratis, mercancias_precio_caja, bobina_max_laminado_cm, bobina_ancho_1_cm, bobina_ancho_2_cm) VALUES (0.45, true, 50, 30, 1.0, 0.4, 0.25, 3, 3.0, 140, 137, 160);

INSERT INTO maquinas (id, nombre, valor_reposicion, vida_util, consumo_electrico, mantenimiento_anual, minutos_m2, parametros_extra) VALUES
('hp_latex', 'HP Latex 330', 5000, 10, 2.04, 800, 7.8, '{}'),
('plotter_summa', 'Plotter Summa', 2000, 10, 0.005, 50, 10.0, '{}'),
('laminadora', 'Laminadora', 2000, 10, 0.005, 50, 10.0, '{}'),
('cnc', 'CNC', 6000, 10, 11.035, 600, 0.0, '{"tiempos_material": {"madera": 132, "dibond": 200, "metacrilato": 400, "aluminio": 800}}');

INSERT INTO margenes (desde_m2, hasta_m2, margen_cliente_final, margen_agencia) VALUES (0, 1, 0.6, 0.45),
(1, 5, 0.58, 0.42),
(5, 20, 0.55, 0.4),
(20, 50, 0.5, 0.35),
(50, 150, 0.45, 0.3),
(150, 999999, 0.4, 0.25);

INSERT INTO materiales (id, familia, clase, nombre, unidad, grosor, tamano_plancha, precio, merma, activo) VALUES ('VM-PER', 'impresion', 'VINILO MONOMERICO', 'Monimérico Permanente', 'm2', NULL, '137cm', 1.35, 0.68, true),
('VC3-BRBN', 'vinilo_corte', 'VINILO CORTE 3-5 AÑOS', 'Blanco/Negro BRILLO', 'm2', NULL, NULL, 3.4, 0.0, true),
('M01-MDF19', 'rigido', 'MADERA', 'Dm 19mm', 'm2', '19mm', '246x122', 13.8, NULL, true),
('PERF-CR', 'perfileria', 'CAJÓN RÓTULO', 'Perfil cajón aluminio', 'ml', NULL, '6m', 9.6, NULL, true),
('MD-CANT', 'manipulados', 'MADERA', 'Canteado de tableros', 'ml', NULL, NULL, 0.9, NULL, true),
('DC', 'complementos', 'ADHESIVOS', 'Cinta doble cara', 'ml', NULL, NULL, 0.17, NULL, true);

INSERT INTO montajes (concepto, tipo, unidad, precio, minimo_horas, activo) VALUES ('MONTADORES', 'MONTADOR ROTULACIÓN', 'h', 22.0, 2, true),
('MONTADORES', 'MONTADOR MOBILIARIO', 'h', 36.0, 4, true),
('HORAS EXTRAS', 'NOCTURNAS', 'h', 17.0, 0, true),
('DIETAS', 'DIETAS', 'dia', 50.0, 0, true),
('KILOMETRAJE', 'KM FURGO PEQUEÑA', 'km', 0.5, 0, true);

INSERT INTO muebles_catalogo (id, marca, nombre, coste, margen_pactado, activo) VALUES 
('CAT-DUN-001', 'D-uñas', 'VINILOS CRISTALERA ( TLF SELLOS PAISES SERVICIOS)', 89.13, 0.5416, true),
('CAT-DUN-002', 'D-uñas', 'POSTER vinilo microventosa', 24.7, 0.2334, true),
('CAT-DUN-003', 'D-uñas', 'Dibond 70 x 100', 58.0, 0.46, true),
('CAT-DUN-004', 'D-uñas', 'MOSTRADOR 100', 410.0, 0.3011, true),
('CAT-DUN-005', 'D-uñas', 'MOSTRADOR 80', 354.0, 0.3589, true),
('CAT-DUN-006', 'D-uñas', 'MOSTRADOR 60', 298.0, 0.4092, true),
('CAT-DUN-007', 'D-uñas', 'ALTOS 5P', 1120.0, 0.4017, true),
('CAT-DUN-008', 'D-uñas', 'ALTOS 4P', 1012.0, 0.3187, true),
('CAT-DUN-009', 'D-uñas', 'ALTOS 3P', 846.0, 0.2681, true),
('CAT-DUN-010', 'D-uñas', 'BAJOS 5P', 700.0, 0.5906, true),
('CAT-DUN-011', 'D-uñas', 'BAJOS 4P', 456.0, 0.6658, true),
('CAT-DUN-012', 'D-uñas', 'BAJOS 3P', 400.0, 0.6222, true),
('CAT-DUN-013', 'D-uñas', 'BAJOS 2 p', 380.0, 0.6146, true),
('CAT-DUN-014', 'D-uñas', 'BAJOS 1P', 350.0, 0.2279, true),
('CAT-DUN-015', 'D-uñas', 'ADAPTACIÓN E INSTALACIÓN DE ASPIRADOR', 20.0, 0.5499, true),
('CAT-DUN-016', 'D-uñas', '4P', 1229.0, 0.5696, true),
('CAT-DUN-017', 'D-uñas', '3P', 1069.0, 0.466, true),
('CAT-DUN-018', 'D-uñas', '2P', 802.0, 0.478, true),
('CAT-DUN-019', 'D-uñas', '1P', 654.0, 0.1937, true),
('CAT-DUN-020', 'D-uñas', '100 HASTA 300CM DE ALTO', 214.0, 0.4877, true),
('CAT-DUN-021', 'D-uñas', 'PALILLERÍA 0.5 HASTA 300CM DE ALTO', 127.0, 0.208, true),
('CAT-DUN-022', 'D-uñas', 'BALDA PARA PALILLERÍA 1.OO', 16.0, 0.5199, true),
('CAT-DUN-023', 'D-uñas', 'BARRA PARA BLISTER + 5 GANCHOS', 22.0, 0.56, true),
('CAT-DUN-024', 'D-uñas', 'EXPOSITOR MADERA', 219.0, 0.4303, true),
('CAT-DUN-025', 'D-uñas', 'EXPO META', 25.0, 0.55, true),
('CAT-DUN-026', 'D-uñas', 'MUEBLE CABINA 140/160', 272.0, 0.2735, true),
('CAT-DUN-027', 'D-uñas', 'ADAPTACION CAJA ANTIGUA CORTa', 80.0, 0.4285, true),
('CAT-DUN-028', 'D-uñas', 'ADAPTACION CAJA ANTIGUA LARGA', 90.0, 0.4526, true),
('CAT-DUN-029', 'D-uñas', 'FRONTAL MADERA + LOGO PARA MUEBLE ANTIGUO', 80.0, 0.4285, true),
('CAT-DUN-030', 'D-uñas', 'FORRADO DE ALMACENAJE', 24.0, 0.7157, true),
('CAT-DUN-031', 'D-uñas', 'PARED AMARILLA CON MAPA 120 X 300', 125.0, 0.67, true),
('CAT-DUN-032', 'D-uñas', 'PARED AMARILLA SIN MAPA 120 X 300', 100.0, 0.54, true),
('CAT-DUN-033', 'D-uñas', 'METACRILATO HOJAS E ISOTIPO 115 X300', 247.0, 0.3117, true),
('CAT-DUN-034', 'D-uñas', '90 X 60', 64.05, 0.1523, true),
('CAT-DUN-035', 'D-uñas', '100 X 111', 78.57, 0.6049, true),
('CAT-DUN-036', 'D-uñas', '200 X 100', 111.58, 0.691, true),
('CAT-DUN-037', 'D-uñas', 'VIAJE HASTA 250 KM', 175.0, 0.37, true),
('CAT-DUN-038', 'D-uñas', 'VIAJE MÁS DE 250 KM', 340.0, 0.25, true),
('CAT-DUN-039', 'D-uñas', 'MONTAJE MADRID', 60.0, 0.69, true),
('CAT-DUN-040', 'D-uñas', 'MONTAJE HASTA 250 KM', 250.0, 0.48, true),
('CAT-DUN-041', 'D-uñas', 'MONTAJE MÁS DE 250 KM', 600.0, 0.27, true),
('CAT-DUN-042', 'D-uñas', 'MONTAJE ADICIONAL', 288.0, 0.48, true),
('CAT-EXM-043', 'EXM', 'ROTULO SOLO TEXTO', 723.82, 0.6855, true),
('CAT-EXM-044', 'EXM', 'RÓTULO CON META (ESPECIAL LEDS) + BANDEJA CHAPA PERFORADA 3 METROS', 1207.0, 0.5625, true),
('CAT-EXM-045', 'EXM', 'ROTULO CON SOPORTE TECHO + Meta trasero', 977.0, 0.6062, true),
('CAT-EXM-046', 'EXM', 'LAMAS + SOPORTE TV', 774.0, 0.0, true),
('CAT-EXM-047', 'EXM', 'MOSTRADOR 155 DE LARGO + LOGO LUMINOSO', 374.43, 0.5315, true),
('CAT-EXM-048', 'EXM', 'MOSTRADOR 100 DE LARGO + LOGO LUMINOSO', 354.8, 0.5454, true),
('CAT-EXM-049', 'EXM', 'MOSTRADOR 70 DE LARGO + LOGO LUMINOSO', 345.31, 0.4224, true),
('CAT-EXM-050', 'EXM', 'HAIR LAB ESTRUCTURA DE 150 CM + 2 MUEBLES CAJONES+1 MUEBLE PUERTAS', 609.78, 0.5156, true),
('CAT-EXM-051', 'EXM', 'MUEBLE TV CON LETRAS PVC 150 cm', 249.11, 0.4997, true),
('CAT-EXM-052', 'EXM', 'MUEBLE TV 150 cm', 208.86, 0.4979, true),
('CAT-EXM-053', 'EXM', 'TOCADOR SUELO', 268.0, 0.5854, true),
('CAT-EXM-054', 'EXM', 'LUMINOSO HAIR LAB ( módulo de 50 cm + letras luminosas Hair lab)', 200.56, 0.75, true),
('CAT-EXM-055', 'EXM', 'MUEBLE TÉCNICO ALTO Y BAJO DE 88 CM DE ANCHO', 344.58, 0.48, true),
('CAT-EXM-056', 'EXM', 'ESTRUCTRURA CURVA DE 4 MÓDULOS DE 86 CM', 2281.0, 0.521, true),
('CAT-EXM-057', 'EXM', 'ESTRUCTRURA RECTA DE 3 MÓDULOS DE 86 CM', 1822.0, 0.49, true),
('CAT-EXM-058', 'EXM', 'VITRINA', 979.92, 0.3, true),
('CAT-EXM-059', 'EXM', 'ROTULO MADERA CON BOMBILLAS', 726.0, 0.4, true),
('CAT-EXM-060', 'EXM', 'ESCULTURA', 100.0, 0.607, true),
('CAT-EXM-061', 'EXM', 'CARRITO 4 CAJONES', 238.79, 0.13, true),
('CAT-EXM-062', 'EXM', 'BANDEJA', 80.0, 0.2653, true),
('CAT-EXM-063', 'EXM', 'MUEBLE NEVERA', 110.0, 0.4975, true),
('CAT-EXM-064', 'EXM', 'MUEBLE ALMACENAJE DE 50 x 254', 216.94, 0.5892, true),
('CAT-EXM-065', 'EXM', 'MUEBLE BAJO HAIR LAB PUERTAS', 162.34, 0.4011, true),
('CAT-EXM-066', 'EXM', 'MUEBLE BAJO HAIR LAB CAJONES', 116.25, 0.698, true),
('CAT-EXM-067', 'EXM', 'MUEBLE TÉCNICO DE 44 CM ( ALTO Y BAJO)', 251.56, 0.2402, true),
('CAT-EXM-068', 'EXM', 'MONTAJES HORARIO COMERCIAL', 142.48, 0.8205, true),
('CAT-NF-069', 'Nails Factory', 'puesto alto de 58 y 26 de almacenaje', 134.68, 0.7674, true),
('CAT-NF-070', 'Nails Factory', 'Puesto adptado de 59', 90.94, 0.7674, true),
('CAT-NF-071', 'Nails Factory', 'Caja de 75', 215.8, 0.6969, true),
('CAT-NF-072', 'Nails Factory', 'Frontal caja pequeño', 247.2, 0.6969, true),
('CAT-NF-073', 'Nails Factory', 'Frontal caja mediano', 301.92, 0.6969, true),
('CAT-NF-074', 'Nails Factory', 'Frontal caja Grande', 362.99, 0.6969, true),
('CAT-NF-075', 'Nails Factory', 'Papeleras', 7.0, 0.5073, true),
('CAT-NF-076', 'Nails Factory', 'Montaje muebles accesorios', 50.0, 0.5073, true),
('CAT-NF-077', 'Nails Factory', 'Montaje vinilos', 80.0, 0.6044, true),
('CAT-NF-078', 'Nails Factory', 'Material vario', 70.0, 0.4017, true);

INSERT INTO personal (id, nombre, coste_mes, horas_pagadas_mes, productividad, n_personas, coste_hora_productiva) VALUES ('p1_admin', 'P1: Admin + Rotulación', 2516, 168, 0.8, 1, 18.72),
('p2_diseno', 'P2: Diseño + Gestión', 3013, 168, 0.8, 1, 22.42),
('p3p4_carpinteria', 'P3+P4: Carpintería (2 pers)', 5032, 168, 0.85, 2, 35.24),
('p5p6_ensamblaje', 'P5+P6: Ensamblaje (2 pers)', 5986, 168, 0.85, 2, 41.92);

INSERT INTO electricidad (id, clase, nombre, unidad, tamano, precio, activo) VALUES ('R01-BL', 'LEDS', 'Rollo LED frío/cálido', 'cm', NULL, 5.25, true),
('R01-RGB', 'LEDS', 'Rollo LED RGB', 'cm', NULL, 7.8, true),
('FA01-ES1260', 'FUENTES', 'Fuente 12V 60w', 'ud', NULL, 16.88, true),
('EN01-SUPS', 'ENCHUFES', 'Enchufe sencillo', 'ud', NULL, 2.81, true);
