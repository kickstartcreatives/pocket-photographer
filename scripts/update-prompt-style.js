// Update prompt_style column for Styles & Genres terms
// Run with: node scripts/update-prompt-style.js

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function updatePromptStyles() {
  console.log('🚀 Starting prompt_style update...\n');

  try {
    // Step 1: Add column if it doesn't exist (this might need to be done manually in Supabase SQL Editor)
    console.log('⚠️  Make sure you have run this SQL first in Supabase:');
    console.log('    ALTER TABLE photography_terms ADD COLUMN IF NOT EXISTS prompt_style text;\n');

    // Step 2: Read the SQL file
    const sqlFile = fs.readFileSync(__dirname + '/add-prompt-style.sql', 'utf8');

    console.log('📝 SQL script loaded');
    console.log('⚠️  Please run this SQL in your Supabase SQL Editor:\n');
    console.log('-----------------------------------------------------------');
    console.log(sqlFile);
    console.log('-----------------------------------------------------------\n');

    // Step 3: Verify what's in the database
    const { data, error } = await supabase
      .from('photography_terms')
      .select('element, category, prompt_style')
      .eq('category', 'Styles & Genres')
      .order('element');

    if (error) {
      console.error('❌ Error fetching terms:', error);
      return;
    }

    console.log(`✅ Found ${data.length} terms in 'Styles & Genres' category\n`);

    // Count terms by prompt_style
    const styleCounts = {};
    data.forEach(term => {
      const style = term.prompt_style || 'NULL';
      styleCounts[style] = (styleCounts[style] || 0) + 1;
    });

    console.log('📊 Terms by prompt_style:');
    Object.entries(styleCounts).sort((a, b) => a[0].localeCompare(b[0])).forEach(([style, count]) => {
      console.log(`   ${style}: ${count}`);
    });

  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
}

updatePromptStyles();
