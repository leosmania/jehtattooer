/**
 * TypeScript types para o CRM
 */

export type ClientStatus =
  | 'novo_orcamento'
  | 'em_consultoria'
  | 'design_aprovado'
  | 'agendado'
  | 'finalizado'
  | 'arquivado'

export interface Client {
  id: string
  nome: string
  email: string
  whatsapp: string
  status: ClientStatus
  anamnesis_token: string
  anamnesis_filled: boolean
  anamnesis_link_sent: boolean
  created_at: string
  updated_at: string
}

export interface QuotationRequest {
  id: string
  client_id: string
  tipo_tatuagem: string
  local_corpo: string
  tamanho_estimado: string
  descricao: string | null
  budget_range: string
  imagens_referencia: string[]
  created_at: string
}

export interface AnamnesisForm {
  id: string
  client_id: string
  condicoes_saude: string | null
  alergias: string | null
  medicamentos: string | null
  condicoes_pele: string | null
  experiencias_tatuagem: string | null
  gestante: boolean
  outras_informacoes: string | null
  submitted_at: string
}

export interface Appointment {
  id: string
  client_id: string
  data_hora: string
  duracao_min: number
  notas: string | null
  created_at: string
  client?: Pick<Client, 'nome' | 'whatsapp'>
}

export interface AdminUser {
  id: string
  email: string
  password_hash: string
  created_at: string
}

export const KANBAN_COLUMNS: Array<{ id: ClientStatus; label: string; color: string }> = [
  { id: 'novo_orcamento', label: 'Novo Orçamento', color: '#FF6B6B' },
  { id: 'em_consultoria', label: 'Em Consultoria', color: '#4ECDC4' },
  { id: 'design_aprovado', label: 'Design Aprovado', color: '#45B7D1' },
  { id: 'agendado', label: 'Agendado', color: '#96CEB4' },
  { id: 'finalizado', label: 'Finalizado', color: '#FFEAA7' },
  { id: 'arquivado', label: 'Arquivado', color: '#DFE6E9' },
]

export const STATUS_LABELS: Record<ClientStatus, string> = {
  novo_orcamento: 'Novo Orçamento',
  em_consultoria: 'Em Consultoria',
  design_aprovado: 'Design Aprovado',
  agendado: 'Agendado',
  finalizado: 'Finalizado',
  arquivado: 'Arquivado',
}
