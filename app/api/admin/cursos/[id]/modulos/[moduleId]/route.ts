import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

async function getAdminUser() {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'ADMIN') return null;
    return { id: session.user.id };
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string; moduleId: string }> }
) {
    const user = await getAdminUser();

    if (!user) {
        return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    try {
        const { moduleId } = await params;

        await prisma.module.delete({
            where: { id: moduleId },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Erro ao excluir módulo:', error);
        return NextResponse.json(
            { error: 'Erro ao excluir módulo' },
            { status: 500 }
        );
    }
}
