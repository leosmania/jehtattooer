'use server'

import { supabase } from '@/lib/supabase'
import bcrypt from 'bcryptjs'
import { createSession } from '@/lib/session'
import { redirect } from 'next/navigation'

/**
 * Server Action: Login do admin
 * Valida email/senha, cria sessão JWT
 */

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  // Validação básica
  if (!email || !password) {
    return { error: 'Email e senha são obrigatórios' }
  }

  // Buscar admin user
  const { data: user, error: fetchError } = await supabase
    .from('admin_users')
    .select('id, email, password_hash')
    .eq('email', email)
    .single()

  if (fetchError || !user) {
    console.error('❌ Admin user não encontrado:', email)
    return { error: 'Credenciais inválidas' }
  }

  // Verificar senha
  const passwordValid = await bcrypt.compare(password, user.password_hash)

  if (!passwordValid) {
    console.warn('⚠️ Senha incorreta para:', email)
    return { error: 'Credenciais inválidas' }
  }

  // Criar sessão
  try {
    await createSession(user.id, user.email)
    console.log('✅ Admin logado:', user.email)
  } catch (error) {
    console.error('❌ Erro ao criar sessão:', error)
    return { error: 'Erro ao criar sessão' }
  }

  // Redirecionar para dashboard
  redirect('/admin/clientes')
}
