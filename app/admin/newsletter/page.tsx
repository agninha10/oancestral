import { PrismaClient } from "@prisma/client";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const prisma = new PrismaClient();

// Force dynamic rendering to always get fresh data
export const dynamic = 'force-dynamic';

async function getSubscribers() {
    try {
        const subscribers = await prisma.newsletterSubscriber.findMany({
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

export default async function NewsletterPage() {
    const subscribers = await getSubscribers();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-foreground">Newsletter</h1>
                <p className="text-muted-foreground mt-2">
                    Gerencie os inscritos na sua newsletter.
                </p>
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
                                    Nenhum inscrito encontrado.
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
            <div className="text-sm text-muted-foreground">
                Total de inscritos: {subscribers.length}
            </div>
        </div>
    );
}
