-- Seed data for JehTattooer CRM
-- Admin user seed

-- IMPORTANTE: Gere o hash da senha rodando:
--   node scripts/hash-password.js jessica@jehtattooer.com.br <SENHA>
--
-- Copie o hash gerado e cole abaixo:

INSERT INTO admin_users (email, password_hash)
VALUES (
  'jessica@jehtattooer.com.br',
  '$2b$10$COLOQUE_O_HASH_AQUI'
);
