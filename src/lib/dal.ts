import 'server-only'

import { cache } from 'react'
import { readSession } from './session'
import { redirect } from 'next/navigation'

/**
 * Data Access Layer (DAL) para autorização
 *
 * Usado em:
 * - Server Components (layout, page)
 * - Server Actions
 *
 * React.cache() deduplica por request — se chamar 2x na mesma request,
 * só executa a lógica uma vez
 */

export const verifySession = cache(async () => {
  const session = await readSession()

  if (!session?.userId) {
    redirect('/admin/login')
  }

  return {
    userId: session.userId,
    email: session.email,
  }
})

/**
 * Para usar em Server Components:
 *
 * export default async function AdminLayout() {
 *   const session = await verifySession()  // redireciona se não autenticado
 *   return (
 *     <div>
 *       Bem-vindo, {session.email}
 *     </div>
 *   )
 * }
 *
 * Para usar em Server Actions:
 *
 * 'use server'
 * import { verifySession } from '@/lib/dal'
 *
 * export async function deleteClientAction(id: string) {
 *   await verifySession()  // dupla verificação de autorização
 *   // ... fazer a operação
 * }
 */
