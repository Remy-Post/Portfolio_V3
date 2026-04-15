'use client';

import './globals.css';
import Nav from './components/Nav';
import Footer from './components/Footer';
import { AppProvider } from './components/AppContext';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <AppProvider>
          <Nav />
          <main className="pt-16">
            {children}
          </main>
          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}