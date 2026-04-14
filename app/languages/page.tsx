import { GET } from "../api/languages/route";
import { NOT_FOUND_PAGE } from "../components/NotFound";
import { ILanguage } from "../../server/models/languages";
import List from "../components/CRUD/List";


export const dynamic = 'force-dynamic';

async function getLanguages() {
    const res: Response = await GET();
    console.log(res);
    if (!res.ok) 
        return null;
    const data = await res.json();
    return data as ILanguage[];
}

export default async function LanguagesPage() {
    const languages = await getLanguages();
    if (!languages) 
        return <NOT_FOUND_PAGE errorMessage="No languages found" />;

    return (
        <div>
            <h1>Languages</h1>
            <List items={languages} basePath="/languages" />
        </div>
    );
}