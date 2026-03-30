# CRM JehTattooer — Status Completo do Projeto

**Última atualização:** 30/03/2026
**Stack:** Next.js 16.2.1 + Supabase + Sanity CMS + Resend + @dnd-kit

---

## Credenciais e Acessos

### Admin Login
- **URL:** `https://www.jehtattooer.com.br/admin/login`
- **Email:** `jessica@jehtattooer.com.br`
- **Senha:** ver `.env.local` ou TESTING_GUIDE.md local

### Supabase
- **Projeto:** `jehtattooer`
- **5 tabelas:** `clients`, `quotation_requests`, `anamnesis_forms`, `appointments`, `admin_users`

### Variáveis de Ambiente (.env.local + Vercel)
```
NEXT_PUBLIC_SUPABASE_URL=<ver .env.local>
SUPABASE_SERVICE_ROLE_KEY=<ver .env.local>
SESSION_SECRET=<ver .env.local>
RESEND_API_KEY=<ver .env.local>
NEXT_PUBLIC_APP_URL=https://jehtattooer.com.br
NEXT_PUBLIC_SANITY_PROJECT_ID=hiiae90m
NEXT_PUBLIC_SANITY_DATASET=production
```
> **Nota:** As chaves secretas estão no arquivo `.env.local` (não commitado no git).
> Copie o `.env.local` para o outro PC ou consulte o painel do Vercel/Supabase.

---

## O que foi implementado (✅)

### 1. Blog (Sanity CMS)
- **Listagem:** `/blog` — busca posts do Sanity, filtro por categoria
- **Post individual:** `/blog/[slug]` — conteúdo com PortableText, posts relacionados
- **Gerenciado via:** Sanity Studio em `/studio`

### 2. Infraestrutura do CRM
| Arquivo | Função |
|---------|--------|
| `src/lib/supabase.ts` | Cliente Supabase server-only com service_role |
| `src/lib/session.ts` | JWT (jose) — encrypt, decrypt, createSession, deleteSession, readSession |
| `src/lib/dal.ts` | `verifySession()` com React cache() — redireciona se não autenticado |
| `src/lib/email.ts` | `sendAnamnesisEmail()` via Resend com template HTML |
| `src/types/crm.ts` | Interfaces TypeScript: Client, QuotationRequest, AnamnesisForm, Appointment |
| `src/proxy.ts` | Proteção de rotas /admin/* (Next.js 16, substitui middleware.ts) |

### 3. Auth Admin
| Arquivo | Função |
|---------|--------|
| `src/app/admin/layout.tsx` | Layout raiz do admin (wrapper simples, sem auth) |
| `src/app/admin/login/page.tsx` | Página de login com metadata noindex |
| `src/app/admin/login/LoginForm.tsx` | Formulário com useFormStatus, valida email/senha |
| `src/app/admin/api/logout/route.ts` | POST endpoint — deleta cookie e redireciona |
| `src/app/actions/crm/loginAction.ts` | Server Action — bcrypt.compare + createSession |

**Fluxo:**
1. Acessa `/admin/login` → preenche email/senha
2. `loginAction` verifica bcrypt no Supabase
3. Cria JWT cookie `admin-session` (HttpOnly, 7 dias)
4. Redireciona para `/admin/clientes`

### 4. Formulário Público de Orçamento + Simulador de Tatuagem
| Arquivo | Função |
|---------|--------|
| `src/app/solicitar-orcamento/page.tsx` | Server component com metadata SEO + integra simulador |
| `src/app/solicitar-orcamento/QuotationForm.tsx` | Formulário 3 passos (dados → tatuagem → investimento) com upload de imagens |
| `src/app/solicitar-orcamento/QuotationForm.module.css` | Styling do formulário |
| `src/app/actions/crm/submitQuotation.ts` | Server Action — cria client + quotation_request |
| `src/app/actions/crm/uploadImage.ts` | Server Action — upload de imagens para Supabase Storage |
| `src/app/simulador/TattooSimulator.tsx` | Simulador interativo de tatuagem (Konva.js, client-side) |
| `src/app/simulador/TattooSimulator.module.css` | Styling do simulador |
| `src/app/simulador/page.tsx` | Redirect para `/solicitar-orcamento` |

**Fluxo do Formulário:**
1. Cliente acessa `/solicitar-orcamento`
2. Preenche 3 etapas: Dados Pessoais → Detalhes da Tatuagem (+ upload até 3 imagens de referência) → Intenção de Investimento
3. Submit → cria registro em `clients` (com `anamnesis_token` automático) + `quotation_requests` (com `imagens_referencia`)
4. Imagens de referência são enviadas ao Supabase Storage (bucket `quotation-images`)
5. Envia email de confirmação via Resend
6. Card aparece no Kanban em "Novo Orçamento"

**Fluxo do Simulador (abaixo do formulário):**
1. Cliente faz upload de foto do corpo
2. Faz upload do desenho da tatuagem → fundo removido automaticamente via `@imgly/background-removal` (client-side, zero custo servidor)
3. Editor interativo: arrastar, redimensionar, girar o desenho sobre a foto + slider de opacidade
4. Salvar resultado como PNG
5. Tudo roda 100% no browser (Canvas/Konva.js) — sem consumo de banda no Vercel

### 5. Kanban Board (Painel Admin)
| Arquivo | Função |
|---------|--------|
| `src/app/admin/clientes/layout.tsx` | Layout com verifySession() + sidebar (auth) |
| `src/app/admin/clientes/page.tsx` | Busca clientes do Supabase, passa para KanbanBoard |
| `src/app/admin/clientes/KanbanBoard.tsx` | DndContext com 6 colunas, drag & drop |
| `src/app/admin/clientes/KanbanColumn.tsx` | Coluna com useDroppable + SortableContext |
| `src/app/admin/clientes/KanbanCard.tsx` | Card com useSortable + onClick para detalhe |
| `src/app/actions/crm/updateClientStatus.ts` | Server Action — atualiza status no Supabase |

**Colunas do Kanban:**
1. 📋 Novo Orçamento
2. 💬 Em Consultoria
3. ✅ Design Aprovado
4. 📅 Agendado
5. 🎨 Finalizado
6. 📦 Arquivado

### 6. Detalhe do Cliente + Gerar Link de Anamnese
| Arquivo | Função |
|---------|--------|
| `src/app/admin/clientes/[id]/page.tsx` | Busca client + quotation + anamnesis, exibe dados + imagens de referência |
| `src/app/admin/clientes/[id]/AnamnesisLinkButton.tsx` | Botão para gerar link + enviar email + copiar URL |
| `src/app/admin/clientes/[id]/ClientDetail.module.css` | Styling da página de detalhe (inclui grid de imagens) |
| `src/app/actions/crm/generateAnamnesisLink.ts` | Server Action — marca link_sent + envia email |

**Funcionalidades:**
- Exibe dados do cliente, detalhes do orçamento e status da anamnese
- **Imagens de referência** do cliente aparecem como thumbnails clicáveis (abre em nova aba)
- Botão para gerar e enviar link de anamnese via email
- URL copiável para compartilhar manualmente

### 7. Banco de Dados (Supabase)
| Tabela | Colunas principais |
|--------|-------------------|
| `clients` | id, nome, email, whatsapp, status, anamnesis_token, anamnesis_filled, anamnesis_link_sent |
| `quotation_requests` | id, client_id, tipo_tatuagem, local_corpo, tamanho_estimado, descricao, budget_range, imagens_referencia (TEXT[]) |
| `anamnesis_forms` | id, client_id, condicoes_saude, alergias, medicamentos, condicoes_pele, experiencias_tatuagem, gestante, outras_informacoes |
| `appointments` | id, client_id, data_hora, duracao_min, notas |
| `admin_users` | id, email, password_hash |

**Migrations:**
- `supabase/migrations/20260329000000_crm_tables.sql` — Schema inicial completo
- `supabase/migrations/20260330000000_add_imagens_referencia.sql` — Coluna imagens_referencia em quotation_requests

**Supabase Storage:**
- Bucket `quotation-images` — imagens de referência enviadas pelos clientes (criado automaticamente pela server action)

**Seed:** `supabase/seed.sql` (admin user)

---

## O que falta implementar (❌)

### Fase 6 — Ficha de Anamnese Pública (PRIORIDADE ALTA)

**Arquivos a criar:**
```
src/app/ficha-anamnese/
  ├── page.tsx              # Server — valida token, busca cliente
  ├── AnamnesisForm.tsx     # 'use client' — formulário de saúde
  └── AnamnesisForm.module.css

src/app/actions/crm/
  └── submitAnamnesis.ts    # Server Action — salva no Supabase
```

**Fluxo esperado:**
1. Cliente acessa `/ficha-anamnese?token=<uuid>` (link recebido por email)
2. Server verifica token no Supabase (`clients.anamnesis_token`)
3. Se inválido → "Link inválido"
4. Se já preenchido (`anamnesis_filled = true`) → "Ficha já preenchida, obrigada!"
5. Se válido → renderiza formulário com campos:
   - Condições de saúde
   - Alergias
   - Medicamentos em uso
   - Condições de pele
   - Experiências com tatuagem
   - Gestante (sim/não)
   - Outras informações
6. Submit → INSERT em `anamnesis_forms` + UPDATE `clients.anamnesis_filled = true`

### Fase 7 — Calendário de Agendamentos (PRIORIDADE MÉDIA)

**Arquivos a criar:**
```
src/app/admin/calendario/
  ├── page.tsx              # Server — fetch appointments
  ├── CalendarView.tsx      # 'use client' — react-big-calendar
  ├── AppointmentModal.tsx  # 'use client' — criar/editar agendamento
  └── Calendar.module.css

src/app/actions/crm/
  ├── createAppointment.ts
  ├── updateAppointment.ts
  └── deleteAppointment.ts
```

**Dependências já instaladas:** `react-big-calendar`, `date-fns`

**Funcionalidades:**
- Visualização mensal/semanal dos agendamentos
- Modal para criar/editar agendamentos (data/hora, duração, notas, cliente)
- Vincular agendamento a um cliente existente
- Sidebar já tem link "📅 Calendário" pronto

### Melhorias Pendentes (PRIORIDADE BAIXA)

1. **Blog** — Verificar se o post está aparecendo (era problema de Sanity Project ID, já corrigido)
2. **Sidebar** — Replicar layout com sidebar para `/admin/calendario/layout.tsx`
3. **Responsividade** — Testar mobile em todas as telas admin
4. **Segurança** — Adicionar Rate Limiting no login
5. **WhatsApp** — Adicionar link direto para WhatsApp no card do cliente

---

## Estrutura de Arquivos Completa

```
src/
├── proxy.ts                          # Proteção rotas /admin/*
├── types/
│   └── crm.ts                        # Interfaces TypeScript
├── lib/
│   ├── supabase.ts                   # Cliente Supabase (server-only)
│   ├── session.ts                    # JWT com jose
│   ├── dal.ts                        # verifySession() cached
│   └── email.ts                      # Resend email
│
├── app/
│   ├── solicitar-orcamento/          # ✅ Formulário público + Simulador
│   │   ├── page.tsx                  # Integra QuotationForm + TattooSimulator
│   │   ├── QuotationForm.tsx         # Formulário 3 passos + upload imagens
│   │   └── QuotationForm.module.css
│   │
│   ├── simulador/                    # ✅ Simulador de Tatuagem (componente)
│   │   ├── page.tsx                  # Redirect → /solicitar-orcamento
│   │   ├── TattooSimulator.tsx       # Editor Konva.js + bg removal
│   │   └── TattooSimulator.module.css
│   │
│   ├── ficha-anamnese/               # ❌ A CRIAR
│   │   ├── page.tsx
│   │   ├── AnamnesisForm.tsx
│   │   └── AnamnesisForm.module.css
│   │
│   ├── blog/                         # ✅ Blog Sanity
│   │   ├── page.tsx
│   │   ├── BlogClient.tsx
│   │   └── [slug]/page.tsx
│   │
│   ├── admin/
│   │   ├── layout.tsx                # Wrapper simples
│   │   ├── Admin.module.css
│   │   ├── login/                    # ✅ Login
│   │   │   ├── page.tsx
│   │   │   ├── LoginForm.tsx
│   │   │   └── LoginForm.module.css
│   │   ├── clientes/                 # ✅ Kanban + Detalhe
│   │   │   ├── layout.tsx            # Auth + Sidebar
│   │   │   ├── page.tsx
│   │   │   ├── KanbanBoard.tsx
│   │   │   ├── KanbanColumn.tsx
│   │   │   ├── KanbanCard.tsx
│   │   │   ├── Kanban.module.css
│   │   │   ├── ClientesPage.module.css
│   │   │   └── [id]/
│   │   │       ├── page.tsx
│   │   │       ├── AnamnesisLinkButton.tsx
│   │   │       └── ClientDetail.module.css
│   │   ├── calendario/               # ❌ A CRIAR
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── CalendarView.tsx
│   │   │   ├── AppointmentModal.tsx
│   │   │   └── Calendar.module.css
│   │   └── api/logout/route.ts       # ✅ Logout
│   │
│   └── actions/crm/
│       ├── loginAction.ts            # ✅
│       ├── submitQuotation.ts        # ✅
│       ├── uploadImage.ts            # ✅ Upload imagens → Supabase Storage
│       ├── updateClientStatus.ts     # ✅
│       ├── generateAnamnesisLink.ts  # ✅
│       ├── submitAnamnesis.ts        # ❌ A CRIAR
│       ├── createAppointment.ts      # ❌ A CRIAR
│       ├── updateAppointment.ts      # ❌ A CRIAR
│       └── deleteAppointment.ts      # ❌ A CRIAR

supabase/
├── config.toml
├── migrations/
│   └── 20260329000000_crm_tables.sql # ✅ Schema completo
└── seed.sql                          # ✅ Admin user

scripts/
└── hash-password.js                  # ✅ Helper bcrypt
```

---

## Bugs Conhecidos / Resolvidos

| Bug | Status | Solução |
|-----|--------|---------|
| useActionState TypeScript | ✅ Resolvido | Usar useFormStatus + useState |
| PortableTextReactComponents | ✅ Resolvido | Usar Partial<> + as any |
| Resend API result.id | ✅ Resolvido | Usar result.data?.id |
| Jose JWT SessionPayload | ✅ Resolvido | as unknown as SessionPayload |
| Blog useSearchParams | ✅ Resolvido | Envolver em Suspense |
| Admin login redirect loop | ✅ Resolvido | Layout raiz sem auth, auth só em /clientes/layout |
| Layout grid duplo | ✅ Resolvido | Admin layout como fragment, grid só em clientes/layout |
| Kanban card branco | ✅ Resolvido | background rgba(255,255,255,0.08) |
| React #418 hydration | ✅ Resolvido | useEffect para init, remover Link de card |
| Select/dropdown invisível | ✅ Resolvido | Cores explícitas + color-scheme: light |
| Blog post não encontrado | ✅ Resolvido | Adicionar NEXT_PUBLIC_SANITY_PROJECT_ID |
| Formulário 500 | ✅ Resolvido | Adicionar env vars no Vercel |

---

## Como Continuar o Desenvolvimento

1. **Clone o repo:** `git clone https://github.com/leosmania/jehtattooer.git`
2. **Instale dependências:** `npm install`
3. **Configure .env.local** com as variáveis acima
4. **Rode local:** `npm run dev`
5. **Supabase CLI:** `supabase link --project-ref wkvwiawjpikhsaviyaru`

### Próximo passo recomendado:
Implementar a **Ficha de Anamnese** (`/ficha-anamnese`) — é a feature que completa o fluxo principal do CRM (cliente solicita orçamento → tatuadora aprova → envia link de anamnese → cliente preenche).

---

## Fluxo Completo End-to-End (quando tudo estiver pronto)

```
1. Cliente acessa /solicitar-orcamento → preenche formulário
2. Card aparece no Kanban em "Novo Orçamento"
3. Tatuadora conversa com cliente, move para "Em Consultoria"
4. Fecha negócio, move para "Design Aprovado"
5. Abre detalhe → clica "Gerar Link de Anamnese"
6. Cliente recebe email → preenche /ficha-anamnese?token=xxx
7. Tatuadora vê ficha preenchida no detalhe
8. Cria agendamento no calendário, move para "Agendado"
9. Realiza tatuagem, move para "Finalizado"
```
