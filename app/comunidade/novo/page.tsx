import { getCategories } from '@/app/actions/forum';
import { NovoTopicoForm } from '@/components/forum/novo-topico-form';

export const dynamic = 'force-dynamic';

export default async function NovoTopicoPage() {
    const categories = await getCategories();

    return <NovoTopicoForm categories={categories} />;
}
