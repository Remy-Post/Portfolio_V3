'use client';

import { useAppContext } from '../components/AppContext';
import { IProject } from '../../server/models/project';
import { ILanguage } from '../../server/models/languages';
import Project from '../components/Project';
import { useState } from 'react';

export default function ProjectsPage() {
  const { projects, languages, loading } = useAppContext();
  const [filterLang, setFilterLang] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="section py-32 flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-slate-200 border-t-slate-600 rounded-full animate-spin" />
      </div>
    );
  }

  const filtered = filterLang
    ? projects.filter((p) =>
        (p.languages as ILanguage[]).some((l) => l._id === filterLang)
      )
    : projects;

  return (
    <div className="section py-12 xl:grid xl:grid-cols-[1fr_3fr] xl:gap-12 xl:items-start">
      {/* Left: Header + Filters */}
      <div className="xl:sticky xl:top-20">
        <div className="mb-10 xl:mb-6 animate-fade-up">
          <p className="text-[10px] font-semibold tracking-widest uppercase text-slate-400 mb-2">
            Work
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl text-slate-900 mb-3">Projects</h1>
          <p className="text-slate-500 max-w-lg xl:max-w-none">
            A collection of {projects.length} projects across {languages.length} technologies.
          </p>
        </div>

        {/* Language icon filter bar */}
        <div className="flex flex-wrap xl:flex-col items-center xl:items-stretch gap-2 mb-8 xl:mb-0 animate-fade-up" style={{ animationDelay: '0.1s' }}>
          <button
            onClick={() => setFilterLang(null)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide
              transition-all duration-200 xl:w-full xl:text-left
              ${!filterLang
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              }`}
          >
            All <span className="ml-1 text-[10px] opacity-60">{projects.length}</span>
          </button>

          {languages
            .sort((a, b) => (b.projects as any[]).length - (a.projects as any[]).length)
            .slice(0, 12)
            .map((lang) => (
              <button
                key={lang._id}
                onClick={() => setFilterLang(filterLang === lang._id ? null : lang._id)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium
                  transition-all duration-200 xl:w-full
                  ${filterLang === lang._id
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-50 text-slate-500 border border-slate-100 hover:border-slate-300'
                  }`}
              >
                <img src={lang.icon} alt="" width={14} height={14} className={filterLang === lang._id ? 'brightness-200' : ''} />
                <span className="hidden sm:inline">{lang.name}</span>
              </button>
            ))}
        </div>
      </div>

      {/* Right: Project grid */}
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((proj, i) => (
            <div
              key={proj._id}
              className="animate-fade-up"
              style={{ animationDelay: `${0.03 * Math.min(i, 12)}s` }}
            >
              <Project project={proj} />
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-slate-400 py-16">No projects match this filter.</p>
        )}
      </div>
    </div>
  );
}
