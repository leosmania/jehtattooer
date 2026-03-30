-- Expandir tabela anamnesis_forms com campos adicionais da ficha completa
-- Criado: 2026-03-30

ALTER TABLE anamnesis_forms
  ADD COLUMN IF NOT EXISTS data_nascimento    TEXT,
  ADD COLUMN IF NOT EXISTS profissao          TEXT,
  ADD COLUMN IF NOT EXISTS pressao_arterial   TEXT,
  ADD COLUMN IF NOT EXISTS historico_alergias TEXT,
  ADD COLUMN IF NOT EXISTS uso_alcool_drogas  BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS em_tratamento      BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS aceita_termos      BOOLEAN DEFAULT FALSE;
