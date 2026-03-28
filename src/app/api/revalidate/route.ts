import { revalidatePath } from 'next/cache';

export async function POST(request: Request) {
  const secret = request.headers.get('x-sanity-webhook-secret');

  if (secret !== process.env.SANITY_WEBHOOK_SECRET) {
    return new Response('Invalid secret', { status: 401 });
  }

  try {
    // Revalidar todas as páginas
    revalidatePath('/', 'layout');

    return Response.json({ revalidated: true, now: Date.now() });
  } catch (err) {
    return Response.json(
      { message: 'Error revalidating', error: err },
      { status: 500 }
    );
  }
}
