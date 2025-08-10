-- Set up storage policies for gallery bucket
-- These policies allow public access to the gallery bucket

-- Allow public read access to gallery bucket
CREATE POLICY "Allow public read access to gallery bucket" ON storage.objects
    FOR SELECT USING (bucket_id = 'gallery');

-- Allow authenticated users to upload to gallery bucket
CREATE POLICY "Allow authenticated users to upload to gallery bucket" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'gallery' AND auth.role() = 'authenticated');

-- Allow authenticated users to update files in gallery bucket
CREATE POLICY "Allow authenticated users to update gallery bucket" ON storage.objects
    FOR UPDATE USING (bucket_id = 'gallery' AND auth.role() = 'authenticated');

-- Allow authenticated users to delete files from gallery bucket
CREATE POLICY "Allow authenticated users to delete from gallery bucket" ON storage.objects
    FOR DELETE USING (bucket_id = 'gallery' AND auth.role() = 'authenticated');

-- Alternative: Allow anonymous uploads to gallery bucket (if you want public uploads)
-- CREATE POLICY "Allow anonymous uploads to gallery bucket" ON storage.objects
--     FOR INSERT WITH CHECK (bucket_id = 'gallery');
