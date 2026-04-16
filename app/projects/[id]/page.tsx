'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowUpRight } from 'lucide-react';
import { useAppContext } from '../../providers';
import type { ILanguage } from '../../../server/models/languages';
import LoadingSpinner from '../../components/LoadingSpinner';
import NotFoundState from '../../components/NotFound';
import BackLink from '../../components/BackLink';
import SectionLabel from '../../components/SectionLabel';
import Hairline from '../../components/Hairline';
import { GitHubIcon } from '../../components/icons';

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const { projects, loading } = useAppContext();

  if (loading) return <LoadingSpinner />;
  if (!id) return <NotFoundState message="Project not found." backHref="/projects" backLabel="Projects" />;

  const project = projects.find((p) => p._id === id);
  if (!project) return <NotFoundState message="Project not found." backHref="/projects" backLabel="Projects" />;

  const populatedLangs: ILanguage[] = Array.isArray(project.languages)
    ? (project.languages as ILanguage[]).filter((l): l is ILanguage => !!l && typeof l === 'object' && '_id' in l && 'name' in l)
    : [];

  return (
    <div className="section py-16 md:py-20">
      <BackLink href="/projects">All projects</BackLink>

      <article className="xl:grid xl:grid-cols-[3fr_2fr] xl:gap-16 xl:items-start">
        {/* Main */}
        <div>
          <SectionLabel number="·" className="mb-6 animate-fade-up">
            Project
          </SectionLabel>

          <h1
            className="font-serif leading-[0.95] tracking-[-0.02em] mb-8 animate-fade-up"
            style={{
              color: 'var(--color-ink)',
              fontSize: 'clamp(2.5rem, 7vw, 5rem)',
              fontWeight: 400,
            }}
          >
            {project.name}
          </h1>

          <p
            className="text-[17px] md:text-[18px] leading-relaxed max-w-[58ch] mb-10 animate-fade-up"
            style={{ color: 'var(--color-muted)', animationDelay: '0.08s' }}
          >
            {project.description}
          </p>

          <div
            className="flex flex-wrap items-center gap-3 mb-14 xl:mb-0 animate-fade-up"
            style={{ animationDelay: '0.14s' }}
          >
            {project.url && (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="detail-btn-primary inline-flex items-center gap-2 px-5 py-3 text-[13px] tracking-wide"
                style={{
                  border: '1px solid var(--color-ink)',
                  color: 'var(--color-ink)',
                  background: 'transparent',
                  fontWeight: 500,
                }}
              >
                Live site
                <ArrowUpRight size={14} strokeWidth={1.7} />
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="detail-btn-ghost inline-flex items-center gap-2 px-5 py-3 text-[13px] tracking-wide"
                style={{
                  border: '1px solid var(--color-rule)',
                  color: 'var(--color-muted)',
                  fontWeight: 500,
                }}
              >
                <GitHubIcon size={14} />
                Source
              </a>
            )}
          </div>
        </div>

        {/* Sidebar — Built with */}
        {populatedLangs.length > 0 && (
          <aside className="animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <Hairline className="mb-8 xl:hidden" />
            <SectionLabel className="mb-6">Built with</SectionLabel>
            <ul className="flex flex-col">
              {populatedLangs.map((lang) => (
                <li key={lang._id}>
                  <Link
                    href={`/techStack/${lang._id}`}
                    className="tech-link group flex items-center gap-3 py-3"
                    style={{ borderBottom: '1px solid var(--color-rule)', color: 'var(--color-muted)' }}
                  >
                    <img
                      src={lang.icon}
                      alt=""
                      width={18}
                      height={18}
                      loading="lazy"
                      decoding="async"
                      className="lang-icon"
                      style={{ width: 18, height: 18 }}
                    />
                    <span className="flex-1 text-[14px]">{lang.name}</span>
                    <ArrowUpRight size={14} strokeWidth={1.5} className="tech-arrow" style={{ color: 'var(--color-subtle)' }} />
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        )}
      </article>

      <style>{`
        .detail-btn-primary { transition: background 220ms, color 220ms; }
        .detail-btn-primary:hover,
        .detail-btn-primary:focus-visible {
          background: var(--color-ink);
          color: var(--color-bg);
        }
        .detail-btn-ghost:hover,
        .detail-btn-ghost:focus-visible {
          color: var(--color-ink);
          border-color: var(--color-ink);
        }
        .tech-link:hover,
        .tech-link:focus-visible { color: var(--color-ink) !important; }
        .tech-arrow { transition: transform 280ms cubic-bezier(0.16,1,0.3,1); }
        .tech-link:hover .tech-arrow,
        .tech-link:focus-visible .tech-arrow { transform: translate(3px, -3px); color: var(--color-ink) !important; }
        @media (prefers-reduced-motion: reduce) {
          .tech-arrow { transition: color 200ms; }
          .tech-link:hover .tech-arrow { transform: none; }
        }
      `}</style>
    </div>
  );
}
