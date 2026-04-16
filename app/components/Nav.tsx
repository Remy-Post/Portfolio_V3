'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, User, Code2, Layers, FileText } from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Home',     href: '/',          Icon: Home },
  { label: 'About',    href: '/aboutMe',   Icon: User },
  { label: 'Stack',    href: '/techStack', Icon: Code2 },
  { label: 'Projects', href: '/projects',  Icon: Layers },
  { label: 'Resume',   href: '/resume',    Icon: FileText },
] as const;

function isActive(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Nav() {
  const pathname = usePathname() ?? '/';

  return (
    <header
      className="fixed top-0 inset-x-0 z-40 backdrop-blur-xl"
      style={{
        background: 'color-mix(in srgb, var(--color-bg) 82%, transparent)',
        borderBottom: '1px solid var(--color-rule)',
      }}
    >
      <nav
        aria-label="Primary"
        className="section h-14 flex items-center justify-between"
      >
        <Link
          href="/"
          aria-label="Remy Post — home"
          className="font-serif text-[1.75rem] leading-none tracking-tight"
          style={{ color: 'var(--color-ink)', fontStyle: 'italic', fontWeight: 500 }}
        >
          RP
        </Link>

        {/* Desktop: text-only with underline */}
        <ul className="hidden sm:flex items-center gap-7">
          {NAV_ITEMS.map(({ label, href }) => {
            const active = isActive(pathname, href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? 'page' : undefined}
                  className="relative inline-block py-1 text-[13px] font-medium tracking-wide transition-colors"
                  style={{
                    color: active ? 'var(--color-ink)' : 'var(--color-subtle)',
                  }}
                >
                  <span className="nav-label">{label}</span>
                  <span
                    aria-hidden="true"
                    className="nav-underline"
                    data-active={active ? 'true' : undefined}
                  />
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Mobile: compact icon row */}
        <ul className="flex sm:hidden items-center gap-1">
          {NAV_ITEMS.map(({ label, href, Icon }) => {
            const active = isActive(pathname, href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-label={label}
                  aria-current={active ? 'page' : undefined}
                  className="inline-flex items-center justify-center w-10 h-10 rounded-md transition-colors"
                  style={{
                    color: active ? 'var(--color-ink)' : 'var(--color-subtle)',
                    background: active ? 'color-mix(in srgb, var(--color-ink) 6%, transparent)' : 'transparent',
                  }}
                >
                  <Icon size={17} strokeWidth={1.6} aria-hidden="true" />
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <style>{`
        .nav-label { position: relative; }
        .nav-underline {
          position: absolute;
          left: 0;
          right: 0;
          bottom: -2px;
          height: 1px;
          background: var(--color-ink);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 320ms cubic-bezier(0.16, 1, 0.3, 1);
        }
        a:hover .nav-underline,
        a:focus-visible .nav-underline,
        .nav-underline[data-active='true'] {
          transform: scaleX(1);
        }
        @media (prefers-reduced-motion: reduce) {
          .nav-underline { transition: none; }
        }
      `}</style>
    </header>
  );
}
