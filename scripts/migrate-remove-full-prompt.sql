-- Migration: Remove full_prompt column from prompt_library table
-- Date: 2025-11-28
-- Description: Removes the Photography Prompt Terms field (full_prompt) as it's no longer needed

-- Drop the full_prompt column
ALTER TABLE prompt_library DROP COLUMN IF EXISTS full_prompt;

-- Note: The complete_prompt column should already exist
-- If it doesn't exist, uncomment the line below:
-- ALTER TABLE prompt_library ADD COLUMN IF NOT EXISTS complete_prompt TEXT;
