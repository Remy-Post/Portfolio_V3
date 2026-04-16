'use client';

import { useParams } from 'next/navigation';
import { useAppContext } from '../../components/AppContext';
import { ILanguage } from '../../../server/models/languages';
import { IProject } from '../../../server/models/project';
import Project from '../../components/Project';
import { ProficiencyDots, PROF_LABELS } from '../../components/Language';
import LoadingSpinner from '../../components/LoadingSpinner';
import NotFoundState from '../../components/NotFound';
import BackLink from '../../components/BackLink';
import SectionLabel from '../../components/SectionLabel';
import Link from 'next/link';

export default function TechStackDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { languages, projects: allProjects, loading } = useAppContext();

  if (loading) return <LoadingSpinner />;

  const language = languages.find((l) => l._id === id);
  if (!language) return <NotFoundState message="Language not found." backHref="/techStack" backLabel="Tech Stack" />;

  const languageProjects = allProjects.filter((p) =>
    (p.languages as ILanguage[]).some((l) => l._id === id)
  );
  const similar = language.similarLanguages || [];

  return (
    <div className="section py-12">
      <BackLink href="/techStack">Tech Stack</BackLink>

      <div className="xl:grid xl:grid-cols-[2fr_3fr] xl:gap-12 xl:items-start">
        {/* Left: Tech info */}
        <div>
          {/* Header */}
          <div className="flex items-start gap-6 mb-10 animate-fade-up">
            <div
              className="shrink-0 w-20 h-20 rounded-2xl border-2 flex items-center justify-center bg-white"
              style={{ borderColor: language.colour }}
            >
              <img src={language.icon} alt={language.name} width={48} height={48} />
            </div>
            <div>
              <h1 className="font-serif text-4xl sm:text-5xl text-slate-900 mb-2">{language.name}</h1>
              <div className="flex items-center gap-3">
                <ProficiencyDots level={language.proficiency} showLabel={false} />
                <span className="text-sm text-slate-500">{PROF_LABELS[language.proficiency]}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          {language.description && (
            <p className="text-slate-600 leading-relaxed max-w-2xl xl:max-w-none mb-10 animate-fade-up" style={{ animationDelay: '0.1s' }}>
              {language.description}
            </p>
          )}

          {/* Similar languages */}
          {similar.length > 0 && (
            <div className="mb-12 xl:mb-0 animate-fade-up" style={{ animationDelay: '0.15s' }}>
              <SectionLabel as="h2" className="mb-3">Related Technologies</SectionLabel>
              <div className="flex flex-wrap gap-2">
                {similar.map((name) => {
                  const match = languages.find((l) => l.name === name);
                  return match ? (
                    <Link
                      key={name}
                      href={`/techStack/${match._id}`}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg
                        bg-slate-50 border border-slate-100 text-sm text-slate-600 font-medium
                        hover:border-slate-300 hover:bg-white transition-all duration-150"
                    >
                      <img src={match.icon} alt="" width={16} height={16} />
                      {name}
                    </Link>
                  ) : (
                    <span
                      key={name}
                      className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-100 text-sm text-slate-400"
                    >
                      {name}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right: Projects */}
        {languageProjects.length > 0 && (
          <div className="animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <SectionLabel as="h2" className="mb-4">Projects ({languageProjects.length})</SectionLabel>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 gap-4">
              {languageProjects.map((proj) => (
                <Project key={proj._id} project={proj} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
