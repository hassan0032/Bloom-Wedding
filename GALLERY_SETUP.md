# Gallery Image Upload Setup Guide

## Overview
The gallery image upload functionality allows administrators to upload images to a Supabase storage bucket and store the URLs in the `gallery_images` table. The RLS (Row Level Security) has been disabled on the gallery_images table to allow for easier image management.

## Setup Steps

### 1. Create Storage Bucket
You need to create a storage bucket named "gallery" in your Supabase dashboard:

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard/project/pkgmgmgxnfodtxzezzmxxm)
2. Navigate to **Storage** in the left sidebar
3. Click **"Create a new bucket"**
4. Set the bucket name to: `gallery`
5. **Important**: Check the **"Public bucket"** option to make images publicly accessible
6. Click **"Create bucket"**

### 2. Database Setup
The following migrations have been applied:
- `20250108000000_create_gallery_images.sql` - Creates the gallery_images table
- `20250108000003_disable_gallery_rls.sql` - Disables RLS on gallery_images table
- `20250108000004_remove_gallery_rls_policies.sql` - Removes all RLS policies from gallery_images table
- `20250108000005_setup_storage_policies.sql` - Sets up storage policies for gallery bucket
- `20250108000006_allow_anonymous_storage.sql` - Allows anonymous uploads to gallery bucket

### 3. Using the Upload Feature

#### Access Admin Panel
1. Navigate to `/admin` in your application
2. Log in with your admin credentials
3. Click on **"Gallery Images"** in the sidebar

#### Upload Images
1. Click **"Select Images"** to choose one or more image files
2. Preview the selected images
3. Click **"Upload to Gallery"** to upload them
4. Images will be:
   - Uploaded to the `gallery` storage bucket
   - Stored with unique filenames
   - URLs saved in the `gallery_images` table
   - Displayed in the gallery section

#### Manage Images
- View all uploaded images in the admin panel
- Delete images by clicking the "×" button on each image
- Images are automatically removed from both storage and database

## File Structure

```
gallery_images table:
- id: UUID (primary key)
- image_url: TEXT (public URL from storage)
- image_name: TEXT (original filename)
- alt_text: TEXT (for accessibility)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

## Storage Structure

```
gallery bucket:
└── gallery/
    ├── 1703123456789-abc123.jpg
    ├── 1703123456790-def456.png
    └── ...
```

## Error Handling

The upload functionality includes comprehensive error handling:

- **Bucket not found**: Clear instructions to create the bucket
- **Upload failures**: Detailed error messages with cleanup
- **Database errors**: Automatic cleanup of uploaded files if database insert fails
- **Delete failures**: Graceful handling of storage cleanup errors

## Security Considerations

- RLS is disabled on gallery_images table for easier management
- Images are stored in a public bucket for website display
- File uploads are restricted to image types only
- Unique filenames prevent conflicts

## Troubleshooting

### Common Issues

1. **"Storage bucket not found" error**
   - Solution: Create the "gallery" bucket in Supabase dashboard

2. **"Permission denied" errors**
   - Solution: Ensure the bucket is set to public
   - Check that RLS is disabled on gallery_images table

3. **"new row violates row-level security policy" error**
   - Solution: This was caused by storage bucket RLS policies
   - Fixed by applying migrations that allow anonymous uploads to the gallery bucket

4. **Images not displaying**
   - Check that the bucket is public
   - Verify image URLs are accessible
   - Check browser console for CORS errors

### Testing the Setup

Run the setup script to verify your configuration:
```bash
node scripts/setup-storage.js
```

This will check if the gallery bucket exists and provide setup instructions if needed.

## Code Files

- `src/pages/Admin.tsx` - Main upload interface
- `src/pages/Gallery.tsx` - Public gallery display
- `supabase/migrations/` - Database setup migrations
- `scripts/setup-storage.js` - Storage verification script
