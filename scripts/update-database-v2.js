const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const Papa = require('papaparse');

const supabaseUrl = 'https://vbaqdgfxamwgrnvnykxr.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZiYXFkZ2Z4YW13Z3Judm55a3hyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDE4NDA3OCwiZXhwIjoyMDc5NzYwMDc4fQ.WLkHbMUzJNmbfvefVBinlDSaBqD2G-GhHEOvNTnI8ZM';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function restoreAndContinue() {
  console.log('Restoring backup and continuing with updated schema...\n');

  try {
    // Restore the backup first
    console.log('Restoring backup data...');
    const backupData = JSON.parse(fs.readFileSync('photography_terms_backup.json', 'utf8'));

    const { error: restoreError } = await supabase
      .from('photography_terms')
      .insert(backupData);

    if (restoreError) {
      console.error('Error restoring backup:', restoreError);
      throw restoreError;
    }
    console.log(`Restored ${backupData.length} rows from backup\n`);

    console.log('Please add the intent_tags column manually:');
    console.log('1. Go to https://vbaqdgfxamwgrnvnykxr.supabase.co/project/vbaqdgfxamwgrnvnykxr/sql');
    console.log('2. Run this SQL:');
    console.log('   ALTER TABLE photography_terms ADD COLUMN IF NOT EXISTS intent_tags text;');
    console.log('3. Then run: node scripts/final-update.js');

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

restoreAndContinue();
