import { IProject } from "@/server/models/project";
import { ILanguage } from "@/server/models/languages";
import { LanguageBadge } from "./Language";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { GitHubIcon } from "./icons";

export default function Project({ project }: { project: IProject }) {
  const languages = project.languages as ILanguage[];

  return (
    <article className="icon-card group p-5 flex flex-col gap-4 h-full">
      {/* Header — title is the link to the detail page */}
      <div className="flex items-start justify-between gap-3">
        <Link href={`/projects/${project._id}`}>
          <h3 className="text-base font-semibold text-slate-900 leading-snug hover:text-slate-600 transition-colors cursor-pointer">
            {project.name}
          </h3>
        </Link>
        <div className="flex items-center gap-1.5 shrink-0">
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="h-7 w-7 rounded-md flex items-center justify-center
              text-slate-300 hover:text-slate-800 hover:bg-slate-100
              transition-all duration-150"
            aria-label="GitHub"
          >
            <GitHubIcon size={14} />
          </a>
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="h-7 w-7 rounded-md flex items-center justify-center
              text-slate-300 hover:text-slate-800 hover:bg-slate-100
              transition-all duration-150"
            aria-label="Live site"
          >
            <ExternalLink size={14} strokeWidth={1.5} />
          </a>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">
        {project.shortDescription}
      </p>

      {/* Language badges */}
      {languages.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
          {languages.map((lang) => (
            <LanguageBadge key={lang._id} language={lang} />
          ))}
        </div>
      )}
    </article>
  );
}
