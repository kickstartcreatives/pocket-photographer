import Link from 'next/link';

export default function Navigation() {
  return (
    <nav className="bg-white border-b border-border-gray">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-navy">
            Pocket Photographer
          </Link>
          <div className="flex gap-6">
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
        </div>
      </div>
    </nav>
  );
}
