const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const Papa = require('papaparse');

const supabaseUrl = 'https://vbaqdgfxamwgrnvnykxr.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZiYXFkZ2Z4YW13Z3Judm55a3hyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDE4NDA3OCwiZXhwIjoyMDc5NzYwMDc4fQ.WLkHbMUzJNmbfvefVBinlDSaBqD2G-GhHEOvNTnI8ZM';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function completeUpdate() {
  console.log('Starting complete database update...\n');

  try {
    // Step 1: Check if intent_tags column exists by trying to read it
    console.log('Step 1: Checking for intent_tags column...');
    const { data: testData, error: testError } = await supabase
      .from('photography_terms')
      .select('id, element, intent_tags')
      .limit(1);

    if (testError && testError.message.includes('intent_tags')) {
      console.log('❌ intent_tags column does not exist yet.');
      console.log('\n🔧 Please add the column manually:');
      console.log('   1. Go to: https://supabase.com/dashboard/project/vbaqdgfxamwgrnvnykxr/sql/new');
      console.log('   2. Paste and run: ALTER TABLE photography_terms ADD COLUMN IF NOT EXISTS intent_tags text;');
      console.log('   3. Then run this script again: node scripts/complete-update.js');
      return;
    }

    console.log('✅ intent_tags column exists\n');

    // Step 2: Delete existing rows
    console.log('Step 2: Deleting existing rows...');
    const { error: deleteError } = await supabase
      .from('photography_terms')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');

    if (deleteError) {
      console.error('Error deleting rows:', deleteError);
      throw deleteError;
    }
    console.log('✅ All existing rows deleted\n');

    // Step 3: Read and parse CSV
    console.log('Step 3: Reading CSV file...');
    const csvFile = fs.readFileSync('/Users/barbaramiller/Downloads/pocketphotographer_dictionary_FINAL_FULL.csv', 'utf8');

    const parseResult = Papa.parse(csvFile, {
      header: true,
      skipEmptyLines: true
    });

    console.log(`✅ Parsed ${parseResult.data.length} rows from CSV\n`);

    // Step 4: Transform and insert data
    console.log('Step 4: Inserting new data...');
    const transformedData = parseResult.data
      .filter(row => row.Element && row.Element.trim() !== '') // Filter out empty rows
      .map(row => ({
        element: row.Element,
        category: row.Category,
        what_it_does: row['What It Does'],
        best_used_for: row['Best Used For'],
        example_prompt_usage: row['Example Prompt Usage'],
        intent_tags: row.IntentTags || null
      }));

    console.log(`Filtered to ${transformedData.length} valid rows\n`);

    // Insert in batches of 50
    const batchSize = 50;
    let totalInserted = 0;

    for (let i = 0; i < transformedData.length; i += batchSize) {
      const batch = transformedData.slice(i, i + batchSize);
      const { error: insertError } = await supabase
        .from('photography_terms')
        .insert(batch);

      if (insertError) {
        console.error(`❌ Error inserting batch ${Math.floor(i / batchSize) + 1}:`, insertError);
        throw insertError;
      }
      totalInserted += batch.length;
      console.log(`✅ Batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(transformedData.length / batchSize)} (${batch.length} rows) - Total: ${totalInserted}`);
    }
    console.log(`\n✅ Total rows inserted: ${totalInserted}\n`);

    // Step 5: Validation
    console.log('Step 5: Running validation queries...\n');

    // Count rows
    const { count, error: countError } = await supabase
      .from('photography_terms')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('Error counting rows:', countError);
    } else {
      console.log(`📊 Total rows in table: ${count}`);
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
      console.log('\n⚠️  Duplicate terms found:');
      duplicates.forEach(([element, count]) => {
        console.log(`  - ${element}: ${count} times`);
      });
    } else {
      console.log('✅ No duplicate terms found');
    }

    // Get unique categories
    const { data: categories } = await supabase
      .from('photography_terms')
      .select('category');

    const uniqueCategories = [...new Set(categories.map(c => c.category))].sort();
    console.log('\n📂 Unique categories (' + uniqueCategories.length + '):');
    uniqueCategories.forEach(cat => console.log(`  - ${cat}`));

    // Check expected categories
    const expectedCategories = [
      'Camera Equipment',
      'Lenses & Optics',
      'Lighting & Environment',
      'Technical Settings',
      'Composition & Perspective',
      'Styles & Genres'
    ];

    const missingCategories = expectedCategories.filter(cat => !uniqueCategories.includes(cat));
    const extraCategories = uniqueCategories.filter(cat => !expectedCategories.includes(cat));

    if (missingCategories.length > 0) {
      console.log('\n⚠️  Missing expected categories:');
      missingCategories.forEach(cat => console.log(`  - ${cat}`));
    }

    if (extraCategories.length > 0) {
      console.log('\n⚠️  Unexpected categories found:');
      extraCategories.forEach(cat => console.log(`  - ${cat}`));
    }

    // Spot check
    const { data: spotCheck } = await supabase
      .from('photography_terms')
      .select('element, category, intent_tags')
      .order('element', { ascending: true })
      .limit(5);

    console.log('\n🔍 Spot check (first 5 rows):');
    spotCheck.forEach((term, i) => {
      const tags = term.intent_tags ? `[${term.intent_tags}]` : '[no tags]';
      console.log(`  ${i + 1}. ${term.element} (${term.category}) ${tags}`);
    });

    // Check terms with intent_tags
    const { data: termsWithTags } = await supabase
      .from('photography_terms')
      .select('intent_tags')
      .not('intent_tags', 'is', null);

    console.log(`\n📋 Terms with intent_tags: ${termsWithTags.length} / ${count}`);

    console.log('\n✅ Database update completed successfully!');
    console.log('\n📝 Summary:');
    console.log(`  - Rows inserted: ${totalInserted}`);
    console.log(`  - Total rows in database: ${count}`);
    console.log(`  - Categories: ${uniqueCategories.length}`);
    console.log(`  - Terms with tags: ${termsWithTags.length}`);
    console.log(`  - Duplicates: ${duplicates.length}`);

  } catch (error) {
    console.error('\n❌ Error during database update:', error);
    process.exit(1);
  }
}

completeUpdate();
