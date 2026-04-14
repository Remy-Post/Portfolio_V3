export const dynamic = 'force-dynamic';

async function getProjects() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/projects`);
  const data = await res.json();
  return data;
}

export default function Home() {
  return (
    <div>
      <h1 className="text-2xl font-bold bg-blue-500">Home</h1>
    </div>
  );
}