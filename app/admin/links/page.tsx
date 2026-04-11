import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/session';
import { getAllLinks, getLinksPageViews } from '@/app/actions/quick-links';
import { LinksManager } from './links-manager';

export const dynamic = 'force-dynamic';

export default async function AdminLinksPage() {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') redirect('/login');

    const [links, pageViews] = await Promise.all([
        getAllLinks(),
        getLinksPageViews(),
    ]);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-zinc-100">Links Rápidos</h1>
                <p className="mt-1 text-sm text-zinc-500">
                    Gerencie os links exibidos em{' '}
                    <a
                        href="/links"
                        target="_blank"
                        className="text-amber-400 underline underline-offset-2 hover:text-amber-300"
                    >
                        oancestral.com.br/links
                    </a>
                    . Visualizações e cliques são rastreados automaticamente.
                </p>
            </div>

            <LinksManager initialLinks={links} pageViews={pageViews} />
        </div>
    );
}
