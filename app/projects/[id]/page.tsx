import { IProject } from '../../../server/models/project';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

async function getProject(id: string): Promise< IProject | null> {
    const res: Response = await fetch(`${process.env.NEXT_CLIENT_API_URL}/api/v1/projects/${id}`);

    if (!res.ok) {
        return null;
    }

    return (await res.json()) as IProject;
}

export default async function ProjectPage({ params }: { params: { id: string } }) {
    const project = await getProject(params.id);

    if (!project) 
        return notFound();
    return (
        <>
            <p>Project Found</p>
            <p>{project.name}</p>
            <p>{project.description}</p>
            <p>{project.shortDescription}</p>
            <p>{project.url}</p>
            <p>{project.githubUrl}</p>
        </>
    );
}
