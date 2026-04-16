'use client';

import { Download, Mail, ExternalLink } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import SectionLabel from '../components/SectionLabel';
import Hairline from '../components/Hairline';

export default function ResumePage() {
  return (
    <div className="section py-16 md:py-20">
      <div className="xl:grid xl:grid-cols-[1fr_2fr] xl:gap-16 xl:items-start">
        {/* Left */}
        <aside className="xl:sticky xl:top-24">
          <PageHeader
            number="05"
            label="Document"
            title="Resume"
            description="A one-page summary of education, skills, and selected work. Download the PDF or read it below."
          />

          <div className="flex flex-col gap-3 mb-12 xl:mb-0 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <a
              href="/cv.pdf"
              download="Remy-Post-Resume.pdf"
              className="resume-btn-primary inline-flex items-center justify-between gap-3 px-5 py-3.5 text-[13px] tracking-wide"
              style={{
                background: 'var(--color-ink)',
                color: 'var(--color-bg)',
                fontWeight: 500,
              }}
            >
              <span className="inline-flex items-center gap-2">
                <Download size={14} strokeWidth={1.8} />
                Download PDF
              </span>
              <span
                className="text-[10px] tracking-[0.2em] uppercase opacity-70"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                A4
              </span>
            </a>

            <a
              href="mailto:remy.post.06@gmail.com"
              className="resume-btn-ghost inline-flex items-center gap-2 px-5 py-3.5 text-[13px] tracking-wide"
              style={{
                border: '1px solid var(--color-rule)',
                color: 'var(--color-muted)',
                fontWeight: 500,
              }}
            >
              <Mail size={14} strokeWidth={1.8} />
              Contact me
            </a>

            <a
              href="/cv.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="resume-btn-ghost inline-flex items-center gap-2 px-5 py-3.5 text-[13px] tracking-wide"
              style={{
                border: '1px solid var(--color-rule)',
                color: 'var(--color-muted)',
                fontWeight: 500,
              }}
            >
              <ExternalLink size={14} strokeWidth={1.8} />
              Open in new tab
            </a>
          </div>
        </aside>

        {/* Right: PDF preview + fallback */}
        <div className="animate-fade-up" style={{ animationDelay: '0.18s' }}>
          <SectionLabel className="mb-4">Preview</SectionLabel>

          <div
            className="relative w-full"
            style={{
              border: '1px solid var(--color-rule)',
              background: 'var(--color-surface)',
            }}
          >
            <iframe
              src="/cv.pdf"
              className="w-full"
              style={{
                height: 'clamp(560px, 78vh, 1100px)',
                border: 0,
                display: 'block',
              }}
              title="Resume preview — Remy Post"
            />
          </div>

          <Hairline className="my-6" />

          <p className="text-[12px] leading-relaxed" style={{ color: 'var(--color-subtle)' }}>
            If the embedded preview doesn&rsquo;t load, the PDF is available as a direct{' '}
            <a href="/cv.pdf" className="inline-link" style={{ color: 'var(--color-ink)', borderBottom: '1px solid var(--color-rule)' }}>
              download
            </a>
            .
          </p>
        </div>
      </div>

      <style>{`
        .resume-btn-primary { transition: background 220ms; }
        .resume-btn-primary:hover,
        .resume-btn-primary:focus-visible {
          background: color-mix(in srgb, var(--color-ink) 90%, var(--color-bg));
        }
        .resume-btn-ghost { transition: color 220ms, border-color 220ms; }
        .resume-btn-ghost:hover,
        .resume-btn-ghost:focus-visible {
          color: var(--color-ink);
          border-color: var(--color-ink);
        }
        .inline-link:hover,
        .inline-link:focus-visible { border-bottom-color: var(--color-ink) !important; }
      `}</style>
    </div>
  );
}
