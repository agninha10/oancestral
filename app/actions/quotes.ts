'use server';

import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth/session';
import { revalidatePath } from 'next/cache';

// ─── Guard ────────────────────────────────────────────────────────────────────

async function requireAdmin() {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
        throw new Error('Acesso Negado.');
    }
    return session;
}

// ─── Público ──────────────────────────────────────────────────────────────────

/**
 * Retorna uma frase ativa aleatória.
 * Busca todas as ativas (tabela pequena) e sorteia no JS para evitar
 * RANDOM() no banco (sem índice eficiente no Postgres para isso).
 * Retorna null se não houver frases cadastradas.
 */
export async function getRandomActiveQuote() {
    const quotes = await prisma.stoicQuote.findMany({
        where: { isActive: true },
        select: { text: true, author: true },
    });
    if (quotes.length === 0) return null;
    return quotes[Math.floor(Math.random() * quotes.length)];
}

// ─── Admin CRUD ───────────────────────────────────────────────────────────────

export async function getQuotes() {
    await requireAdmin();
    return prisma.stoicQuote.findMany({
        orderBy: { createdAt: 'desc' },
    });
}

export async function createQuote(data: { text: string; author: string }) {
    await requireAdmin();

    const text = data.text.trim();
    const author = data.author.trim();
    if (!text || !author) throw new Error('Texto e autor são obrigatórios.');

    await prisma.stoicQuote.create({ data: { text, author } });
    revalidatePath('/admin/frases');
}

export async function updateQuote(
    id: string,
    data: { text?: string; author?: string },
) {
    await requireAdmin();
    await prisma.stoicQuote.update({ where: { id }, data });
    revalidatePath('/admin/frases');
}

export async function toggleQuoteStatus(id: string, isActive: boolean) {
    await requireAdmin();
    await prisma.stoicQuote.update({ where: { id }, data: { isActive } });
    revalidatePath('/admin/frases');
}

export async function deleteQuote(id: string) {
    await requireAdmin();
    await prisma.stoicQuote.delete({ where: { id } });
    revalidatePath('/admin/frases');
}
