'use server';

import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth/session';
import { revalidatePath } from 'next/cache';

// ─── Defaults ─────────────────────────────────────────────────────────────────
// Inseridos automaticamente se a tabela estiver vazia.

const DEFAULT_LINKS = [
    {
        title: 'O Clã Ancestral — Assinatura Premium',
        url: '/cla-ancestral',
        emoji: '🔥',
        highlight: true,
        order: 0,
    },
    {
        title: 'Repelentes Naturais — Guia Completo',
        url: '/ebook-repelente',
        emoji: '🌿',
        highlight: false,
        order: 1,
    },
    {
        title: 'A Forja — Cronômetro de Jejum',
        url: '/jejum',
        emoji: '⚡',
        highlight: false,
        order: 2,
    },
    {
        title: 'Comunidade Gratuita',
        url: 'https://t.me/oancestral',
        emoji: '🏕️',
        highlight: false,
        order: 3,
    },
];

// ─── Guard ─────────────────────────────────────────────────────────────────────

async function requireAdmin() {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
        throw new Error('Acesso negado.');
    }
    return session;
}

// ─── Público ──────────────────────────────────────────────────────────────────

/** Retorna todos os links ativos ordenados por `order`. */
export async function getActiveLinks() {
    const links = await prisma.quickLink.findMany({
        where: { isActive: true },
        orderBy: { order: 'asc' },
    });
    return links;
}

// ─── Admin CRUD ───────────────────────────────────────────────────────────────

/** Retorna TODOS os links (ativos e inativos) para a tela admin. */
export async function getAllLinks() {
    await requireAdmin();

    const links = await prisma.quickLink.findMany({
        orderBy: { order: 'asc' },
    });

    // Semeadura única: se não há nenhum link ainda, cria os defaults.
    if (links.length === 0) {
        await prisma.quickLink.createMany({ data: DEFAULT_LINKS });
        return prisma.quickLink.findMany({ orderBy: { order: 'asc' } });
    }

    return links;
}

export async function createLink(data: {
    title: string;
    url: string;
    emoji?: string;
    imageUrl?: string;
    highlight?: boolean;
    order?: number;
}) {
    await requireAdmin();

    const title = data.title.trim();
    const url = data.url.trim();
    if (!title || !url) throw new Error('Título e URL são obrigatórios.');

    // Ordem padrão: após o último item existente.
    const last = await prisma.quickLink.findFirst({ orderBy: { order: 'desc' } });
    const order = data.order ?? (last ? last.order + 1 : 0);

    await prisma.quickLink.create({
        data: {
            title,
            url,
            emoji: data.emoji?.trim() || null,
            imageUrl: data.imageUrl?.trim() || null,
            highlight: data.highlight ?? false,
            order,
        },
    });
    revalidatePath('/links');
    revalidatePath('/admin/links');
}

export async function updateLink(
    id: string,
    data: Partial<{
        title: string;
        url: string;
        emoji: string;
        imageUrl: string;
        highlight: boolean;
        order: number;
        isActive: boolean;
    }>,
) {
    await requireAdmin();
    await prisma.quickLink.update({ where: { id }, data });
    revalidatePath('/links');
    revalidatePath('/admin/links');
}

export async function toggleLinkActive(id: string, isActive: boolean) {
    await requireAdmin();
    await prisma.quickLink.update({ where: { id }, data: { isActive } });
    revalidatePath('/links');
    revalidatePath('/admin/links');
}

export async function deleteLink(id: string) {
    await requireAdmin();
    await prisma.quickLink.delete({ where: { id } });
    revalidatePath('/links');
    revalidatePath('/admin/links');
}

/** Incrementa o contador de cliques de um link (chamado pelo API route). */
export async function incrementLinkClicks(id: string) {
    await prisma.quickLink.update({
        where: { id },
        data: { clicks: { increment: 1 } },
    });
}

/** Retorna o total de visualizações da página /links. */
export async function getLinksPageViews(): Promise<number> {
    await requireAdmin();
    const metric = await prisma.siteMetric.findUnique({
        where: { key: 'links_page_views' },
    });
    return metric?.value ?? 0;
}
