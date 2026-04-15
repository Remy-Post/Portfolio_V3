import { ILanguage } from "../../server/models/languages";
import Link from "next/link";

const PROF_LABELS = ['', 'Beginner', 'Intermediate', 'Advanced', 'Expert'];

function ProficiencyDots({ level }: { level: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4].map((i) => (
        <span
          key={i}
          className={`prof-dot ${i <= level ? 'prof-dot-filled' : 'prof-dot-empty'}`}
        />
      ))}
      <span className="text-[10px] text-slate-400 ml-1.5 font-medium">
        {PROF_LABELS[level] || ''}
      </span>
    </div>
  );
}

/** Large icon card — used on Tech Stack page & Home */
export default function Language({ language, size = 'md' }: { language: ILanguage; size?: 'sm' | 'md' | 'lg' }) {
  const iconSizes = { sm: 28, md: 40, lg: 56 };
  const iconPx = iconSizes[size];

  return (
    <Link href={`/techStack/${language._id}`}>
      <div
        className="icon-card group relative flex flex-col items-center text-center p-5 gap-3 cursor-pointer"
        style={{ borderTopColor: language.colour, borderTopWidth: size === 'lg' ? 3 : 2 }}
      >
        <div className="relative">
          <img
            src={language.icon}
            alt={language.name}
            width={iconPx}
            height={iconPx}
            className="transition-transform duration-200 group-hover:scale-110"
          />
        </div>

        <div className="flex flex-col items-center gap-1.5">
          <span className="text-sm font-semibold text-slate-800 leading-tight">
            {language.name}
          </span>
          {size !== 'sm' && <ProficiencyDots level={language.proficiency} />}
        </div>

        {/* Project count badge */}
        {size !== 'sm' && language.projects && (
          <span className="text-[10px] text-slate-400 font-medium">
            {(language.projects as any[]).length} project{(language.projects as any[]).length !== 1 ? 's' : ''}
          </span>
        )}
      </div>
    </Link>
  );
}

/** Tiny inline icon badge — used inside project cards */
export function LanguageBadge({ language }: { language: ILanguage }) {
  return (
    <Link href={`/techStack/${language._id}`}>
      <span
        className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md
          bg-slate-50 border border-slate-100 text-xs text-slate-600 font-medium
          hover:border-slate-300 hover:bg-white transition-all duration-150"
      >
        <img src={language.icon} alt="" width={14} height={14} className="shrink-0" />
        {language.name}
      </span>
    </Link>
  );
}
