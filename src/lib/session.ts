import 'server-only'

import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

/**
 * Session management com JWT usando jose
 * Funciona no Edge Runtime e Node.js
 * Cookie: HttpOnly, Secure, SameSite=Lax
 */

const secret = new TextEncoder().encode(
  process.env.SESSION_SECRET || 'development-secret-change-in-production'
)

export interface SessionPayload {
  userId: string
  email: string
}

/**
 * Encrypt: cria um JWT assinado
 */
export async function encrypt(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload as any)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret)
}

/**
 * Decrypt: verifica e decodifica um JWT
 * Retorna null se inválido ou expirado
 */
export async function decrypt(token?: string): Promise<SessionPayload | null> {
  if (!token) return null

  try {
    const verified = await jwtVerify(token, secret)
    return verified.payload as unknown as SessionPayload
  } catch (error) {
    // Token inválido, expirado, ou erro na verificação
    return null
  }
}

/**
 * Criar sessão: encrypt + set HttpOnly cookie
 */
export async function createSession(userId: string, email: string): Promise<void> {
  const token = await encrypt({ userId, email })
  const cookieStore = await cookies()

  cookieStore.set('admin-session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 dias
    path: '/',
  })
}

/**
 * Deletar sessão: remove o cookie
 */
export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete('admin-session')
}

/**
 * Read session do cookie
 */
export async function readSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin-session')?.value

  if (!token) return null

  return decrypt(token)
}
