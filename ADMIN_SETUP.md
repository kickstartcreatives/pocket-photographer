# Admin Panel Setup Guide

## Access the Admin Panel

URL: `http://localhost:3000/admin` (local) or `https://your-domain.com/admin` (production)

**Password:** `pocketphoto2024`

(You can change this in `.env.local` - `ADMIN_PASSWORD` variable)

---

## Features

### Photography Terms Management
- ✅ View all photography terms in a table
- ✅ Add new terms with form
- ✅ Edit existing terms
- ✅ Delete terms (with confirmation)
- Fields: Term, Category, Description, Intent Tags, Video Notes

### Prompt Library Management
- ✅ View all prompts with images
- ✅ Add new prompts
- ✅ Edit existing prompts
- ✅ Delete prompts (with confirmation)
- ✅ Image upload (via Supabase Storage or URL)
- Fields: Title, Style, AI Platform, Description, Complete Prompt, Image, Terms Used, What to Expect

---

## Setup Supabase Storage (For Image Uploads)

### Step 1: Create Storage Bucket

1. Go to Supabase Dashboard: https://supabase.com/dashboard/project/vbaqdgfxamwgrnvnykxr/storage/buckets
2. Click "New bucket"
3. Name: `images`
4. Make it **Public** (check the box)
5. Click "Create bucket"

### Step 2: Set Storage Policies

1. Click on the `images` bucket
2. Go to "Policies" tab
3. Click "New policy" under "INSERT policies"
   - Name: `Allow public uploads`
   - Check `INSERT`
   - Use this policy:
   ```sql
   true
   ```
   - Click "Save"

4. Click "New policy" under "SELECT policies"
   - Name: `Allow public reads`
   - Check `SELECT`
   - Use this policy:
   ```sql
   true
   ```
   - Click "Save"

### Step 3: Create Folder Structure (Optional)

The upload component automatically creates folders:
- `images/prompts/` - For prompt library images

---

## Usage Tips

### Adding a New Photography Term
1. Go to Admin Panel → Photography Terms tab
2. Click "+ Add New Term"
3. Fill in the form (Term and Description are required)
4. Click "Create"

### Adding a New Prompt with Image
1. Go to Admin Panel → Prompt Library tab
2. Click "+ Add New Prompt"
3. Fill in the form
4. For the image:
   - **Option 1:** Click "Choose Image" to upload from your computer (requires Supabase Storage setup)
   - **Option 2:** Paste an image URL in the "Or paste Image URL" field
5. Add terms used (comma-separated, e.g., "Golden Hour, Bokeh, Portrait")
6. Click "Create"

### Editing Items
- Click "Edit" on any term or prompt
- Make your changes
- Click "Update"

### Deleting Items
- Click "Delete" on any term or prompt
- Confirm the deletion

---

## Security Notes

- ⚠️ The password is stored in plain text in `.env.local`
- ⚠️ Authentication is stored in sessionStorage (cleared when browser closes)
- ⚠️ For production, consider:
  - Using Supabase Auth for proper authentication
  - Adding role-based access control
  - Using environment variables for the password check (via API route)

---

## Troubleshooting

### Images won't upload
- Make sure you've created the `images` bucket in Supabase Storage
- Check that the bucket is set to **Public**
- Verify the storage policies are set correctly
- You can always paste image URLs instead of uploading

### Can't log in
- Check that `ADMIN_PASSWORD` is set in `.env.local`
- Make sure the password matches `pocketphoto2024` (or whatever you set it to)
- Try clearing your browser's sessionStorage and refreshing

### Changes not saving
- Check the browser console for errors
- Verify your Supabase connection is working
- Make sure the table schemas match the expected format
