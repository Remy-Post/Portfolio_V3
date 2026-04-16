const API = process.env.NEXT_CLIENT_API_URL;

export async function GET() {
  const res = await fetch(`${API}/api/v1/projects`, { cache: 'no-store' });
  if (!res.ok) {
    const errorText = await res.text();
    return new Response(errorText, { status: res.status });
  }
  return Response.json(await res.json());
}

export async function POST(req: Request) {
  const body = await req.json();
  const cookieHeader = req.headers.get('cookie') ?? '';

  const res = await fetch(`${API}/api/v1/projects`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookieHeader,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error(`API POST /api/v1/projects failed: ${errorText}`);
    return new Response(errorText, { status: res.status });
  }

  return Response.json({ success: true });
}
