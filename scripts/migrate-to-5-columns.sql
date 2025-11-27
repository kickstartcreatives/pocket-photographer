-- Migration script to update photography_terms table to 5-column structure
-- Run this in Supabase SQL Editor

-- Drop the existing table (this will delete all data)
DROP TABLE IF EXISTS photography_terms CASCADE;

-- Create new photography_terms table with 5 columns
CREATE TABLE photography_terms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  element TEXT NOT NULL,
  category TEXT NOT NULL,
  what_it_does TEXT NOT NULL,
  best_used_for TEXT NOT NULL,
  example_prompt_usage TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better search performance
CREATE INDEX idx_photography_terms_element ON photography_terms(element);
CREATE INDEX idx_photography_terms_category ON photography_terms(category);

-- Enable Row Level Security (RLS)
ALTER TABLE photography_terms ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access to photography_terms"
  ON photography_terms
  FOR SELECT
  TO anon
  USING (true);

-- Create full-text search column
ALTER TABLE photography_terms ADD COLUMN search_vector tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(element, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(category, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(what_it_does, '')), 'C') ||
    setweight(to_tsvector('english', coalesce(best_used_for, '')), 'D')
  ) STORED;

CREATE INDEX idx_photography_terms_search ON photography_terms USING gin(search_vector);
