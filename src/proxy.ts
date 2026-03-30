import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decrypt } from './lib/session'

/**
 * Proxy (Next.js 16 — substitui middleware.ts)
 * Protege rotas /admin/* com autenticação
 *
 * Nota: este é um arquivo de proxy, não de middleware!
 * Veja: https://nextjs.org/docs/app/api-reference/file-conventions/proxy
 */

const PUBLIC_ADMIN_ROUTES = ['/admin/login']
const ADMIN_PREFIX = '/admin'

export async function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname

  // Só proteger rotas /admin/*
  if (!pathname.startsWith(ADMIN_PREFIX)) {
    return NextResponse.next()
  }

  // Rotas públicas do admin não precisam de autenticação
  if (PUBLIC_ADMIN_ROUTES.includes(pathname)) {
    return NextResponse.next()
  }

  // Verificar sessão — check otimista, sem DB hit
  const sessionCookie = req.cookies.get('admin-session')?.value
  const session = await decrypt(sessionCookie)

  // Se não autenticado, redirecionar para login
  if (!session?.userId) {
    return NextResponse.redirect(new URL('/admin/login', req.url))
  }

  // Autenticado, permitir acesso
  return NextResponse.next()
}

/**
 * Config: aplicar proxy apenas a /admin/*
 * Isso melhora performance — não run em todas as rotas
 */
export const config = {
  matcher: '/admin/:path*',
}
