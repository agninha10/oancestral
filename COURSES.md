# Sistema de Cursos LMS - O Ancestral

## Visão Geral

Sistema completo de LMS (Learning Management System) integrado à plataforma O Ancestral, permitindo a criação e gerenciamento de cursos com vídeos, módulos hierárquicos e controle de progresso dos alunos.

## Estrutura do Banco de Dados

### Modelos Criados

#### Course
- `id`: ID único do curso
- `title`: Título do curso
- `slug`: URL amigável (ex: fundamentos-nutricao-ancestral)
- `description`: Descrição detalhada do curso
- `coverImage`: URL da imagem de capa
- `isPremium`: Se true, requer assinatura ativa (padrão: true)
- `published`: Status de publicação
- `featured`: Curso em destaque
- `createdAt`, `updatedAt`: Timestamps

#### Module
- `id`: ID único do módulo
- `title`: Título do módulo
- `order`: Ordem de exibição
- `courseId`: Referência ao curso
- Relação: Pertence a um Course, possui múltiplas Lessons

#### Lesson
-  `id`: ID único da aula
- `title`: Título da aula
- `slug`: URL amigável da aula
- `videoUrl`: URL do vídeo embed (YouTube/Vimeo/Panda Video)
- `content`: Conteúdo HTML/Rich Text da aula
- `order`: Ordem de exibição dentro do módulo
- `isFree`: Se true, aula é gratuita (degustação)
- `moduleId`: Referência ao módulo

#### UserProgress
- `id`: ID único
- `userId`: Referência ao usuário
- `lessonId`: Referência à aula
- `isCompleted`: Status de conclusão
- `completedAt`: Data/hora de conclusão

## Funcionalidades Implementadas

### 1. Listagem de Cursos (/cursos)
- Grid responsivo estilo Netflix/Hotmart
- Cards com imagem de capa, título e descrição
- Badge "Premium" para cursos pagos
- Barra de progresso para alunos que já iniciaram
- Sistema de skeleton loading

### 2. Player de Vídeo (/cursos/[courseSlug]/[lessonSlug])

**Layout Desktop:**
- Sidebar lateral esquerda com módulos e aulas (accordion)
- Área principal com vídeo em destaque
- Conteúdo de texto abaixo do vídeo
- Botão "Marcar como Concluída"

**Layout Mobile:**
- Vídeo fixo no topo
- Lista de módulos/aulas abaixo do vídeo (colapsável)

**Controle de Acesso:**
- Aulas gratuitas: Liberadas para todos
- Aulas premium: Verificação de `subscriptionStatus === 'ACTIVE'`
- Lock screen com CTA para assinatura quando não autorizado

**Funcionalidades:**
- Marcar aula como concluída
- Auto-avançar para próxima aula após conclusão
- Indicador visual de aulas completadas
- Progresso persistido no banco de dados

### 3. Admin Dashboard (/admin/cursos)

**Gerenciamento de Cursos:**
- Listagem de todos os cursos
- Criar novo curso com:
  - Título e slug auto-gerado
  - Descrição
  - Upload de imagem de capa (Cloudinary)
  - Flag Premium/Gratuito
  - Status de publicação

**Gerenciamento de Módulos:**
- Adicionar módulos ao curso
- Reordenar módulos (drag & drop visual)
- Editar/excluir módulos

**Gerenciamento de Aulas:**
- Adicionar aulas ao módulo
- Campos:
  - Título e slug
  - URL do vídeo embed
  - Conteúdo rich text
  - Flag de aula gratuita
- Reordenar aulas
- Editar/excluir aulas

## APIs Criadas

### Públicas
- `GET /api/cursos` - Lista cursos publicados (com progresso se autenticado)
- `GET /api/cursos/[slug]/progress` - Progresso do usuário no curso
- `POST /api/cursos/progress` - Marcar aula como concluída

### Admin (requer autenticação de admin)
- `GET/POST /api/admin/cursos` - Listar/criar cursos
- `GET/PUT/DELETE /api/admin/cursos/[id]` - Gerenciar curso específico
- `POST /api/admin/cursos/[id]/modulos` - Criar módulo
- `DELETE /api/admin/cursos/[id]/modulos/[moduleId]` - Excluir módulo
- `GET /api/admin/modulos/[id]` - Buscar módulo com aulas
- `POST /api/admin/modulos/[id]/aulas` - Criar aula
- `PUT/DELETE /api/admin/aulas/[id]` - Editar/excluir aula

## Componentes Criados

### Frontend
- `CourseCard` - Card de curso na listagem
- `CourseListClient` - Grid de cursos com loading states
- `CourseSidebar` - Navegação de módulos/aulas
- `LessonPlayer` - Player de vídeo com controles

### UI
- `Skeleton` - Componente de loading placeholder

## Como Usar

### Criar um Novo Curso

1. Acesse `/admin/cursos`
2. Clique em "Novo Curso"
3. Preencha os dados e salve
4. Adicione módulos ao curso
5. Para cada módulo, adicione aulas
6. Publique o curso quando estiver pronto

### Configurar Vídeos

Use URLs de embed dos players:
- **YouTube**: `https://www.youtube.com/embed/VIDEO_ID`
- **Vimeo**: `https://player.vimeo.com/video/VIDEO_ID`
- **Panda Video**: URL fornecida pelo Panda

### Controlar Acesso

1. **Curso Gratuito**: Desmarque "Curso Premium"
2. **Curso Premium**: Mantenha marcado - requer subscription ativa
3. **Aulas de Degustação**: Marque aulas específicas como "Aula gratuita"

## Melhorias Futuras Sugeridas

- [ ] Editor WYSIWYG para conteúdo das aulas
- [ ] Sistema de drag & drop para reordenar módulos e aulas
- [ ] Certificado de conclusão
- [ ] Quizzes e exercícios
- [ ] Comentários nas aulas
- [ ] Download de materiais complementares
- [ ] Anotações pessoais do aluno
- [ ] Controle de velocidade do vídeo
- [ ] Legendas/transcrições
- [ ] Analytics de engajamento

## Tecnologias Utilizadas

- Next.js 14 (App Router)
- Prisma ORM
- PostgreSQL
- TypeScript
- Tailwind CSS
- Shadcn/UI
- Lucide Icons

## Navegação

O link "Cursos" foi adicionado automaticamente ao:
- Header principal do site
- Sidebar do painel administrativo
