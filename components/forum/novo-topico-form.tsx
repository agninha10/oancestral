'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { ArrowLeft, Loader2, Send } from 'lucide-react';
import { createPost } from '@/app/actions/forum';
import type { CategoryWithCount } from '@/app/actions/forum';

interface NovoTopicoFormProps {
    categories: CategoryWithCount[];
}

export function NovoTopicoForm({ categories }: NovoTopicoFormProps) {
    const router = useRouter();
    const [isPending, startT] = useTransition();
    const [title,      setTitle]      = useState('');
    const [content,    setContent]    = useState('');
    const [categoryId, setCategoryId] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        startT(async () => {
            const res = await createPost({ title, content, categoryId });
            if (res.success) {
                toast.success('Tópico criado com sucesso!');
                router.push(`/comunidade/post/${res.postSlug}`);
            } else {
                toast.error(res.error);
            }
        });
    };

    const canSubmit = title.trim().length >= 3 && content.trim().length >= 10 && categoryId && !isPending;

    return (
        <div className="space-y-6 max-w-2xl">
            <Link href="/comunidade" className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-amber-400 transition-colors">
                <ArrowLeft className="h-4 w-4" /> Voltar ao fórum
            </Link>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 space-y-6">
                <div>
                    <h1 className="font-serif text-2xl font-bold text-amber-400">Novo Tópico</h1>
                    <p className="mt-1 text-sm text-zinc-500">
                        Compartilhe sua experiência, dúvida ou descoberta com a comunidade.
                    </p>
                </div>

                {categories.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-zinc-700 py-10 text-center">
                        <p className="text-zinc-500 text-sm">Nenhuma categoria disponível.</p>
                        <p className="text-zinc-600 text-xs mt-1">O administrador precisa criar categorias no painel admin.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Category */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-300">Categoria</label>
                            <div className="grid grid-cols-2 gap-2">
                                {categories.map((cat) => (
                                    <button
                                        key={cat.id}
                                        type="button"
                                        onClick={() => setCategoryId(cat.id)}
                                        className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors text-left ${
                                            categoryId === cat.id
                                                ? 'border-amber-500 bg-amber-500/10 text-amber-400'
                                                : 'border-zinc-700 bg-zinc-800/50 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200'
                                        }`}
                                    >
                                        <span>{cat.icon}</span>
                                        <span className="leading-snug">{cat.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Title */}
                        <div className="space-y-2">
                            <label htmlFor="title" className="text-sm font-medium text-zinc-300">Título</label>
                            <input
                                id="title"
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Um título claro e direto ao ponto"
                                maxLength={120}
                                disabled={isPending}
                                className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-amber-500/60 focus:outline-none focus:ring-1 focus:ring-amber-500/30 disabled:opacity-50"
                            />
                            <p className="text-right text-xs text-zinc-600">{title.length}/120</p>
                        </div>

                        {/* Content */}
                        <div className="space-y-2">
                            <label htmlFor="content" className="text-sm font-medium text-zinc-300">Conteúdo</label>
                            <textarea
                                id="content"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Escreva seu tópico com detalhes. Quanto mais contexto, melhor a discussão."
                                rows={8}
                                disabled={isPending}
                                className="w-full resize-none rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-amber-500/60 focus:outline-none focus:ring-1 focus:ring-amber-500/30 disabled:opacity-50"
                            />
                        </div>

                        <div className="flex justify-end pt-2">
                            <button
                                type="submit"
                                disabled={!canSubmit}
                                className="flex items-center gap-2 rounded-lg bg-amber-500 px-6 py-3 font-bold text-zinc-950 transition-colors hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                {isPending
                                    ? <><Loader2 className="h-4 w-4 animate-spin" />Publicando…</>
                                    : <><Send className="h-4 w-4" />Publicar na Forja</>
                                }
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
