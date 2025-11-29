# Database Migration Instructions

## Drop `full_prompt` Column from `prompt_library` Table

### Date: 2025-11-28

### What Changed
The `full_prompt` column has been removed from the `prompt_library` table because it's no longer needed. The application now uses only the `complete_prompt` field which contains the full AI prompt.

### How to Run the Migration

1. **Open Supabase SQL Editor**
   - Go to: https://supabase.com/dashboard/project/vbaqdgfxamwgrnvnykxr/sql/new

2. **Copy and paste the SQL migration script**
   ```sql
   -- Remove full_prompt column from prompt_library table
   ALTER TABLE prompt_library DROP COLUMN IF EXISTS full_prompt;
   ```

3. **Run the script**
   - Click "Run" or press Cmd/Ctrl + Enter

4. **Verify the change**
   - Run this query to confirm the column is gone:
   ```sql
   SELECT column_name, data_type, is_nullable
   FROM information_schema.columns
   WHERE table_name = 'prompt_library'
   ORDER BY ordinal_position;
   ```

### What This Affects
- **Frontend**: Already updated - no references to `full_prompt` remain
- **TypeScript Types**: Already updated - `full_prompt` removed from `PromptLibraryItem` interface
- **Database**: Will remove the unused `full_prompt` column from storage

### Rollback
If you need to rollback this change, you can add the column back with:
```sql
ALTER TABLE prompt_library ADD COLUMN full_prompt TEXT;
```

However, note that the frontend no longer uses this field, so rollback is not recommended.
