'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useAppContext } from '../providers';
import type { ILanguage } from '../../server/models/languages';
import LoadingSpinner from '../components/LoadingSpinner';
import PageHeader from '../components/PageHeader';
import SectionLabel from '../components/SectionLabel';
import Project from '../components/Project';

const FILTER_MIN_HEIGHT = 200;
const FILTER_MAX_HEIGHT = 480;
const FILTER_BOTTOM_GAP = 96; // 6rem — matches the 6rem (top-24) sticky offset

export default function ProjectsPage() {
  const { projects, languages, loading } = useAppContext();
  const [filterLang, setFilterLang] = useState<string | null>(null);
  const filterPanelRef = useRef<HTMLDivElement>(null);
  const mainListRef = useRef<HTMLElement>(null);

  const languageCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of projects) {
      if (!Array.isArray(p.languages)) continue;
      for (const l of p.languages as ILanguage[]) {
        if (l && typeof l === 'object' && '_id' in l) counts.set(l._id, (counts.get(l._id) ?? 0) + 1);
      }
    }
    return counts;
  }, [projects]);

  const sortedLanguages = useMemo(
    () =>
      [...languages].sort((a, b) => {
        const aCount = languageCounts.get(a._id) ?? 0;
        const bCount = languageCounts.get(b._id) ?? 0;
        return bCount - aCount;
      }),
    [languages, languageCounts],
  );

  const filtered = filterLang
    ? projects.filter((p) =>
        Array.isArray(p.languages)
          ? (p.languages as ILanguage[]).some((l) => l && typeof l === 'object' && '_id' in l && l._id === filterLang)
          : false,
      )
    : projects;

  /**
   * Dynamic filter-panel sizing (xl+ only, where the sidebar is sticky).
   * The panel's bottom follows whichever is higher on screen:
   *   - the bottom of the projects list (right column), or
   *   - viewport_bottom - FILTER_BOTTOM_GAP (the fixed screen-bottom gap).
   * Clamped between FILTER_MIN_HEIGHT and FILTER_MAX_HEIGHT. Snap, not animated.
   */
  useEffect(() => {
    const panel = filterPanelRef.current;
    const list = mainListRef.current;
    if (!panel || !list) return;

    let rafId: number | null = null;

    const update = () => {
      rafId = null;

      if (window.innerWidth < 1280) {
        panel.style.maxHeight = '';
        return;
      }

      const panelRect = panel.getBoundingClientRect();
      const listRect = list.getBoundingClientRect();
      const vh = window.innerHeight;

      const desiredBottomY = Math.min(vh - FILTER_BOTTOM_GAP, listRect.bottom);
      const available = desiredBottomY - panelRect.top;
      const height = Math.max(FILTER_MIN_HEIGHT, Math.min(FILTER_MAX_HEIGHT, available));

      panel.style.maxHeight = `${height}px`;
    };

    const schedule = () => {
      if (rafId === null) rafId = window.requestAnimationFrame(update);
    };

    schedule();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);

    const ro = new ResizeObserver(schedule);
    ro.observe(list);
    ro.observe(document.body);

    return () => {
      if (rafId !== null) window.cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      ro.disconnect();
    };
  }, [filtered.length]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="section py-16 md:py-20">
      <div className="xl:grid xl:grid-cols-[1fr_2.5fr] xl:gap-16 xl:items-start">
        {/* Sidebar — sticky TOC filter */}
        <aside className="xl:sticky xl:top-24">
          <PageHeader
            number="04"
            label="Work"
            title="Projects"
            description={`A collection of ${projects.length} projects across ${languages.length} technologies.`}
          />

          <nav aria-label="Filter by language" className="mb-12 xl:mb-0 animate-fade-up" style={{ animationDelay: '0.08s' }}>
            <div className="flex items-baseline justify-between mb-4 px-4">
              <SectionLabel>Filter by</SectionLabel>
              {filterLang && (
                <button
                  type="button"
                  onClick={() => setFilterLang(null)}
                  className="clear-link text-[11px] tracking-wider transition-colors"
                  style={{ color: 'var(--color-subtle)', fontFamily: 'var(--font-mono)' }}
                >
                  Clear
                </button>
              )}
            </div>

            <div ref={filterPanelRef} className="filter-panel">
              <ul className="flex flex-col">
                <li className="filter-item">
                  <button
                    type="button"
                    onClick={() => setFilterLang(null)}
                    aria-pressed={filterLang === null}
                    className={`toc-item w-full flex items-center justify-between text-left px-4 py-3 ${filterLang === null ? 'toc-item--active' : ''}`}
                    style={{ color: filterLang === null ? 'var(--color-ink)' : 'var(--color-muted)' }}
                  >
                    <span className="text-[13px]">All projects</span>
                    <span
                      className="text-[11px] tracking-wider"
                      style={{ color: 'var(--color-subtle)', fontFamily: 'var(--font-mono)' }}
                    >
                      {projects.length}
                    </span>
                  </button>
                </li>
                {sortedLanguages
                  .filter((l) => (languageCounts.get(l._id) ?? 0) > 0)
                  .map((lang) => {
                    const count = languageCounts.get(lang._id) ?? 0;
                    const isActive = filterLang === lang._id;
                    return (
                      <li key={lang._id} className="filter-item">
                        <button
                          type="button"
                          onClick={() => setFilterLang(isActive ? null : lang._id)}
                          aria-pressed={isActive}
                          className={`toc-item group w-full flex items-center gap-3 text-left px-4 py-3 ${isActive ? 'toc-item--active' : ''}`}
                          style={{ color: isActive ? 'var(--color-ink)' : 'var(--color-muted)' }}
                        >
                          <img
                            src={lang.icon}
                            alt=""
                            width={16}
                            height={16}
                            loading="lazy"
                            decoding="async"
                            className={`lang-icon ${isActive ? 'lang-icon--active' : ''}`}
                            style={{ width: 16, height: 16 }}
                          />
                          <span className="flex-1 text-[13px] truncate">{lang.name}</span>
                          <span
                            className="text-[11px] tracking-wider shrink-0"
                            style={{ color: 'var(--color-subtle)', fontFamily: 'var(--font-mono)' }}
                          >
                            {count}
                          </span>
                        </button>
                      </li>
                    );
                  })}
              </ul>
            </div>
          </nav>
        </aside>

        {/* Right: editorial list */}
        <main ref={mainListRef}>
          {filtered.length > 0 ? (
            <div>
              {filtered.map((proj, i) => (
                <Project
                  key={proj._id}
                  project={proj}
                  number={String(i + 1).padStart(2, '0')}
                />
              ))}
            </div>
          ) : (
            <p className="py-16 text-center" style={{ color: 'var(--color-subtle)' }}>
              No projects match this filter.
            </p>
          )}
        </main>
      </div>

      <style>{`
        .filter-panel {
          border: 1px solid var(--color-rule);
          border-radius: 12px;
          background: var(--color-surface);
          overflow-x: hidden;
          /* Hide scrollbar in Firefox and IE/Edge */
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        /* Hide scrollbar in WebKit */
        .filter-panel::-webkit-scrollbar {
          width: 0;
          height: 0;
          display: none;
        }

        .filter-item + .filter-item {
          border-top: 1px solid var(--color-rule);
        }

        .toc-item {
          position: relative;
          transition: background 180ms, color 180ms;
          cursor: pointer;
        }

        .toc-item:hover,
        .toc-item:focus-visible {
          color: var(--color-ink) !important;
          background: color-mix(in srgb, var(--color-ink) 3%, transparent);
        }

        .toc-item--active {
          background: color-mix(in srgb, var(--color-ink) 4%, transparent);
          box-shadow: inset 2px 0 0 var(--color-ink);
        }

        .clear-link:hover,
        .clear-link:focus-visible { color: var(--color-ink) !important; }

        /* Scrollable on xl+ where the sidebar is sticky.
           max-height reserves ~6rem at the bottom of the viewport so the panel
           never touches the screen edge — matching the 6rem (top-24) sticky
           offset at the top. Scrollbar stays hidden. */
        @media (min-width: 1280px) {
          .filter-panel {
            max-height: min(480px, calc(100vh - 30rem));
            overflow-y: auto;
          }
        }
      `}</style>
    </div>
  );
}
