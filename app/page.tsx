'use client';

import { useAppContext } from './components/AppContext';
import { ILanguage } from '../server/models/languages';
import { IProject } from '../server/models/project';
import Language from './components/Language';
import Project from './components/Project';
import Link from 'next/link';
import { ArrowRight, Download } from 'lucide-react';

export default function Home() {
  const { languages, projects, loading } = useAppContext();

  if (loading) {
    return (
      <div className="section py-32 flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-slate-200 border-t-slate-600 rounded-full animate-spin" />
      </div>
    );
  }

  const featured = [...projects]
    .sort((a, b) => (b.languages as any[]).length - (a.languages as any[]).length)
    .slice(0, 6);

  return (
    <>
      {/* ═══════ ROW 1: HERO + TECH STACK ═══════ */}
      <div className="section-row xl:grid-cols-[2fr_3fr] xl:pt-20 xl:pb-16">
        {/* Hero */}
        <section className="section xl:max-w-none xl:mx-0 xl:px-0 pt-20 pb-16 xl:pt-0 xl:pb-0">
          <div className="max-w-2xl xl:max-w-none">
            <p
              className="text-sm font-semibold tracking-widest uppercase text-slate-400 mb-4 animate-fade-up"
            >
              Full-Stack Developer
            </p>
            <h1
              className="font-serif text-6xl sm:text-7xl text-slate-900 leading-[0.95] mb-6 animate-fade-up"
              style={{ animationDelay: '0.08s' }}
            >
              Remy Post
            </h1>
            <p
              className="text-lg text-slate-500 leading-relaxed max-w-lg mb-8 animate-fade-up"
              style={{ animationDelay: '0.16s' }}
            >
              I build full-stack applications with modern tools.
              Clean code, thoughtful design, real results.
            </p>

            <div
              className="flex items-center gap-3 animate-fade-up"
              style={{ animationDelay: '0.24s' }}
            >
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg
                  bg-slate-900 text-white text-sm font-medium
                  hover:bg-slate-800 transition-colors duration-200"
              >
                View Projects
                <ArrowRight size={14} />
              </Link>
              <Link
                href="/resume"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg
                  border border-slate-200 text-sm font-medium text-slate-600
                  hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
              >
                <Download size={14} />
                Resume
              </Link>
            </div>
          </div>
        </section>

        {/* Tech Stack */}
        <section className="bg-slate-50/60 border-y border-slate-100 xl:border-0 xl:bg-transparent">
          <div className="section xl:max-w-none xl:mx-0 xl:px-0 py-16 xl:py-0">
            <div className="xl:rounded-2xl xl:bg-slate-50/60 xl:border xl:border-slate-100 xl:p-8">
              <div className="flex items-end justify-between mb-8">
                <div>
                  <p className="text-[10px] font-semibold tracking-widest uppercase text-slate-400 mb-2">
                    Technologies
                  </p>
                  <h2 className="font-serif text-3xl text-slate-900">What I work with</h2>
                </div>
                <Link
                  href="/techStack"
                  className="text-sm text-slate-400 hover:text-slate-700 transition-colors flex items-center gap-1"
                >
                  View all <ArrowRight size={13} />
                </Link>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-4 gap-3">
                {languages.map((lang, i) => (
                  <div
                    key={lang._id}
                    className="animate-fade-up"
                    style={{ animationDelay: `${0.04 * i}s` }}
                  >
                    <Language language={lang} size="sm" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ═══════ ROW 2: FEATURED PROJECTS + CONTACT CTA ═══════ */}
      <div className="section-row xl:grid-cols-[3fr_2fr] xl:py-16">
        {/* Featured Projects */}
        <section className="section xl:max-w-none xl:mx-0 xl:px-0 py-16 xl:py-0">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-[10px] font-semibold tracking-widest uppercase text-slate-400 mb-2">
                Work
              </p>
              <h2 className="font-serif text-3xl text-slate-900">Featured projects</h2>
            </div>
            <Link
              href="/projects"
              className="text-sm text-slate-400 hover:text-slate-700 transition-colors flex items-center gap-1"
            >
              View all <ArrowRight size={13} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 gap-4">
            {featured.map((proj) => (
              <Project key={proj._id} project={proj} />
            ))}
          </div>
        </section>

        {/* Contact CTA */}
        <section className="bg-slate-50/60 border-t border-slate-100 xl:border-0 xl:bg-transparent">
          <div className="section xl:max-w-none xl:mx-0 xl:px-0 py-20 xl:py-0 text-center xl:text-left">
            <div className="xl:rounded-2xl xl:bg-slate-50/60 xl:border xl:border-slate-100 xl:p-10 xl:flex xl:flex-col xl:justify-center xl:h-full xl:min-h-[320px]">
              <p className="text-[10px] font-semibold tracking-widest uppercase text-slate-400 mb-3">
                Get in touch
              </p>
              <h2 className="font-serif text-3xl text-slate-900 mb-3">
                Let&apos;s work together
              </h2>
              <p className="text-slate-500 text-sm mb-8 max-w-md mx-auto xl:mx-0">
                Open to opportunities, collaborations, and interesting conversations.
              </p>
              <div>
                <a
                  href="mailto:remy.post.06@gmail.com"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg
                    bg-slate-900 text-white text-sm font-medium
                    hover:bg-slate-800 transition-colors duration-200"
                >
                  Say hello
                  <ArrowRight size={14} />
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
