import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function BackLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-700
        transition-colors mb-8"
    >
      <ArrowLeft size={14} />
      {children}
    </Link>
  );
}
