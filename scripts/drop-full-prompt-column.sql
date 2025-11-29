-- Migration: Remove full_prompt column from prompt_library table
-- Date: 2025-11-28
-- Description: Removes the full_prompt column as it's no longer needed.
--              The complete_prompt field contains the full AI prompt.

-- Drop the full_prompt column from prompt_library table
ALTER TABLE prompt_library DROP COLUMN IF EXISTS full_prompt;

-- Verify the change
-- Run this to see the updated table structure:
-- SELECT column_name, data_type, is_nullable
-- FROM information_schema.columns
-- WHERE table_name = 'prompt_library'
-- ORDER BY ordinal_position;
