import { ILanguage } from "../../server/models/languages";
import Image from "next/image";

export default function Language({ language }: { language: ILanguage }) {
    return (
        <div>
            <img src={language.icon} alt={language.name} />
            <p>{language.description}</p>
        </div>
    );
}