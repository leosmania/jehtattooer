'use server'

import { supabase } from '@/lib/supabase'

export interface AnamnesisData {
  // Dados complementares (mínimos necessários para saúde)
  data_nascimento: string
  profissao: string
  // Condições de saúde
  condicoes_saude: string       // valores separados por vírgula
  condicoes_pele: string        // valores separados por vírgula
  pressao_arterial: string
  // Alergias
  historico_alergias: string    // valores separados por vírgula
  alergias: string              // descrição livre
  // Estado atual
  gestante: boolean
  uso_alcool_drogas: boolean
  em_tratamento: boolean
  medicamentos: string          // quais medicamentos
  // Extras
  experiencias_tatuagem: string
  outras_informacoes: string
  // Consentimento
  aceita_termos: boolean
}

export async function submitAnamnesisAction(
  token: string,
  data: AnamnesisData
): Promise<{ success: boolean; error?: string }> {
  try {
    // Validar token e buscar cliente
    const { data: clients, error: clientError } = await supabase
      .from('clients')
      .select('id, nome, anamnesis_token, anamnesis_filled')
      .eq('anamnesis_token', token)

    if (clientError || !clients || clients.length === 0) {
      return { success: false, error: 'Link inválido ou expirado.' }
    }

    const client = clients[0]

    if (client.anamnesis_filled) {
      return { success: false, error: 'Ficha já preenchida.' }
    }

    // Salvar ficha de anamnese
    const { error: insertError } = await supabase
      .from('anamnesis_forms')
      .insert({
        client_id:           client.id,
        data_nascimento:     data.data_nascimento || null,
        profissao:           data.profissao || null,
        condicoes_saude:     data.condicoes_saude || null,
        condicoes_pele:      data.condicoes_pele || null,
        pressao_arterial:    data.pressao_arterial || null,
        historico_alergias:  data.historico_alergias || null,
        alergias:            data.alergias || null,
        gestante:            data.gestante,
        uso_alcool_drogas:   data.uso_alcool_drogas,
        em_tratamento:       data.em_tratamento,
        medicamentos:        data.medicamentos || null,
        experiencias_tatuagem: data.experiencias_tatuagem || null,
        outras_informacoes:  data.outras_informacoes || null,
        aceita_termos:       data.aceita_termos,
      })

    if (insertError) {
      console.error('❌ Erro ao salvar anamnese:', insertError)
      return { success: false, error: 'Erro ao salvar. Tente novamente.' }
    }

    // Marcar cliente como anamnese preenchida
    const { error: updateError } = await supabase
      .from('clients')
      .update({ anamnesis_filled: true })
      .eq('id', client.id)

    if (updateError) {
      console.error('❌ Erro ao atualizar cliente:', updateError)
      // Não retorna erro — a ficha já foi salva
    }

    console.log('✅ Anamnese preenchida para cliente:', client.nome)
    return { success: true }
  } catch (error) {
    console.error('❌ Erro inesperado ao salvar anamnese:', error)
    return { success: false, error: 'Erro inesperado. Tente novamente.' }
  }
}
