import { Suspense } from 'react';
import Link from 'next/link';
import { PenSquare } from 'lucide-react';
import { getPosts, getCategories } from '@/app/actions/forum';
import { getSession } from '@/lib/auth/session';
import { PostCard } from '@/components/forum/post-card';
import { PostFeedSkeleton } from '@/components/forum/skeletons';

export const dynamic = 'force-dynamic';

interface PageProps {
    searchParams: Promise<{ category?: string }>;
}

async function Feed({ categorySlug, isAuthenticated }: { categorySlug?: string; isAuthenticated: boolean }) {
    const posts = await getPosts(categorySlug);

    if (posts.length === 0) {
        return (
            <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-zinc-800 py-16 text-center">
                <span className="text-4xl">🔥</span>
                <p className="text-zinc-400 font-medium">Nenhum tópico ainda.</p>
                <p className="text-sm text-zinc-600">Seja o primeiro a acender a Forja.</p>
                {isAuthenticated && (
                    <Link
                        href="/comunidade/novo"
                        className="mt-2 rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-bold text-zinc-950 hover:bg-amber-400 transition-colors"
                    >
                        Criar primeiro tópico
                    </Link>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {posts.map((post) => (
                <PostCard key={post.id} post={post} isAuthenticated={isAuthenticated} />
            ))}
        </div>
    );
}

export default async function ComunidadePage({ searchParams }: PageProps) {
    const [{ category }, session] = await Promise.all([
        searchParams,
        getSession(),
    ]);

    const isAuthenticated = !!session;

    let headingLabel = 'Todos os Tópicos';
    if (category) {
        const cats = await getCategories();
        const cat = cats.find((c) => c.slug === category);
        if (cat) headingLabel = `${cat.icon} ${cat.name}`;
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="font-serif text-2xl font-bold text-zinc-100">{headingLabel}</h2>
                {isAuthenticated && (
                    <Link
                        href="/comunidade/novo"
                        className="lg:hidden flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-bold text-zinc-950 hover:bg-amber-400 transition-colors"
                    >
                        <PenSquare className="h-4 w-4" />
                        Novo
                    </Link>
                )}
            </div>

            <Suspense fallback={<PostFeedSkeleton />}>
                <Feed categorySlug={category} isAuthenticated={isAuthenticated} />
            </Suspense>
        </div>
    );
}
