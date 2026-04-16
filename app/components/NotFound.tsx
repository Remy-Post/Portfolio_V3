import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NotFoundState({
  message,
  backHref,
  backLabel,
}: {
  message: string;
  backHref: string;
  backLabel: string;
}) {
  return (
    <div className="section py-32 flex flex-col items-center text-center gap-6">
      <p
        className="text-[11px] tracking-[0.22em] uppercase"
        style={{ color: 'var(--color-subtle)', fontFamily: 'var(--font-mono)' }}
      >
        404 — Not Found
      </p>
      <p
        className="font-serif"
        style={{
          color: 'var(--color-ink)',
          fontSize: 'clamp(1.5rem, 4vw, 2rem)',
          lineHeight: 1.1,
          maxWidth: '34ch',
        }}
      >
        {message}
      </p>
      <Link
        href={backHref}
        className="back-link inline-flex items-center gap-2 text-[13px] transition-colors mt-2"
        style={{ color: 'var(--color-muted)' }}
      >
        <ArrowLeft size={14} strokeWidth={1.5} aria-hidden="true" />
        <span>Back to {backLabel}</span>
      </Link>
      <style>{`
        .back-link:hover,
        .back-link:focus-visible { color: var(--color-ink) !important; }
      `}</style>
    </div>
  );
}
