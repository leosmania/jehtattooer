# 🚀 Setup do CRM — Instruções Passo a Passo

## ✅ O que foi criado

- ✓ `supabase/migrations/20260329000000_crm_tables.sql` — schema completo das 5 tabelas
- ✓ `scripts/hash-password.js` — script para gerar hash bcrypt
- ✓ `supabase/seed.sql` — seed de dados (em branco, aguardando hash)
- ✓ `supabase init` já rodado

---

## 📋 Próximos Passos

### Passo 1: Fazer Login no Supabase CLI

```bash
supabase login
```

Será aberta uma página no navegador para você fazer login com sua conta Supabase. Após o login, uma API key será gerada e armazenada localmente.

### Passo 2: Linkar ao Projeto Remoto

```bash
supabase link --project-ref wkvwiawjpikhsaviyaru
```

Será pedida a **senha do banco de dados** (a que você forneceu: `81379937Je@`).

Após isso, o `supabase/config.toml` será atualizado com as referências ao projeto remoto.

### Passo 3: Gerar Hash da Senha do Admin

```bash
node scripts/hash-password.js jessica@jehtattooer.com.br SUA_SENHA_AQUI
```

**Substitua `SUA_SENHA_AQUI`** por uma senha forte que você quer usar para logar no admin.

Exemplo:
```bash
node scripts/hash-password.js jessica@jehtattooer.com.br MinhaSenh@Forte123
```

**Output:**
```
✅ Hash bcrypt gerado com sucesso!

Email: jessica@jehtattooer.com.br
Hash: $2b$10$XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

Cole isso no supabase/seed.sql:
INSERT INTO admin_users (email, password_hash) VALUES ('jessica@jehtattooer.com.br', '$2b$10$XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');
```

### Passo 4: Atualizar seed.sql

1. Abra `supabase/seed.sql`
2. Copie a linha inteira do INSERT gerada no passo anterior
3. Cole no arquivo, substituindo a linha:
   ```sql
   INSERT INTO admin_users (email, password_hash)
   VALUES (
     'jessica@jehtattooer.com.br',
     '$2b$10$COLOQUE_O_HASH_AQUI'
   );
   ```

### Passo 5: Fazer Push das Migrations

```bash
supabase db push
```

Isso vai:
1. Aplicar a migration `20260329000000_crm_tables.sql` ao banco remoto
2. Criar todas as 5 tabelas (clients, quotation_requests, anamnesis_forms, appointments, admin_users)
3. Criar indexes e triggers

**Esperado:** Output mostrando que as migrations foram aplicadas com sucesso.

### Passo 6: Rodar o Seed (Popular Admin)

```bash
supabase db execute ./supabase/seed.sql --project-ref wkvwiawjpikhsaviyaru
```

Isso vai inserir o usuário admin no banco.

---

## 🔧 Variáveis de Ambiente (.env.local)

Após os passos acima, você terá as informações para preencher `.env.local`:

### Obter NEXT_PUBLIC_SUPABASE_URL

No dashboard do Supabase:
1. Vá para **Project Settings** → **API**
2. Copie o **Project URL**

Exemplo: `https://wkvwiawjpikhsaviyaru.supabase.co`

### Obter SUPABASE_SERVICE_ROLE_KEY

No dashboard do Supabase:
1. Vá para **Project Settings** → **API**
2. Seção **Project API keys**
3. Copie a **Service Role key** (não confundir com Anon key!)

Exemplo: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### Gerar SESSION_SECRET

```bash
openssl rand -base64 32
```

Output será algo como: `ABCD1234EFGH5678IJKL9012MNOP3456QRST7890UVW=`

### Obter RESEND_API_KEY

1. Crie conta em [resend.com](https://resend.com) (free tier é suficiente)
2. Vá para **Settings** → **API Keys**
3. Copie a **API Key**

Exemplo: `re_XXXXXXXXXXXXXXXXXXXXXXXXXXXXX`

### Exemplo Completo (.env.local)

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://wkvwiawjpikhsaviyaru.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Session
SESSION_SECRET=ABCD1234EFGH5678IJKL9012MNOP3456QRST7890UVW=

# Email
RESEND_API_KEY=re_XXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# App URL
NEXT_PUBLIC_APP_URL=https://jehtattooer.com.br
```

### Adicionar ao Vercel

1. No dashboard do Vercel, vá para seu projeto
2. **Settings** → **Environment Variables**
3. Adicione as mesmas variáveis acima (exceto SESSION_SECRET que pode ser diferente):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `SESSION_SECRET`
   - `RESEND_API_KEY`
   - `NEXT_PUBLIC_APP_URL`

---

## ✅ Verificação Final

Após todos os passos, verifique:

```bash
# Verificar que o supabase está linkado
supabase status

# Ver que as tabelas existem no remoto
supabase db list
```

Esperado: output mostrando as 5 tabelas criadas.

---

## 📞 Quando Pronto

Após concluir estes passos, avise que:
- ✅ Supabase está configurado e linkado
- ✅ 5 tabelas estão criadas no banco
- ✅ Admin user está inserido
- ✅ .env.local preenchido com as variáveis

E então posso começar a codificar os endpoints, Server Actions, e componentes do CRM!

---

## 🚨 Troubleshooting

### "command not found: supabase"
Supabase CLI não está no PATH. Instale via:
```bash
npm install -g supabase
# ou
scoop install supabase  # se você usa Scoop
```

### "Access token not provided"
Faça login primeiro:
```bash
supabase login
```

### "Cannot connect to Docker"
Se você não vai usar a versão local (recomendo não usar), pule a verificação local. Foco no remoto:
```bash
supabase db push --no-verify
```

### Hash generator não funciona
Instale bcryptjs antes:
```bash
npm install bcryptjs
```

---

## 🎯 Próxima Fase

Quando todo esse setup estiver concluído, vou implementar:
1. Fundação (lib/supabase.ts, lib/session.ts, etc)
2. Auth admin (login, proxy.ts, layout)
3. Formulário de orçamento
4. Kanban
5. Ficha de anamnese
6. Calendário
