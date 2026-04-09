import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email, reason } = body;

        if (!email?.trim()) {
            return NextResponse.json({ error: 'E-mail é obrigatório.' }, { status: 400 });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            return NextResponse.json({ error: 'E-mail inválido.' }, { status: 400 });
        }

        // Salva como mensagem de contato para aparecer no painel admin
        await prisma.contactMessage.create({
            data: {
                name: 'Solicitação de Exclusão',
                email: email.trim().toLowerCase().slice(0, 200),
                subject: '[EXCLUSÃO DE CONTA] Solicitação via /excluir-conta',
                message: reason?.trim()
                    ? `Motivo informado pelo usuário:\n\n${reason.trim().slice(0, 2000)}`
                    : 'Nenhum motivo informado.',
            },
        });

        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json(
            { error: 'Erro ao enviar solicitação. Tente novamente.' },
            { status: 500 }
        );
    }
}
