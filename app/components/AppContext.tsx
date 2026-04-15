'use client';

// global var store using React's Context Hook for client components like forms
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { IProject } from '../../server/models/project';
import { ILanguage } from '../../server/models/languages';
import { Theme } from '../../util';


interface AppContextType {
    languages: ILanguage[];
    setLanguages: (languages: ILanguage[]) => void; 
    projects: IProject[];
    setProjects: (projects: IProject[]) => void;
    theme: Theme;
    setTheme: (theme: Theme) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    error: string | null;
    setError: (error: string | null) => void;
}

// create global container to hold these vars
const AppContext = createContext<AppContextType | undefined>(undefined);

// create global provider to wrap all components as children
interface AppProviderProps {
    children: ReactNode;
}

// make global
export function AppProvider({ children }: AppProviderProps) {
    const [languages, setLanguages] = useState<ILanguage[]>([]);
    const [projects, setProjects] = useState<IProject[]>([]);
    const [theme, setTheme] = useState<Theme>(Theme.Light);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const [languagesRes, projectsRes] = await Promise.all([
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/languages`),
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/projects`),
                ]);

                if (!languagesRes.ok) throw new Error('Failed to fetch languages');
                if (!projectsRes.ok) throw new Error('Failed to fetch projects');

                const [languagesData, projectsData] = await Promise.all([
                    languagesRes.json(),
                    projectsRes.json(),
                ]);

                setLanguages(languagesData);
                setProjects(projectsData);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        
        fetchData();
    }, []); // empty array = runs once on mount

    const value: AppContextType = {
        languages, setLanguages,
        projects, setProjects,
        theme, setTheme,
        loading, setLoading,
        error, setError,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

// hook to let children use this global context
export const useAppContext = () => {
    const context = useContext(AppContext);
     
    if (!context) throw new Error('Global context not found');
    return context;
}