-- CRM Tables for JehTattooer
-- Created: 2026-03-29

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Clientes (criados via formulário de orçamento)
CREATE TABLE IF NOT EXISTS clients (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome                 TEXT NOT NULL,
  email                TEXT NOT NULL,
  whatsapp             TEXT NOT NULL,
  status               TEXT NOT NULL DEFAULT 'novo_orcamento'
                       CHECK (status IN ('novo_orcamento','em_consultoria','design_aprovado','agendado','finalizado','arquivado')),
  anamnesis_token      UUID UNIQUE DEFAULT gen_random_uuid(),
  anamnesis_filled     BOOLEAN DEFAULT FALSE,
  anamnesis_link_sent  BOOLEAN DEFAULT FALSE,
  created_at           TIMESTAMPTZ DEFAULT now(),
  updated_at           TIMESTAMPTZ DEFAULT now()
);

-- Pedidos de orçamento
CREATE TABLE IF NOT EXISTS quotation_requests (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id        UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  tipo_tatuagem    TEXT NOT NULL,
  local_corpo      TEXT NOT NULL,
  tamanho_estimado TEXT NOT NULL,
  descricao        TEXT,
  budget_range     TEXT NOT NULL,
  created_at       TIMESTAMPTZ DEFAULT now()
);

-- Fichas de anamnese
CREATE TABLE IF NOT EXISTS anamnesis_forms (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id             UUID NOT NULL UNIQUE REFERENCES clients(id) ON DELETE CASCADE,
  condicoes_saude       TEXT,
  alergias              TEXT,
  medicamentos          TEXT,
  condicoes_pele        TEXT,
  experiencias_tatuagem TEXT,
  gestante              BOOLEAN DEFAULT FALSE,
  outras_informacoes    TEXT,
  submitted_at          TIMESTAMPTZ DEFAULT now()
);

-- Agendamentos
CREATE TABLE IF NOT EXISTS appointments (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id   UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  data_hora   TIMESTAMPTZ NOT NULL,
  duracao_min INTEGER DEFAULT 120,
  notas       TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Usuários admin
CREATE TABLE IF NOT EXISTS admin_users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- Trigger: atualiza updated_at em clients automaticamente
CREATE OR REPLACE FUNCTION public.update_clients_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS clients_updated_at ON clients;
CREATE TRIGGER clients_updated_at
  BEFORE UPDATE ON clients
  FOR EACH ROW
  EXECUTE FUNCTION public.update_clients_updated_at();

-- Indexes para queries frequentes
CREATE INDEX IF NOT EXISTS idx_clients_status ON clients(status);
CREATE INDEX IF NOT EXISTS idx_clients_anamnesis_token ON clients(anamnesis_token);
CREATE INDEX IF NOT EXISTS idx_clients_anamnesis_filled ON clients(anamnesis_filled);
CREATE INDEX IF NOT EXISTS idx_quotation_requests_client_id ON quotation_requests(client_id);
CREATE INDEX IF NOT EXISTS idx_anamnesis_forms_client_id ON anamnesis_forms(client_id);
CREATE INDEX IF NOT EXISTS idx_appointments_client_id ON appointments(client_id);
CREATE INDEX IF NOT EXISTS idx_appointments_data_hora ON appointments(data_hora);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);

-- Row Level Security (RLS) — desabilitar para agora (ou habilitar depois)
-- Toda leitura/escrita vai via Server Action com service_role key
ALTER TABLE clients DISABLE ROW LEVEL SECURITY;
ALTER TABLE quotation_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE anamnesis_forms DISABLE ROW LEVEL SECURITY;
ALTER TABLE appointments DISABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users DISABLE ROW LEVEL SECURITY;
