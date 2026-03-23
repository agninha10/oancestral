'use client';

import { useState, useTransition } from 'react';
import { Trash2, ToggleLeft, ToggleRight, Plus, Loader2, Quote } from 'lucide-react';
import {
    createQuote,
    deleteQuote,
    toggleQuoteStatus,
} from '@/app/actions/quotes';

type Quote = {
    id: string;
    text: string;
    author: string;
    isActive: boolean;
    createdAt: Date;
};

export function QuotesManager({ initialQuotes }: { initialQuotes: Quote[] }) {
    const [quotes, setQuotes] = useState<Quote[]>(initialQuotes);
    const [text, setText] = useState('');
    const [author, setAuthor] = useState('');
    const [error, setError] = useState('');
    const [isPending, startTransition] = useTransition();

    // ── Create ──────────────────────────────────────────────────────────────
    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim() || !author.trim()) {
            setError('Preencha o texto e o autor.');
            return;
        }
        setError('');
        startTransition(async () => {
            try {
                await createQuote({ text, author });
                // Optimistic: recarrega via revalidatePath — Next.js atualiza a página
                // mas como é um Client Component, forçamos um reload parcial via router.refresh
                setText('');
                setAuthor('');
                // Reload de dados: em Client Component usamos router.refresh()
                // mas como isso causa flash, vamos só atualizar o estado local e deixar
                // o revalidatePath cuidar do re-fetch ao recarregar
                window.location.reload();
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Erro ao criar frase.');
            }
        });
    };

    // ── Toggle ──────────────────────────────────────────────────────────────
    const handleToggle = (id: string, current: boolean) => {
        setQuotes((prev) =>
            prev.map((q) => (q.id === id ? { ...q, isActive: !current } : q)),
        );
        startTransition(async () => {
            try {
                await toggleQuoteStatus(id, !current);
            } catch {
                // Reverte optimistic update
                setQuotes((prev) =>
                    prev.map((q) => (q.id === id ? { ...q, isActive: current } : q)),
                );
            }
        });
    };

    // ── Delete ──────────────────────────────────────────────────────────────
    const handleDelete = (id: string) => {
        setQuotes((prev) => prev.filter((q) => q.id !== id));
        startTransition(async () => {
            try {
                await deleteQuote(id);
            } catch {
                // Restaura se falhar (precisaria de um refetch real; simplificamos)
                window.location.reload();
            }
        });
    };

    const active = quotes.filter((q) => q.isActive).length;

    return (
        <div className="space-y-8">

            {/* ── Formulário de criação ─────────────────────────────────── */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
                <h2 className="mb-5 flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-zinc-400">
                    <Plus className="h-4 w-4 text-amber-500" />
                    Adicionar Frase
                </h2>

                <form onSubmit={handleCreate} className="space-y-4">
                    <div>
                        <label className="mb-1.5 block text-xs font-medium text-zinc-500">
                            Texto da Frase
                        </label>
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder='"A verdadeira soberania é o domínio sobre si mesmo."'
                            rows={3}
                            className="w-full resize-none rounded-xl border border-zinc-700 bg-zinc-800/60 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/30"
                        />
                    </div>

                    <div>
                        <label className="mb-1.5 block text-xs font-medium text-zinc-500">
                            Autor
                        </label>
                        <input
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                            placeholder="Marco Aurélio"
                            className="w-full rounded-xl border border-zinc-700 bg-zinc-800/60 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/30"
                        />
                    </div>

                    {error && (
                        <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-400">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={isPending}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 py-3 text-sm font-bold text-zinc-950 hover:bg-amber-400 disabled:opacity-50 transition-colors"
                    >
                        {isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Plus className="h-4 w-4" />
                        )}
                        Adicionar Frase
                    </button>
                </form>
            </div>

            {/* ── Lista de frases ───────────────────────────────────────── */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4">
                    <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-400">
                        Frases Cadastradas
                    </h2>
                    <span className="rounded-lg bg-zinc-800 px-2.5 py-1 text-xs text-zinc-400">
                        {active} ativa{active !== 1 ? 's' : ''} · {quotes.length} total
                    </span>
                </div>

                {quotes.length === 0 ? (
                    <div className="flex flex-col items-center gap-2 px-6 py-16 text-center">
                        <Quote className="h-8 w-8 text-zinc-700" />
                        <p className="text-sm text-zinc-600">Nenhuma frase cadastrada ainda.</p>
                    </div>
                ) : (
                    <ul className="divide-y divide-zinc-800/60">
                        {quotes.map((quote) => (
                            <li
                                key={quote.id}
                                className={`flex items-start gap-4 px-6 py-4 transition-colors ${
                                    quote.isActive ? '' : 'opacity-40'
                                }`}
                            >
                                {/* Quote content */}
                                <div className="min-w-0 flex-1 space-y-1">
                                    <p className="text-sm italic text-zinc-300 leading-relaxed">
                                        &ldquo;{quote.text}&rdquo;
                                    </p>
                                    <p className="text-xs text-zinc-600">— {quote.author}</p>
                                </div>

                                {/* Actions */}
                                <div className="flex shrink-0 items-center gap-2 pt-0.5">
                                    {/* Toggle ativo/inativo */}
                                    <button
                                        onClick={() => handleToggle(quote.id, quote.isActive)}
                                        title={quote.isActive ? 'Desativar' : 'Ativar'}
                                        className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs transition-colors hover:bg-zinc-800"
                                    >
                                        {quote.isActive ? (
                                            <>
                                                <ToggleRight className="h-4 w-4 text-amber-500" />
                                                <span className="hidden text-amber-500 sm:inline">Ativa</span>
                                            </>
                                        ) : (
                                            <>
                                                <ToggleLeft className="h-4 w-4 text-zinc-600" />
                                                <span className="hidden text-zinc-600 sm:inline">Inativa</span>
                                            </>
                                        )}
                                    </button>

                                    {/* Excluir */}
                                    <button
                                        onClick={() => handleDelete(quote.id)}
                                        title="Excluir frase"
                                        className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-700 hover:bg-red-500/10 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
