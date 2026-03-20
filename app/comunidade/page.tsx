import { Suspense } from 'react';
import Link from 'next/link';
import { PenSquare } from 'lucide-react';
import { getPosts, getCategories } from '@/app/actions/forum';
import { PostCard } from '@/components/forum/post-card';
import { PostFeedSkeleton } from '@/components/forum/skeletons';

export const dynamic = 'force-dynamic';

interface PageProps {
    searchParams: Promise<{ category?: string }>;
}

async function Feed({ categorySlug }: { categorySlug?: string }) {
    const posts = await getPosts(categorySlug);

    if (posts.length === 0) {
        return (
            <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-zinc-800 py-16 text-center">
                <span className="text-4xl">🔥</span>
                <p className="text-zinc-400 font-medium">Nenhum tópico ainda.</p>
                <p className="text-sm text-zinc-600">Seja o primeiro a acender a Forja.</p>
                <Link
                    href="/comunidade/novo"
                    className="mt-2 rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-bold text-zinc-950 hover:bg-amber-400 transition-colors"
                >
                    Criar primeiro tópico
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {posts.map((post) => (
                <PostCard key={post.id} post={post} />
            ))}
        </div>
    );
}

export default async function ComunidadePage({ searchParams }: PageProps) {
    const { category } = await searchParams;

    // Category label for heading
    let headingLabel = 'Todos os Tópicos';
    if (category) {
        const cats = await getCategories();
        const cat = cats.find((c) => c.slug === category);
        if (cat) headingLabel = `${cat.icon} ${cat.name}`;
    }

    return (
        <div className="space-y-4">
            {/* Page header */}
            <div className="flex items-center justify-between">
                <h2 className="font-serif text-2xl font-bold text-zinc-100">{headingLabel}</h2>
                <Link
                    href="/comunidade/novo"
                    className="lg:hidden flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-bold text-zinc-950 hover:bg-amber-400 transition-colors"
                >
                    <PenSquare className="h-4 w-4" />
                    Novo
                </Link>
            </div>

            {/* Feed */}
            <Suspense fallback={<PostFeedSkeleton />}>
                <Feed categorySlug={category} />
            </Suspense>
        </div>
    );
}
