import type { Metadata, Viewport } from 'next';
import { Fraunces, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Nav from './components/Nav';
import Footer from './components/Footer';
import { AppProvider } from './providers';

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
  axes: ['SOFT', 'opsz'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Remy Post — Full-Stack Developer',
  description:
    'Remy Post — Year 2 CS student at Lakehead University building full-stack web apps with React, Next.js, Express, TypeScript, and MongoDB.',
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-family='serif' font-size='90'>R</text></svg>",
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#f6f2e9',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${fraunces.variable} ${jetbrainsMono.variable}`}>
      <body suppressHydrationWarning>
        <AppProvider>
          <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-[var(--color-ink)] focus:text-[var(--color-bg)] focus:px-3 focus:py-1.5 focus:text-xs">
            Skip to content
          </a>
          <Nav />
          <main id="main" className="pt-16 min-h-screen">
            {children}
          </main>
          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}
