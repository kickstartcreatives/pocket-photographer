'use client';

import { useState } from 'react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  formType: 'prompt' | 'feedback';
}

export default function ContactModal({ isOpen, onClose, formType }: ContactModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const formConfig = {
    prompt: {
      title: 'Request a Prompt',
      accessKey: '2c1bf446-de3e-476e-bf22-7d0c0d46c5b2',
      subject: 'Prompt Request - Pocket Photographer',
      messagePlaceholder: 'Tell us what kind of prompt example you\'d like to see...',
    },
    feedback: {
      title: 'Send Feedback',
      accessKey: 'c665ac6d-9400-4a5e-abae-6abc6bb15d81',
      subject: 'Pocket Photographer Feedback',
      messagePlaceholder: 'Share your suggestions or feedback...',
    },
  };

  const config = formConfig[formType];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    formData.append('access_key', config.accessKey);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setIsSuccess(true);
        setTimeout(() => {
          onClose();
          setIsSuccess(false);
          (e.target as HTMLFormElement).reset();
        }, 2000);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } catch (err) {
      setError('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-6 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-text-primary">{config.title}</h2>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-navy transition"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {isSuccess ? (
          <div className="text-center py-8">
            <div className="text-5xl mb-4">✓</div>
            <p className="text-lg font-medium text-text-primary">Thank you!</p>
            <p className="text-text-secondary">We'll get back to you soon.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <input type="hidden" name="subject" value={config.subject} />

            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-text-primary mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="message" className="block text-sm font-medium text-text-primary mb-1">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={4}
                placeholder={config.messagePlaceholder}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange"
              />
            </div>

            {error && (
              <div className="mb-4 text-red-600 text-sm">{error}</div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-orange text-white py-2 px-4 rounded-lg hover:bg-navy transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
