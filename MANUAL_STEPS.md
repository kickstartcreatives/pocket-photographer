# Final Steps Required

## Complete the Database Update

### Step 1: Add intent_tags Column

1. Go to your Supabase SQL Editor:
   https://supabase.com/dashboard/project/vbaqdgfxamwgrnvnykxr/sql/new

2. Paste this SQL:
   ```sql
   ALTER TABLE photography_terms ADD COLUMN IF NOT EXISTS intent_tags text;
   ```

4. Click "Run" or press Cmd+Enter

### Step 2: Run the Complete Update Script

Once the column is added, run:

```bash
cd /Users/barbaramiller/pocket-photographer
node scripts/complete-update.js
```

The script will:
1. ✅ Verify intent_tags column exists
2. 🗑️ Delete all existing rows (115 old rows)
3. 📖 Read and parse the CSV (245+ new rows)
4. ⬆️ Insert all new data with intent_tags
5. ✅ Run comprehensive validation:
   - Count total rows
   - Check for duplicates
   - Validate categories match expected list
   - Show spot check of first 5 terms
   - Count how many terms have intent_tags

---

## Summary of Changes

### Frontend Updates (Already Complete ✅)
- Updated homepage hero section
- Added intro section
- Updated feature cards
- Added "How Pocket Photographer Works" section

### Database Updates (In Progress ⏳)
- Backup created: `photography_terms_backup.json` (115 rows)
- Old data restored temporarily
- Waiting for you to add intent_tags column
- Ready to import 245+ new terms with all updated content

### What's in the New CSV
- 245+ photography terms (vs 115 old terms)
- All new categories properly assigned
- IntentTags column for filtering
- Updated descriptions with video notes embedded
- New terms for composition, lenses, color grading, etc.
