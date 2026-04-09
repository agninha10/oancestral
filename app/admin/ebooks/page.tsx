'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Eye, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Ebook {
    id: string;
    title: string;
    slug: string;
    subtitle: string | null;
    access: 'PURCHASE' | 'CLAN' | 'FREE';
    published: boolean;
    createdAt: string;
}

const ACCESS_LABELS: Record<string, string> = {
    PURCHASE: 'Compra',
    CLAN: 'Clã',
    FREE: 'Gratuito',
};

export default function EbooksAdminPage() {
    const [ebooks, setEbooks] = useState<Ebook[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/admin/ebooks')
            .then((r) => r.json())
            .then(setEbooks)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <p className="text-muted-foreground">Carregando ebooks...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Ebooks</h1>
                    <p className="text-muted-foreground">Gerencie os ebooks da plataforma</p>
                </div>
                <Link href="/admin/ebooks/novo">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Novo Ebook
                    </Button>
                </Link>
            </div>

            {ebooks.length === 0 ? (
                <Card className="p-12 text-center">
                    <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Nenhum ebook criado</h3>
                    <p className="text-muted-foreground mb-6">
                        Comece criando seu primeiro ebook
                    </p>
                    <Link href="/admin/ebooks/novo">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Criar Primeiro Ebook
                        </Button>
                    </Link>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {ebooks.map((ebook) => (
                        <Card key={ebook.id} className="p-6">
                            <div className="flex items-start justify-between gap-4">
                                <div className="space-y-2 flex-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h3 className="text-xl font-semibold">{ebook.title}</h3>
                                        <Badge variant={ebook.published ? 'default' : 'secondary'}>
                                            {ebook.published ? 'Publicado' : 'Rascunho'}
                                        </Badge>
                                        <Badge variant="outline">{ACCESS_LABELS[ebook.access]}</Badge>
                                    </div>
                                    {ebook.subtitle && (
                                        <p className="text-sm text-muted-foreground">{ebook.subtitle}</p>
                                    )}
                                    <p className="text-sm text-muted-foreground">
                                        Criado em{' '}
                                        {format(new Date(ebook.createdAt), "dd 'de' MMMM 'de' yyyy", {
                                            locale: ptBR,
                                        })}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Link href={`/dashboard/ebooks`} target="_blank">
                                        <Button variant="outline" size="sm">
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                    <Link href={`/admin/ebooks/${ebook.id}`}>
                                        <Button variant="outline" size="sm">
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
