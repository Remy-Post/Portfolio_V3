import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function BackLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="back-link inline-flex items-center gap-2 text-[13px] tracking-wide mb-10 md:mb-12 transition-colors"
      style={{ color: 'var(--color-subtle)' }}
    >
      <ArrowLeft size={14} strokeWidth={1.5} aria-hidden="true" className="back-arrow" />
      <span>{children}</span>

      <style>{`
        .back-link:hover,
        .back-link:focus-visible {
          color: var(--color-ink) !important;
        }
        .back-arrow { transition: transform 260ms cubic-bezier(0.16,1,0.3,1); }
        .back-link:hover .back-arrow,
        .back-link:focus-visible .back-arrow { transform: translateX(-4px); }
        @media (prefers-reduced-motion: reduce) {
          .back-arrow { transition: none; }
        }
      `}</style>
    </Link>
  );
}
