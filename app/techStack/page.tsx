'use client';

import { useAppContext } from '../components/AppContext';
import Language from '../components/Language';
import { ILanguage } from '../../server/models/languages';
import LoadingSpinner from '../components/LoadingSpinner';
import PageHeader from '../components/PageHeader';
import { useState } from 'react';

const PROF_FILTERS = [
  { label: 'All', value: 0 },
  { label: 'Expert', value: 4 },
  { label: 'Advanced', value: 3 },
  { label: 'Intermediate', value: 2 },
  { label: 'Beginner', value: 1 },
];

export default function TechStackPage() {
  const { languages, loading } = useAppContext();
  const [activeFilter, setActiveFilter] = useState(0);

  if (loading) return <LoadingSpinner />;

  const filtered = activeFilter === 0
    ? languages
    : languages.filter((l) => l.proficiency === activeFilter);

  return (
    <div className="section py-12 xl:grid xl:grid-cols-[1fr_3fr] xl:gap-12 xl:items-start">
      {/* Left: Header + Filters */}
      <div className="xl:sticky xl:top-20">
        <PageHeader
          label="Technologies"
          title="Tech Stack"
          description="The languages, frameworks, and tools I use to bring ideas to life."
        />

        {/* Filter tabs */}
        <div className="flex flex-wrap xl:flex-col gap-2 mb-8 xl:mb-0 animate-fade-up" style={{ animationDelay: '0.1s' }}>
          {PROF_FILTERS.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setActiveFilter(value)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide
                transition-all duration-200 xl:w-full xl:text-left
                ${activeFilter === value
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700'
                }`}
            >
              {label}
              {value === 0 && (
                <span className="ml-1.5 text-[10px] opacity-60">{languages.length}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Right: Icon grid */}
      <div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filtered.map((lang, i) => (
            <div
              key={lang._id}
              className="animate-fade-up"
              style={{ animationDelay: `${0.04 * i}s` }}
            >
              <Language language={lang} size="lg" />
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-slate-400 py-16">No technologies at this level yet.</p>
        )}
      </div>
    </div>
  );
}
