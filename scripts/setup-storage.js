const https = require('https');

const SUPABASE_URL = 'https://vbaqdgfxamwgrnvnykxr.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZiYXFkZ2Z4YW13Z3Judm55a3hyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDE4NDA3OCwiZXhwIjoyMDc5NzYwMDc4fQ.WLkHbMUzJNmbfvefVBinlDSaBqD2G-GhHEOvNTnI8ZM';

function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, SUPABASE_URL);
    const options = {
      method,
      headers: {
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'application/json',
        'apikey': SERVICE_KEY
      }
    };

    const req = https.request(url, options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const json = body ? JSON.parse(body) : {};
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(json);
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${JSON.stringify(json)}`));
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function setupStorage() {
  console.log('🚀 Setting up Supabase Storage...\n');

  try {
    // Step 1: Check if bucket exists
    console.log('1️⃣  Checking for existing "images" bucket...');
    try {
      const buckets = await makeRequest('GET', '/storage/v1/bucket');
      const imagesBucket = buckets.find(b => b.name === 'images');

      if (imagesBucket) {
        console.log('   ✅ Bucket "images" already exists!\n');
      } else {
        throw new Error('Bucket not found');
      }
    } catch (error) {
      if (error.message.includes('not found') || error.message.includes('Bucket not found')) {
        console.log('   ℹ️  Bucket does not exist. Creating...');

        // Create bucket
        await makeRequest('POST', '/storage/v1/bucket', {
          name: 'images',
          public: true,
          file_size_limit: 5242880, // 5MB
          allowed_mime_types: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
        });

        console.log('   ✅ Created "images" bucket!\n');
      } else {
        throw error;
      }
    }

    // Step 2: Set up policies
    console.log('2️⃣  Setting up storage policies...');

    // Note: Storage policies are typically set via SQL, so we'll provide instructions
    console.log('   ℹ️  Storage policies need to be set via SQL Editor.\n');

    console.log('📋 Next Steps - Run this SQL in Supabase SQL Editor:');
    console.log('   https://supabase.com/dashboard/project/vbaqdgfxamwgrnvnykxr/sql/new\n');

    console.log(`-- Allow public uploads to images bucket
CREATE POLICY "Allow public uploads to images bucket"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'images');

-- Allow public reads from images bucket
CREATE POLICY "Allow public reads from images bucket"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'images');

-- Allow public updates to images bucket
CREATE POLICY "Allow public updates to images bucket"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'images');

-- Allow public deletes from images bucket
CREATE POLICY "Allow public deletes from images bucket"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'images');
`);

    console.log('\n✨ Storage bucket setup complete!');
    console.log('\n📝 Remember to:');
    console.log('   1. Run the SQL policies above in Supabase SQL Editor');
    console.log('   2. Test image upload in the admin panel at /admin');

  } catch (error) {
    console.error('\n❌ Error setting up storage:', error.message);
    console.log('\n📖 Manual Setup Instructions:');
    console.log('   1. Go to: https://supabase.com/dashboard/project/vbaqdgfxamwgrnvnykxr/storage/buckets');
    console.log('   2. Click "New bucket"');
    console.log('   3. Name: images');
    console.log('   4. Check "Public bucket"');
    console.log('   5. Click "Create bucket"');
    console.log('   6. Then run the SQL policies shown above');
  }
}

setupStorage();
