/**
 * ─────────────────────────────────────────────────────────────────────────────
 * CONFIGURAÇÃO DE ACESSO POR PRODUTO
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Para adicionar um novo produto:
 * 1. Adicione a chave correspondente ao `product` salvo em `Transaction.product`
 * 2. Preencha os campos abaixo
 * 3. Para ebooks: coloque o PDF em `private/ebooks/<nome>.pdf`
 *    A URL de download é gerada automaticamente via /api/download/<produto>
 *    (requer o cliente logado e com a compra confirmada)
 * 4. Para plataforma/assinatura: preencha apenas `accessUrl`
 * ─────────────────────────────────────────────────────────────────────────────
 */

export type ProductAccessType = 'ebook' | 'platform';

export interface ProductAccessConfig {
    /** Nome de exibição do produto */
    label: string;

    /** Tipo de entrega do produto */
    type: ProductAccessType;

    /** Emoji/ícone textual para o e-mail */
    emoji: string;

    /**
     * Caminho do PDF relativo à pasta /private do projeto.
     * Ex: 'ebooks/jejum.pdf'  →  arquivo em /private/ebooks/jejum.pdf
     * Apenas para type === 'ebook'.
     */
    privateFilePath?: string;

    /**
     * URL de acesso enviada no botão do e-mail.
     * - Ebooks: rota do portal onde o cliente baixa o arquivo.
     * - Plataforma: dashboard de conteúdo premium.
     */
    accessUrl: string;

    // ── Conteúdo do e-mail de acesso ─────────────────────────────────────────

    /** Assunto do e-mail */
    emailSubject: string;

    /** Título principal do card do e-mail */
    emailTitle: string;

    /** Subtítulo/nome completo do produto */
    emailSubtitle: string;

    /** Parágrafo de instruções no e-mail */
    emailBody: string;

    /** Rótulo do botão CTA */
    emailCTALabel: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Mapeamento: Transaction.product → configuração de acesso
// ─────────────────────────────────────────────────────────────────────────────

export const PRODUCT_ACCESS_CONFIG: Record<string, ProductAccessConfig> = {
    // ── Livro de Receitas Ancestrais ──────────────────────────────────────────
    'livro-ancestral': {
        label: 'Livro de Receitas Ancestrais',
        type: 'ebook',
        emoji: '📖',
        privateFilePath: 'ebooks/livro-ancestral.pdf',
        accessUrl: '/dashboard/ebooks',
        emailSubject: 'Seu Livro de Receitas Ancestrais — Acesso ao Download',
        emailTitle: 'Seu livro está pronto!',
        emailSubtitle: 'Manual da Cozinha Ancestral — Acesso Vitalício',
        emailBody:
            'Seu ebook já está disponível no portal. Acesse com seu e-mail e senha ' +
            'e vá até "Meus Ebooks" para baixar o PDF a qualquer momento.',
        emailCTALabel: 'Baixar Meu Ebook',
    },

    // ── Guia de Jejum Intermitente ────────────────────────────────────────────
    jejum: {
        label: 'Guia de Jejum Intermitente',
        type: 'ebook',
        emoji: '⚡',
        privateFilePath: 'ebooks/jejum.pdf',
        accessUrl: '/dashboard/ebooks',
        emailSubject: 'Seu Guia de Jejum Intermitente — Acesso ao Download',
        emailTitle: 'Seu guia chegou!',
        emailSubtitle: 'Guia Definitivo do Jejum Intermitente',
        emailBody:
            'Seu ebook já está disponível no portal. Acesse com seu e-mail e senha ' +
            'e vá até "Meus Ebooks" para baixar o PDF a qualquer momento.',
        emailCTALabel: 'Baixar Meu Ebook',
    },

    // ── Repelentes Naturais ───────────────────────────────────────────────────
    repelente: {
        label: 'Repelentes Naturais',
        type: 'ebook',
        emoji: '🌿',
        privateFilePath: 'ebooks/repelentes-naturais-ebook.pdf',
        accessUrl: '/dashboard/ebooks',
        emailSubject: 'Seu E-book Repelentes Naturais — Acesso ao Download',
        emailTitle: 'Seu e-book chegou!',
        emailSubtitle: 'Repelentes Naturais — Proteja Sua Biologia',
        emailBody:
            'Seu ebook já está disponível no portal. Acesse com seu e-mail e senha ' +
            'e vá até "Meus Ebooks" para baixar o PDF a qualquer momento.',
        emailCTALabel: 'Baixar Meu Ebook',
    },

    // ── Testosterona Primal ───────────────────────────────────────────────────
    testosterona: {
        label: 'Testosterona Primal',
        type: 'ebook',
        emoji: '🔥',
        privateFilePath: 'ebooks/testo.pdf',
        accessUrl: '/dashboard/ebooks',
        emailSubject: 'Seu E-book Testosterona Primal — Acesso ao Download',
        emailTitle: 'O Protocolo chegou!',
        emailSubtitle: 'Testosterona Primal — Dieta da Selva',
        emailBody:
            'Seu e-book já está disponível no portal. Acesse com seu e-mail e senha ' +
            'e vá até "Meus Ebooks" para baixar o PDF a qualquer momento. ' +
            'Bons 30 dias de protocolo.',
        emailCTALabel: 'Baixar Meu Ebook',
    },

    // ── Assinatura Mensal ─────────────────────────────────────────────────────
    mensal: {
        label: 'Assinatura Mensal — Clã Ancestral',
        type: 'platform',
        emoji: '👑',
        accessUrl: '/dashboard',
        emailSubject: 'Seu Acesso Premium ao O Ancestral está ativo',
        emailTitle: 'Bem-vindo ao Clã Ancestral!',
        emailSubtitle: 'Assinatura Mensal — Acesso Premium',
        emailBody:
            'Seu acesso premium está ativo. Entre no portal com seu e-mail e senha para ' +
            'desbloquear receitas exclusivas, artigos aprofundados, aulas em vídeo e a ' +
            'comunidade privada.',
        emailCTALabel: 'Acessar o Portal Premium',
    },

    // ── Assinatura Anual ──────────────────────────────────────────────────────
    anual: {
        label: 'Assinatura Anual — Clã Ancestral',
        type: 'platform',
        emoji: '👑',
        accessUrl: '/dashboard',
        emailSubject: 'Seu Acesso Premium ao O Ancestral está ativo',
        emailTitle: 'Bem-vindo ao Clã Ancestral!',
        emailSubtitle: 'Assinatura Anual — Acesso Premium',
        emailBody:
            'Seu acesso premium está ativo. Entre no portal com seu e-mail e senha para ' +
            'desbloquear receitas exclusivas, artigos aprofundados, aulas em vídeo e a ' +
            'comunidade privada.',
        emailCTALabel: 'Acessar o Portal Premium',
    },
};
