import { draftMode } from 'next/headers';

export async function GET() {
  const draft = await draftMode();

  return Response.json({
    isDraftMode: draft.isEnabled,
  });
}
