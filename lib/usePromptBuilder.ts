'use client';

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'pocket-photographer-prompt-builder';

export function usePromptBuilder() {
  const [selectedTerms, setSelectedTerms] = useState<string[]>([]);
  const [isClient, setIsClient] = useState(false);

  // Initialize from localStorage on client mount
  useEffect(() => {
    setIsClient(true);
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setSelectedTerms(parsed);
        }
      } catch (e) {
        console.error('Failed to parse stored prompt builder data:', e);
      }
    }
  }, []);

  // Sync to localStorage whenever selectedTerms changes
  useEffect(() => {
    if (isClient) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedTerms));
    }
  }, [selectedTerms, isClient]);

  const addTerm = (term: string) => {
    setSelectedTerms(prev => {
      if (!prev.includes(term)) {
        return [...prev, term];
      }
      return prev;
    });
  };

  const removeTerm = (term: string) => {
    setSelectedTerms(prev => prev.filter(t => t !== term));
  };

  const toggleTerm = (term: string) => {
    setSelectedTerms(prev => {
      if (prev.includes(term)) {
        return prev.filter(t => t !== term);
      }
      return [...prev, term];
    });
  };

  const clearTerms = () => {
    setSelectedTerms([]);
  };

  const getPromptString = () => {
    return selectedTerms.join(', ');
  };

  return {
    selectedTerms,
    addTerm,
    removeTerm,
    toggleTerm,
    clearTerms,
    getPromptString,
    isClient
  };
}
