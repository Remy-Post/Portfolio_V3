'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ArrowRight, Download } from 'lucide-react';
import { useAppContext } from './providers';
import LoadingSpinner from './components/LoadingSpinner';
import PageHeader from './components/PageHeader';
import SectionLabel from './components/SectionLabel';
import Project from './components/Project';
import Language from './components/Language';
import Hairline from './components/Hairline';

const HeroField = dynamic(() => import('./components/HeroField'), {
  ssr: false,
  loading: () => <HeroFieldSkeleton />,
});

function HeroFieldSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="hero-field-skeleton w-full h-full"
      style={{
        background:
          'radial-gradient(ellipse at 60% 40%, color-mix(in srgb, var(--color-ink) 4%, transparent) 0%, transparent 70%)',
      }}
    />
  );
}

export default function Home() {
  const { languages, projects, loading } = useAppContext();

  if (loading) return <LoadingSpinner />;

  const featured = [...projects]
    .sort((a, b) => {
      const aLen = Array.isArray(a.languages) ? a.languages.length : 0;
      const bLen = Array.isArray(b.languages) ? b.languages.length : 0;
      return bLen - aLen;
    })
    .slice(0, 6);

  const topLanguages = [...languages]
    .sort((a, b) => {
      const aLen = Array.isArray(a.projects) ? a.projects.length : 0;
      const bLen = Array.isArray(b.projects) ? b.projects.length : 0;
      return bLen - aLen;
    })
    .slice(0, 8);

  return (
    <div className="section py-16 md:py-20 xl:py-24">
      {/* Hero: sticky sidebar on xl+, stacked on smaller */}
      <section className="xl:grid xl:grid-cols-[1fr_1fr] xl:gap-16 xl:items-start mb-20 md:mb-28">
        <div className="xl:sticky xl:top-24 animate-fade-up">
          <SectionLabel number="00" className="mb-5">
            Portfolio — 2026
          </SectionLabel>

          <h1
            className="font-serif leading-[0.92] tracking-[-0.02em] mb-8"
            style={{
              color: 'var(--color-ink)',
              fontSize: 'clamp(3rem, 10vw, 7rem)',
              fontWeight: 400,
            }}
          >
            Remy <em style={{ fontStyle: 'italic' }}>Post</em>
          </h1>

          <p
            className="text-[16px] md:text-[17px] leading-relaxed max-w-[44ch] mb-8"
            style={{ color: 'var(--color-muted)' }}
          >
            A year-two CS student building full-stack web apps — Express APIs, MongoDB, and the quieter parts of Next.js.
          </p>

          <div className="flex flex-wrap items-center gap-3 animate-fade-up" style={{ animationDelay: '0.12s' }}>
            <Link
              href="/projects"
              className="cta-primary inline-flex items-center gap-2 px-5 py-3 text-[13px] tracking-wide"
              style={{
                background: 'var(--color-ink)',
                color: 'var(--color-bg)',
                fontWeight: 500,
              }}
            >
              See the work
              <ArrowRight size={14} strokeWidth={1.8} />
            </Link>
            <Link
              href="/resume"
              className="cta-ghost inline-flex items-center gap-2 px-5 py-3 text-[13px] tracking-wide"
              style={{
                border: '1px solid var(--color-rule)',
                color: 'var(--color-muted)',
                fontWeight: 500,
              }}
            >
              <Download size={14} strokeWidth={1.8} />
              Resume
            </Link>
          </div>
        </div>

        {/* Right: Three.js signal field (lazy, animated in Phase D) */}
        <div
          className="relative mt-14 xl:mt-0 aspect-[4/3] md:aspect-[5/4] xl:aspect-auto xl:h-[min(600px,80vh)] animate-fade-in"
          style={{ animationDelay: '0.2s' }}
        >
          <HeroField />
        </div>
      </section>

      {/* Featured Projects — editorial list */}
      <section className="mb-20 md:mb-28">
        <div className="flex items-end justify-between mb-10 md:mb-12">
          <div>
            <SectionLabel number="01" className="mb-4">
              Selected work
            </SectionLabel>
            <h2
              className="font-serif"
              style={{
                color: 'var(--color-ink)',
                fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
                fontWeight: 400,
                lineHeight: 1,
                letterSpacing: '-0.015em',
              }}
            >
              Featured projects
            </h2>
          </div>
          <Link
            href="/projects"
            className="cta-ghost-inline inline-flex items-center gap-1.5 text-[13px] transition-colors"
            style={{ color: 'var(--color-subtle)' }}
          >
            View all
            <ArrowRight size={13} strokeWidth={1.5} />
          </Link>
        </div>

        <div>
          {featured.map((proj, i) => (
            <Project
              key={proj._id}
              project={proj}
              number={String(i + 1).padStart(2, '0')}
            />
          ))}
        </div>
      </section>

      {/* Tech Stack */}
      <section className="mb-20 md:mb-28">
        <div className="flex items-end justify-between mb-10 md:mb-12">
          <div>
            <SectionLabel number="02" className="mb-4">
              Tools &amp; technologies
            </SectionLabel>
            <h2
              className="font-serif"
              style={{
                color: 'var(--color-ink)',
                fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
                fontWeight: 400,
                lineHeight: 1,
                letterSpacing: '-0.015em',
              }}
            >
              What I work with
            </h2>
          </div>
          <Link
            href="/techStack"
            className="cta-ghost-inline inline-flex items-center gap-1.5 text-[13px] transition-colors"
            style={{ color: 'var(--color-subtle)' }}
          >
            View all
            <ArrowRight size={13} strokeWidth={1.5} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-4 3xl:grid-cols-8">
          {topLanguages.map((lang, i) => (
            <div
              key={lang._id}
              className="animate-fade-up"
              style={{ animationDelay: `${0.04 * i}s` }}
            >
              <Language language={lang} size="sm" />
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section>
        <Hairline className="mb-12 md:mb-16" />
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-8 md:gap-16 items-start">
          <div>
            <SectionLabel number="03" className="mb-4">
              Get in touch
            </SectionLabel>
            <h2
              className="font-serif mb-4"
              style={{
                color: 'var(--color-ink)',
                fontSize: 'clamp(1.75rem, 5vw, 3rem)',
                fontWeight: 400,
                lineHeight: 1,
                letterSpacing: '-0.015em',
              }}
            >
              Let&rsquo;s <em style={{ fontStyle: 'italic' }}>talk</em>.
            </h2>
          </div>
          <div className="max-w-[42ch]">
            <p className="text-[15px] leading-relaxed mb-6" style={{ color: 'var(--color-muted)' }}>
              Open to internships, co-ops, and interesting conversations about building things on the web.
            </p>
            <a
              href="mailto:remy.post.06@gmail.com"
              className="cta-primary inline-flex items-center gap-2 px-5 py-3 text-[13px] tracking-wide"
              style={{
                background: 'var(--color-ink)',
                color: 'var(--color-bg)',
                fontWeight: 500,
              }}
            >
              remy.post.06@gmail.com
              <ArrowRight size={14} strokeWidth={1.8} />
            </a>
          </div>
        </div>
      </section>

      <style>{`
        .cta-primary { transition: background 250ms, transform 200ms; }
        .cta-primary:hover,
        .cta-primary:focus-visible {
          background: color-mix(in srgb, var(--color-ink) 90%, var(--color-bg));
        }
        .cta-ghost { transition: color 200ms, border-color 200ms, background 200ms; }
        .cta-ghost:hover,
        .cta-ghost:focus-visible {
          color: var(--color-ink);
          border-color: var(--color-ink);
        }
        .cta-ghost-inline:hover,
        .cta-ghost-inline:focus-visible { color: var(--color-ink) !important; }
      `}</style>
    </div>
  );
}
