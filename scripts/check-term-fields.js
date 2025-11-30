const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://vbaqdgfxamwgrnvnykxr.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZiYXFkZ2Z4YW13Z3Judm55a3hyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDE4NDA3OCwiZXhwIjoyMDc5NzYwMDc4fQ.WLkHbMUzJNmbfvefVBinlDSaBqD2G-GhHEOvNTnI8ZM';

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

async function checkFields() {
  const { data, error } = await supabase
    .from('photography_terms')
    .select('*')
    .limit(1);

  if (error) {
    console.error('Error:', error);
    return;
  }

  if (data && data.length > 0) {
    console.log('All fields in photography_terms table:');
    console.log(Object.keys(data[0]));
    console.log('\nExample record:');
    console.log(JSON.stringify(data[0], null, 2));
  }
}

checkFields();
