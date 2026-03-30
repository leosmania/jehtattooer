'use server'

import { verifySession } from '@/lib/dal'
import { supabase } from '@/lib/supabase'
import { sendAnamnesisEmail } from '@/lib/email'

/**
 * Server Action: Gerar e enviar link de anamnese para o cliente
 * Chamada pela tatuadora quando fecha com o cliente
 */
export async function generateAnamnesisLinkAction(clientId: string): Promise<{
  success: boolean
  anamnesisUrl?: string
  email?: string
  error?: string
}> {
  try {
    await verifySession()

    // Buscar cliente
    const { data: clients, error: clientError } = await supabase
      .from('clients')
      .select('id, nome, email, anamnesis_token, anamnesis_link_sent, anamnesis_filled')
      .eq('id', clientId)

    if (clientError || !clients || clients.length === 0) {
      return { success: false, error: 'Cliente não encontrado' }
    }

    const client = clients[0]

    if (client.anamnesis_filled) {
      return { success: false, error: 'Cliente já preencheu a ficha de anamnese' }
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://jehtattooer.com.br'
    const anamnesisUrl = `${appUrl}/ficha-anamnese?token=${client.anamnesis_token}`

    // Marcar que o link foi enviado
    await supabase
      .from('clients')
      .update({ anamnesis_link_sent: true })
      .eq('id', clientId)

    // Enviar email
    const emailResult = await sendAnamnesisEmail({
      to: client.email,
      nome: client.nome,
      anamnesisUrl,
    })

    if (!emailResult.success) {
      console.warn('⚠️ Falha ao enviar email, mas link foi gerado')
    }

    console.log('✅ Link de anamnese gerado para:', client.email)

    return {
      success: true,
      anamnesisUrl,
      email: client.email,
    }
  } catch (error) {
    console.error('❌ Erro ao gerar link de anamnese:', error)
    return { success: false, error: 'Erro ao processar' }
  }
}
