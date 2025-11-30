const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://vbaqdgfxamwgrnvnykxr.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZiYXFkZ2Z4YW13Z3Judm55a3hyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDE4NDA3OCwiZXhwIjoyMDc5NzYwMDc4fQ.WLkHbMUzJNmbfvefVBinlDSaBqD2G-GhHEOvNTnI8ZM';

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

async function setupPolicies() {
  console.log('🔐 Setting up storage policies...\n');

  const policies = [
    {
      name: 'Allow public uploads to images bucket',
      sql: `
        CREATE POLICY IF NOT EXISTS "Allow public uploads to images bucket"
        ON storage.objects FOR INSERT
        TO public
        WITH CHECK (bucket_id = 'images');
      `
    },
    {
      name: 'Allow public reads from images bucket',
      sql: `
        CREATE POLICY IF NOT EXISTS "Allow public reads from images bucket"
        ON storage.objects FOR SELECT
        TO public
        USING (bucket_id = 'images');
      `
    },
    {
      name: 'Allow public updates to images bucket',
      sql: `
        CREATE POLICY IF NOT EXISTS "Allow public updates to images bucket"
        ON storage.objects FOR UPDATE
        TO public
        USING (bucket_id = 'images');
      `
    },
    {
      name: 'Allow public deletes from images bucket',
      sql: `
        CREATE POLICY IF NOT EXISTS "Allow public deletes from images bucket"
        ON storage.objects FOR DELETE
        TO public
        USING (bucket_id = 'images');
      `
    }
  ];

  for (const policy of policies) {
    try {
      console.log(`   Creating: ${policy.name}...`);
      const { data, error } = await supabase.rpc('exec_sql', { sql: policy.sql });

      if (error) {
        // Try direct SQL execution
        const result = await supabase.from('_supabase').select('*').limit(0);
        console.log(`   ℹ️  Policy creation requires manual SQL execution`);
      } else {
        console.log(`   ✅ Created: ${policy.name}`);
      }
    } catch (e) {
      console.log(`   ℹ️  ${policy.name} - Needs manual setup`);
    }
  }

  console.log('\n📋 Please run this SQL manually in Supabase SQL Editor:');
  console.log('   https://supabase.com/dashboard/project/vbaqdgfxamwgrnvnykxr/sql/new\n');

  const allPoliciesSQL = policies.map(p => p.sql).join('\n');
  console.log(allPoliciesSQL);

  console.log('\n✨ After running the SQL, your storage will be ready!');
}

setupPolicies();
