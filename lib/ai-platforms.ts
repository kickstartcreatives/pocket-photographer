// Default AI Platforms
// These can be managed from the admin panel
export const DEFAULT_AI_PLATFORMS = [
  'Midjourney v6',
  'Midjourney v7',
  'Flux',
  'Ideogram',
  'Nano Banana Pro',
  'Higgsfield'
];

// Get AI platforms from localStorage (client-side only)
export function getAIPlatforms(): string[] {
  if (typeof window === 'undefined') {
    return DEFAULT_AI_PLATFORMS;
  }

  const stored = localStorage.getItem('ai-platforms');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      return DEFAULT_AI_PLATFORMS;
    }
  }
  return DEFAULT_AI_PLATFORMS;
}

// Save AI platforms to localStorage
export function saveAIPlatforms(platforms: string[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('ai-platforms', JSON.stringify(platforms));
  }
}
