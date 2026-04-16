'use client';

import { useAppContext } from '../components/AppContext';
import { ProficiencyDots, PROF_LABELS } from '../components/Language';
import LoadingSpinner from '../components/LoadingSpinner';
import PageHeader from '../components/PageHeader';
import SectionLabel from '../components/SectionLabel';
import Link from 'next/link';
import { MapPin, GraduationCap, Award } from 'lucide-react';

export default function AboutMePage() {
  const { languages, loading } = useAppContext();

  if (loading) return <LoadingSpinner />;

  const byProficiency = [4, 3, 2, 1]
    .map((level) => ({
      level,
      label: PROF_LABELS[level],
      langs: languages.filter((l) => l.proficiency === level),
    }))
    .filter((g) => g.langs.length > 0);

  return (
    <div className="section py-12 xl:grid xl:grid-cols-[1fr_3fr] xl:gap-12 xl:items-start">
      {/* Left: Sidebar */}
      <div className="xl:sticky xl:top-20">
        <PageHeader
          label="About"
          title="Remy Post"
          description="Full-stack developer passionate about building clean, functional web applications. I enjoy working across the entire stack — from database design to polished user interfaces."
        />
      </div>

      {/* Right: Content */}
      <div>
        {/* Bio cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          {/* Location */}
          <div className="icon-card p-5 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center gap-3 mb-2">
              <span className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                <MapPin size={16} strokeWidth={1.5} />
              </span>
              <SectionLabel as="span">Location</SectionLabel>
            </div>
            <p className="text-sm text-slate-600 pl-11">Ontario, Canada</p>
          </div>

          {/* Education */}
          <div className="icon-card p-5 animate-fade-up" style={{ animationDelay: '0.15s' }}>
            <div className="flex items-center gap-3 mb-2">
              <span className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                <GraduationCap size={16} strokeWidth={1.5} />
              </span>
              <SectionLabel as="span">Education</SectionLabel>
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
              <SectionLabel as="span">Certifications</SectionLabel>
            </div>
            <p className="text-xs text-slate-400 pl-11">Coming soon</p>
          </div>
        </div>

        {/* Skills by proficiency */}
        <SectionLabel as="h2" className="mb-6 animate-fade-up">
          Skills by proficiency
        </SectionLabel>

        <div className="flex flex-col gap-8">
          {byProficiency.map(({ level, label, langs }, gi) => (
            <div key={level} className="animate-fade-up" style={{ animationDelay: `${0.1 + gi * 0.08}s` }}>
              <div className="flex items-center gap-3 mb-3">
                <h3 className="text-sm font-semibold text-slate-700">{label}</h3>
                <ProficiencyDots level={level} showLabel={false} gap="gap-0.5" />
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
  );
}
