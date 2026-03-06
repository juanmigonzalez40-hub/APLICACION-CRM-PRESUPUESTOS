-- Migration: CRM v2 harmonization
-- Adds project name to budgets and renames partidas to presupuesto_lineas for consistency.

-- 1. Modify presupuestos
ALTER TABLE IF EXISTS presupuestos 
ADD COLUMN IF NOT EXISTS nombre_proyecto TEXT,
ADD COLUMN IF NOT EXISTS serie_proforma TEXT;

-- 2. Rename partidas to presupuesto_lineas if it exists
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'partidas') THEN
        ALTER TABLE partidas RENAME TO presupuesto_lineas;
    END IF;
END $$;

-- 3. Update the trigger function to use the new table name
CREATE OR REPLACE FUNCTION sync_budget_totals()
RETURNS TRIGGER AS $$
DECLARE
    target_id UUID;
BEGIN
    target_id := COALESCE(NEW.presupuesto_id, OLD.presupuesto_id);
    UPDATE presupuestos
    SET 
        base_imponible = (SELECT COALESCE(SUM(precio_final), 0) FROM presupuesto_lineas WHERE presupuesto_id = target_id AND activo = true),
        iva = (SELECT COALESCE(SUM(precio_final), 0) * 0.21 FROM presupuesto_lineas WHERE presupuesto_id = target_id AND activo = true),
        total = (SELECT COALESCE(SUM(precio_final), 0) * 1.21 FROM presupuesto_lineas WHERE presupuesto_id = target_id AND activo = true)
    WHERE id = target_id;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 4. Ensure presupuesto_lineas has details field for technical specs
ALTER TABLE IF EXISTS presupuesto_lineas 
ADD COLUMN IF NOT EXISTS detalles JSONB DEFAULT '{}'::jsonb;
