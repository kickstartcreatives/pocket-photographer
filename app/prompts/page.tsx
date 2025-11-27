'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { PromptLibraryItem } from '@/lib/types';

export default function PromptsPage() {
  const [prompts, setPrompts] = useState<PromptLibraryItem[]>([]);
  const [filteredPrompts, setFilteredPrompts] = useState<PromptLibraryItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [showCopied, setShowCopied] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [expandedPrompts, setExpandedPrompts] = useState<Set<string>>(new Set());

  // Fetch all prompts
  useEffect(() => {
    async function fetchPrompts() {
      setLoading(true);

      const { data, error } = await supabase
        .from('prompt_library')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching prompts:', error);
      } else if (data) {
        setPrompts(data);
        setFilteredPrompts(data);

        // Extract unique categories
        const uniqueCategories = Array.from(
          new Set(data.map(p => p.category).filter(Boolean))
        ).sort();
        setCategories(uniqueCategories as string[]);
      }

      setLoading(false);
    }

    fetchPrompts();
  }, []);

  // Apply category filter
  useEffect(() => {
    if (selectedCategory) {
      setFilteredPrompts(prompts.filter(p => p.category === selectedCategory));
    } else {
      setFilteredPrompts(prompts);
    }
  }, [selectedCategory, prompts]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 1000);
  };

  const togglePromptExpansion = (promptId: string) => {
    setExpandedPrompts(prev => {
      const next = new Set(prev);
      if (next.has(promptId)) {
        next.delete(promptId);
      } else {
        next.add(promptId);
      }
      return next;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-text-secondary">Loading prompts...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Copied Toast */}
      {showCopied && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-navy text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Copied to clipboard!
        </div>
      )}

      {/* Image Lightbox */}
      {lightboxImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <img
            src={lightboxImage}
            alt="Example"
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Header */}
      <header className="header-gradient text-white py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold">Prompt Library</h1>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Instructions */}
        <div className="bg-orange/10 border-2 border-orange rounded-lg p-4 mb-6">
          <p className="text-text-primary text-sm">
            <strong>How to use:</strong> Click the copy button on any prompt to use it as a starting point for your own AI image creations.
            See which photography terms create stunning results!
          </p>
        </div>

        {/* Category Filter */}
        {categories.length > 0 && (
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('')}
                className={`px-3 py-1 rounded-full text-sm transition ${
                  !selectedCategory
                    ? 'bg-orange text-white'
                    : 'bg-gray-200 text-text-primary hover:bg-gray-300'
                }`}
              >
                All Styles
              </button>
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1 rounded-full text-sm transition ${
                    selectedCategory === category
                      ? 'bg-orange text-white'
                      : 'bg-gray-200 text-text-primary hover:bg-gray-300'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Prompts Display */}
        {filteredPrompts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-text-secondary mb-4">No prompts yet!</p>
            <p className="text-sm text-text-secondary">
              Add example prompts to the prompt_library table in Supabase.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {filteredPrompts.map(prompt => (
              <div key={prompt.id} className="card">
                <div className="flex gap-3">
                  {/* Left side - Image Thumbnail */}
                  {prompt.image_url && (
                    <div className="flex-shrink-0">
                      <button
                        onClick={() => setLightboxImage(prompt.image_url!)}
                        className="relative group w-32 h-32 rounded-lg overflow-hidden border-2 border-gray-200 hover:border-orange transition block"
                      >
                        <img
                          src={prompt.image_url}
                          alt={prompt.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
                          </svg>
                        </div>
                      </button>
                      {/* Combined action text */}
                      {prompt.complete_prompt ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setLightboxImage(prompt.image_url!);
                            togglePromptExpansion(prompt.id);
                          }}
                          className="text-xs text-text-secondary italic text-center mt-2 w-full hover:text-orange hover:scale-105 transition"
                        >
                          View image and prompt ⤢
                        </button>
                      ) : (
                        <p className="text-xs text-text-secondary italic text-center mt-1">Click to expand</p>
                      )}
                    </div>
                  )}

                  {/* Right side - Text content */}
                  <div className="flex-1 min-w-0">
                    {/* Title */}
                    <h3 className="text-xl font-bold text-text-primary mb-2">{prompt.title}</h3>

                    {/* Description */}
                    {prompt.description && (
                      <p className="text-sm text-text-secondary mb-3">{prompt.description}</p>
                    )}

                    {/* Dictionary Terms Used */}
                    {prompt.terms_used.length > 0 && (
                      <div className="mb-3">
                        <strong className="text-sm text-text-primary">Dictionary Terms Used:</strong>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {prompt.terms_used.map((term, idx) => (
                            <a
                              key={idx}
                              href={`/dictionary?search=${encodeURIComponent(term)}`}
                              className="text-xs px-2 py-1 bg-gray-100 hover:bg-orange hover:text-white rounded-full text-text-primary transition"
                            >
                              {term}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Expanded Complete Prompt */}
                {prompt.complete_prompt && expandedPrompts.has(prompt.id) && (
                  <div className="mt-3 bg-teal/5 border border-teal rounded-lg p-3 relative">
                    <button
                      onClick={() => togglePromptExpansion(prompt.id)}
                      className="absolute top-2 right-2 text-text-secondary hover:text-navy transition"
                      title="Close"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    <div className="flex items-start gap-2 mb-2 pr-6">
                      <strong className="text-sm text-text-primary">Complete AI Prompt:</strong>
                      <button
                        onClick={() => copyToClipboard(prompt.complete_prompt!)}
                        className="text-orange hover:text-navy transition ml-auto"
                        title="Copy complete prompt"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                    <p className="text-sm font-mono text-text-primary bg-white p-2 rounded border border-teal/20">
                      {prompt.complete_prompt}
                    </p>
                  </div>
                )}

                {/* Photography Prompt Terms Section */}
                <div className="mb-3">
                  <strong className="text-sm text-text-primary">Photography Prompt Terms:</strong>
                  <div className="relative mt-1">
                    <div className="bg-gray-100 p-3 rounded text-sm font-mono pr-10">
                      {prompt.full_prompt}
                    </div>
                    <button
                      onClick={() => copyToClipboard(prompt.full_prompt)}
                      className="absolute top-2 right-2 text-orange hover:text-navy transition"
                      title="Copy prompt"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* What to Expect */}
                {prompt.what_to_expect && (
                  <div className="text-sm">
                    <strong className="text-text-primary">What to Expect:</strong>
                    <p className="text-text-secondary mt-1">{prompt.what_to_expect}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
