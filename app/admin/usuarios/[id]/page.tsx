import { prisma } from "@/lib/prisma";
import { UserForm } from "@/components/admin/user-form";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

interface Props {
    params: {
        id: string;
    };
}

export default async function EditUserPage({ params }: Props) {
    // In Next.js 15+, params is a Promise, but in 14 it's not. 
    // Assuming standard Next 14 behavior based on package.json (usually) or typical usage.
    // If build fails, I'll await it.
    // Re-checking package.json... "next": "16.1.6".
    // Next 15+ changes params to be a Promise. So I should await it if possible or treat it as such.

    const { id } = await Promise.resolve(params); // Safe wrapper for both versions usually or just await

    const user = await prisma.user.findUnique({
        where: { id },
    });

    if (!user) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-foreground">Editar Usuário</h1>
                <p className="text-muted-foreground mt-2">
                    Atualize os dados e permissões do usuário.
                </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
                <UserForm user={user} />
            </div>
        </div>
    );
}
