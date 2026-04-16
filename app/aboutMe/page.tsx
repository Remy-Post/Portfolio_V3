'use client';

import Link from 'next/link';
import { useAppContext } from '../providers';
import { PROF_LABELS } from '../components/Language';
import LoadingSpinner from '../components/LoadingSpinner';
import PageHeader from '../components/PageHeader';
import SectionLabel from '../components/SectionLabel';
import Hairline from '../components/Hairline';

const LEVELS = [4, 3, 2, 1] as const;

export default function AboutMePage() {
  const { languages, loading } = useAppContext();

  if (loading) return <LoadingSpinner />;

  const byProficiency = LEVELS.map((level) => ({
    level,
    label: PROF_LABELS[level],
    langs: languages.filter((l) => l.proficiency === level),
  })).filter((g) => g.langs.length > 0);

  return (
    <div className="section py-16 md:py-20">
      <div className="xl:grid xl:grid-cols-[1fr_2.5fr] xl:gap-16 xl:items-start">
        {/* Sidebar */}
        <aside className="xl:sticky xl:top-24">
          <PageHeader number="03" label="About" title="Remy Post" />
        </aside>

        {/* Essay + skills */}
        <main>
          {/* Essay */}
          <div className="max-w-[62ch] animate-fade-up" style={{ animationDelay: '0.08s' }}>
            <p
              className="font-serif text-[22px] md:text-[26px] leading-[1.35] mb-6"
              style={{ color: 'var(--color-ink)', fontWeight: 400 }}
            >
              Full-stack developer focused on the MERN stack, TypeScript, and Next.js — with a distinct preference for the backend.
            </p>
            <p className="text-[15px] md:text-[16px] leading-relaxed mb-5" style={{ color: 'var(--color-muted)' }}>
              I work across the stack — from Express APIs and MongoDB schema design to React interfaces — but my strongest work
              happens below the paint: request lifecycles, data models, and the quiet plumbing that keeps an application honest.
            </p>
            <p className="text-[15px] md:text-[16px] leading-relaxed" style={{ color: 'var(--color-muted)' }}>
              Currently in year two of a concurrent Honours BSc Computer Science at Lakehead University with a Computer
              Programmer Diploma at Georgian College. Open to internships and co-ops where I can ship real things alongside
              people who care about craft.
            </p>
          </div>

          {/* Margin notes — education + certifications */}
          <div className="mt-14 md:mt-20 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 max-w-[62ch] md:max-w-none">
            <div className="animate-fade-up" style={{ animationDelay: '0.15s' }}>
              <SectionLabel className="mb-4">Education</SectionLabel>
              <p className="font-serif text-[18px] md:text-[20px] mb-2" style={{ color: 'var(--color-ink)', fontWeight: 400 }}>
                Honours BSc Computer Science
              </p>
              <p className="text-[13px] mb-1" style={{ color: 'var(--color-muted)' }}>Lakehead University</p>
              <p className="font-serif text-[18px] md:text-[20px] mt-5 mb-2" style={{ color: 'var(--color-ink)', fontWeight: 400 }}>
                Computer Programmer Diploma
              </p>
              <p className="text-[13px] mb-1" style={{ color: 'var(--color-muted)' }}>Georgian College</p>
              <p
                className="text-[11px] tracking-[0.18em] uppercase mt-4"
                style={{ color: 'var(--color-subtle)', fontFamily: 'var(--font-mono)' }}
              >
                Year 2 · Started Sep 2024
              </p>
            </div>

            <div className="animate-fade-up" style={{ animationDelay: '0.2s' }}>
              <SectionLabel className="mb-4">Certifications</SectionLabel>
              <ul className="flex flex-col gap-3">
                <li>
                  <p className="font-serif text-[18px] md:text-[20px]" style={{ color: 'var(--color-ink)', fontWeight: 400 }}>
                    React — The Complete Guide 2025
                  </p>
                </li>
                <li>
                  <p className="font-serif text-[18px] md:text-[20px]" style={{ color: 'var(--color-ink)', fontWeight: 400 }}>
                    100 Days of Code — Python Pro Bootcamp
                  </p>
                </li>
              </ul>
              <p
                className="text-[11px] tracking-[0.18em] uppercase mt-4"
                style={{ color: 'var(--color-subtle)', fontFamily: 'var(--font-mono)' }}
              >
                Udemy
              </p>
            </div>
          </div>

          <Hairline className="my-14 md:my-20" />

          {/* Skills by proficiency — two-column clean list */}
          <div>
            <SectionLabel number={String(languages.length).padStart(2, '0')} className="mb-8 animate-fade-up">
              Skills by proficiency
            </SectionLabel>

            <div className="flex flex-col gap-10">
              {byProficiency.map(({ level, label, langs }, gi) => (
                <div
                  key={level}
                  className="grid grid-cols-[auto_1fr] gap-6 md:gap-10 animate-fade-up"
                  style={{ animationDelay: `${0.1 + gi * 0.08}s` }}
                >
                  <div className="min-w-[140px]">
                    <p
                      className="text-[11px] tracking-[0.2em] uppercase mb-2"
                      style={{ color: 'var(--color-subtle)', fontFamily: 'var(--font-mono)' }}
                    >
                      {label}
                    </p>
                    <p
                      className="font-serif text-[14px]"
                      style={{ color: 'var(--color-ink)', fontFamily: 'var(--font-mono)' }}
                    >
                      {String(langs.length).padStart(2, '0')} total
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                    {langs.map((lang) => (
                      <Link
                        key={lang._id}
                        href={`/techStack/${lang._id}`}
                        className="skill-link group inline-flex items-center gap-2.5 py-1.5 transition-colors"
                        style={{ color: 'var(--color-muted)' }}
                      >
                        <img
                          src={lang.icon}
                          alt=""
                          width={16}
                          height={16}
                          loading="lazy"
                          decoding="async"
                          className="lang-icon shrink-0"
                          style={{ width: 16, height: 16 }}
                        />
                        <span className="text-[14px]">{lang.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      <style>{`
        .skill-link:hover,
        .skill-link:focus-visible { color: var(--color-ink) !important; }
      `}</style>
    </div>
  );
}
