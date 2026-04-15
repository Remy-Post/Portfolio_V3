'use client';

import { useAppContext } from '../components/AppContext';
import { ILanguage } from '../../server/models/languages';
import Link from 'next/link';
import { MapPin, GraduationCap, Award } from 'lucide-react';

const PROF_LABELS = ['', 'Beginner', 'Intermediate', 'Advanced', 'Expert'];

export default function AboutMePage() {
  const { languages, loading } = useAppContext();

  if (loading) {
    return (
      <div className="section py-32 flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-slate-200 border-t-slate-600 rounded-full animate-spin" />
      </div>
    );
  }

  const byProficiency = [4, 3, 2, 1]
    .map((level) => ({
      level,
      label: PROF_LABELS[level],
      langs: languages.filter((l) => l.proficiency === level),
    }))
    .filter((g) => g.langs.length > 0);

  return (
    <div className="section py-12">
      {/* Header */}
      <div className="mb-14 animate-fade-up">
        <p className="text-[10px] font-semibold tracking-widest uppercase text-slate-400 mb-2">
          About
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl text-slate-900 mb-4">Remy Post</h1>
        <p className="text-lg text-slate-500 leading-relaxed max-w-2xl">
          Full-stack developer passionate about building clean, functional web applications.
          I enjoy working across the entire stack — from database design to polished user interfaces.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
        {/* Left: Bio cards */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          {/* Location */}
          <div className="icon-card p-5 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center gap-3 mb-2">
              <span className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                <MapPin size={16} strokeWidth={1.5} />
              </span>
              <span className="text-[10px] font-semibold tracking-widest uppercase text-slate-400">Location</span>
            </div>
            <p className="text-sm text-slate-600 pl-11">Ontario, Canada</p>
          </div>

          {/* Education */}
          <div className="icon-card p-5 animate-fade-up" style={{ animationDelay: '0.15s' }}>
            <div className="flex items-center gap-3 mb-2">
              <span className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                <GraduationCap size={16} strokeWidth={1.5} />
              </span>
              <span className="text-[10px] font-semibold tracking-widest uppercase text-slate-400">Education</span>
            </div>
            <p className="text-sm text-slate-600 pl-11">Computer Programming &amp; Analysis</p>
            <p className="text-xs text-slate-400 pl-11 mt-0.5">Details coming soon</p>
          </div>

          {/* Certifications */}
          <div className="icon-card p-5 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center gap-3 mb-2">
              <span className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                <Award size={16} strokeWidth={1.5} />
              </span>
              <span className="text-[10px] font-semibold tracking-widest uppercase text-slate-400">Certifications</span>
            </div>
            <p className="text-xs text-slate-400 pl-11">Coming soon</p>
          </div>
        </div>

        {/* Right: Skills by proficiency */}
        <div className="lg:col-span-2">
          <h2 className="text-[10px] font-semibold tracking-widest uppercase text-slate-400 mb-6 animate-fade-up">
            Skills by proficiency
          </h2>

          <div className="flex flex-col gap-8">
            {byProficiency.map(({ level, label, langs }, gi) => (
              <div key={level} className="animate-fade-up" style={{ animationDelay: `${0.1 + gi * 0.08}s` }}>
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-sm font-semibold text-slate-700">{label}</h3>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4].map((i) => (
                      <span key={i} className={`prof-dot ${i <= level ? 'prof-dot-filled' : 'prof-dot-empty'}`} />
                    ))}
                  </div>
                  <span className="text-xs text-slate-400">{langs.length}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {langs.map((lang) => (
                    <Link
                      key={lang._id}
                      href={`/techStack/${lang._id}`}
                      className="inline-flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl
                        bg-white border border-slate-100 text-sm text-slate-700 font-medium
                        hover:border-slate-300 hover:shadow-sm transition-all duration-200"
                    >
                      <img src={lang.icon} alt="" width={22} height={22} />
                      {lang.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
