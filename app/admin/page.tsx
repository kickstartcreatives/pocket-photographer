'use client';

import { useState, useEffect } from 'react';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { PhotographyTerm, PromptLibraryItem } from '@/lib/types';
import ImageUpload from '@/components/ImageUpload';
import { getAIPlatforms, saveAIPlatforms, DEFAULT_AI_PLATFORMS } from '@/lib/ai-platforms';

type Tab = 'terms' | 'prompts' | 'platforms';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('terms');

  // Terms state
  const [terms, setTerms] = useState<PhotographyTerm[]>([]);
  const [editingTerm, setEditingTerm] = useState<PhotographyTerm | null>(null);
  const [showTermForm, setShowTermForm] = useState(false);

  // Prompts state
  const [prompts, setPrompts] = useState<PromptLibraryItem[]>([]);
  const [editingPrompt, setEditingPrompt] = useState<PromptLibraryItem | null>(null);
  const [showPromptForm, setShowPromptForm] = useState(false);

  // AI Platforms state
  const [aiPlatforms, setAIPlatforms] = useState<string[]>([]);
  const [newPlatform, setNewPlatform] = useState('');
  const [editingPlatformIndex, setEditingPlatformIndex] = useState<number | null>(null);
  const [editingPlatformValue, setEditingPlatformValue] = useState('');

  // Toast notification
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Check if already authenticated
  useEffect(() => {
    const auth = sessionStorage.getItem('admin_authenticated');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Fetch data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchTerms();
      fetchPrompts();
      setAIPlatforms(getAIPlatforms());
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'pocketphoto2024') { // We'll move this to env check via API route later
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_authenticated', 'true');
      setError('');
    } else {
      setError('Invalid password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_authenticated');
    setPassword('');
  };

  const fetchTerms = async () => {
    const { data, error } = await supabaseAdmin
      .from('photography_terms')
      .select('*')
      .order('element', { ascending: true });

    if (error) {
      console.error('Error fetching terms:', error);
    } else if (data) {
      setTerms(data);
    }
  };

  const fetchPrompts = async () => {
    console.log('Fetching prompts...');
    const { data, error } = await supabaseAdmin
      .from('prompt_library')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching prompts:', error);
    } else if (data) {
      console.log('Fetched prompts:', data);
      setPrompts(data);
    }
  };

  const deleteTerm = async (id: string) => {
    if (!confirm('Are you sure you want to delete this term?')) return;

    const { error } = await supabaseAdmin
      .from('photography_terms')
      .delete()
      .eq('id', id);

    if (error) {
      alert('Error deleting term: ' + error.message);
    } else {
      fetchTerms();
    }
  };

  const deletePrompt = async (id: string) => {
    if (!confirm('Are you sure you want to delete this prompt?')) return;

    const { error } = await supabaseAdmin
      .from('prompt_library')
      .delete()
      .eq('id', id);

    if (error) {
      alert('Error deleting prompt: ' + error.message);
    } else {
      fetchPrompts();
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold text-navy mb-6 text-center">Admin Login</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange focus:border-orange"
                placeholder="Enter admin password"
              />
            </div>
            {error && (
              <p className="text-red-600 text-sm">{error}</p>
            )}
            <button
              type="submit"
              className="w-full btn-orange"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className={`px-6 py-3 rounded-lg shadow-lg text-white ${
            toast.type === 'success' ? 'bg-orange' : 'bg-red-500'
          }`}>
            {toast.message}
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-navy text-white py-4 px-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-orange hover:bg-orange/80 rounded-lg transition"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b">
          <button
            onClick={() => setActiveTab('terms')}
            className={`px-6 py-3 font-semibold transition ${
              activeTab === 'terms'
                ? 'text-orange border-b-2 border-orange'
                : 'text-gray-600 hover:text-navy'
            }`}
          >
            Photography Terms ({terms.length})
          </button>
          <button
            onClick={() => setActiveTab('prompts')}
            className={`px-6 py-3 font-semibold transition ${
              activeTab === 'prompts'
                ? 'text-orange border-b-2 border-orange'
                : 'text-gray-600 hover:text-navy'
            }`}
          >
            Prompt Library ({prompts.length})
          </button>
          <button
            onClick={() => setActiveTab('platforms')}
            className={`px-6 py-3 font-semibold transition ${
              activeTab === 'platforms'
                ? 'text-orange border-b-2 border-orange'
                : 'text-gray-600 hover:text-navy'
            }`}
          >
            AI Platforms ({aiPlatforms.length})
          </button>
        </div>

        {/* Terms Tab */}
        {activeTab === 'terms' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-navy">Photography Terms</h2>
              <button
                onClick={() => {
                  setEditingTerm(null);
                  setShowTermForm(true);
                }}
                className="btn-orange"
              >
                + Add New Term
              </button>
            </div>

            {showTermForm && (
              <TermForm
                term={editingTerm}
                onClose={() => {
                  setShowTermForm(false);
                  setEditingTerm(null);
                }}
                onSave={() => {
                  setShowTermForm(false);
                  setEditingTerm(null);
                  fetchTerms();
                }}
                showToast={showToast}
              />
            )}

            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Term
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {terms.map((term) => (
                    <tr key={term.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {term.element}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {term.category}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-md truncate">
                        {term.what_it_does}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                        <button
                          onClick={() => {
                            setEditingTerm(term);
                            setShowTermForm(true);
                          }}
                          className="text-orange hover:text-navy"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteTerm(term.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Prompts Tab */}
        {activeTab === 'prompts' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-navy">Prompt Library</h2>
              <button
                onClick={() => {
                  setEditingPrompt(null);
                  setShowPromptForm(true);
                }}
                className="btn-orange"
              >
                + Add New Prompt
              </button>
            </div>

            {showPromptForm && (
              <PromptForm
                prompt={editingPrompt}
                aiPlatforms={aiPlatforms}
                onClose={() => {
                  setShowPromptForm(false);
                  setEditingPrompt(null);
                }}
                onSave={() => {
                  setShowPromptForm(false);
                  setEditingPrompt(null);
                  fetchPrompts();
                }}
                showToast={showToast}
              />
            )}

            <div className="grid gap-4">
              {prompts.map((prompt) => (
                <div key={prompt.id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex gap-4">
                    {prompt.image_url && (
                      <img
                        src={prompt.image_url}
                        alt={prompt.title}
                        className="w-32 h-32 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-navy mb-2">{prompt.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{prompt.description}</p>
                      <p className="text-xs text-gray-500 mb-2">
                        <strong>Style:</strong> {prompt.style} | <strong>Platform:</strong> {prompt.ai_platform}
                      </p>
                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            setEditingPrompt(prompt);
                            setShowPromptForm(true);
                          }}
                          className="text-sm text-orange hover:text-navy font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deletePrompt(prompt.id)}
                          className="text-sm text-red-600 hover:text-red-800 font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI Platforms Tab */}
        {activeTab === 'platforms' && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-navy mb-4">AI Platforms</h2>

              {/* Add New Platform */}
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h3 className="text-sm font-semibold text-navy mb-3">Add New Platform</h3>
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Enter platform name (e.g., Ideogram v3)"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange focus:border-transparent"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const input = e.currentTarget;
                        const newPlatform = input.value.trim();
                        if (newPlatform && !aiPlatforms.includes(newPlatform)) {
                          const updated = [...aiPlatforms, newPlatform];
                          setAIPlatforms(updated);
                          saveAIPlatforms(updated);
                          input.value = '';
                          showToast('Platform added successfully');
                        } else if (aiPlatforms.includes(newPlatform)) {
                          showToast('Platform already exists', 'error');
                        }
                      }
                    }}
                  />
                  <button
                    onClick={(e) => {
                      const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                      const newPlatform = input.value.trim();
                      if (newPlatform && !aiPlatforms.includes(newPlatform)) {
                        const updated = [...aiPlatforms, newPlatform];
                        setAIPlatforms(updated);
                        saveAIPlatforms(updated);
                        input.value = '';
                        showToast('Platform added successfully');
                      } else if (aiPlatforms.includes(newPlatform)) {
                        showToast('Platform already exists', 'error');
                      }
                    }}
                    className="btn-orange"
                  >
                    Add Platform
                  </button>
                </div>
              </div>

              {/* Platform List */}
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Platform Name
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {aiPlatforms.map((platform, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {editingPlatformIndex === index ? (
                            <input
                              type="text"
                              value={editingPlatformValue}
                              onChange={(e) => setEditingPlatformValue(e.target.value)}
                              className="px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-orange focus:border-transparent"
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  const newValue = editingPlatformValue.trim();
                                  if (newValue && newValue !== platform) {
                                    if (aiPlatforms.includes(newValue)) {
                                      showToast('Platform already exists', 'error');
                                    } else {
                                      const updated = [...aiPlatforms];
                                      updated[index] = newValue;
                                      setAIPlatforms(updated);
                                      saveAIPlatforms(updated);
                                      setEditingPlatformIndex(null);
                                      showToast('Platform updated');
                                    }
                                  } else {
                                    setEditingPlatformIndex(null);
                                  }
                                } else if (e.key === 'Escape') {
                                  setEditingPlatformIndex(null);
                                }
                              }}
                            />
                          ) : (
                            platform
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {editingPlatformIndex === index ? (
                            <div className="flex gap-2 justify-end">
                              <button
                                onClick={() => {
                                  const newValue = editingPlatformValue.trim();
                                  if (newValue && newValue !== platform) {
                                    if (aiPlatforms.includes(newValue)) {
                                      showToast('Platform already exists', 'error');
                                    } else {
                                      const updated = [...aiPlatforms];
                                      updated[index] = newValue;
                                      setAIPlatforms(updated);
                                      saveAIPlatforms(updated);
                                      setEditingPlatformIndex(null);
                                      showToast('Platform updated');
                                    }
                                  } else {
                                    setEditingPlatformIndex(null);
                                  }
                                }}
                                className="text-orange hover:text-navy"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingPlatformIndex(null)}
                                className="text-gray-600 hover:text-gray-900"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <div className="flex gap-3 justify-end">
                              <button
                                onClick={() => {
                                  setEditingPlatformIndex(index);
                                  setEditingPlatformValue(platform);
                                }}
                                className="text-orange hover:text-navy"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => {
                                  if (window.confirm(`Delete "${platform}"?`)) {
                                    const updated = aiPlatforms.filter((_, i) => i !== index);
                                    setAIPlatforms(updated);
                                    saveAIPlatforms(updated);
                                    showToast('Platform deleted');
                                  }
                                }}
                                className="text-red-600 hover:text-red-900"
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Term Form Component
function TermForm({ term, onClose, onSave, showToast }: {
  term: PhotographyTerm | null;
  onClose: () => void;
  onSave: () => void;
  showToast: (message: string, type?: 'success' | 'error') => void;
}) {
  const [formData, setFormData] = useState<Partial<PhotographyTerm>>(
    term || {
      element: '',
      category: '',
      what_it_does: '',
      best_used_for: '',
      example_prompt_usage: '',
      intent_tags: ''
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (term) {
      // Update existing
      const { error } = await supabaseAdmin
        .from('photography_terms')
        .update(formData)
        .eq('id', term.id);

      if (error) {
        showToast('Error updating term: ' + error.message, 'error');
      } else {
        showToast('Term updated successfully!');
        onSave();
      }
    } else {
      // Create new
      const { error } = await supabaseAdmin
        .from('photography_terms')
        .insert([formData]);

      if (error) {
        showToast('Error creating term: ' + error.message, 'error');
      } else {
        showToast('Term created successfully!');
        onSave();
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h3 className="text-xl font-bold text-navy mb-4">
            {term ? 'Edit Term' : 'Add New Term'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Term *
              </label>
              <input
                type="text"
                required
                value={formData.element || ''}
                onChange={(e) => setFormData({ ...formData, element: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange focus:border-orange"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                required
                value={formData.category || ''}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange focus:border-orange"
              >
                <option value="">Select a category</option>
                <option value="Camera Equipment">Camera Equipment</option>
                <option value="Composition & Perspective">Composition & Perspective</option>
                <option value="Lenses & Optics">Lenses & Optics</option>
                <option value="Lighting & Environment">Lighting & Environment</option>
                <option value="Styles & Genres">Styles & Genres</option>
                <option value="Technical Settings">Technical Settings</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                What It Does *
              </label>
              <textarea
                required
                rows={2}
                value={formData.what_it_does || ''}
                onChange={(e) => setFormData({ ...formData, what_it_does: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange focus:border-orange"
                placeholder="Brief description of what this term means"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Best Used For *
              </label>
              <textarea
                required
                rows={2}
                value={formData.best_used_for || ''}
                onChange={(e) => setFormData({ ...formData, best_used_for: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange focus:border-orange"
                placeholder="When/where to use this term"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Example Prompt Usage *
              </label>
              <textarea
                required
                rows={2}
                value={formData.example_prompt_usage || ''}
                onChange={(e) => setFormData({ ...formData, example_prompt_usage: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange focus:border-orange"
                placeholder="Example of how to use this in a prompt"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Intent Tags
              </label>
              <input
                type="text"
                value={formData.intent_tags || ''}
                onChange={(e) => setFormData({ ...formData, intent_tags: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange focus:border-orange"
                placeholder="e.g. mood, technical, composition"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 btn-orange"
              >
                {term ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Prompt Form Component
function PromptForm({ prompt, aiPlatforms, onClose, onSave, showToast }: {
  prompt: PromptLibraryItem | null;
  aiPlatforms: string[];
  onClose: () => void;
  onSave: () => void;
  showToast: (message: string, type?: 'success' | 'error') => void;
}) {
  const [formData, setFormData] = useState<Partial<PromptLibraryItem>>(
    prompt || {
      title: '',
      style: '',
      description: '',
      complete_prompt: '',
      full_prompt: '',
      ai_platform: '',
      image_url: '',
      terms_used: [],
      category: '',
      what_to_expect: ''
    }
  );

  const availableStyles = [
    'Portrait',
    'Editorial / Fashion',
    'Cinematic / Film Look',
    'Street & Documentary',
    'Landscape & Scenery',
    'Product / Commercial',
    'Lifestyle & Branding',
    'Creative / Experimental'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare data with derived fields
    const submitData = {
      ...formData,
      full_prompt: formData.complete_prompt || formData.full_prompt || '',
      category: formData.style?.split(' ')[0] || '' // Extract first word from style as category
    };

    if (prompt) {
      // Update existing
      console.log('Updating prompt:', prompt.id, 'with data:', submitData);
      const { data, error } = await supabaseAdmin
        .from('prompt_library')
        .update(submitData)
        .eq('id', prompt.id)
        .select();

      if (error) {
        console.error('Update error:', error);
        showToast('Error updating prompt: ' + error.message, 'error');
      } else {
        console.log('Updated successfully:', data);
        showToast('Prompt updated successfully!');
        onSave();
      }
    } else {
      // Create new
      console.log('Creating prompt with data:', submitData);
      const { data, error } = await supabaseAdmin
        .from('prompt_library')
        .insert([submitData])
        .select();

      if (error) {
        console.error('Create error:', error);
        showToast('Error creating prompt: ' + error.message, 'error');
      } else {
        console.log('Created successfully:', data);
        showToast('Prompt created successfully!');
        onSave();
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h3 className="text-xl font-bold text-navy mb-4">
            {prompt ? 'Edit Prompt' : 'Add New Prompt'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                required
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange focus:border-orange"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Style *
                </label>
                <select
                  required
                  value={formData.style || ''}
                  onChange={(e) => setFormData({ ...formData, style: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange focus:border-orange"
                >
                  <option value="">Select a style</option>
                  {availableStyles.map(style => (
                    <option key={style} value={style}>{style}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  AI Platform *
                </label>
                <select
                  required
                  value={formData.ai_platform || ''}
                  onChange={(e) => setFormData({ ...formData, ai_platform: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange focus:border-orange"
                >
                  <option value="">Select a platform</option>
                  {aiPlatforms.map(platform => (
                    <option key={platform} value={platform}>{platform}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Complete Prompt *
              </label>
              <textarea
                required
                rows={2}
                value={formData.complete_prompt || ''}
                onChange={(e) => setFormData({ ...formData, complete_prompt: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange focus:border-orange"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Terms Used (comma-separated)
              </label>
              <input
                type="text"
                value={Array.isArray(formData.terms_used) ? formData.terms_used.join(', ') : ''}
                onChange={(e) => setFormData({
                  ...formData,
                  terms_used: e.target.value.split(',').map(t => t.trim()).filter(Boolean)
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange focus:border-orange"
                placeholder="e.g. Golden Hour, Bokeh"
              />
            </div>

            <div>
              <ImageUpload
                currentUrl={formData.image_url || ''}
                onUpload={(url) => setFormData({ ...formData, image_url: url })}
              />
              <label className="block text-sm font-medium text-gray-700 mb-1 mt-2">
                Or paste Image URL
              </label>
              <input
                type="url"
                value={formData.image_url || ''}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange focus:border-orange"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange focus:border-orange"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  What to Expect
                </label>
                <textarea
                  rows={2}
                  value={formData.what_to_expect || ''}
                  onChange={(e) => setFormData({ ...formData, what_to_expect: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange focus:border-orange"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 btn-orange"
              >
                {prompt ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
