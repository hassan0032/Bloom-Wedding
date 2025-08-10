-- Fix RLS policies for gallery_images table
-- Drop existing policies
DROP POLICY IF EXISTS "Allow public read access to gallery images" ON public.gallery_images;
DROP POLICY IF EXISTS "Allow authenticated users to insert gallery images" ON public.gallery_images;
DROP POLICY IF EXISTS "Allow authenticated users to update gallery images" ON public.gallery_images;
DROP POLICY IF EXISTS "Allow authenticated users to delete gallery images" ON public.gallery_images;

-- Create simpler policies that work better
CREATE POLICY "Allow public read access to gallery images" 
ON public.gallery_images
FOR SELECT 
USING (true);

-- Allow any authenticated user to insert
CREATE POLICY "Allow authenticated users to insert gallery images" 
ON public.gallery_images
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- Allow any authenticated user to update
CREATE POLICY "Allow authenticated users to update gallery images" 
ON public.gallery_images
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

-- Allow any authenticated user to delete
CREATE POLICY "Allow authenticated users to delete gallery images" 
ON public.gallery_images
FOR DELETE 
USING (auth.uid() IS NOT NULL);

-- Ensure RLS is enabled
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
