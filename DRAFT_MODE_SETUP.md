# Draft Mode Setup - Visualizar Mudanças do Sanity em Tempo Real

## Como Funciona

- **Draft Mode**: Permite visualizar mudanças do Sanity em tempo real ANTES de publicar
- **Webhook de Revalidação**: Quando você publica algo no Sanity, o site é atualizado automaticamente

---

## 1️⃣ Configurar Variáveis de Ambiente

### Local (`.env.local`)
```
SANITY_DRAFT_SECRET=seu_secret_bem_complexo_aqui
SANITY_WEBHOOK_SECRET=outro_secret_bem_complexo_aqui
```

### Vercel
1. Acesse [vercel.com/dashboard](https://vercel.com/dashboard)
2. Selecione seu projeto
3. Vá em **Settings → Environment Variables**
4. Adicione as mesmas duas variáveis acima

---

## 2️⃣ Habilitar Draft Mode

### Para Visualizar em Tempo Real:

Acesse esta URL no seu navegador:
```
http://localhost:3000/api/draft-mode/enable?secret=seu_secret_bem_complexo_aqui
```

Ou em produção:
```
https://jehtattooer.com.br/api/draft-mode/enable?secret=seu_secret_bem_complexo_aqui
```

Agora quando você editar no Sanity, o site reflete as mudanças em tempo real!

### Para Desabilitar Draft Mode:
```
http://localhost:3000/api/draft-mode/disable
```

---

## 3️⃣ Configurar Webhook no Sanity (Opcional - Para Revalidação Automática)

Isso faz o site se atualizar automaticamente quando você publica no Sanity.

### No Sanity:
1. Acesse [manage.sanity.io](https://manage.sanity.io)
2. Selecione seu projeto
3. Vá em **API → Webhooks**
4. Clique em **Create Webhook**
5. Configure:
   - **Dataset**: `production`
   - **Trigger on**: `Create`, `Update`, `Delete`
   - **Webhook URL**: `https://jehtattooer.com.br/api/revalidate`
   - **HTTP Headers**:
     - Key: `x-sanity-webhook-secret`
     - Value: `outro_secret_bem_complexo_aqui`

---

## 🚀 Resultado

✅ **Draft Mode Ativo**: Vê mudanças em tempo real
✅ **Webhook Configurado**: Site se atualiza automaticamente quando publica
✅ **Sem Necessidade de Deploy**: Mudanças refletem instantaneamente!

---

## Dúvidas?

- **Draft Mode não funciona?** Verifique se o secret está correto na URL
- **Webhook não funciona?** Verifique o secret no header HTTP do webhook
- **Mudanças ainda cacheadas?** Desabilite e reabilite o Draft Mode
