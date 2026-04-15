'use client';

import { useParams } from 'next/navigation';
import { useAppContext } from '../../components/AppContext';
import { ILanguage } from '../../../server/models/languages';
import { IProject } from '../../../server/models/project';
import Project from '../../components/Project';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const PROF_LABELS = ['', 'Beginner', 'Intermediate', 'Advanced', 'Expert'];

export default function TechStackDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { languages, projects: allProjects, loading } = useAppContext();

  if (loading) {
    return (
      <div className="section py-32 flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-slate-200 border-t-slate-600 rounded-full animate-spin" />
      </div>
    );
  }

  const language = languages.find((l) => l._id === id);
  if (!language) {
    return (
      <div className="section py-32 text-center">
        <p className="text-slate-400">Language not found.</p>
        <Link href="/techStack" className="text-sm text-slate-600 hover:text-slate-900 mt-4 inline-block">
          &larr; Back to Tech Stack
        </Link>
      </div>
    );
  }

  const languageProjects = allProjects.filter((p) =>
    (p.languages as ILanguage[]).some((l) => l._id === id)
  );
  const similar = language.similarLanguages || [];

  return (
    <div className="section py-12">
      {/* Back */}
      <Link
        href="/techStack"
        className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-700
          transition-colors mb-8"
      >
        <ArrowLeft size={14} />
        Tech Stack
      </Link>

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
              <h1 className="font-serif text-4xl text-slate-900 mb-2">{language.name}</h1>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4].map((i) => (
                    <span key={i} className={`prof-dot ${i <= language.proficiency ? 'prof-dot-filled' : 'prof-dot-empty'}`} />
                  ))}
                </div>
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
              <h2 className="text-[10px] font-semibold tracking-widest uppercase text-slate-400 mb-3">
                Related Technologies
              </h2>
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
            <h2 className="text-[10px] font-semibold tracking-widest uppercase text-slate-400 mb-4">
              Projects ({languageProjects.length})
            </h2>
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
