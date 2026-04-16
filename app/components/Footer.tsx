import { Home, Layers, Mail } from 'lucide-react';
import { GitHubIcon, LinkedInIcon } from './icons';
import SectionLabel from './SectionLabel';

const NAV_LINKS = [
  { label: 'Home',     href: '/',         Icon: Home },
  { label: 'Projects', href: '/projects', Icon: Layers },
];

const SOCIAL_LINKS = [
  { label: 'GitHub',   href: 'https://github.com/Remy-Post',   Icon: GitHubIcon,   external: true  },
  { label: 'LinkedIn', href: 'https://linkedin.com',            Icon: LinkedInIcon, external: true  },
  { label: 'Email',    href: 'mailto:remy.post.06@gmail.com',   Icon: Mail,         external: false },
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-slate-50/60">
      <div className="max-w-5xl xl:max-w-7xl 3xl:max-w-[80%] mx-auto px-6 py-14">

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 items-start">

          {/* Brand */}
          <div>
            <p className="font-serif text-2xl text-slate-900 mb-2">Remy Post</p>
            <p className="text-sm text-slate-400 leading-relaxed max-w-[22ch]">
              Building thoughtful software, one line at a time.
            </p>
          </div>

          {/* Navigate */}
          <div>
            <SectionLabel className="mb-5">Navigate</SectionLabel>
            <ul className="flex flex-col gap-1">
              {NAV_LINKS.map(({ label, href, Icon }) => (
                <li key={href}>
                  <a href={href} className="group inline-flex items-center gap-3 py-1">
                    <span className="h-8 w-8 rounded-lg flex items-center justify-center
                      bg-white text-slate-400 border border-slate-100
                      group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-900
                      transition-all duration-200 shrink-0">
                      <Icon size={14} strokeWidth={1.75} />
                    </span>
                    <span className="text-sm text-slate-500 group-hover:text-slate-900 transition-colors duration-200">
                      {label}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <SectionLabel className="mb-5">Connect</SectionLabel>
            <div className="flex gap-2.5">
              {SOCIAL_LINKS.map(({ label, href, Icon, external }) => (
                <a
                  key={label}
                  href={href}
                  target={external ? '_blank' : undefined}
                  rel={external ? 'noopener noreferrer' : undefined}
                  aria-label={label}
                  className="h-10 w-10 rounded-xl flex items-center justify-center
                    bg-white text-slate-400 border border-slate-100
                    hover:bg-slate-900 hover:text-white hover:border-slate-900
                    transition-all duration-200"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-slate-400">&copy; {new Date().getFullYear()} Remy Post</p>
          <p className="text-xs text-slate-300">Next.js &middot; Express &middot; MongoDB</p>
        </div>
      </div>
    </footer>
  );
}
