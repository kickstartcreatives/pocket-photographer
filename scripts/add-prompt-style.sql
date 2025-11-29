-- ============================================================
-- Add prompt_style column and update Styles & Genres terms
-- ============================================================

-- Step 1: Add prompt_style column to photography_terms
ALTER TABLE photography_terms
ADD COLUMN IF NOT EXISTS prompt_style text;

-- Step 2: Update Styles & Genres terms with their prompt_style mappings
-- Based on styles_genres_prompt_style_mapping.csv

UPDATE photography_terms SET prompt_style = 'Cinematic / Film Look' WHERE element = 'Analog Color Palette' AND category = 'Styles & Genres';
UPDATE photography_terms SET prompt_style = 'Portrait' WHERE element = 'Kodak Portra 400' AND category = 'Styles & Genres';
UPDATE photography_terms SET prompt_style = 'Creative / Experimental' WHERE element = 'Cross-Processing' AND category = 'Styles & Genres';
UPDATE photography_terms SET prompt_style = 'Creative / Experimental' WHERE element = 'Neon Cyberpunk City Look' AND category = 'Styles & Genres';
UPDATE photography_terms SET prompt_style = 'Lifestyle & Branding' WHERE element = 'Kodak Gold 200' AND category = 'Styles & Genres';
UPDATE photography_terms SET prompt_style = 'Creative / Experimental' WHERE element = 'Lomography Color Negative' AND category = 'Styles & Genres';
UPDATE photography_terms SET prompt_style = 'Creative / Experimental' WHERE element = 'Color Shifted Film Look' AND category = 'Styles & Genres';
UPDATE photography_terms SET prompt_style = 'Editorial / Fashion' WHERE element = 'Editorial Portrait Style' AND category = 'Styles & Genres';
UPDATE photography_terms SET prompt_style = 'Portrait' WHERE element = 'Low-Key Portrait' AND category = 'Styles & Genres';
UPDATE photography_terms SET prompt_style = 'Editorial / Fashion' WHERE element = 'Kodak Portra 160' AND category = 'Styles & Genres';
UPDATE photography_terms SET prompt_style = 'Landscape & Scenery' WHERE element = 'Fuji Velvia 50' AND category = 'Styles & Genres';
UPDATE photography_terms SET prompt_style = 'Editorial / Fashion' WHERE element = 'Fashion Editorial' AND category = 'Styles & Genres';
UPDATE photography_terms SET prompt_style = 'Portrait' WHERE element = 'Kodak Portra 800' AND category = 'Styles & Genres';
UPDATE photography_terms SET prompt_style = 'Lifestyle & Branding' WHERE element = 'Lifestyle Portrait' AND category = 'Styles & Genres';
UPDATE photography_terms SET prompt_style = 'Portrait' WHERE element = 'High-Key Portrait' AND category = 'Styles & Genres';
UPDATE photography_terms SET prompt_style = 'Cinematic / Film Look' WHERE element = 'Cinematic Still Frame' AND category = 'Styles & Genres';
UPDATE photography_terms SET prompt_style = 'Editorial / Fashion' WHERE element = 'Fuji Pro 400H' AND category = 'Styles & Genres';
UPDATE photography_terms SET prompt_style = 'Creative / Experimental' WHERE element = 'Daguerreotype' AND category = 'Styles & Genres';
UPDATE photography_terms SET prompt_style = 'Lifestyle & Branding' WHERE element = 'Environmental Portrait' AND category = 'Styles & Genres';
UPDATE photography_terms SET prompt_style = 'Cinematic / Film Look' WHERE element = 'Cinematic Color Grading' AND category = 'Styles & Genres';
UPDATE photography_terms SET prompt_style = 'Street & Documentary' WHERE element = 'Documentary Style' AND category = 'Styles & Genres';
UPDATE photography_terms SET prompt_style = 'Cinematic / Film Look' WHERE element = 'Cinematic Depth' AND category = 'Styles & Genres';
UPDATE photography_terms SET prompt_style = 'Product / Commercial' WHERE element = 'Tack Sharp' AND category = 'Styles & Genres';
UPDATE photography_terms SET prompt_style = 'Lifestyle & Branding' WHERE element = 'Commercial Lifestyle Look' AND category = 'Styles & Genres';
UPDATE photography_terms SET prompt_style = 'Product / Commercial' WHERE element = 'Product Hero Shot' AND category = 'Styles & Genres';
UPDATE photography_terms SET prompt_style = 'Landscape & Scenery' WHERE element = 'Kodak Ektar 100' AND category = 'Styles & Genres';
UPDATE photography_terms SET prompt_style = 'Portrait' WHERE element = 'Candid Expression' AND category = 'Styles & Genres';
UPDATE photography_terms SET prompt_style = 'Cinematic / Film Look' WHERE element = 'Analog Negative Scan' AND category = 'Styles & Genres';
UPDATE photography_terms SET prompt_style = 'Creative / Experimental' WHERE element = 'Holga/Toy Camera' AND category = 'Styles & Genres';
UPDATE photography_terms SET prompt_style = 'Lifestyle & Branding' WHERE element = 'Polaroid/Instant Film' AND category = 'Styles & Genres';
UPDATE photography_terms SET prompt_style = 'Street & Documentary' WHERE element = 'Kodak Tri-X 400' AND category = 'Styles & Genres';
UPDATE photography_terms SET prompt_style = 'Cinematic / Film Look' WHERE element = 'Cinestill 800T' AND category = 'Styles & Genres';
UPDATE photography_terms SET prompt_style = 'Creative / Experimental' WHERE element = 'Tintype' AND category = 'Styles & Genres';
UPDATE photography_terms SET prompt_style = 'Street & Documentary' WHERE element = 'Ilford Delta 3200' AND category = 'Styles & Genres';
UPDATE photography_terms SET prompt_style = 'Editorial / Fashion' WHERE element = 'Kodak Ektachrome' AND category = 'Styles & Genres';
UPDATE photography_terms SET prompt_style = 'Product / Commercial' WHERE element = 'Photorealistic' AND category = 'Styles & Genres';
UPDATE photography_terms SET prompt_style = 'Cinematic / Film Look' WHERE element = 'Push Processing' AND category = 'Styles & Genres';
UPDATE photography_terms SET prompt_style = 'Portrait' WHERE element = 'Professional Headshot' AND category = 'Styles & Genres';
UPDATE photography_terms SET prompt_style = 'Portrait' WHERE element = 'Natural Skin Texture' AND category = 'Styles & Genres';
UPDATE photography_terms SET prompt_style = 'Creative / Experimental' WHERE element = 'Painterly Portrait Style' AND category = 'Styles & Genres';
UPDATE photography_terms SET prompt_style = 'Creative / Experimental' WHERE element = 'Cyanotype' AND category = 'Styles & Genres';
UPDATE photography_terms SET prompt_style = 'Street & Documentary' WHERE element = 'Handheld Documentary Style' AND category = 'Styles & Genres';
UPDATE photography_terms SET prompt_style = 'Cinematic / Film Look' WHERE element = 'Film Noir Style' AND category = 'Styles & Genres';
UPDATE photography_terms SET prompt_style = 'Creative / Experimental' WHERE element = 'Platinum Print' AND category = 'Styles & Genres';
UPDATE photography_terms SET prompt_style = 'Editorial / Fashion' WHERE element = 'Medium Format Film' AND category = 'Styles & Genres';
UPDATE photography_terms SET prompt_style = 'Street & Documentary' WHERE element = 'Ilford HP5 Plus 400' AND category = 'Styles & Genres';
UPDATE photography_terms SET prompt_style = 'Product / Commercial' WHERE element = 'Large Format 4x5' AND category = 'Styles & Genres';

-- Step 3: Verify the updates
SELECT
  category,
  prompt_style,
  COUNT(*) as count
FROM photography_terms
WHERE category = 'Styles & Genres'
GROUP BY category, prompt_style
ORDER BY prompt_style;

-- Step 4: Show all Styles & Genres terms with their prompt_style
SELECT
  element,
  category,
  prompt_style
FROM photography_terms
WHERE category = 'Styles & Genres'
ORDER BY prompt_style, element;
