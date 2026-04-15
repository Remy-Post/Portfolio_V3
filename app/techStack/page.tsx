'use client';
import { useAppContext } from '../components/AppContext';
import Language from '../components/language';
import { ILanguage } from '../../server/models/languages';

export default function TechStackPage() {
    const { languages }: { languages: ILanguage[] } = useAppContext();
    return (
        <>
            <h1>Tech Stack</h1>
            <br />
            <h3>My favorite technologies</h3>
            <ul>
                <li>

                </li>
                
            </ul>
            <br />
            <h3>List of technologies I use</h3>
            <ul>
                {languages.map((language) => (
                    <Language key={language._id} language={language} />
                ))}
            </ul>
        </>
    );
}

function Description({ title, description, icon = '', ...props}: { title: string, description: string, icon: string, props: any}) {
    return (
        <div {...props}>
            {icon && <img src={icon} alt={title} />}
            <h3>{title}</h3>
            <br />
            <p>{description}</p>
        </div>
    );
}