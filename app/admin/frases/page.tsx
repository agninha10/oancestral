import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/session';
import { getQuotes } from '@/app/actions/quotes';
import { QuotesManager } from './quotes-manager';

export const dynamic = 'force-dynamic';

export default async function FrasesPage() {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') redirect('/login');

    const quotes = await getQuotes();

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-zinc-100">Frases Estoicas</h1>
                <p className="mt-1 text-sm text-zinc-500">
                    Gerencie as frases exibidas aleatoriamente no dashboard dos alunos.
                </p>
            </div>
            <QuotesManager initialQuotes={quotes} />
        </div>
    );
}
