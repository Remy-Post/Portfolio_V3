import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { IProject } from '../../server/models/project';
import type { ILanguage } from '../../server/models/languages';
import { LanguageBadge } from './Language';

/**
 * Editorial index row — replaces the old card grid across Home, /projects, and /techStack/[id].
 * Large serif project name, hairline rule between entries, arrow slides on hover.
 * Numeral is optional (mono). Responsive: single column on mobile, two-line on tablet+, three-column grid on xl.
 */
export default function Project({
  project,
  number,
}: {
  project: IProject;
  number?: string;
}) {
  const languages = Array.isArray(project.languages) ? (project.languages as ILanguage[]) : [];
  const populatedLangs = languages.filter((l): l is ILanguage => typeof l === 'object' && l !== null && '_id' in l && 'name' in l);

  return (
    <article className="project-row group relative">
      <Link
        href={`/projects/${project._id}`}
        className="project-row-link block py-6 md:py-8"
        aria-label={`${project.name} — view project details`}
      >
        <div className="grid grid-cols-[auto_1fr_auto] md:grid-cols-[auto_2fr_3fr_auto] gap-4 md:gap-8 items-baseline">
          {/* Numeral */}
          {number && (
            <span
              aria-hidden="true"
              className="text-[11px] tracking-[0.15em] pt-2"
              style={{
                color: 'var(--color-subtle)',
                fontFamily: 'var(--font-mono)',
              }}
            >
              {number}
            </span>
          )}
          {!number && <span aria-hidden="true" />}

          {/* Title */}
          <h3
            className="font-serif leading-[1] tracking-[-0.01em]"
            style={{
              color: 'var(--color-ink)',
              fontSize: 'clamp(1.5rem, 3.5vw, 2.25rem)',
              fontWeight: 400,
            }}
          >
            {project.name}
          </h3>

          {/* Short description (hidden on mobile, inline on md+) */}
          <p
            className="hidden md:block text-[14px] leading-relaxed"
            style={{ color: 'var(--color-muted)' }}
          >
            {project.shortDescription}
          </p>

          {/* Arrow */}
          <span
            aria-hidden="true"
            className="project-arrow self-center"
            style={{ color: 'var(--color-subtle)' }}
          >
            <ArrowUpRight size={20} strokeWidth={1.4} />
          </span>
        </div>

        {/* Mobile description */}
        <p
          className="md:hidden mt-3 text-[13px] leading-relaxed max-w-[55ch]"
          style={{ color: 'var(--color-muted)' }}
        >
          {project.shortDescription}
        </p>

        {/* Language badges */}
        {populatedLangs.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4">
            {populatedLangs.map((lang) => (
              <LanguageBadge key={lang._id} language={lang} size="sm" />
            ))}
          </div>
        )}
      </Link>

      <style>{`
        .project-row { border-bottom: 1px solid var(--color-rule); }
        .project-row:first-child { border-top: 1px solid var(--color-rule); }
        .project-arrow {
          display: inline-flex;
          transition: transform 360ms cubic-bezier(0.16, 1, 0.3, 1), color 200ms;
        }
        .project-row:hover .project-arrow,
        .project-row:focus-within .project-arrow {
          transform: translate(4px, -4px);
          color: var(--color-ink);
        }
        .project-row:hover h3,
        .project-row:focus-within h3 {
          font-style: italic;
        }
        @media (prefers-reduced-motion: reduce) {
          .project-arrow { transition: color 200ms; }
          .project-row:hover .project-arrow,
          .project-row:focus-within .project-arrow { transform: none; }
        }
      `}</style>
    </article>
  );
}
