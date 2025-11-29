-- ============================================================
-- Add style column to prompt_library for filtering
-- ============================================================

-- Step 1: Add style column to prompt_library
ALTER TABLE prompt_library
ADD COLUMN IF NOT EXISTS style text;

-- Step 2: Create index for better filtering performance
CREATE INDEX IF NOT EXISTS idx_prompt_library_style ON prompt_library(style);

-- Step 3: Verify the column was added
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'prompt_library'
AND column_name = 'style';

-- Step 4: Show current prompts (ready to be updated with styles)
SELECT id, title, category, style
FROM prompt_library
ORDER BY created_at DESC;

-- Note: You'll need to manually update each prompt with its appropriate style:
-- UPDATE prompt_library SET style = 'Portrait' WHERE id = '...';
-- UPDATE prompt_library SET style = 'Editorial / Fashion' WHERE id = '...';
-- UPDATE prompt_library SET style = 'Cinematic / Film Look' WHERE id = '...';
-- UPDATE prompt_library SET style = 'Street & Documentary' WHERE id = '...';
-- UPDATE prompt_library SET style = 'Landscape & Scenery' WHERE id = '...';
-- UPDATE prompt_library SET style = 'Product / Commercial' WHERE id = '...';
-- UPDATE prompt_library SET style = 'Lifestyle & Branding' WHERE id = '...';
-- UPDATE prompt_library SET style = 'Creative / Experimental' WHERE id = '...';
