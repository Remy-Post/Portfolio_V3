'use client';
import Link from 'next/link';
import { Home, Layers } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Home',     href: '/',         Icon: Home },
  { label: 'Projects', href: '/projects', Icon: Layers },
];

export default function Nav() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white/95 backdrop-blur-md border-b border-zinc-200">
      <nav>
        <ul className="flex items-center gap-4">
          <Link href="/">
            <Home size={15} strokeWidth={1.75} />
            <span className="text-sm text-zinc-500 group-hover:text-zinc-900 transition-colors duration-200">Home</span>
          </Link>
          <Link href="/aboutMe">
            About Me
          </Link>
          <Link href="/techStack">
            Tech Stack
          </Link>
          <Link href="/projects">
            Projects
          </Link>
          <Link href="/resume">
            Resume
          </Link>
        </ul>
      </nav>
    </header>
  );
}
