# Pocket Photographer - Setup Instructions

## Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign in with GitHub (or create an account)
4. Click "New Project"
5. Choose your organization
6. Fill in project details:
   - **Name**: pocket-photographer
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to you (e.g., US West)
7. Click "Create new project" (this takes ~2 minutes)

## Step 2: Get Supabase Credentials

Once your project is created:

1. Go to **Project Settings** (gear icon in sidebar)
2. Click **API** in the left menu
3. Copy these values:
   - **Project URL** → This is your `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → This is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → This is your `SUPABASE_SERVICE_KEY` (keep this secret!)

## Step 3: Update .env.local

Open `.env.local` and replace the placeholder values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...your-anon-key...
SUPABASE_SERVICE_KEY=eyJhbGc...your-service-key...
# Using Web3Forms instead of Resend
WEB3FORMS_ACCESS_KEY=your-web3forms-access-key
CONTACT_EMAIL=prompts@kickstartcreatives.com
```

## Step 4: Set Up Database Tables

1. In Supabase, go to **SQL Editor** (in left sidebar)
2. Click **New query**
3. Copy the contents of `scripts/setup-database.sql`
4. Paste into the SQL editor
5. Click **Run** (or press Cmd+Enter)
6. You should see "Success. No rows returned"

This creates:
- `photography_terms` table with all fields
- `prompt_library` table
- Indexes for fast searching
- Row Level Security policies for public read access
- Full-text search capabilities

## Step 5: Import Photography Terms

Run the import script to load the 114+ photography terms:

```bash
npx tsx scripts/import-csv.ts
```

You should see output like:
```
Parsed 114 rows from CSV
Found 114 valid terms to import
Cleared existing data
Inserted batch 1: 50 terms
Inserted batch 2: 50 terms
Inserted batch 3: 14 terms
Import complete!
Total terms in database: 114
```

## Step 6: Verify Data

1. In Supabase, go to **Table Editor**
2. Click on `photography_terms` table
3. You should see all 114+ terms with categories like:
   - Technical Settings
   - Lighting Setup
   - Camera Equipment
   - Film & Processing
   - Compositional Elements
   - Portrait Styles
   - Lens Characteristics
   - Image Quality

## Step 7: Test Locally

The dev server should already be running at http://localhost:3000

If not, start it:
```bash
npm run dev
```

Visit http://localhost:3000 to see the homepage!

## Next Steps

- Build the Dictionary page (`/dictionary`)
- Build the Prompt Library page (`/prompts`)
- Add the email submission form
- Deploy to Vercel
- Set up custom domain: pocketphotographer.kickstartcreatives.com

## Troubleshooting

### Import fails with "relation does not exist"
- Make sure you ran the SQL setup script first
- Check that you're using the correct Supabase project

### Import fails with RLS policy error
- Make sure you're using the `SUPABASE_SERVICE_KEY` (service_role), not the anon key
- The service role key bypasses RLS policies

### No data showing in app
- Check browser console for errors
- Verify the anon key has read access (RLS policies are set correctly)
- Check that data exists in Supabase Table Editor
