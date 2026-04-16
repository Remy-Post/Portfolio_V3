'use client';

import { useParams } from 'next/navigation';
import { useAppContext } from '../../components/AppContext';
import { IProject } from '../../../server/models/project';
import { ILanguage } from '../../../server/models/languages';
import { LanguageBadge } from '../../components/Language';
import LoadingSpinner from '../../components/LoadingSpinner';
import NotFoundState from '../../components/NotFound';
import BackLink from '../../components/BackLink';
import SectionLabel from '../../components/SectionLabel';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { GitHubIcon } from '../../components/icons';

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { projects, loading } = useAppContext();

  if (loading) return <LoadingSpinner />;

  const project = projects.find((p) => p._id === id);
  if (!project) return <NotFoundState message="Project not found." backHref="/projects" backLabel="Projects" />;

  const languages = (project.languages || []) as ILanguage[];

  return (
    <div className="section py-12 max-w-3xl xl:max-w-none">
      <BackLink href="/projects">Projects</BackLink>

      <div className="xl:grid xl:grid-cols-[3fr_2fr] xl:gap-12 xl:items-start">
        {/* Left: Project info */}
        <div>
          {/* Header */}
          <div className="animate-fade-up">
            <h1 className="font-serif text-4xl sm:text-5xl text-slate-900 mb-4">{project.name}</h1>
            <p className="text-lg text-slate-500 leading-relaxed mb-6">{project.description}</p>
          </div>

          {/* Links */}
          <div className="flex items-center gap-3 mb-10 xl:mb-0 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg
                bg-slate-900 text-white text-sm font-medium
                hover:bg-slate-800 transition-colors duration-200"
            >
              <GitHubIcon size={15} />
              View Source
            </a>
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg
                border border-slate-200 text-sm font-medium text-slate-600
                hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
            >
              <ExternalLink size={15} strokeWidth={1.5} />
              Live Site
            </a>
          </div>
        </div>

        {/* Right: Languages panel */}
        {languages.length > 0 && (
          <div className="animate-fade-up xl:rounded-2xl xl:bg-slate-50/60 xl:border xl:border-slate-100 xl:p-8" style={{ animationDelay: '0.15s' }}>
            <SectionLabel as="h2" className="mb-3">Built with</SectionLabel>
            <div className="flex flex-wrap gap-2">
              {languages.map((lang) => (
                <Link
                  key={lang._id}
                  href={`/techStack/${lang._id}`}
                  className="inline-flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl
                    bg-white border border-slate-100 text-sm text-slate-700 font-medium
                    hover:border-slate-300 hover:shadow-sm transition-all duration-200"
                >
                  <img src={lang.icon} alt="" width={20} height={20} />
                  {lang.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
