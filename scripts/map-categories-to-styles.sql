-- Map existing category values to new style values
-- This provides an initial mapping based on category names

-- Map Landscape category to Landscape & Scenery style
UPDATE prompt_library
SET style = 'Landscape & Scenery'
WHERE category = 'Landscape' AND style IS NULL;

-- Map Street category to Street & Documentary style
UPDATE prompt_library
SET style = 'Street & Documentary'
WHERE category = 'Street' AND style IS NULL;

-- Map Portrait category to Portrait style
UPDATE prompt_library
SET style = 'Portrait'
WHERE category = 'Portrait' AND style IS NULL;

-- Map Fashion category to Editorial / Fashion style
UPDATE prompt_library
SET style = 'Editorial / Fashion'
WHERE category IN ('Fashion', 'Editorial') AND style IS NULL;

-- Map Product category to Product / Commercial style
UPDATE prompt_library
SET style = 'Product / Commercial'
WHERE category = 'Product' AND style IS NULL;

-- Map Lifestyle category to Lifestyle & Branding style
UPDATE prompt_library
SET style = 'Lifestyle & Branding'
WHERE category = 'Lifestyle' AND style IS NULL;

-- Map Cinematic category to Cinematic / Film Look style
UPDATE prompt_library
SET style = 'Cinematic / Film Look'
WHERE category = 'Cinematic' AND style IS NULL;

-- Map Creative/Experimental categories
UPDATE prompt_library
SET style = 'Creative / Experimental'
WHERE category IN ('Creative', 'Experimental', 'Abstract') AND style IS NULL;

-- Show results
SELECT
  style,
  COUNT(*) as count
FROM prompt_library
GROUP BY style
ORDER BY style;

-- Show all prompts with their assigned styles
SELECT title, category, style
FROM prompt_library
ORDER BY style, title;
