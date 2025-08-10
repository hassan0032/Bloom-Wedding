-- Remove all RLS policies from gallery_images table
DROP POLICY IF EXISTS "Allow public read access to gallery images" ON public.gallery_images;
DROP POLICY IF EXISTS "Allow authenticated users to insert gallery images" ON public.gallery_images;
DROP POLICY IF EXISTS "Allow authenticated users to update gallery images" ON public.gallery_images;
DROP POLICY IF EXISTS "Allow authenticated users to delete gallery images" ON public.gallery_images;

-- Disable RLS completely
ALTER TABLE public.gallery_images DISABLE ROW LEVEL SECURITY;
