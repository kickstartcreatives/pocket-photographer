const https = require('https');

const supabaseUrl = 'vbaqdgfxamwgrnvnykxr.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZiYXFkZ2Z4YW13Z3Judm55a3hyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDE4NDA3OCwiZXhwIjoyMDc5NzYwMDc4fQ.WLkHbMUzJNmbfvefVBinlDSaBqD2G-GhHEOvNTnI8ZM';

// Execute raw SQL via Supabase's SQL endpoint
const sql = 'ALTER TABLE photography_terms ADD COLUMN IF NOT EXISTS intent_tags text;';

const options = {
  hostname: supabaseUrl,
  path: '/rest/v1/rpc/exec_sql',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'apikey': supabaseServiceKey,
    'Authorization': `Bearer ${supabaseServiceKey}`
  }
};

const req = https.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    if (res.statusCode === 200 || res.statusCode === 201) {
      console.log('✅ Column added successfully');
    } else {
      console.log('Response:', data);
      console.log('Status:', res.statusCode);
      console.log('\nNote: The column may already exist or you may need to add it manually.');
      console.log('Go to: https://vbaqdgfxamwgrnvnykxr.supabase.co/project/vbaqdgfxamwgrnvnykxr/sql');
      console.log('Run: ALTER TABLE photography_terms ADD COLUMN IF NOT EXISTS intent_tags text;');
    }
  });
});

req.on('error', (error) => {
  console.error('Error:', error);
});

req.write(JSON.stringify({ sql }));
req.end();
