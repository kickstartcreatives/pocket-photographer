'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-border-gray">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-1.5 text-xl font-bold text-navy">
            <Image src="/logo.png" alt="Pocket Photographer" width={40} height={40} className="w-10 h-10" />
            <span>pocket photographer</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-6">
            <Link href="/" className="text-text-primary hover:text-teal transition">
              Home
            </Link>
            <Link href="/dictionary" className="text-text-primary hover:text-teal transition">
              Dictionary
            </Link>
            <Link href="/prompts" className="text-text-primary hover:text-teal transition">
              Prompts
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-navy hover:text-teal transition"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-2 flex flex-col gap-3">
            <Link
              href="/"
              className="text-text-primary hover:text-teal transition py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/dictionary"
              className="text-text-primary hover:text-teal transition py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Dictionary
            </Link>
            <Link
              href="/prompts"
              className="text-text-primary hover:text-teal transition py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Prompts
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
