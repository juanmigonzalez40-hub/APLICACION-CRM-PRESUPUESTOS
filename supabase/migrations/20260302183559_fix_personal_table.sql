-- Add missing column to personal table
ALTER TABLE personal ADD COLUMN IF NOT EXISTS coste_hora_productiva NUMERIC DEFAULT 0;
