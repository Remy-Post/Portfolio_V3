'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useAppContext } from '../../providers';
import type { ILanguage } from '../../../server/models/languages';
import { ProficiencyDots, PROF_LABELS } from '../../components/Language';
import LoadingSpinner from '../../components/LoadingSpinner';
import NotFoundState from '../../components/NotFound';
import BackLink from '../../components/BackLink';
import SectionLabel from '../../components/SectionLabel';
import Project from '../../components/Project';
import Hairline from '../../components/Hairline';

export default function TechStackDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const { languages, projects: allProjects, loading } = useAppContext();

  if (loading) return <LoadingSpinner />;
  if (!id) return <NotFoundState message="Language not found." backHref="/techStack" backLabel="Tech Stack" />;

  const language = languages.find((l) => l._id === id);
  if (!language) return <NotFoundState message="Language not found." backHref="/techStack" backLabel="Tech Stack" />;

  const related = allProjects.filter((p) =>
    Array.isArray(p.languages)
      ? (p.languages as ILanguage[]).some((l) => l && typeof l === 'object' && '_id' in l && l._id === id)
      : false,
  );

  const similar = language.similarLanguages ?? [];

  return (
    <div className="section py-16 md:py-20">
      <BackLink href="/techStack">All technologies</BackLink>

      <div className="xl:grid xl:grid-cols-[2fr_3fr] xl:gap-16 xl:items-start">
        {/* Left */}
        <div>
          <SectionLabel className="mb-6 animate-fade-up">
            Technology
          </SectionLabel>

          <div className="flex items-start gap-5 md:gap-7 mb-10 animate-fade-up" style={{ animationDelay: '0.04s' }}>
            <div
              className="shrink-0 flex items-center justify-center"
              style={{
                width: 'clamp(68px, 8vw, 92px)',
                height: 'clamp(68px, 8vw, 92px)',
                border: '1px solid var(--color-rule)',
              }}
            >
              <img
                src={language.icon}
                alt=""
                width={48}
                height={48}
                decoding="async"
                className="lang-icon lang-icon--active"
                style={{ width: 'clamp(36px, 4vw, 52px)', height: 'clamp(36px, 4vw, 52px)' }}
              />
            </div>

            <div className="min-w-0">
              <h1
                className="font-serif leading-[0.95] tracking-[-0.02em] mb-3"
                style={{
                  color: 'var(--color-ink)',
                  fontSize: 'clamp(2.25rem, 6vw, 4rem)',
                  fontWeight: 400,
                }}
              >
                {language.name}
              </h1>
              <div className="flex items-center gap-3">
                <ProficiencyDots level={language.proficiency} showLabel={false} />
                <span
                  className="text-[11px] tracking-[0.18em] uppercase"
                  style={{ color: 'var(--color-subtle)', fontFamily: 'var(--font-mono)' }}
                >
                  {PROF_LABELS[language.proficiency] ?? ''}
                </span>
              </div>
            </div>
          </div>

          {language.description && (
            <p
              className="text-[16px] md:text-[17px] leading-relaxed max-w-[58ch] mb-10 animate-fade-up"
              style={{ color: 'var(--color-muted)', animationDelay: '0.12s' }}
            >
              {language.description}
            </p>
          )}

          {similar.length > 0 && (
            <div className="mb-14 xl:mb-0 animate-fade-up" style={{ animationDelay: '0.2s' }}>
              <SectionLabel className="mb-3">Related technologies</SectionLabel>
              <p className="text-[14px] leading-relaxed" style={{ color: 'var(--color-muted)' }}>
                {similar.map((name, i) => {
                  const match = languages.find((l) => l.name === name);
                  const isLast = i === similar.length - 1;
                  return (
                    <span key={name}>
                      {match ? (
                        <Link
                          href={`/techStack/${match._id}`}
                          className="inline-link"
                          style={{ color: 'var(--color-ink)', borderBottom: '1px solid var(--color-rule)' }}
                        >
                          {name}
                        </Link>
                      ) : (
                        <span style={{ color: 'var(--color-muted)' }}>{name}</span>
                      )}
                      {!isLast && <span style={{ color: 'var(--color-subtle)' }}>, </span>}
                    </span>
                  );
                })}
              </p>
            </div>
          )}
        </div>

        {/* Right: projects */}
        <div className="animate-fade-up" style={{ animationDelay: '0.24s' }}>
          <Hairline className="mb-8 xl:hidden" />
          <SectionLabel number={related.length > 0 ? String(related.length).padStart(2, '0') : undefined} className="mb-6">
            Projects using {language.name}
          </SectionLabel>

          {related.length > 0 ? (
            <div>
              {related.map((p, i) => (
                <Project key={p._id} project={p} number={String(i + 1).padStart(2, '0')} />
              ))}
            </div>
          ) : (
            <p className="py-8 text-[14px]" style={{ color: 'var(--color-subtle)' }}>
              No projects yet — check back soon.
            </p>
          )}
        </div>
      </div>

      <style>{`
        .inline-link { transition: border-color 200ms, color 200ms; }
        .inline-link:hover,
        .inline-link:focus-visible {
          border-bottom-color: var(--color-ink) !important;
        }
      `}</style>
    </div>
  );
}
