-- Add intent_tags column to photography_terms table
ALTER TABLE photography_terms
ADD COLUMN IF NOT EXISTS intent_tags text;
