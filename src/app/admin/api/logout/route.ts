import { deleteSession } from '@/lib/session'
import { redirect } from 'next/navigation'

/**
 * POST /admin/api/logout
 * Deleta a sessão e redireciona para login
 */

export async function POST() {
  await deleteSession()
  redirect('/admin/login')
}
