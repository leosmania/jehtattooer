import 'server-only'

import { createClient } from '@supabase/supabase-js'

/**
 * Supabase client com service_role key (server-side only)
 * Nunca expor essa chave ao cliente!
 *
 * Usa:
 * - NEXT_PUBLIC_SUPABASE_URL — public, seguro
 * - SUPABASE_SERVICE_ROLE_KEY — server-only, CRÍTICO, nunca enviar ao cliente
 */

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL')
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing env.SUPABASE_SERVICE_ROLE_KEY')
}

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
)
