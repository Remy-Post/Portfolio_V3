'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { IProject } from '../server/models/project';
import type { ILanguage } from '../server/models/languages';

interface AppContextValue {
  languages: ILanguage[];
  projects: IProject[];
  loading: boolean;
  error: string | null;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [languages, setLanguages] = useState<ILanguage[]>([]);
  const [projects, setProjects] = useState<IProject[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchData() {
      try {
        const [langRes, projRes] = await Promise.all([
          fetch('/api/languages', { signal: controller.signal }),
          fetch('/api/projects', { signal: controller.signal }),
        ]);

        if (!langRes.ok) throw new Error(`Failed to fetch languages (${langRes.status})`);
        if (!projRes.ok) throw new Error(`Failed to fetch projects (${projRes.status})`);

        const [langData, projData] = await Promise.all([
          langRes.json() as Promise<ILanguage[]>,
          projRes.json() as Promise<IProject[]>,
        ]);

        setLanguages(Array.isArray(langData) ? langData : []);
        setProjects(Array.isArray(projData) ? projData : []);
      } catch (err) {
        if ((err as { name?: string }).name === 'AbortError') return;
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
    return () => controller.abort();
  }, []);

  return (
    <AppContext.Provider value={{ languages, projects, loading, error }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}
