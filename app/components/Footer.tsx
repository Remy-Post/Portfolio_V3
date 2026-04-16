import Link from 'next/link';
import { GitHubIcon, LinkedInIcon } from './icons';
import { Mail } from 'lucide-react';
import SectionLabel from './SectionLabel';

const NAV_LINKS = [
  { label: 'Home',      href: '/' },
  { label: 'About',     href: '/aboutMe' },
  { label: 'Stack',     href: '/techStack' },
  { label: 'Projects',  href: '/projects' },
  { label: 'Resume',    href: '/resume' },
];

const SOCIAL_LINKS = [
  { label: 'GitHub',   href: 'https://github.com/Remy-Post',             Icon: GitHubIcon,   external: true  },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/remy-post',    Icon: LinkedInIcon, external: true  },
  { label: 'Email',    href: 'mailto:remy.post.06@gmail.com',            Icon: Mail,         external: false },
];

export default function Footer() {
  return (
    <footer
      className="relative z-10"
      style={{
        borderTop: '1px solid var(--color-rule)',
        background: 'color-mix(in srgb, var(--color-bg) 94%, var(--color-ink) 2%)',
      }}
    >
      <div className="section py-14 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr] gap-10 md:gap-16">
          {/* Brand */}
          <div>
            <p
              className="font-serif text-3xl md:text-[2.25rem] leading-none tracking-tight mb-3"
              style={{ color: 'var(--color-ink)' }}
            >
              Remy Post
            </p>
            <p
              className="text-sm leading-relaxed max-w-[34ch]"
              style={{ color: 'var(--color-muted)' }}
            >
              Full-stack developer focused on MERN, TypeScript, and Next.js. Open to internships and co-ops.
            </p>
          </div>

          {/* Navigate */}
          <div>
            <SectionLabel className="mb-5">Navigate</SectionLabel>
            <ul className="flex flex-col gap-2">
              {NAV_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="footer-link inline-block text-sm transition-colors"
                    style={{ color: 'var(--color-muted)' }}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <SectionLabel className="mb-5">Connect</SectionLabel>
            <div className="flex items-center gap-2.5">
              {SOCIAL_LINKS.map(({ label, href, Icon, external }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="footer-social inline-flex items-center justify-center h-10 w-10 rounded-md transition-colors"
                  style={{
                    color: 'var(--color-muted)',
                    border: '1px solid var(--color-rule)',
                    background: 'transparent',
                  }}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <hr className="hairline my-10 md:my-12" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-[11px] tracking-[0.18em] uppercase" style={{ color: 'var(--color-subtle)', fontFamily: 'var(--font-mono)' }}>
            &copy; {new Date().getFullYear()} · Remy Post
          </p>
          <p className="text-[11px] tracking-[0.18em] uppercase" style={{ color: 'var(--color-subtle)', fontFamily: 'var(--font-mono)' }}>
            Next.js · Express · MongoDB
          </p>
        </div>
      </div>

      <style>{`
        .footer-link { position: relative; }
        .footer-link::after {
          content: '';
          position: absolute;
          left: 0; right: 0; bottom: -2px;
          height: 1px;
          background: var(--color-ink);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 300ms cubic-bezier(0.16,1,0.3,1);
        }
        .footer-link:hover { color: var(--color-ink) !important; }
        .footer-link:hover::after,
        .footer-link:focus-visible::after { transform: scaleX(1); }

        .footer-social:hover,
        .footer-social:focus-visible {
          color: var(--color-ink) !important;
          border-color: var(--color-ink) !important;
        }

        @media (prefers-reduced-motion: reduce) {
          .footer-link::after { transition: none; }
        }
      `}</style>
    </footer>
  );
}
