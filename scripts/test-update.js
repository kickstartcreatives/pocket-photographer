const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://vbaqdgfxamwgrnvnykxr.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZiYXFkZ2Z4YW13Z3Judm55a3hyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDE4NDA3OCwiZXhwIjoyMDc5NzYwMDc4fQ.WLkHbMUzJNmbfvefVBinlDSaBqD2G-GhHEOvNTnI8ZM';

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

async function testUpdate() {
  console.log('🧪 Testing prompt update...\n');

  // First, get the first prompt
  const { data: prompts, error: fetchError } = await supabase
    .from('prompt_library')
    .select('*')
    .limit(1);

  if (fetchError) {
    console.error('❌ Error fetching:', fetchError);
    return;
  }

  const prompt = prompts[0];
  console.log('📖 Current prompt:');
  console.log(`   Title: "${prompt.title}"`);
  console.log(`   ID: ${prompt.id}\n`);

  // Try to update it
  const newTitle = `TEST UPDATE ${Date.now()}`;
  console.log(`✏️  Attempting to update title to: "${newTitle}"`);

  const { data: updateData, error: updateError } = await supabase
    .from('prompt_library')
    .update({ title: newTitle })
    .eq('id', prompt.id)
    .select();

  if (updateError) {
    console.error('❌ Update error:', updateError);
    return;
  }

  console.log('✅ Update response:', updateData);

  // Fetch again to verify
  console.log('\n🔍 Fetching again to verify...');
  const { data: verifyData, error: verifyError } = await supabase
    .from('prompt_library')
    .select('*')
    .eq('id', prompt.id)
    .single();

  if (verifyError) {
    console.error('❌ Verify error:', verifyError);
    return;
  }

  console.log('📖 After update:');
  console.log(`   Title: "${verifyData.title}"`);

  if (verifyData.title === newTitle) {
    console.log('\n✅ SUCCESS! Update worked!');
  } else {
    console.log('\n❌ FAILED! Title did not change in database');
    console.log('   This indicates an RLS policy is blocking updates');
  }
}

testUpdate();
