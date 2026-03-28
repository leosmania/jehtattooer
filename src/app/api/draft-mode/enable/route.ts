import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');

  // Validar secret
  if (secret !== process.env.SANITY_DRAFT_SECRET) {
    return new Response('Invalid secret', { status: 401 });
  }

  // Ativar Draft Mode
  const draft = await draftMode();
  draft.enable();

  // Redirecionar para home
  redirect('/');
}
