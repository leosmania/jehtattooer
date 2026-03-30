'use server'

import { verifySession } from '@/lib/dal'
import { supabase } from '@/lib/supabase'

/**
 * Server Action: Atualizar status do cliente (Kanban drag & drop)
 * Chamada quando cliente é movido para outra coluna
 */

const VALID_STATUSES = ['novo_orcamento', 'em_consultoria', 'design_aprovado', 'agendado', 'finalizado', 'arquivado']

export async function updateClientStatusAction(clientId: string, newStatus: string): Promise<{
  success: boolean
  error?: string
}> {
  try {
    // Verificar autenticação
    await verifySession()

    // Validar status
    if (!VALID_STATUSES.includes(newStatus)) {
      return { success: false, error: 'Status inválido' }
    }

    // Atualizar no Supabase
    const { error } = await supabase
      .from('clients')
      .update({ status: newStatus })
      .eq('id', clientId)

    if (error) {
      console.error('Erro ao atualizar status:', error)
      return { success: false, error: 'Erro ao atualizar' }
    }

    console.log('✅ Status atualizado:', clientId, '→', newStatus)
    return { success: true }
  } catch (error) {
    console.error('❌ Erro ao atualizar status:', error)
    return { success: false, error: 'Erro ao processar' }
  }
}
