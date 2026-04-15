'use client';

import { useAppContext } from '../components/AppContext';
import Language from '../components/Language';
import { ILanguage } from '../../server/models/languages';
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

  if (loading) {
    return (
      <div className="section py-32 flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-slate-200 border-t-slate-600 rounded-full animate-spin" />
      </div>
    );
  }

  const filtered = activeFilter === 0
    ? languages
    : languages.filter((l) => l.proficiency === activeFilter);

  return (
    <div className="section py-12">
      {/* Header */}
      <div className="mb-10 animate-fade-up">
        <p className="text-[10px] font-semibold tracking-widest uppercase text-slate-400 mb-2">
          Technologies
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl text-slate-900 mb-3">Tech Stack</h1>
        <p className="text-slate-500 max-w-lg">
          The languages, frameworks, and tools I use to bring ideas to life.
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-8 animate-fade-up" style={{ animationDelay: '0.1s' }}>
        {PROF_FILTERS.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setActiveFilter(value)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide
              transition-all duration-200
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

      {/* Icon grid */}
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
  );
}
