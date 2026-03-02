-- DL Studio Budgeting App - Initial Schema
-- Created: 2026-03-02
-- Version: 1.1 (Updated with Muebles Catalogo and Spanish naming)

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. SEQUENCES
-- Auto-reference sequence: 2026-001, 2026-002, etc.
CREATE SEQUENCE IF NOT EXISTS presupuesto_ref_seq START 1;

-- 3. TABLES (Configuración)

CREATE TABLE IF NOT EXISTS materiales (
    id TEXT PRIMARY KEY,
    familia TEXT NOT NULL, -- impresion / laminado / vinilo_corte / rigido
    clase TEXT,
    nombre TEXT NOT NULL,
    unidad TEXT NOT NULL, -- m2 / ml / ud / liston
    grosor TEXT,
    tamano_plancha TEXT,
    precio NUMERIC NOT NULL DEFAULT 0,
    merma NUMERIC DEFAULT 1, -- factor cobertura
    activo BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS electricidad (
    id TEXT PRIMARY KEY,
    clase TEXT NOT NULL, -- LEDS / FUENTES / ENCHUFES / CABLEADO / DIFUSORES
    nombre TEXT NOT NULL,
    unidad TEXT NOT NULL, -- m / ud / cm
    tamano TEXT,
    precio NUMERIC NOT NULL DEFAULT 0,
    activo BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS perfileria (
    id TEXT PRIMARY KEY,
    clase TEXT NOT NULL, -- ANGULOS / TUBO / MARCO TELA / CAJON ROTULO
    nombre TEXT NOT NULL,
    unidad TEXT NOT NULL, -- ml / ud
    tamano TEXT,
    precio_ml NUMERIC NOT NULL DEFAULT 0,
    activo BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS complementos (
    id TEXT PRIMARY KEY,
    clase TEXT NOT NULL, -- LONAS / ADHESIVOS
    nombre TEXT NOT NULL,
    unidad TEXT NOT NULL, -- ml / ud / bote
    precio NUMERIC NOT NULL DEFAULT 0,
    activo BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS manipulados (
    id TEXT PRIMARY KEY,
    clase TEXT NOT NULL, -- MADERA / EMBALAJE
    nombre TEXT NOT NULL,
    unidad TEXT NOT NULL, -- m2 / ml / ud
    precio NUMERIC NOT NULL DEFAULT 0,
    activo BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS montajes (
    id TEXT PRIMARY KEY,
    concepto TEXT NOT NULL, -- MONTADORES / VIAJES / DIETAS / EXTRAS
    tipo TEXT NOT NULL,
    unidad TEXT NOT NULL, -- H / km / DIA/pax / DIA / CAJA
    precio NUMERIC NOT NULL DEFAULT 0,
    minimo_horas NUMERIC,
    activo BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS maquinas (
    id TEXT PRIMARY KEY, -- hp_latex / laminadora / plotter_summa / cnc
    nombre TEXT NOT NULL,
    valor_reposicion NUMERIC DEFAULT 0,
    vida_util INT DEFAULT 5,
    consumo_electrico NUMERIC DEFAULT 0, -- kWh/h
    minutos_m2 NUMERIC DEFAULT 0,
    m2_año INT DEFAULT 0,
    mantenimiento_anual NUMERIC DEFAULT 0,
    parametros_extra JSONB DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS personal (
    id TEXT PRIMARY KEY, -- p1_admin / p2_diseno / p3p4_carpinteria / p5p6_ensamblaje
    nombre TEXT NOT NULL,
    coste_mes NUMERIC NOT NULL DEFAULT 0,
    horas_pagadas_mes INT DEFAULT 168,
    productividad NUMERIC DEFAULT 0.75,
    n_personas INT DEFAULT 1
);

CREATE TABLE IF NOT EXISTS margenes (
    id SERIAL PRIMARY KEY,
    desde_m2 NUMERIC NOT NULL,
    hasta_m2 NUMERIC NOT NULL,
    margen_cliente_final NUMERIC NOT NULL,
    margen_agencia NUMERIC NOT NULL
);

CREATE TABLE IF NOT EXISTS configuracion_global (
    id INT PRIMARY KEY DEFAULT 1,
    precio_kwh NUMERIC DEFAULT 0.20,
    amortizacion_activa BOOLEAN DEFAULT TRUE,
    retal_min_ancho_cm INT DEFAULT 50,
    retal_min_alto_cm INT DEFAULT 30,
    minimo_m2_cobrable NUMERIC DEFAULT 1.0,
    margen_min_cliente_final NUMERIC DEFAULT 0.40,
    margen_min_agencia NUMERIC DEFAULT 0.25,
    mercancias_cajas_gratis INT DEFAULT 3,
    mercancias_precio_caja NUMERIC DEFAULT 3.0,
    bobina_max_laminado_cm INT DEFAULT 140,
    bobina_ancho_1_cm INT DEFAULT 137,
    bobina_ancho_2_cm INT DEFAULT 160,
    CONSTRAINT single_row CHECK (id = 1)
);

CREATE TABLE IF NOT EXISTS muebles_catalogo (
    id TEXT PRIMARY KEY,
    marca TEXT NOT NULL,
    nombre TEXT NOT NULL,
    coste NUMERIC NOT NULL DEFAULT 0,
    margen_pactado NUMERIC NOT NULL DEFAULT 0, -- Factor for PVP calculation
    activo BOOLEAN DEFAULT TRUE
);

-- Materiales Unificados View (for Edge Function compatibility)
CREATE OR REPLACE VIEW materiales_unificados AS
SELECT * FROM materiales;

-- 4. TABLES (Negocio)

CREATE TABLE IF NOT EXISTS clientes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre TEXT NOT NULL,
    empresa TEXT,
    telefono TEXT,
    email TEXT,
    tipo_cliente TEXT NOT NULL DEFAULT 'cliente_final', -- cliente_final / agencia
    fecha_creacion TIMESTAMPTZ DEFAULT NOW(),
    activo BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS presupuestos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    referencia TEXT UNIQUE NOT NULL,
    cliente_id UUID REFERENCES clientes(id),
    estado TEXT DEFAULT 'borrador', -- borrador / enviado / aceptado / rechazado
    fecha_creacion TIMESTAMPTZ DEFAULT NOW(),
    fecha_envio TIMESTAMPTZ,
    fecha_validez TIMESTAMPTZ DEFAULT (NOW() + interval '15 days'),
    base_imponible NUMERIC DEFAULT 0,
    iva NUMERIC DEFAULT 0,
    total NUMERIC DEFAULT 0,
    notas TEXT,
    pdf_url TEXT
);

CREATE TABLE IF NOT EXISTS partidas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    presupuesto_id UUID REFERENCES presupuestos(id) ON DELETE CASCADE,
    orden INT,
    familia TEXT NOT NULL,
    descripcion TEXT,
    cantidad NUMERIC DEFAULT 1,
    unidad TEXT, -- m2 / ml / ud / h / día
    coste_unitario NUMERIC DEFAULT 0,
    precio_venta_unitario NUMERIC DEFAULT 0,
    margen_aplicado NUMERIC,
    descuento NUMERIC DEFAULT 0,
    precio_final NUMERIC DEFAULT 0,
    metadatos_calculo JSONB DEFAULT '{}'::jsonb,
    activo BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS archivos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    presupuesto_id UUID REFERENCES presupuestos(id) ON DELETE CASCADE,
    partida_id UUID REFERENCES partidas(id) ON DELETE SET NULL,
    tipo TEXT, -- svg_rotulo / adjunto_general
    nombre_archivo TEXT NOT NULL,
    storage_url TEXT NOT NULL,
    fecha_subida TIMESTAMPTZ DEFAULT NOW()
);

-- 5. FUNCTIONS & TRIGGERS

-- Function to generate automatic reference (YYYY-XXX)
CREATE OR REPLACE FUNCTION generate_budget_reference() 
RETURNS TEXT AS $$
DECLARE
    year_prefix TEXT;
    next_val INT;
BEGIN
    year_prefix := TO_CHAR(NOW(), 'YYYY');
    next_val := nextval('presupuesto_ref_seq');
    RETURN year_prefix || '-' || LPAD(next_val::TEXT, 3, '0');
END;
$$ LANGUAGE plpgsql;

-- Trigger to set reference on insert
CREATE OR REPLACE FUNCTION set_budget_reference()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.referencia IS NULL THEN
        NEW.referencia := generate_budget_reference();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_budget_reference
BEFORE INSERT ON presupuestos
FOR EACH ROW EXECUTE FUNCTION set_budget_reference();

-- Trigger to calculate Budget Totals
CREATE OR REPLACE FUNCTION sync_budget_totals()
RETURNS TRIGGER AS $$
DECLARE
    target_id UUID;
BEGIN
    target_id := COALESCE(NEW.presupuesto_id, OLD.presupuesto_id);
    UPDATE presupuestos
    SET 
        base_imponible = (SELECT COALESCE(SUM(precio_final), 0) FROM partidas WHERE presupuesto_id = target_id AND activo = true),
        iva = (SELECT COALESCE(SUM(precio_final), 0) * 0.21 FROM partidas WHERE presupuesto_id = target_id AND activo = true),
        total = (SELECT COALESCE(SUM(precio_final), 0) * 1.21 FROM partidas WHERE presupuesto_id = target_id AND activo = true)
    WHERE id = target_id;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_budget_totals
AFTER INSERT OR UPDATE OR DELETE ON partidas
FOR EACH ROW EXECUTE FUNCTION sync_budget_totals();
