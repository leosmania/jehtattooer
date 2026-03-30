-- Campos adicionais da ficha de anamnese (Fase 6 — ajustes pós-análise do Google Forms)
-- Criado: 2026-03-30

ALTER TABLE anamnesis_forms
  ADD COLUMN IF NOT EXISTS propensao_queloide   BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS compromisso_pagamento TEXT;
