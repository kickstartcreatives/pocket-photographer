-- Storage Policies for Images Bucket
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/vbaqdgfxamwgrnvnykxr/sql/new

-- Drop existing policies if they exist (no error if they don't)
DROP POLICY IF EXISTS "Allow public uploads to images bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow public reads from images bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow public updates to images bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow public deletes from images bucket" ON storage.objects;

-- Create new policies
CREATE POLICY "Allow public uploads to images bucket"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'images');

CREATE POLICY "Allow public reads from images bucket"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'images');

CREATE POLICY "Allow public updates to images bucket"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'images');

CREATE POLICY "Allow public deletes from images bucket"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'images');
