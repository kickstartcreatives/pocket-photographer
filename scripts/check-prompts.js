const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://vbaqdgfxamwgrnvnykxr.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZiYXFkZ2Z4YW13Z3Judm55a3hyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDE4NDA3OCwiZXhwIjoyMDc5NzYwMDc4fQ.WLkHbMUzJNmbfvefVBinlDSaBqD2G-GhHEOvNTnI8ZM';

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

async function checkPrompts() {
  console.log('📚 Checking all prompts in database...\n');

  const { data, error } = await supabase
    .from('prompt_library')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('❌ Error fetching prompts:', error);
    return;
  }

  console.log(`Found ${data.length} prompts:\n`);

  data.forEach((prompt, idx) => {
    console.log(`${idx + 1}. "${prompt.title}"`);
    console.log(`   ID: ${prompt.id}`);
    console.log(`   Style: ${prompt.style}`);
    console.log(`   Platform: ${prompt.ai_platform}`);
    console.log(`   Created: ${prompt.created_at}`);
    console.log('');
  });
}

checkPrompts();
