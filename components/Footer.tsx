'use client';

import { useState } from 'react';
import ContactModal from './ContactModal';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [showContactModal, setShowContactModal] = useState(false);

  return (
    <>
      <footer className="bg-white border-t border-border-gray mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-sm text-text-secondary mb-3">
              © {currentYear} Kickstart Creatives. All rights reserved.
            </p>
            <p className="text-sm text-text-secondary">
              Have a suggestion or feedback?{' '}
              <button
                onClick={() => setShowContactModal(true)}
                className="text-teal hover:text-orange transition font-medium underline"
              >
                Let us know
              </button>
              {' · '}
              <a
                href="/admin"
                className="text-gray-400 hover:text-gray-600 transition text-xs"
              >
                Admin
              </a>
            </p>
          </div>
        </div>
      </footer>

      {/* Contact Modal */}
      <ContactModal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
        formType="feedback"
      />
    </>
  );
}
