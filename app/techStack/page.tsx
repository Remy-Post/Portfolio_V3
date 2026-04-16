'use client';

import { useMemo, useState } from 'react';
import { useAppContext } from '../providers';
import Language, { PROF_LABELS } from '../components/Language';
import LoadingSpinner from '../components/LoadingSpinner';
import PageHeader from '../components/PageHeader';
import SectionLabel from '../components/SectionLabel';

const LEVELS = [4, 3, 2, 1] as const;

export default function TechStackPage() {
  const { languages, loading } = useAppContext();
  const [activeFilter, setActiveFilter] = useState<number>(0);

  const countsByLevel = useMemo(() => {
    const m = new Map<number, number>();
    for (const l of languages) m.set(l.proficiency, (m.get(l.proficiency) ?? 0) + 1);
    return m;
  }, [languages]);

  if (loading) return <LoadingSpinner />;

  const filtered = activeFilter === 0 ? languages : languages.filter((l) => l.proficiency === activeFilter);

  return (
    <div className="section py-16 md:py-20">
      <div className="xl:grid xl:grid-cols-[1fr_2.5fr] xl:gap-16 xl:items-start">
        {/* Sidebar */}
        <aside className="xl:sticky xl:top-24">
          <PageHeader
            number="02"
            label="Technologies"
            title="Tech Stack"
            description="Languages, frameworks, and tools I use across frontend, backend, and systems work."
          />

          <nav aria-label="Filter by proficiency" className="mb-12 xl:mb-0 animate-fade-up" style={{ animationDelay: '0.08s' }}>
            <SectionLabel className="mb-4">Proficiency</SectionLabel>

            <ul className="flex flex-col">
              <li>
                <button
                  type="button"
                  onClick={() => setActiveFilter(0)}
                  aria-pressed={activeFilter === 0}
                  className="toc-item w-full flex items-center justify-between py-2.5 text-left"
                  style={{ color: activeFilter === 0 ? 'var(--color-ink)' : 'var(--color-muted)' }}
                >
                  <span className="text-[13px]">All technologies</span>
                  <span
                    className="text-[11px] tracking-wider"
                    style={{ color: 'var(--color-subtle)', fontFamily: 'var(--font-mono)' }}
                  >
                    {languages.length}
                  </span>
                </button>
              </li>
              {LEVELS.map((level) => {
                const count = countsByLevel.get(level) ?? 0;
                const isActive = activeFilter === level;
                if (count === 0) return null;
                return (
                  <li key={level}>
                    <button
                      type="button"
                      onClick={() => setActiveFilter(isActive ? 0 : level)}
                      aria-pressed={isActive}
                      className="toc-item w-full flex items-center justify-between py-2.5 text-left"
                      style={{ color: isActive ? 'var(--color-ink)' : 'var(--color-muted)' }}
                    >
                      <span className="text-[13px]">{PROF_LABELS[level]}</span>
                      <span
                        className="text-[11px] tracking-wider"
                        style={{ color: 'var(--color-subtle)', fontFamily: 'var(--font-mono)' }}
                      >
                        {count}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        {/* Right: grid */}
        <main>
          {filtered.length === 0 ? (
            <p className="py-16 text-center" style={{ color: 'var(--color-subtle)' }}>
              No technologies at this level yet.
            </p>
          ) : (
            <div
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-4 3xl:grid-cols-6"
              style={{ borderTop: '1px solid var(--color-rule)' }}
            >
              {filtered.map((lang, i) => (
                <div
                  key={lang._id}
                  className="animate-fade-up"
                  style={{ animationDelay: `${Math.min(0.03 * i, 0.4)}s`, borderRight: '1px solid var(--color-rule)' }}
                >
                  <Language language={lang} size="lg" />
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      <style>{`
        .toc-item:hover,
        .toc-item:focus-visible { color: var(--color-ink) !important; }
      `}</style>
    </div>
  );
}
