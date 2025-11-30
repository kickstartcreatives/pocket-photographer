'use client';

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'pocket-photographer-prompt-builder';

export function usePromptBuilder() {
  const [selectedTerms, setSelectedTerms] = useState<string[]>([]);
  const [promptText, setPromptText] = useState<string>('');
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
          setPromptText(parsed.join(', '));
        }
      } catch (e) {
        console.error('Failed to parse stored prompt builder data:', e);
      }
    }
  }, []);

  // Sync promptText when selectedTerms changes (but not from manual edit)
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
      const newTerms = prev.includes(term)
        ? prev.filter(t => t !== term)
        : [...prev, term];
      setPromptText(newTerms.join(', '));
      return newTerms;
    });
  };

  const clearTerms = () => {
    setSelectedTerms([]);
    setPromptText('');
  };

  const getPromptString = () => {
    return promptText;
  };

  const setPromptString = (text: string) => {
    setPromptText(text);
  };

  return {
    selectedTerms,
    addTerm,
    removeTerm,
    toggleTerm,
    clearTerms,
    getPromptString,
    setPromptString,
    isClient
  };
}
