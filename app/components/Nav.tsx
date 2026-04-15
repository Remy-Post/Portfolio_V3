'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, User, Code2, Layers, FileText } from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Home',       href: '/',          Icon: Home },
  { label: 'About',      href: '/aboutMe',   Icon: User },
  { label: 'Stack',      href: '/techStack',  Icon: Code2 },
  { label: 'Projects',   href: '/projects',  Icon: Layers },
  { label: 'Resume',     href: '/resume',    Icon: FileText },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-100">
      <nav className="max-w-5xl xl:max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Monogram */}
        <Link href="/" className="font-serif text-2xl text-slate-900 tracking-tight leading-none">
          RP
        </Link>

        {/* Icon-first nav — labels revealed on hover */}
        <ul className="group flex items-center gap-2">
          {NAV_ITEMS.map(({ label, href, Icon }) => {
            const isActive = pathname === href
              || (href !== '/' && pathname.startsWith(href));

            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`flex flex-col items-center px-3 py-1.5 rounded-lg
                    transition-all duration-200
                    ${isActive
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-400 hover:text-slate-800 hover:bg-slate-50'
                    }`}
                >
                  <Icon size={17} strokeWidth={1.5} />
                  <span className="text-[9px] font-semibold tracking-wider uppercase
                    max-h-0 opacity-0 overflow-hidden
                    group-hover:max-h-4 group-hover:opacity-100 group-hover:mt-0.5
                    transition-all duration-300 ease-out">
                    {label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
