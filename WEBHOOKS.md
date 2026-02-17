# Configuração de Webhooks - AbacatePay

## Desenvolvimento Local

Em ambiente de desenvolvimento local (localhost), o AbacatePay **não consegue** enviar webhooks porque não tem acesso à sua máquina local.

### Solução Temporária

Foi criado um botão **"Processar Manualmente"** no dashboard de vendas (`/admin/vendas`) que permite ativar manualmente assinaturas após confirmação de pagamento.

**Como usar:**
1. Acesse `/admin/vendas`
2. Localize a transação com status `PENDING`
3. Clique em "Processar Manualmente"
4. O sistema irá:
   - Atualizar o status da transação para `PAID`
   - Ativar a assinatura do usuário
   - Definir a data de expiração (30 dias para mensal, 365 dias para anual)

### Testando Webhooks Localmente (Opcional)

Se precisar testar webhooks em desenvolvimento, você pode usar ferramentas como:

#### Opção 1: ngrok
```bash
# Instalar ngrok
npm install -g ngrok

# Expor sua aplicação local
ngrok http 3000

# Copiar a URL fornecida (ex: https://abc123.ngrok.io)
# Configurar no dashboard do AbacatePay
```

#### Opção 2: LocalTunnel
```bash
# Instalar localtunnel
npm install -g localtunnel

# Expor sua aplicação
lt --port 3000

# Usar a URL fornecida
```

---

## Produção

### 1. Configurar URL do Webhook

No dashboard do AbacatePay (https://abacatepay.com/dashboard):

1. Vá em **Configurações** > **Webhooks**
2. Adicione a URL: `https://seu-dominio.com/api/webhooks/abacate`
3. Defina o secret (já configurado no `.env` como `ABACATE_WEBHOOK_SECRET`)

### 2. Eventos Processados

O webhook processa os seguintes eventos:

- **`billing.paid`**: Pagamento confirmado
  - Atualiza transação para `PAID`
  - Ativa assinatura do usuário (`ACTIVE`)
  - Define data de expiração

- **`billing.failed`**: Pagamento falhou
  - Atualiza transação para `FAILED`
  - Mantém usuário como `FREE`

- **`billing.disputed`**: Chargeback/Disputa
  - Bloqueia acesso imediatamente
  - Atualiza para `FREE`

- **`billing.canceled`**: Assinatura cancelada
  - Atualiza transação para `CANCELED`
  - Remove acesso premium

### 3. Segurança

O webhook valida a autenticação através de:
- Header `Authorization: Bearer [ABACATE_WEBHOOK_SECRET]`
- Ou header `abacate-secret: [ABACATE_WEBHOOK_SECRET]`

### 4. URLs de Retorno

Atualmente configuradas no código:
- `returnUrl`: `/sucesso` - Página exibida após pagamento
- `completionUrl`: `/sucesso` - Página de confirmação

**Importante:** Se o usuário está sendo redirecionado para uma URL diferente (ex: `/admin/vendas`), verifique a configuração no dashboard do AbacatePay, pois ele pode ter uma URL de retorno global configurada que sobrescreve a URL da requisição.

### 5. Logs e Monitoramento

Todos os eventos de webhook são logados no console com o prefixo `[WEBHOOK]`:

```javascript
[WEBHOOK] Received event: billing.paid
[WEBHOOK] Processing billing.paid for user: usuario@email.com
[WEBHOOK] User usuario@email.com subscription activated for 30 days
```

### 6. Variáveis de Ambiente Necessárias

```env
# API Key do AbacatePay
ABACATE_API_KEY="abc_dev_..."

# Secret para validar webhooks
ABACATE_WEBHOOK_SECRET="seu-secret-aqui"

# URL base da aplicação (produção)
NEXT_PUBLIC_APP_URL="https://seu-dominio.com"
```

---

## Problemas Comuns

### Webhook não é chamado
- **Em desenvolvimento local**: Normal. Use o botão manual ou configure um túnel (ngrok/localtunnel)
- **Em produção**: Verifique se a URL está correta no dashboard do AbacatePay

### Usuário redirecionado para URL errada
- Verifique a configuração de URL de retorno global no dashboard do AbacatePay
- Confirme que `NEXT_PUBLIC_APP_URL` está correta no `.env`

### Assinatura não ativa após pagamento
- Verifique os logs do servidor para confirmar que o webhook foi recebido
- Confirme que o `ABACATE_WEBHOOK_SECRET` está correto
- Use o botão "Processar Manualmente" enquanto diagnostica o problema

### Transação não encontrada no webhook
- O webhook busca transações pelo `billingId`
- Verifique se a transação foi criada corretamente no checkout
- Confirme que o `billingId` no webhook corresponde ao salvo no banco

---

## Testando o Fluxo Completo

1. **Checkout**: Usuário preenche o formulário em `/assinatura`
2. **Transação Criada**: Status `PENDING` é salvo no banco
3. **Pagamento**: Usuário paga via PIX ou Cartão no AbacatePay
4. **Webhook**: AbacatePay envia `billing.paid` para sua API
5. **Ativação**: Sistema atualiza status e ativa assinatura
6. **Retorno**: Usuário é redirecionado para `/sucesso`

Em produção, todo esse fluxo acontece automaticamente. Em desenvolvimento, use o botão manual após o passo 3.
