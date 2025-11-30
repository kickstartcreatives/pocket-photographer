const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = 'https://vbaqdgfxamwgrnvnykxr.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZiYXFkZ2Z4YW13Z3Judm55a3hyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDE4NDA3OCwiZXhwIjoyMDc5NzYwMDc4fQ.WLkHbMUzJNmbfvefVBinlDSaBqD2G-GhHEOvNTnI8ZM';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function restoreBackup() {
  console.log('Restoring backup data...\n');

  try {
    const backupData = JSON.parse(fs.readFileSync('photography_terms_backup.json', 'utf8'));

    // Remove search_vector from each record (it's a generated column)
    const cleanData = backupData.map(({ search_vector, ...rest }) => rest);

    const { error: restoreError } = await supabase
      .from('photography_terms')
      .insert(cleanData);

    if (restoreError) {
      console.error('Error restoring backup:', restoreError);
      throw restoreError;
    }

    console.log(`✅ Successfully restored ${cleanData.length} rows from backup\n`);

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

restoreBackup();
