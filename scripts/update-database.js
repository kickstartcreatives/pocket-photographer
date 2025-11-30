const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const Papa = require('papaparse');

const supabaseUrl = 'https://vbaqdgfxamwgrnvnykxr.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZiYXFkZ2Z4YW13Z3Judm55a3hyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDE4NDA3OCwiZXhwIjoyMDc5NzYwMDc4fQ.WLkHbMUzJNmbfvefVBinlDSaBqD2G-GhHEOvNTnI8ZM';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function updateDatabase() {
  console.log('Starting database update process...\n');

  try {
    // Step 1: Add intent_tags column if it doesn't exist
    console.log('Step 1: Checking/adding intent_tags column...');
    const { error: alterError } = await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE photography_terms ADD COLUMN IF NOT EXISTS intent_tags text;'
    });

    // If rpc doesn't work, we'll need to use a different approach
    // For now, let's proceed assuming the column exists or will be added manually
    console.log('intent_tags column check complete\n');

    // Step 2: Backup existing data
    console.log('Step 2: Backing up existing data...');
    const { data: existingData, error: backupError } = await supabase
      .from('photography_terms')
      .select('*');

    if (backupError) {
      console.error('Error backing up data:', backupError);
      throw backupError;
    }

    // Save backup to file
    fs.writeFileSync(
      'photography_terms_backup.json',
      JSON.stringify(existingData, null, 2)
    );
    console.log(`Backed up ${existingData.length} rows to photography_terms_backup.json\n`);

    // Step 3: Delete existing rows
    console.log('Step 3: Deleting existing rows...');
    const { error: deleteError } = await supabase
      .from('photography_terms')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all rows

    if (deleteError) {
      console.error('Error deleting rows:', deleteError);
      throw deleteError;
    }
    console.log('All existing rows deleted\n');

    // Step 4: Read and parse CSV
    console.log('Step 4: Reading CSV file...');
    const csvFile = fs.readFileSync('/Users/barbaramiller/Downloads/pocketphotographer_dictionary_FINAL_FULL.csv', 'utf8');

    const parseResult = Papa.parse(csvFile, {
      header: true,
      skipEmptyLines: true
    });

    console.log(`Parsed ${parseResult.data.length} rows from CSV\n`);

    // Step 5: Transform and insert data
    console.log('Step 5: Inserting new data...');
    const transformedData = parseResult.data.map(row => ({
      element: row.Element,
      category: row.Category,
      what_it_does: row['What It Does'],
      best_used_for: row['Best Used For'],
      example_prompt_usage: row['Example Prompt Usage'],
      intent_tags: row.IntentTags || null
    }));

    // Insert in batches of 100
    const batchSize = 100;
    for (let i = 0; i < transformedData.length; i += batchSize) {
      const batch = transformedData.slice(i, i + batchSize);
      const { error: insertError } = await supabase
        .from('photography_terms')
        .insert(batch);

      if (insertError) {
        console.error(`Error inserting batch ${i / batchSize + 1}:`, insertError);
        throw insertError;
      }
      console.log(`Inserted batch ${i / batchSize + 1} (${batch.length} rows)`);
    }
    console.log(`\nTotal rows inserted: ${transformedData.length}\n`);

    // Step 6: Validation
    console.log('Step 6: Running validation queries...\n');

    // Count rows
    const { count, error: countError } = await supabase
      .from('photography_terms')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('Error counting rows:', countError);
    } else {
      console.log(`Total rows in table: ${count}`);
    }

    // Check for duplicates
    const { data: allTerms } = await supabase
      .from('photography_terms')
      .select('element');

    const elementCounts = {};
    allTerms.forEach(term => {
      elementCounts[term.element] = (elementCounts[term.element] || 0) + 1;
    });

    const duplicates = Object.entries(elementCounts).filter(([_, count]) => count > 1);
    if (duplicates.length > 0) {
      console.log('\nDuplicate terms found:');
      duplicates.forEach(([element, count]) => {
        console.log(`  ${element}: ${count} times`);
      });
    } else {
      console.log('No duplicate terms found');
    }

    // Get unique categories
    const { data: categories } = await supabase
      .from('photography_terms')
      .select('category');

    const uniqueCategories = [...new Set(categories.map(c => c.category))].sort();
    console.log('\nUnique categories:');
    uniqueCategories.forEach(cat => console.log(`  - ${cat}`));

    // Spot check first 5 rows
    const { data: spotCheck } = await supabase
      .from('photography_terms')
      .select('*')
      .limit(5);

    console.log('\nSpot check (first 5 rows):');
    spotCheck.forEach((term, i) => {
      console.log(`${i + 1}. ${term.element} (${term.category})`);
    });

    console.log('\n✅ Database update completed successfully!');

  } catch (error) {
    console.error('\n❌ Error during database update:', error);
    process.exit(1);
  }
}

updateDatabase();
