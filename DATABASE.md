# O Ancestral - Database Setup

## 🐘 PostgreSQL Docker Container

O banco de dados está rodando em um container Docker com as seguintes configurações:

- **Image:** postgres:16-alpine
- **Container Name:** oancestral-db
- **Port:** 5433 (host) → 5432 (container)
- **Database:** oancestral
- **User:** oancestral
- **Password:** oancestral_dev_2024

### Comandos Docker

```bash
# Iniciar o container
docker-compose up -d

# Parar o container
docker-compose down

# Ver logs
docker-compose logs -f postgres

# Verificar status
docker ps | grep oancestral

# Acessar o PostgreSQL CLI
docker exec -it oancestral-db psql -U oancestral -d oancestral
```

## 📊 Prisma

### Comandos Úteis

```bash
# Criar nova migration
npm run db:migrate

# Aplicar schema sem criar migration (dev only)
npm run db:push

# Abrir Prisma Studio (GUI para o banco)
npm run db:studio

# Gerar Prisma Client
npm run db:generate

# Executar seed (quando implementado)
npm run db:seed
```

### Schema Models

O schema atual inclui os seguintes models:

1. **User** - Usuários e autenticação
2. **Recipe** - Receitas ancestrais
   - RecipeIngredient
   - RecipeInstruction
3. **BlogPost** - Posts do blog
4. **Course** - Cursos da plataforma
5. **Lesson** - Aulas dos cursos
6. **CourseEnrollment** - Matrículas dos usuários
7. **LessonProgress** - Progresso nas aulas

### Enums

- **RecipeCategory:** CARNIVORE, LOW_CARB, KETO, PALEO, ANCESTRAL, OTHER
- **BlogCategory:** NUTRITION, FASTING, TRAINING, MINDSET, LIFESTYLE, OTHER

## 🔌 Conexão

A string de conexão está configurada em `.env.local`:

```
DATABASE_URL="postgresql://oancestral:oancestral_dev_2024@localhost:5433/oancestral"
```

### Usando o Prisma Client

```typescript
import { prisma } from '@/lib/prisma'

// Exemplo: buscar todos os usuários
const users = await prisma.user.findMany()

// Exemplo: criar uma receita
const recipe = await prisma.recipe.create({
  data: {
    title: "Bife com Manteiga",
    slug: "bife-com-manteiga",
    description: "Receita carnívora simples e deliciosa",
    content: "...",
    category: "CARNIVORE",
    authorId: "user-id",
    published: true
  }
})
```

## 🚀 Próximos Passos

1. Implementar seed data (receitas, posts, cursos de exemplo)
2. Criar API endpoints para CRUD operations
3. Implementar autenticação (NextAuth.js ou Supabase Auth)
4. Adicionar validação com Zod nos endpoints
5. Implementar paginação e filtros
