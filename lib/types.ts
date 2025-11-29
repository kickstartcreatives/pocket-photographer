// Photography Term from database
export interface PhotographyTerm {
  id: string;
  element: string;
  category: string;
  what_it_does: string;
  best_used_for: string;
  example_prompt_usage: string;
  prompt_style?: string;
  created_at: string;
  updated_at: string;
}

// Prompt Library Item
export interface PromptLibraryItem {
  id: string;
  title: string;
  description?: string;
  complete_prompt?: string;
  ai_platform: string;
  image_url?: string;
  terms_used: string[];
  category?: string;
  what_to_expect?: string;
  created_at: string;
  updated_at: string;
}

// Filter state
export interface Filters {
  search: string;
  categories: string[];
}

// View mode
export type ViewMode = 'card' | 'table';

// Sort options
export type SortOption = '' | 'random' | 'term-asc' | 'term-desc' | 'category';
