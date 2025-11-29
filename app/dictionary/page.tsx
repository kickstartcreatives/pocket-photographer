'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { PhotographyTerm, Filters, ViewMode, SortOption } from '@/lib/types';
import { usePromptBuilder } from '@/lib/usePromptBuilder';

function DictionaryContent() {
  const searchParams = useSearchParams();
  const [terms, setTerms] = useState<PhotographyTerm[]>([]);
  const [filteredTerms, setFilteredTerms] = useState<PhotographyTerm[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [filters, setFilters] = useState<Filters>({ search: '', categories: [] });
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('dictionaryViewMode') as ViewMode) || 'table';
    }
    return 'table';
  });
  const [sortOption, setSortOption] = useState<SortOption>('' as SortOption);
  const [loading, setLoading] = useState(true);
  const [showCopied, setShowCopied] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Use shared prompt builder hook
  const { selectedTerms, toggleTerm, clearTerms, getPromptString } = usePromptBuilder();

  // Fetch all terms and categories
  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      const { data, error } = await supabase
        .from('photography_terms')
        .select('*')
        .order('element', { ascending: true });

      if (error) {
        console.error('Error fetching terms:', error);
      } else if (data) {
        setTerms(data);
        setFilteredTerms(data);

        // Extract unique categories
        const uniqueCategories = Array.from(new Set(data.map(t => t.category))).sort();
        setCategories(uniqueCategories);
      }

      setLoading(false);
    }

    fetchData();
  }, []);

  // Set search from URL parameter
  useEffect(() => {
    const searchQuery = searchParams.get('search');
    if (searchQuery) {
      setFilters(prev => ({ ...prev, search: searchQuery }));
    }
  }, [searchParams]);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...terms];

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(term =>
        term.element.toLowerCase().includes(searchLower) ||
        term.what_it_does.toLowerCase().includes(searchLower) ||
        term.best_used_for.toLowerCase().includes(searchLower) ||
        term.category.toLowerCase().includes(searchLower)
      );
    }

    // Apply category filter
    if (filters.categories.length > 0) {
      result = result.filter(term => filters.categories.includes(term.category));
    }

    // Apply sorting
    if (sortOption === 'random' || sortOption === '') {
      // Fisher-Yates shuffle for random order (default when no sort selected)
      for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
      }
    } else {
      result.sort((a, b) => {
        switch (sortOption) {
          case 'term-asc':
            return a.element.localeCompare(b.element);
          case 'term-desc':
            return b.element.localeCompare(a.element);
          case 'category':
            return a.category.localeCompare(b.category) || a.element.localeCompare(b.element);
          default:
            return 0;
        }
      });
    }

    setFilteredTerms(result);
    // Reset to page 1 when filters or sorting changes
    setCurrentPage(1);
  }, [filters, sortOption, terms]);

  const toggleCategory = (category: string) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const clearFilters = () => {
    setFilters({ search: '', categories: [] });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 1000);
  };

  const copyAllSelected = () => {
    copyToClipboard(getPromptString());
  };

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    localStorage.setItem('dictionaryViewMode', mode);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-text-secondary">Loading dictionary...</div>
      </div>
    );
  }

  // Pagination calculations
  const totalItems = filteredTerms.length;
  const totalPages = itemsPerPage === -1 ? 1 : Math.ceil(totalItems / itemsPerPage);
  const startIndex = itemsPerPage === -1 ? 0 : (currentPage - 1) * itemsPerPage;
  const endIndex = itemsPerPage === -1 ? totalItems : startIndex + itemsPerPage;
  const paginatedTerms = filteredTerms.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen" onContextMenu={(e) => e.preventDefault()}>
      {/* Copied Toast Notification */}
      {showCopied && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-navy text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Copied to clipboard!
        </div>
      )}

      {/* Header */}
      <header className="header-gradient text-white py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold">PHOTOGRAPHY DICTIONARY</h1>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Instructions */}
        <div className="bg-orange/10 border-2 border-orange rounded-lg p-4 mb-6">
          <p className="text-text-primary text-sm">
            <strong>How to use:</strong> Click any term box to add it to your Prompt Builder, or click the copy icon to copy a single term.
            Build your perfect AI image prompt by selecting multiple terms, then copy them all at once!
          </p>
        </div>

        {/* Prompt Builder Panel - Top */}
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
                onClick={copyAllSelected}
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

        {/* Search and Controls */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          {/* Search */}
          <input
            type="text"
            placeholder="Search terms..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            className="flex-1 px-4 py-2 border border-border-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-teal"
          />

          {/* Sort */}
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as SortOption)}
            className="px-4 py-2 border border-border-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-teal text-gray-400"
            style={sortOption !== '' ? { color: 'inherit' } : undefined}
          >
            <option value="" disabled>Sort</option>
            <option value="term-asc">A-Z</option>
            <option value="term-desc">Z-A</option>
            <option value="category">By Category</option>
            <option value="random">Random</option>
          </select>

          {/* Items Per Page */}
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-border-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-teal"
          >
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
            <option value={50}>50 per page</option>
            <option value={100}>100 per page</option>
            <option value={-1}>All</option>
          </select>

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
              title="Table view"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Category Filters */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => toggleCategory(category)}
                className={`px-3 py-1 rounded-full text-sm transition ${
                  filters.categories.includes(category)
                    ? 'bg-orange text-white'
                    : 'bg-gray-200 text-text-primary hover:bg-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
            {filters.categories.length > 0 && (
              <button
                onClick={clearFilters}
                className="px-3 py-1 rounded-full text-sm bg-navy text-white hover:opacity-90"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Terms Display */}
        {viewMode === 'card' ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedTerms.map(term => (
              <div key={term.id} className="card">
                <div className="flex items-start gap-2 mb-3">
                  <button
                    onClick={() => toggleTerm(term.element)}
                    className={`flex-1 text-left bg-gray-100 p-3 rounded text-sm font-mono transition ${
                      selectedTerms.includes(term.element) ? 'ring-2 ring-orange bg-orange/10' : 'hover:bg-gray-200'
                    }`}
                    title="Click to add to prompt builder"
                  >
                    {term.element}
                  </button>
                  <button
                    onClick={() => copyToClipboard(term.element)}
                    className="bg-gray-100 p-3 rounded text-orange hover:text-navy hover:bg-gray-200 transition"
                    title="Copy term only"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
                <p className="text-sm text-text-secondary mb-3">{term.what_it_does}</p>
                <div className="space-y-2 text-sm">
                  <div>
                    <strong className="text-text-primary">Best For:</strong>
                    <p className="text-text-secondary">{term.best_used_for}</p>
                  </div>
                  <div>
                    <strong className="text-text-primary">Example Usage:</strong>
                    <p className="text-text-secondary">{term.example_prompt_usage}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-teal text-white">
                  <th className="p-3 text-left">Term</th>
                  <th className="p-3 text-left">Category</th>
                  <th className="p-3 text-left">What It Does</th>
                  <th className="p-3 text-left">Best Used For</th>
                  <th className="p-3 text-left">Example Usage</th>
                </tr>
              </thead>
              <tbody>
                {paginatedTerms.map(term => (
                  <tr key={term.id} className="border-b border-border-gray hover:bg-gray-50">
                    <td className="p-3">
                      <div className="relative inline-block min-w-[120px]">
                        <button
                          onClick={() => toggleTerm(term.element)}
                          className={`w-full text-left bg-gray-200 p-2 rounded text-sm font-mono pr-8 border transition ${
                            selectedTerms.includes(term.element)
                              ? 'ring-2 ring-orange bg-orange/10 border-orange'
                              : 'border-gray-300 hover:bg-gray-300'
                          }`}
                          title="Click to add to prompt builder"
                        >
                          {term.element}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(term.element);
                          }}
                          className="absolute top-1 right-1 text-orange hover:text-navy transition"
                          title="Copy term only"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                      </div>
                    </td>
                    <td className="p-3 text-sm">{term.category}</td>
                    <td className="p-3 text-sm">{term.what_it_does}</td>
                    <td className="p-3 text-sm">{term.best_used_for}</td>
                    <td className="p-3 text-sm">{term.example_prompt_usage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filteredTerms.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-text-secondary">No terms match your filters</p>
            <button onClick={clearFilters} className="btn-primary mt-4">
              Clear Filters
            </button>
          </div>
        )}

        {/* Pagination Controls */}
        {filteredTerms.length > 0 && itemsPerPage !== -1 && (
          <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-text-secondary">
              Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of {totalItems} terms
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-border-gray rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Previous
              </button>
              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-4 py-2 border rounded-lg transition ${
                        currentPage === pageNum
                          ? 'bg-orange text-white border-orange'
                          : 'border-border-gray hover:bg-gray-100'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-border-gray rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}

export default function DictionaryPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-lg text-text-secondary">Loading dictionary...</div></div>}>
      <DictionaryContent />
    </Suspense>
  );
}
