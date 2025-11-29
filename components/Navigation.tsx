import Link from 'next/link';
import Image from 'next/image';

export default function Navigation() {
  return (
    <nav className="bg-white border-b border-border-gray">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-1.5 text-xl font-bold text-navy font-montserrat uppercase tracking-wide">
            <Image src="/logo.png" alt="Pocket Photographer" width={40} height={40} className="w-10 h-10" />
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
