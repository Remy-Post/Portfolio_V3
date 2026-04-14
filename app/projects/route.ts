export async function GET() {
    // make get req to fetch all games from express api.  read domain from env var
    const res: Response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/projects`);
    return Response.json(await res.json());
};

export async function POST(req: Request) {
    // read request body as json
    const body = await req.json();

    // get cookie w/jwt
    const cookieHeader: string = req.headers.get('cookie') || '';

    // call server api, passing cookie w/jwt to private method
    const res: Response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/projects`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Cookie': cookieHeader
        },
        body: JSON.stringify(body)
    });

    // api call fails
    if (!res.ok) {
        const errorText = await res.text();
        console.log(`API POST Error: ${errorText}`);
        return new Response(errorText, { status: res.status });
    }

    // api call succeeds and returns only 201 created
    return Response.json({ success: true });
}