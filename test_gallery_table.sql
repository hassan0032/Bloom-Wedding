-- Test script to verify gallery_images table exists
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'gallery_images'
ORDER BY ordinal_position;
