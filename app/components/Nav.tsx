'use client';
import Link from 'next/link';

export default function Nav() {
  return (
    <>
      <menu>
        <li><Link href="/">Home</Link></li>
        <li><Link href="/projects">Projects</Link></li>
      </menu>
    </>
  );
}