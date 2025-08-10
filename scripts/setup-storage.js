// Script to set up Supabase storage bucket for gallery images
// Run this script if you encounter storage bucket errors

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://pkgmgxnfodtxzezzmxxm.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBrZ21neG5mb2R0eHplenpteHhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2Mjg3MjksImV4cCI6MjA3MDIwNDcyOX0.zEUWdPzpvg6gE2jy3E_9Dj1EGp_TJFPBR1JdaUhbCrU";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function setupStorage() {
  console.log('Testing gallery bucket access...');
  
  try {
    // Try to upload a test file to check if bucket exists and is accessible
    const testFile = new File(['test'], 'test.txt', { type: 'text/plain' });
    
    console.log('Attempting to upload test file to gallery bucket...');
    
    const { data, error } = await supabase.storage
      .from('gallery')
      .upload('test-file.txt', testFile);
    
    if (error) {
      if (error.message.includes('bucket') || error.message.includes('not found')) {
        console.log('❌ Gallery bucket not found or not accessible');
        console.log('\nTo create the gallery bucket:');
        console.log('1. Go to your Supabase dashboard');
        console.log('2. Navigate to Storage');
        console.log('3. Click "Create a new bucket"');
        console.log('4. Name it "gallery"');
        console.log('5. Make it public (check "Public bucket" option)');
        console.log('6. Click "Create bucket"');
      } else if (error.message.includes('permission') || error.message.includes('access')) {
        console.log('❌ Permission denied - bucket exists but not accessible');
        console.log('\nTo fix this:');
        console.log('1. Go to your Supabase dashboard');
        console.log('2. Navigate to Storage');
        console.log('3. Find the "gallery" bucket');
        console.log('4. Click on it and ensure "Public bucket" is checked');
        console.log('5. Save the changes');
      } else {
        console.log('❌ Error:', error.message);
      }
    } else {
      console.log('✅ Gallery bucket is accessible!');
      console.log('Test file uploaded successfully');
      
      // Clean up the test file
      await supabase.storage.from('gallery').remove(['test-file.txt']);
      console.log('Test file cleaned up');
    }
    
  } catch (error) {
    console.error('Setup error:', error);
  }
}

setupStorage();
