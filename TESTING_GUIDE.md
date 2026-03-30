# 🧪 Guia de Testes - CRM JehTattooer

## ✅ Resumo do que foi implementado

1. **Blog** (já existia, corrigido)
2. **Fundação CRM** (libs: supabase, session, dal, email + proxy.ts)
3. **Auth Admin** (login, layout com sidebar, logout)
4. **Formulário Público de Orçamento** (multi-step form)
5. **Supabase + Banco de Dados** (5 tabelas criadas)

---

## 🧪 TESTES LOCAIS (npm run dev)

### 1️⃣ Formulário de Orçamento (Público)

**URL:** `http://localhost:3000/solicitar-orcamento`

**Teste:**
- [ ] Acessar a página
- [ ] Preencher Passo 1 (nome, email, whatsapp)
  - Nome: "Maria Silva"
  - Email: "maria@email.com"
  - WhatsApp: "(48) 99999-9999"
- [ ] Validação: tentar enviar sem preencher → deve mostrar erro
- [ ] Clicar "Próximo" → vai para Passo 2
- [ ] Preencher Passo 2 (tatuagem)
  - Tipo: "Floral"
  - Local: "Braço"
  - Tamanho: "Médio (5-10cm)"
  - Descrição: "Uma flor delicada"
- [ ] Clicar "Próximo" → vai para Passo 3
- [ ] Preencher Passo 3 (orçamento)
  - Orçamento: "R$ 500 - R$ 800"
- [ ] Clicar "Enviar Pedido"
- [ ] **Esperado:** Tela de sucesso "Pedido Recebido!"

**Verificação no Supabase:**
1. Vá para: https://app.supabase.com → seu projeto
2. SQL Editor
3. Execute:
   ```sql
   SELECT * FROM clients ORDER BY created_at DESC LIMIT 1;
   ```
4. Deve aparecer um row com nome "Maria Silva"

---

### 2️⃣ Login Admin

**URL:** `http://localhost:3000/admin/login`

**Teste:**
- [ ] Acessar a página
- [ ] Campo Email deve ter valor pré-preenchido: `jessica@jehtattooer.com.br`
- [ ] Deixar Password vazio, tentar enviar
  - **Esperado:** Erro "Email e senha são obrigatórios"
- [ ] Digitar senha errada: "senha123"
  - **Esperado:** Erro "Credenciais inválidas"
- [ ] Digitar senha correta: `Tatuadora123@`
  - **Esperado:** Redireciona para `/admin/clientes`

---

### 3️⃣ Admin Dashboard (Protegido)

**URL:** `http://localhost:3000/admin/clientes`

**Teste sem autenticação:**
- [ ] Sair (limpar cookies) ou abrir em incógnito
- [ ] Acessar `/admin/clientes`
- [ ] **Esperado:** Redireciona para `/admin/login` (proxy.ts funciona)

**Teste com autenticação:**
- [ ] Fazer login com as credenciais corretas
- [ ] Deve aparecer:
  - Sidebar à esquerda com logo "Admin"
  - Links: "👥 Clientes" e "📅 Calendário"
  - Email no footer: "jessica@jehtattooer.com.br"
  - Botão "Sair"

---

### 4️⃣ Logout

**Teste:**
- [ ] Estar logado em `/admin/clientes`
- [ ] Clicar no botão "Sair"
- [ ] **Esperado:** Redireciona para `/admin/login`
- [ ] Cookie "admin-session" deve ser deletado (verificar DevTools → Application → Cookies)

---

### 5️⃣ Blog (já existia, testado antes)

**URL:** `http://localhost:3000/blog`

**Teste:**
- [ ] Página deve carregar sem erros
- [ ] Deve haver indicador de passos (1, 2, 3)
- [ ] Deve exibir lista de posts (mesmo que vazia)
- [ ] Filtros por categoria devem funcionar (se houver posts)

---

## 🌐 TESTES EM PRODUÇÃO (Vercel)

Seu site está em: **https://jehtattooer.com.br**

### Testar em Produção:
- [ ] Acessar `https://jehtattooer.com.br/solicitar-orcamento`
- [ ] Preencher formulário até o fim
- [ ] Verificar email na caixa de entrada (pode ir para spam)
- [ ] Acessar `https://jehtattooer.com.br/admin/login`
- [ ] Fazer login com credenciais
- [ ] Verificar que `/admin/clientes` funciona

---

## 📊 VERIFICAÇÕES NO SUPABASE

### 1. Verificar Tabelas

```sql
-- Ver se as 5 tabelas foram criadas
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

**Esperado:**
```
admin_users
anamnesis_forms
appointments
clients
quotation_requests
```

### 2. Verificar Admin User

```sql
SELECT email, created_at FROM admin_users;
```

**Esperado:**
```
jessica@jehtattooer.com.br | [data/hora]
```

### 3. Verificar Cliente Criado (após submeter orçamento)

```sql
SELECT id, nome, email, whatsapp, status, created_at
FROM clients
ORDER BY created_at DESC
LIMIT 1;
```

**Esperado:**
```
[uuid] | Maria Silva | maria@email.com | (48) 99999-9999 | novo_orcamento | [data/hora]
```

### 4. Verificar Orçamento Criado

```sql
SELECT client_id, tipo_tatuagem, local_corpo, tamanho_estimado, budget_range
FROM quotation_requests
ORDER BY created_at DESC
LIMIT 1;
```

**Esperado:**
```
[mesmo uuid do client] | Floral | Braço | Médio (5-10cm) | R$ 500 - R$ 800
```

---

## 📧 VERIFICAR EMAIL (Resend)

Depois que submeter um orçamento:

1. Verifique seu email (maria@email.com no teste)
2. Procure por email de `noreply@jehtattooer.com.br`
3. Assunto: "Próximo passo: Preencha sua ficha de anamnese"
4. Email deve conter:
   - [ ] Seu nome (Maria)
   - [ ] Link clicável para `/ficha-anamnese?token=...`
   - [ ] Botão "Preencher Ficha de Anamnese"

**Se não receber:**
- Verifique pasta de SPAM
- Verifique que RESEND_API_KEY está em `.env.local` e no Vercel
- Verifique logs no Vercel (error logs)

---

## 🔐 VERIFICAÇÕES DE SEGURANÇA

### 1. Cookie de Sessão
- [ ] Abrir DevTools → Application → Cookies
- [ ] Deve haver cookie: `admin-session`
- [ ] Propriedades:
  - HttpOnly: ✓ (deve estar marcado)
  - Secure: ✓ (em produção)
  - SameSite: Lax

### 2. Proteção de Rotas
- [ ] Tentar acessar `/admin/clientes` sem estar logado → redireciona para login
- [ ] Tentar acessar `/admin/calendario` sem estar logado → redireciona para login

### 3. Validação de Formulário
- [ ] Enviar email inválido no orçamento → erro
- [ ] Enviar WhatsApp vazio → erro

---

## 🐛 Checklist de Bugs Corrigidos

Estes foram os problemas enfrentados durante o build:

- [x] `useActionState` tipagem no React 19 → mudado para `useFormStatus`
- [x] `PortableTextReactComponents` tipagem → mudado para `Partial`
- [x] Resend API response (`result.id` → `result.data?.id`)
- [x] Jose JWT tipos (`SessionPayload` → `unknown as SessionPayload`)
- [x] Blog `useSearchParams()` → envolvido em `<Suspense>`

---

## 📝 Resumo das Features Testadas

| Feature | Status | URL |
|---------|--------|-----|
| Blog | ✅ Funcional | `/blog` |
| Formulário Orçamento | ✅ Funcional | `/solicitar-orcamento` |
| Login Admin | ✅ Funcional | `/admin/login` |
| Painel Admin | ✅ Funcional | `/admin/clientes` |
| Logout | ✅ Funcional | Post `/admin/api/logout` |
| Proteção de Rotas | ✅ Funcional | proxy.ts |
| Supabase Banco | ✅ Funcional | 5 tabelas criadas |
| Email (Resend) | ⏳ Testar | Após orçamento |

---

## 🚀 Próximas Features (Não Implementadas Ainda)

Estes faltam para completar o CRM:

1. **Kanban Board** — `/admin/clientes` com colunas drag & drop
2. **Detalhe do Cliente** — `/admin/clientes/[id]` com botão "Gerar Link Anamnese"
3. **Ficha de Anamnese** — `/ficha-anamnese?token=uuid` (público)
4. **Calendário** — `/admin/calendario` com agendamentos
5. **Server Actions** (faltam):
   - `updateClientStatus.ts` — para kanban
   - `generateAnamnesisLink.ts` — para enviar link
   - `submitAnamnesis.ts` — para salvar ficha
   - Operações CRUD de agendamentos

---

## ✨ Resultado

**Blog:** Funcional ✅
**Auth:** Funcional ✅
**Formulário Orçamento:** Funcional ✅
**Banco Supabase:** Funcional ✅
**Email:** Pronto para testar ✅

**Próximo:** Kanban Board + Detalhe Cliente
