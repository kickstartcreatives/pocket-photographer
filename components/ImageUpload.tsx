'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface ImageUploadProps {
  onUpload: (url: string) => void;
  currentUrl?: string;
}

export default function ImageUpload({ onUpload, currentUrl }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentUrl || null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      if (!e.target.files || e.target.files.length === 0) {
        return;
      }

      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `prompts/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      const publicUrl = data.publicUrl;
      setPreview(publicUrl);
      onUpload(publicUrl);
    } catch (error) {
      alert('Error uploading image: ' + (error as Error).message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Image Upload
      </label>

      {preview && (
        <div className="mb-2">
          <img
            src={preview}
            alt="Preview"
            className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
          />
        </div>
      )}

      <div className="flex items-center gap-3">
        <label className="cursor-pointer">
          <span className={`px-4 py-2 rounded-lg transition inline-block ${
            uploading
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-orange text-white hover:bg-orange/80'
          }`}>
            {uploading ? 'Uploading...' : 'Choose Image'}
          </span>
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>

        {preview && (
          <button
            type="button"
            onClick={() => {
              setPreview(null);
              onUpload('');
            }}
            className="text-sm text-red-600 hover:text-red-800"
          >
            Remove
          </button>
        )}
      </div>

      <p className="text-xs text-gray-500">
        Or paste an image URL in the field above
      </p>
    </div>
  );
}
