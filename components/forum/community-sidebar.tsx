'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Flame, PenSquare } from 'lucide-react';
import type { CategoryWithCount } from '@/app/actions/forum';

interface CommunitySidebarProps {
    categories: CategoryWithCount[];
}

export function CommunitySidebar({ categories }: CommunitySidebarProps) {
    const searchParams = useSearchParams();
    const activeSlug = searchParams.get('category') ?? '';

    const totalPosts = categories.reduce((acc, c) => acc + c._count.posts, 0);

    return (
        <aside className="flex flex-col gap-2">
            {/* Header */}
            <div className="mb-2 px-1">
                <h2 className="font-serif text-xs font-semibold uppercase tracking-widest text-zinc-500">
                    Categorias
                </h2>
            </div>

            {/* All */}
            <Link
                href="/comunidade"
                className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    !activeSlug
                        ? 'bg-zinc-800 text-amber-400'
                        : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100'
                )}
            >
                <span className="text-base">🗡️</span>
                <span className="flex-1">Todos os Tópicos</span>
                <span className="text-xs text-zinc-600">{totalPosts}</span>
            </Link>

            {/* Category list */}
            {categories.map((cat) => (
                <Link
                    key={cat.slug}
                    href={`/comunidade?category=${cat.slug}`}
                    className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                        activeSlug === cat.slug
                            ? 'bg-zinc-800 text-amber-400'
                            : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100'
                    )}
                >
                    <span className="text-base">{cat.icon}</span>
                    <span className="flex-1 leading-snug">{cat.name}</span>
                    <span className="text-xs text-zinc-600">{cat._count.posts}</span>
                </Link>
            ))}

            {/* Divider */}
            <div className="my-3 border-t border-zinc-800" />

            {/* New post CTA */}
            <Link
                href="/comunidade/novo"
                className="flex items-center justify-center gap-2 rounded-lg bg-amber-500 px-4 py-3 font-bold text-zinc-950 transition-colors hover:bg-amber-400 active:bg-amber-600"
            >
                <PenSquare className="h-4 w-4" />
                NOVO TÓPICO
            </Link>

            {/* Community tagline */}
            <p className="mt-4 px-1 text-center text-[11px] leading-relaxed text-zinc-600">
                A Forja é o espaço dos que escolhem ser mais.
                <br />Compartilhe, aprenda, evolua.
            </p>
        </aside>
    );
}
