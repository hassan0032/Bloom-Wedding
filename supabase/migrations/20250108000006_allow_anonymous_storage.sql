-- Allow anonymous uploads to gallery bucket
-- This is needed for the admin panel to work without requiring user authentication

-- Drop existing policies first
DROP POLICY IF EXISTS "Allow authenticated users to upload to gallery bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to update gallery bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete from gallery bucket" ON storage.objects;

-- Create new policies that allow anonymous access
CREATE POLICY "Allow anonymous uploads to gallery bucket" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'gallery');

CREATE POLICY "Allow anonymous updates to gallery bucket" ON storage.objects
    FOR UPDATE USING (bucket_id = 'gallery');

CREATE POLICY "Allow anonymous deletes from gallery bucket" ON storage.objects
    FOR DELETE USING (bucket_id = 'gallery');
