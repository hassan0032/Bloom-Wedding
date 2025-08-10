-- Fix RLS policies for gallery_images table
-- First, drop existing policies
DROP POLICY IF EXISTS "Allow public read access to gallery images" ON public.gallery_images;
DROP POLICY IF EXISTS "Allow authenticated users to insert gallery images" ON public.gallery_images;
DROP POLICY IF EXISTS "Allow authenticated users to update gallery images" ON public.gallery_images;
DROP POLICY IF EXISTS "Allow authenticated users to delete gallery images" ON public.gallery_images;

-- Create new policies with proper authentication checks
CREATE POLICY "Allow public read access to gallery images" 
ON public.gallery_images
FOR SELECT 
USING (true);

CREATE POLICY "Allow authenticated users to insert gallery images" 
ON public.gallery_images
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update gallery images" 
ON public.gallery_images
FOR UPDATE 
USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete gallery images" 
ON public.gallery_images
FOR DELETE 
USING (auth.role() = 'authenticated');

-- Also ensure the table has RLS enabled
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
