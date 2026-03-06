# Google Indexing API - Guia de Configuração

## Visão Geral
Este projeto agora integra a Google Indexing API para notificar automaticamente o Google quando posts do blog ou receitas são publicados.

## Pré-requisitos

### 1. Criar um Projeto no Google Cloud Console
1. Acesse: https://console.cloud.google.com/
2. Crie um novo projeto ou selecione um existente
3. Ative a **Indexing API** para o projeto:
   - Navegue até "APIs & Services" > "Library"
   - Busque por "Indexing API"
   - Clique em "Enable"

### 2. Criar uma Service Account
1. No Google Cloud Console, vá para "APIs & Services" > "Credentials"
2. Clique em "Create Credentials" > "Service Account"
3. Preencha:
   - **Nome**: `indexing-api-service`
   - **ID**: será gerado automaticamente
4. Clique em "Create and Continue"
5. Skip as permissões opcionais e clique em "Done"

### 3. Gerar Chave JSON
1. Na lista de Service Accounts, clique na conta recém-criada
2. Vá para a aba "Keys"
3. Clique em "Add Key" > "Create new key"
4. Escolha o formato **JSON**
5. O arquivo será baixado automaticamente

### 4. Configurar o Search Console
1. Acesse: https://search.google.com/search-console
2. Adicione seu site se ainda não estiver lá
3. Vá para "Settings" > "Users and permissions"
4. Clique em "Add user"
5. Adicione o email da Service Account (encontrado no arquivo JSON: `client_email`)
6. Defina a permissão como **Owner**

## Configuração das Variáveis de Ambiente

Adicione as seguintes variáveis ao seu arquivo `.env`:

```env
# Google Indexing API
GOOGLE_CLIENT_EMAIL="seu-service-account@seu-projeto.iam.gserviceaccount.com"
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nSua chave privada aqui...\n-----END PRIVATE KEY-----\n"
```

### Como obter os valores do arquivo JSON:

Abra o arquivo JSON baixado e copie:
- `client_email` → `GOOGLE_CLIENT_EMAIL`
- `private_key` → `GOOGLE_PRIVATE_KEY` (copie exatamente como está, incluindo os `\n`)

**Importante**: No arquivo `.env`, mantenha as aspas duplas e os caracteres `\n` exatamente como estão no JSON. O código já faz o tratamento correto desses caracteres.

## Como Funciona

### Fluxo Automático
1. Um administrador cria ou atualiza um post do blog ou receita no painel admin
2. Se o conteúdo for marcado como `published: true`
3. O sistema automaticamente:
   - Salva o conteúdo no banco de dados
   - Monta a URL final (`/blog/{slug}` ou `/receitas/{slug}`)
   - Envia uma notificação para o Google Indexing API
   - Continua o fluxo normalmente (não bloqueia a resposta)

### Arquivos Modificados

#### Novo arquivo criado:
- `lib/google-indexing.ts` - Utilitário de notificação do Google

#### Arquivos atualizados:
- `app/api/admin/blog/route.ts` - POST de novos posts
- `app/api/admin/blog/[id]/route.ts` - PUT de posts existentes
- `app/api/admin/receitas/route.ts` - POST de novas receitas
- `app/api/admin/receitas/[id]/route.ts` - PUT de receitas existentes

### Tratamento de Erros

A função é **silenciosa** por design:
- Se as credenciais não estiverem configuradas, apenas loga um aviso
- Se o Google API falhar, loga o erro mas não quebra o fluxo
- O salvamento do conteúdo sempre funciona, independente da indexação

## Monitoramento

Para verificar se está funcionando:

1. **Logs no Console**:
   ```
   [Google Indexing] URL notificada com sucesso: https://seusite.com/blog/meu-post
   ```

2. **Google Search Console**:
   - Acesse: https://search.google.com/search-console
   - Vá para "URL Inspection"
   - Cole a URL publicada
   - Você verá o status de indexação

## Troubleshooting

### "Credenciais não configuradas"
- Verifique se as variáveis `GOOGLE_CLIENT_EMAIL` e `GOOGLE_PRIVATE_KEY` estão no `.env`
- Reinicie o servidor após adicionar as variáveis

### "Permission denied" ou "Unauthorized"
- Certifique-se de que a Service Account foi adicionada ao Search Console com permissão **Owner**
- Pode levar alguns minutos para as permissões propagarem

### "API not enabled"
- Verifique se a Indexing API está ativada no Google Cloud Console
- Vá para "APIs & Services" > "Enabled APIs & services"

## Limitações

- **Quota**: 200 requisições por dia (suficiente para a maioria dos casos)
- **Escopo**: Funciona apenas para URLs do domínio verificado no Search Console
- **Velocidade**: A indexação não é instantânea; pode levar horas ou dias

## Referências

- [Google Indexing API Documentation](https://developers.google.com/search/apis/indexing-api/v3/quickstart)
- [Search Console Help](https://support.google.com/webmasters/)
