import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as Papa from 'papaparse';
import * as path from 'path';

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials. Please check your .env.local file.');
  process.exit(1);
}

// Use service role key for admin operations
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function importCSV() {
  try {
    // Read the CSV file
    const csvPath = path.join(__dirname, '../../Downloads/pocketphotographer_FINAL_5_columns.csv');
    const csvContent = fs.readFileSync(csvPath, 'utf-8');

    // Parse CSV - handle quoted fields with commas
    const { data, errors } = Papa.parse(csvContent, {
      header: true,
      skipEmptyLines: true,
      quoteChar: '"',
      escapeChar: '"',
    });

    if (errors.length > 0) {
      console.warn(`CSV parsing warnings: ${errors.length} rows had field count mismatches (will attempt to import anyway)`);
    }

    console.log(`Parsed ${data.length} rows from CSV`);

    // Transform data to match database schema
    const termsData = (data as any[]).map(row => ({
      element: row['Element'] || row['element'] || '',
      category: row['Category'] || row['category'] || '',
      what_it_does: row['What It Does'] || row['what_it_does'] || '',
      best_used_for: row['Best Used For'] || row['best_used_for'] || '',
      example_prompt_usage: row['Example Prompt Usage'] || row['example_prompt_usage'] || '',
    }));

    // Filter out any empty rows
    const validTerms = termsData.filter(term => term.element && term.category);
    console.log(`Found ${validTerms.length} valid terms to import`);

    // Clear existing data (optional)
    const { error: deleteError } = await supabase
      .from('photography_terms')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all rows

    if (deleteError) {
      console.error('Error clearing existing data:', deleteError);
    } else {
      console.log('Cleared existing data');
    }

    // Insert data in batches
    const batchSize = 50;
    for (let i = 0; i < validTerms.length; i += batchSize) {
      const batch = validTerms.slice(i, i + batchSize);

      const { data: insertedData, error: insertError } = await supabase
        .from('photography_terms')
        .insert(batch)
        .select();

      if (insertError) {
        console.error(`Error inserting batch ${i / batchSize + 1}:`, insertError);
      } else {
        console.log(`Inserted batch ${i / batchSize + 1}: ${insertedData?.length} terms`);
      }
    }

    console.log('Import complete!');

    // Verify import
    const { count } = await supabase
      .from('photography_terms')
      .select('*', { count: 'exact', head: true });

    console.log(`Total terms in database: ${count}`);

  } catch (error) {
    console.error('Error importing CSV:', error);
  }
}

importCSV();
