import { prisma } from "@/lib/prisma";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// Force dynamic rendering to always get fresh data
export const dynamic = 'force-dynamic';

type NewsletterStatus = "all" | "active" | "inactive" | "recent";

function getStatusParams(status?: string): NewsletterStatus {
    if (status === "active" || status === "inactive" || status === "recent") {
        return status;
    }

    return "all";
}

async function getSubscribers(status: NewsletterStatus) {
    try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const where =
            status === "active"
                ? { active: true }
                : status === "inactive"
                    ? { active: false }
                    : status === "recent"
                        ? { subscribedAt: { gte: thirtyDaysAgo } }
                        : undefined;

        const subscribers = await prisma.newsletterSubscriber.findMany({
            where,
            orderBy: {
                subscribedAt: 'desc',
            },
        });
        return subscribers;
    } catch (error) {
        console.error("Error fetching subscribers:", error);
        return [];
    }
}

export default async function NewsletterPage({ searchParams }: { searchParams?: { status?: string } }) {
    const status = getStatusParams(searchParams?.status);
    const subscribers = await getSubscribers(status);

    const filterLabel =
        status === "active"
            ? "assinantes ativos"
            : status === "inactive"
                ? "assinantes inativos"
                : status === "recent"
                    ? "assinantes dos últimos 30 dias"
                    : "todos os assinantes";

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-foreground">Newsletter</h1>
                <p className="text-muted-foreground mt-2">
                    Gerencie os inscritos na sua newsletter e veja quem são.
                </p>
            </div>

            <div className="flex flex-wrap gap-2">
                <Link href="/admin/newsletter?status=all">
                    <Badge variant={status === "all" ? "default" : "outline"}>Todos</Badge>
                </Link>
                <Link href="/admin/newsletter?status=active">
                    <Badge variant={status === "active" ? "default" : "outline"}>Ativos</Badge>
                </Link>
                <Link href="/admin/newsletter?status=inactive">
                    <Badge variant={status === "inactive" ? "default" : "outline"}>Inativos</Badge>
                </Link>
                <Link href="/admin/newsletter?status=recent">
                    <Badge variant={status === "recent" ? "default" : "outline"}>Últimos 30 dias</Badge>
                </Link>
            </div>

            <div className="text-sm text-muted-foreground">
                Mostrando {filterLabel}: {subscribers.length}
            </div>

            <div className="border border-border rounded-lg overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Email</TableHead>
                            <TableHead>Fonte</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Data de Inscrição</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {subscribers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                    Nenhum inscrito encontrado para este filtro.
                                </TableCell>
                            </TableRow>
                        ) : (
                            subscribers.map((subscriber) => (
                                <TableRow key={subscriber.id}>
                                    <TableCell className="font-medium">{subscriber.email}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="capitalize">
                                            {subscriber.source.toLowerCase().replace('_', ' ')}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={subscriber.active ? "default" : "secondary"}>
                                            {subscriber.active ? "Ativo" : "Inativo"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {format(new Date(subscriber.subscribedAt), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
