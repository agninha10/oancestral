# Guia de Deploy no Vercel

Este guia explica como fazer o deploy do projeto **O Ancestral** na plataforma Vercel.

## 📋 Pré-requisitos

- Conta no [Vercel](https://vercel.com)
- Conta no GitHub (repositório do projeto)
- Banco de dados PostgreSQL em produção

## 🗄️ Configurar Banco de Dados

Você precisa de um banco PostgreSQL em produção. Recomendações:

### Opção 1: Neon (Recomendado - Gratuito)
1. Acesse [neon.tech](https://neon.tech)
2. Crie uma conta e um novo projeto
3. Copie a `DATABASE_URL` fornecida
4. O Neon é serverless e tem tier gratuito generoso

### Opção 2: Vercel Postgres
1. No dashboard do Vercel, vá em Storage
2. Crie um novo Postgres Database
3. A URL será automaticamente adicionada às variáveis de ambiente

### Opção 3: Supabase
1. Acesse [supabase.com](https://supabase.com)
2. Crie um novo projeto
3. Vá em Settings > Database
4. Copie a Connection String (modo "Session")

### Opção 4: Railway
1. Acesse [railway.app](https://railway.app)
2. Crie um novo projeto PostgreSQL
3. Copie a `DATABASE_URL` fornecida

## 🚀 Deploy no Vercel

### 1. Preparar Repositório

Certifique-se de que seu código está no GitHub:

```bash
git add .
git commit -m "Preparar para deploy no Vercel"
git push origin main
```

### 2. Importar Projeto no Vercel

1. Acesse [vercel.com/new](https://vercel.com/new)
2. Importe seu repositório do GitHub
3. Configure o projeto:
   - **Framework Preset**: Next.js (detectado automaticamente)
   - **Root Directory**: `./` (raiz do projeto)
   - **Build Command**: Deixe em branco (usa `vercel.json`)
   - **Output Directory**: Deixe em branco (padrão Next.js)

### 3. Configurar Variáveis de Ambiente

Na seção "Environment Variables", adicione todas as variáveis obrigatórias:

#### DATABASE_URL
```bash
DATABASE_URL=postgresql://user:password@host:port/database?schema=public
```
> Use a URL do banco de dados que você configurou anteriormente

#### JWT_SECRET
```bash
JWT_SECRET=sua-chave-secreta-aqui
```
> **IMPORTANTE**: Gere uma nova chave segura para produção:
> ```bash
> node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
> ```

#### Cloudinary (para upload de imagens)

Crie uma conta gratuita no [Cloudinary](https://cloudinary.com):
1. Acesse [cloudinary.com](https://cloudinary.com) e crie uma conta
2. No dashboard, copie as credenciais:

```bash
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=seu-cloud-name
CLOUDINARY_API_KEY=sua-api-key
CLOUDINARY_API_SECRET=seu-api-secret
```

> [!TIP]
> As credenciais do Cloudinary estão disponíveis no dashboard após o login, na seção "Product Environment Credentials"


### 4. Deploy

1. Clique em **Deploy**
2. Aguarde o build completar (2-5 minutos)
3. Vercel fornecerá uma URL de produção

> [!NOTE]
> **Deploy Totalmente Automatizado**: O build do Vercel executará automaticamente:
> - Geração do Prisma Client
> - Migrações do banco de dados (`prisma migrate deploy`)
> - População do banco com dados iniciais (`prisma db seed`)
> - Build do Next.js
>
> Você **NÃO precisa** executar comandos manuais após o deploy! 🎉

## ✅ Verificar Deploy

1. Acesse a URL fornecida pelo Vercel
2. Teste as principais funcionalidades:
   - [ ] Página inicial carrega
   - [ ] Navegação funciona
   - [ ] Login/cadastro funcionam
   - [ ] Receitas são exibidas (dados do seed)
   - [ ] Blog posts são exibidos (dados do seed)
   - [ ] Upload de imagens funciona (criar/editar receita)

## 🔧 Configurações Adicionais

### Domínio Customizado

1. No dashboard do Vercel, vá em Settings > Domains
2. Adicione seu domínio
3. Configure os DNS conforme instruções

### Variáveis de Ambiente por Ambiente

Você pode configurar variáveis diferentes para:
- **Production**: Deploy da branch `main`
- **Preview**: Deploy de PRs e outras branches
- **Development**: Ambiente local

### Logs e Monitoramento

- Acesse o dashboard do Vercel para ver logs em tempo real
- Configure alertas em Settings > Notifications

## 🐛 Troubleshooting

### Erro: "Prisma Client not generated"

**Solução**: O script `postinstall` deve resolver isso. Se persistir:
1. Verifique se `package.json` tem `"postinstall": "prisma generate"`
2. Force um novo deploy: `vercel --force`

### Erro: "Can't reach database server"

**Solução**: Verifique se:
1. A `DATABASE_URL` está correta nas variáveis de ambiente
2. O banco de dados permite conexões externas
3. A URL usa SSL: adicione `?sslmode=require` ao final

### Erro 500 em produção

**Solução**:
1. Verifique os logs no dashboard do Vercel
2. Confirme que todas as variáveis de ambiente estão configuradas
3. Verifique se as migrações foram executadas

### Build falha

**Solução**:
1. Verifique os logs de build no Vercel
2. Teste o build localmente: `npm run build`
3. Certifique-se de que não há erros de TypeScript

## 📚 Recursos Úteis

- [Documentação Vercel](https://vercel.com/docs)
- [Documentação Prisma](https://www.prisma.io/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

## 🔄 Atualizações Futuras

Para deployar novas versões:

```bash
git add .
git commit -m "Sua mensagem"
git push origin main
```

O Vercel automaticamente detecta o push e faz o deploy! 🎉
