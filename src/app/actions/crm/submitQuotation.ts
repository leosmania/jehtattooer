'use server'

import { supabase } from '@/lib/supabase'
import { sendAnamnesisEmail } from '@/lib/email'

/**
 * Server Action: Submeter pedido de orçamento
 * Cria client + quotation_request + envia confirmação
 */

interface QuotationFormData {
  nome: string
  email: string
  whatsapp: string
  tipo_tatuagem: string
  local_corpo: string
  tamanho_estimado: string
  descricao: string
  budget_range: string
}

export async function submitQuotationAction(data: QuotationFormData): Promise<{
  success: boolean
  error?: string
  clientId?: string
}> {
  try {
    // Validação básica
    if (!data.nome || !data.email || !data.whatsapp || !data.tipo_tatuagem) {
      return { success: false, error: 'Campos obrigatórios não preenchidos' }
    }

    // 1. Criar cliente
    const { data: client, error: clientError } = await supabase
      .from('clients')
      .insert({
        nome: data.nome,
        email: data.email,
        whatsapp: data.whatsapp,
        status: 'novo_orcamento',
      })
      .select('id, anamnesis_token')
      .single()

    if (clientError || !client) {
      console.error('❌ Erro ao criar cliente:', clientError)
      return { success: false, error: 'Erro ao processar pedido' }
    }

    // 2. Criar quotation request
    const { error: quotationError } = await supabase
      .from('quotation_requests')
      .insert({
        client_id: client.id,
        tipo_tatuagem: data.tipo_tatuagem,
        local_corpo: data.local_corpo,
        tamanho_estimado: data.tamanho_estimado,
        descricao: data.descricao || null,
        budget_range: data.budget_range,
      })

    if (quotationError) {
      console.error('❌ Erro ao criar quotation:', quotationError)
      // Delete client se falhar a quotation
      await supabase.from('clients').delete().eq('id', client.id)
      return { success: false, error: 'Erro ao processar pedido' }
    }

    // 3. Enviar email de confirmação (opcional, falha silenciosamente)
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://jehtattooer.com.br'
    const emailResult = await sendAnamnesisEmail({
      to: data.email,
      nome: data.nome,
      anamnesisUrl: `${appUrl}/ficha-anamnese?token=${client.anamnesis_token}`,
    })

    if (!emailResult.success) {
      console.warn('⚠️ Falha ao enviar email, mas pedido foi criado')
    }

    console.log('✅ Pedido de orçamento criado:', client.id)

    return {
      success: true,
      clientId: client.id,
    }
  } catch (error) {
    console.error('❌ Erro inesperado:', error)
    return { success: false, error: 'Erro ao processar pedido' }
  }
}
