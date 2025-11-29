'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { PromptLibraryItem, ViewMode } from '@/lib/types';
import ContactModal from '@/components/ContactModal';
import { usePromptBuilder } from '@/lib/usePromptBuilder';

export default function PromptsPage() {
  const [prompts, setPrompts] = useState<PromptLibraryItem[]>([]);
  const [filteredPrompts, setFilteredPrompts] = useState<PromptLibraryItem[]>([]);
  const [styles, setStyles] = useState<string[]>([]);
  const [selectedStyle, setSelectedStyle] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [showCopied, setShowCopied] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('promptsViewMode') as ViewMode) || 'card';
    }
    return 'card';
  });
  const [showContactModal, setShowContactModal] = useState(false);
  const [sortBy, setSortBy] = useState<'a-z' | 'z-a' | 'category' | ''>('' as 'a-z' | 'z-a' | 'category');

  // Use shared prompt builder hook
  const { selectedTerms, toggleTerm, clearTerms, getPromptString } = usePromptBuilder();

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

        // Extract unique styles
        const uniqueStyles = Array.from(
          new Set(data.map(p => p.style).filter(Boolean))
        ).sort();
        setStyles(uniqueStyles as string[]);
      }

      setLoading(false);
    }

    fetchPrompts();
  }, []);

  // Apply style filter and sorting
  useEffect(() => {
    let filtered = selectedStyle
      ? prompts.filter(p => p.style === selectedStyle)
      : prompts;

    // Apply sorting (if no sort selected, keep original order)
    let sorted = [...filtered];
    if (sortBy !== '') {
      sorted.sort((a, b) => {
        if (sortBy === 'a-z') {
          return a.title.localeCompare(b.title);
        } else if (sortBy === 'z-a') {
          return b.title.localeCompare(a.title);
        } else if (sortBy === 'category') {
          return (a.category || '').localeCompare(b.category || '');
        }
        return 0;
      });
    }

    setFilteredPrompts(sorted);
  }, [selectedStyle, prompts, sortBy]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 1000);
  };

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    localStorage.setItem('promptsViewMode', mode);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-text-secondary">Loading prompts...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" onContextMenu={(e) => e.preventDefault()}>
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
            onContextMenu={(e) => e.preventDefault()}
            draggable={false}
          />
        </div>
      )}

      {/* Header */}
      <header className="header-gradient text-white py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold">PROMPT LIBRARY</h1>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Instructions */}
        <div className="bg-orange/10 border-2 border-orange rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <p className="text-text-primary text-sm">
              <strong>How to use:</strong> Click any image to view it full size. Click any dictionary term from any image below OR visit the Dictionary page to add terms to your Prompt Builder. Mix and match any terms from the dictionary to create your own custom AI image prompts!
            </p>
            <button
              onClick={() => setShowContactModal(true)}
              className="text-sm text-teal hover:text-orange transition font-medium underline whitespace-nowrap ml-4"
            >
              📬 Request a prompt
            </button>
          </div>
        </div>

        {/* Prompt Builder Panel - Shows when terms are selected */}
        {selectedTerms.length > 0 && (
          <div className="bg-orange/10 border-2 border-orange rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-lg text-navy">
                Prompt Builder ({selectedTerms.length} term{selectedTerms.length !== 1 ? 's' : ''})
              </h3>
              <button
                onClick={clearTerms}
                className="text-sm text-text-secondary hover:text-navy"
              >
                Clear All
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              {selectedTerms.map(term => (
                <span
                  key={term}
                  className="bg-white px-3 py-1 rounded-full text-sm flex items-center gap-2 border border-orange"
                >
                  {term}
                  <button
                    onClick={() => toggleTerm(term)}
                    className="text-orange hover:text-navy font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-3">
              <div className="flex-1 bg-white p-3 rounded font-mono text-sm border border-orange">
                {getPromptString()}
              </div>
              <button
                onClick={() => copyToClipboard(getPromptString())}
                className="btn-orange flex items-center gap-2 hover:!bg-navy"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy All
              </button>
            </div>
          </div>
        )}

        {/* Style Filter */}
        {styles.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedStyle('')}
              className={`px-3 py-1 rounded-full text-sm transition ${
                !selectedStyle
                  ? 'bg-orange text-white'
                  : 'bg-gray-200 text-text-primary hover:bg-gray-300'
              }`}
            >
              All Styles
            </button>
            {styles.map(style => (
              <button
                key={style}
                onClick={() => setSelectedStyle(style)}
                className={`px-3 py-1 rounded-full text-sm transition ${
                  selectedStyle === style
                    ? 'bg-orange text-white'
                    : 'bg-gray-200 text-text-primary hover:bg-gray-300'
                }`}
              >
                {style}
              </button>
            ))}
          </div>
        )}

        {/* Sort and View Mode */}
        <div className="mb-6 flex items-center justify-end gap-4">
          <div className="flex items-center gap-3">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'a-z' | 'z-a' | 'category')}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange text-gray-400"
                style={sortBy !== '' ? { color: 'inherit' } : undefined}
              >
                <option value="" disabled>Sort</option>
                <option value="a-z">A-Z</option>
                <option value="z-a">Z-A</option>
                <option value="category">By Style</option>
              </select>
            </div>

            {/* View Mode */}
            <div className="flex gap-2">
              <button
                onClick={() => handleViewModeChange('card')}
                className={`p-2 rounded-lg transition ${viewMode === 'card' ? 'bg-orange text-white' : 'bg-gray-200 text-text-primary hover:bg-gray-300'}`}
                title="Card view"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                </svg>
              </button>
              <button
                onClick={() => handleViewModeChange('table')}
                className={`p-2 rounded-lg transition ${viewMode === 'table' ? 'bg-orange text-white' : 'bg-gray-200 text-text-primary hover:bg-gray-300'}`}
                title="List view"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Prompts Display */}
        {filteredPrompts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-text-secondary mb-4">No prompts yet!</p>
            <p className="text-sm text-text-secondary">
              Add example prompts to the prompt_library table in Supabase.
            </p>
          </div>
        ) : viewMode === 'card' ? (
          <div className="grid md:grid-cols-2 gap-6 items-start">
            {filteredPrompts.map(prompt => (
              <div key={prompt.id} className="card h-full">
                <div className="flex gap-3">
                  {/* Left side - Image Thumbnail */}
                  {prompt.image_url && (
                    <div className="flex-shrink-0">
                      <div
                        onClick={() => setLightboxImage(prompt.image_url!)}
                        className="relative group w-32 h-32 rounded-lg overflow-hidden border-2 border-gray-200 hover:border-orange transition cursor-pointer"
                        onContextMenu={(e) => e.preventDefault()}
                      >
                        <img
                          src={prompt.image_url}
                          alt={prompt.title}
                          className="w-full h-full object-cover"
                          onContextMenu={(e) => e.preventDefault()}
                          draggable={false}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
                          </svg>
                        </div>
                      </div>
                      {/* AI Platform */}
                      <p className="text-xs text-text-secondary italic text-center mt-2 w-full">
                        {prompt.ai_platform}
                      </p>
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
                            <button
                              key={idx}
                              onClick={() => toggleTerm(term)}
                              className={`text-xs px-2 py-1 rounded-full transition ${
                                selectedTerms.includes(term)
                                  ? 'bg-orange text-white'
                                  : 'bg-gray-100 text-text-primary hover:bg-orange/20'
                              }`}
                              title={selectedTerms.includes(term) ? 'Remove from prompt builder' : 'Add to prompt builder'}
                            >
                              {term}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* AI Prompt Used - Always shown */}
                {prompt.complete_prompt && (
                  <div className="mt-3 bg-teal/5 border border-teal rounded-lg p-3 relative">
                    <div className="flex items-start gap-2 mb-2 pr-6">
                      <strong className="text-sm text-text-primary">AI Prompt Used:</strong>
                      <button
                        onClick={() => copyToClipboard(prompt.complete_prompt!)}
                        className="text-orange hover:text-navy transition ml-auto"
                        title="Copy AI prompt"
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
        ) : (
          <div className="space-y-4">
            {filteredPrompts.map(prompt => (
              <div key={prompt.id} className="card">
                <div className="flex gap-4">
                  {/* Left side - Image Thumbnail */}
                  {prompt.image_url && (
                    <div className="flex-shrink-0">
                      <button
                        onClick={() => setLightboxImage(prompt.image_url!)}
                        className="relative group w-24 h-24 rounded-lg overflow-hidden border-2 border-gray-200 hover:border-orange transition block"
                        onContextMenu={(e) => e.preventDefault()}
                      >
                        <img
                          src={prompt.image_url}
                          alt={prompt.title}
                          className="w-full h-full object-cover"
                          onContextMenu={(e) => e.preventDefault()}
                          draggable={false}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
                          </svg>
                        </div>
                      </button>
                      {/* AI Platform */}
                      <p className="text-xs text-text-secondary italic text-center mt-2 w-full">
                        {prompt.ai_platform}
                      </p>
                    </div>
                  )}

                  {/* Right side - Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-text-primary mb-1">{prompt.title}</h3>
                    {prompt.description && (
                      <p className="text-sm text-text-secondary mb-2">{prompt.description}</p>
                    )}

                    {/* Dictionary Terms Used */}
                    {prompt.terms_used.length > 0 && (
                      <div className="mb-2">
                        <strong className="text-xs text-text-primary">Dictionary Terms Used:</strong>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {prompt.terms_used.map((term, idx) => (
                            <button
                              key={idx}
                              onClick={() => toggleTerm(term)}
                              className={`text-xs px-2 py-0.5 rounded-full transition ${
                                selectedTerms.includes(term)
                                  ? 'bg-orange text-white'
                                  : 'bg-gray-100 text-text-primary hover:bg-orange/20'
                              }`}
                              title={selectedTerms.includes(term) ? 'Remove from prompt builder' : 'Add to prompt builder'}
                            >
                              {term}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* AI Prompt Used - Always shown */}
                {prompt.complete_prompt && (
                  <div className="mt-3 bg-teal/5 border border-teal rounded-lg p-3 relative">
                    <div className="flex items-start gap-2 mb-2 pr-6">
                      <strong className="text-sm text-text-primary">AI Prompt Used:</strong>
                      <button
                        onClick={() => copyToClipboard(prompt.complete_prompt!)}
                        className="text-orange hover:text-navy transition ml-auto"
                        title="Copy AI prompt"
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
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Contact Modal */}
      <ContactModal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
        formType="prompt"
      />
    </div>
  );
}
