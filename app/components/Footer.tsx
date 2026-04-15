import { Home, Layers, Mail } from 'lucide-react';

function GitHubIcon({ size = 18 }: { size?: number; strokeWidth?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.373 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.562 21.8 24 17.302 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function LinkedInIcon({ size = 18 }: { size?: number; strokeWidth?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

const NAV_LINKS = [
  { label: 'Home',     href: '/',         Icon: Home },
  { label: 'Projects', href: '/projects', Icon: Layers },
];

const SOCIAL_LINKS = [
  { label: 'GitHub',   href: 'https://github.com',           Icon: GitHubIcon,   external: true  },
  { label: 'LinkedIn', href: 'https://linkedin.com',          Icon: LinkedInIcon, external: true  },
  { label: 'Email',    href: 'mailto:contact@example.com',    Icon: Mail,         external: false },
];

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white">
      <div className="max-w-5xl mx-auto px-6 py-12">

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 items-start">

          {/* Brand */}
          <div>
            <p className="font-serif text-xl text-zinc-900 mb-2">Your Name</p>
            <p className="text-sm text-zinc-400 leading-relaxed max-w-[18ch]">
              Building thoughtful software, one line at a time.
            </p>
          </div>

          {/* Icon + label nav pairs */}
          <div>
            <p className="text-[10px] font-medium tracking-widest uppercase text-zinc-400 mb-5">
              Navigate
            </p>
            <ul className="flex flex-col gap-1">
              {NAV_LINKS.map(({ label, href, Icon }) => (
                <li key={href}>
                  <a
                    href={href}
                    className="group inline-flex items-center gap-3 py-1"
                  >
                    <span className="h-8 w-8 rounded-lg flex items-center justify-center
                      bg-zinc-100 text-zinc-500
                      group-hover:bg-zinc-900 group-hover:text-white
                      transition-all duration-200 shrink-0">
                      <Icon size={15} strokeWidth={1.75} />
                    </span>
                    <span className="text-sm text-zinc-500 group-hover:text-zinc-900 transition-colors duration-200">
                      {label}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social icon circles */}
          <div>
            <p className="text-[10px] font-medium tracking-widest uppercase text-zinc-400 mb-5">
              Connect
            </p>
            <div className="flex gap-2.5">
              {SOCIAL_LINKS.map(({ label, href, Icon, external }) => (
                <a
                  key={label}
                  href={href}
                  target={external ? '_blank' : undefined}
                  rel={external ? 'noopener noreferrer' : undefined}
                  aria-label={label}
                  className="h-11 w-11 rounded-xl flex items-center justify-center
                    bg-zinc-100 text-zinc-500
                    hover:bg-zinc-900 hover:text-white
                    transition-all duration-200"
                >
                  <Icon size={18} strokeWidth={1.75} />
                </a>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-zinc-400">© 2026 Your Name. All rights reserved.</p>
          <p className="text-xs text-zinc-300">Built with Next.js & Tailwind CSS</p>
        </div>

      </div>
    </footer>
  );
}
