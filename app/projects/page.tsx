
import { NOT_FOUND_PAGE } from "../components/NotFound";
import { IProject } from "../../server/models/project";

export const dynamic = 'force-dynamic';

async function getProjects() {
    const res: Response = await fetch(`${process.env.NEXT_CLIENT_API_URL}/api/v1/projects`);
    if (!res.ok) {
        return null;
    }
    const data = await res.json();
    return data as IProject[];
}

export default async function ProjectsPage() {
    const projects = await getProjects();

    if (!projects) {
        return <NOT_FOUND_PAGE errorMessage="No projects found" />;
    }
    return (
        <div>
            <h1>Projects</h1>
            <ul>
                {projects.map((project) => (
                    <li key={Math.random().toString()}>{project.name}</li>
                ))}
            </ul>
        </div>
    );
}