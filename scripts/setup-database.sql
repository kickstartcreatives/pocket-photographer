-- Create photography_terms table
CREATE TABLE IF NOT EXISTS photography_terms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  element TEXT NOT NULL,
  category TEXT NOT NULL,
  what_it_does TEXT NOT NULL,
  best_used_for TEXT NOT NULL,
  example_prompt_usage TEXT NOT NULL,
  prompt_style TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create prompt_library table
CREATE TABLE IF NOT EXISTS prompt_library (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  complete_prompt TEXT,
  ai_platform TEXT NOT NULL,
  image_url TEXT,
  terms_used TEXT[] NOT NULL,
  category TEXT,
  what_to_expect TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better search performance
CREATE INDEX IF NOT EXISTS idx_photography_terms_element ON photography_terms(element);
CREATE INDEX IF NOT EXISTS idx_photography_terms_category ON photography_terms(category);
CREATE INDEX IF NOT EXISTS idx_prompt_library_ai_platform ON prompt_library(ai_platform);
CREATE INDEX IF NOT EXISTS idx_prompt_library_category ON prompt_library(category);

-- Enable Row Level Security (RLS)
ALTER TABLE photography_terms ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompt_library ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to photography_terms"
  ON photography_terms
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public read access to prompt_library"
  ON prompt_library
  FOR SELECT
  TO anon
  USING (true);

-- Create full-text search columns
ALTER TABLE photography_terms ADD COLUMN IF NOT EXISTS search_vector tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(element, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(category, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(what_it_does, '')), 'C') ||
    setweight(to_tsvector('english', coalesce(best_used_for, '')), 'D')
  ) STORED;

CREATE INDEX IF NOT EXISTS idx_photography_terms_search ON photography_terms USING gin(search_vector);
