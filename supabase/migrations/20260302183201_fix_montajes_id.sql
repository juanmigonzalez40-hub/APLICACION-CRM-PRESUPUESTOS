-- Fix montajes table ID to be automatic UUID
ALTER TABLE montajes DROP COLUMN id;
ALTER TABLE montajes ADD COLUMN id UUID PRIMARY KEY DEFAULT gen_random_uuid();
