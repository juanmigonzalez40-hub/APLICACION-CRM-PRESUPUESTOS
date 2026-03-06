-- Migration: Split muebles_catalogo into brand-specific tables

-- 1. Create мебели_duñas
CREATE TABLE IF NOT EXISTS muebles_duñas (
    id TEXT PRIMARY KEY,
    marca TEXT,
    nombre TEXT,
    coste DECIMAL,
    margen_pactado DECIMAL,
    activo BOOLEAN DEFAULT TRUE
);

-- 2. Create muebles_exm
CREATE TABLE IF NOT EXISTS muebles_exm (
    id TEXT PRIMARY KEY,
    marca TEXT,
    nombre TEXT,
    coste DECIMAL,
    margen_pactado DECIMAL,
    activo BOOLEAN DEFAULT TRUE
);

-- 3. Create muebles_nail
CREATE TABLE IF NOT EXISTS muebles_nail (
    id TEXT PRIMARY KEY,
    marca TEXT,
    nombre TEXT,
    coste DECIMAL,
    margen_pactado DECIMAL,
    activo BOOLEAN DEFAULT TRUE
);

-- 4. Migrate Data
INSERT INTO muebles_duñas SELECT * FROM muebles_catalogo WHERE marca = 'D-uñas';
INSERT INTO muebles_exm SELECT * FROM muebles_catalogo WHERE marca = 'EXM';
INSERT INTO muebles_nail SELECT * FROM muebles_catalogo WHERE marca = 'Nails Factory';

-- Note: We keep the original muebles_catalogo as a backup for now, 
-- but the app will switch to these independent tables.
