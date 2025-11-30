# Database Update Scripts

## Main Script to Run

**`complete-update.js`** - This is the only script you need to run!

```bash
node scripts/complete-update.js
```

### What it does:
1. Checks if `intent_tags` column exists
2. If column is missing, shows you instructions to add it manually
3. If column exists, proceeds with full update:
   - Deletes all existing rows
   - Imports 245+ new terms from CSV
   - Runs validation checks
   - Shows summary report

---

## Other Scripts (for reference)

- **`add-column.sql`** - SQL to add intent_tags column (copy into Supabase SQL Editor)
- **`restore-backup.js`** - Restores the backup if needed
- **`update-database.js`** - Original script (deprecated, use complete-update.js instead)
- **`update-database-v2.js`** - Intermediate version (deprecated)
- **`final-update.js`** - Same as complete-update.js but without column check

---

## Backup

Your original 115 rows are backed up in:
**`photography_terms_backup.json`**

Currently, the old data has been restored to the database while we wait for the column to be added.

---

## CSV File Location

`/Users/barbaramiller/Downloads/pocketphotographer_dictionary_FINAL_FULL.csv`

- 245+ rows
- Columns: Element, Category, What It Does, Best Used For, Example Prompt Usage, IntentTags
