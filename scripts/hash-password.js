#!/usr/bin/env node

/**
 * Script para gerar hash bcrypt de senha
 * Uso: node scripts/hash-password.js [email] [senha]
 *
 * Exemplo:
 *   node scripts/hash-password.js jessica@jehtattooer.com.br senha123
 *
 * Output: hash bcrypt para usar no supabase/seed.sql
 */

const bcrypt = require('bcryptjs');

const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
  console.error('Uso: node scripts/hash-password.js <email> <senha>');
  console.error('Exemplo: node scripts/hash-password.js jessica@jehtattooer.com.br senha123');
  process.exit(1);
}

bcrypt.hash(password, 10, (err, hash) => {
  if (err) {
    console.error('Erro:', err.message);
    process.exit(1);
  }

  console.log('\n✅ Hash bcrypt gerado com sucesso!\n');
  console.log('Email:', email);
  console.log('Hash:', hash);
  console.log('\nCole isso no supabase/seed.sql:');
  console.log(`INSERT INTO admin_users (email, password_hash) VALUES ('${email}', '${hash}');`);
  console.log('\n');
});
