import type { ILanguage } from '../../server/models/languages';
import Link from 'next/link';

export const PROF_LABELS = ['', 'Beginner', 'Intermediate', 'Advanced', 'Expert'] as const;

function projectCount(projects: ILanguage['projects']): number {
  return Array.isArray(projects) ? projects.length : 0;
}

export function ProficiencyDots({
  level,
  showLabel = true,
  gap = 'gap-1',
}: {
  level: number;
  showLabel?: boolean;
  gap?: string;
}) {
  return (
    <div className={`inline-flex items-center ${gap}`} aria-label={`Proficiency: ${PROF_LABELS[level] ?? 'Unknown'}`}>
      {[1, 2, 3, 4].map((i) => (
        <span
          key={i}
          aria-hidden="true"
          className={`prof-dot ${i <= level ? 'prof-dot-filled' : 'prof-dot-empty'}`}
        />
      ))}
      {showLabel && (
        <span
          className="ml-1.5 text-[10px] tracking-wide"
          style={{ color: 'var(--color-subtle)', fontFamily: 'var(--font-mono)' }}
        >
          {PROF_LABELS[level] ?? ''}
        </span>
      )}
    </div>
  );
}

/**
 * Language icon tile — grayscale at rest, saturates on hover / focus / active.
 * Used on Home (sm), Tech Stack index (lg), and anywhere a language needs presence.
 */
export default function Language({
  language,
  size = 'md',
  active = false,
}: {
  language: ILanguage;
  size?: 'sm' | 'md' | 'lg';
  active?: boolean;
}) {
  const iconPx = { sm: 32, md: 44, lg: 56 }[size];
  const padY = { sm: 'py-5', md: 'py-6', lg: 'py-8' }[size];
  const count = projectCount(language.projects);

  return (
    <Link
      href={`/techStack/${language._id}`}
      className={`group block relative ${padY} px-3 text-center transition-colors`}
      style={{
        borderBottom: '1px solid var(--color-rule)',
      }}
      aria-label={`${language.name} — ${PROF_LABELS[language.proficiency] ?? 'skill'}`}
    >
      <div className="flex flex-col items-center gap-3">
        <img
          src={language.icon}
          alt=""
          width={iconPx}
          height={iconPx}
          loading="lazy"
          decoding="async"
          className={`lang-icon ${active ? 'lang-icon--active' : ''}`}
          style={{ width: iconPx, height: iconPx }}
        />

        <div className="flex flex-col items-center gap-1.5">
          <span
            className="text-[13px] md:text-sm font-medium leading-tight transition-colors"
            style={{ color: 'var(--color-muted)' }}
          >
            {language.name}
          </span>

          {size !== 'sm' && (
            <ProficiencyDots level={language.proficiency} showLabel={false} />
          )}

          {size !== 'sm' && count > 0 && (
            <span
              className="text-[10px] tracking-wider uppercase"
              style={{ color: 'var(--color-subtle)', fontFamily: 'var(--font-mono)' }}
            >
              {count} {count === 1 ? 'project' : 'projects'}
            </span>
          )}
        </div>
      </div>

      <style>{`
        .group:hover span,
        .group:focus-visible span {
          color: var(--color-ink);
        }
      `}</style>
    </Link>
  );
}

/**
 * Inline language badge for use inside project rows and meta lists.
 * Grayscale-at-rest, saturates on hover.
 */
export function LanguageBadge({
  language,
  size = 'md',
}: {
  language: ILanguage;
  size?: 'sm' | 'md';
}) {
  const iconPx = size === 'sm' ? 14 : 16;
  return (
    <Link
      href={`/techStack/${language._id}`}
      className="badge group inline-flex items-center gap-1.5 px-2 py-1 rounded-sm transition-colors"
      style={{
        border: '1px solid var(--color-rule)',
        color: 'var(--color-muted)',
        fontFamily: 'var(--font-mono)',
        fontSize: size === 'sm' ? '10px' : '11px',
        letterSpacing: '0.04em',
        background: 'transparent',
      }}
    >
      <img
        src={language.icon}
        alt=""
        width={iconPx}
        height={iconPx}
        loading="lazy"
        decoding="async"
        className="lang-icon shrink-0"
        style={{ width: iconPx, height: iconPx }}
      />
      <span>{language.name}</span>

      <style>{`
        .badge:hover,
        .badge:focus-visible {
          color: var(--color-ink) !important;
          border-color: var(--color-ink) !important;
        }
      `}</style>
    </Link>
  );
}
