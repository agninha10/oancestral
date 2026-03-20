import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
    try {
        const { token, password } = await req.json();

        if (!token || !password) {
            return NextResponse.json({ error: 'Token e senha são obrigatórios.' }, { status: 400 });
        }

        if (password.length < 8) {
            return NextResponse.json({ error: 'A senha deve ter pelo menos 8 caracteres.' }, { status: 400 });
        }

        const user = await prisma.user.findFirst({
            where: {
                resetToken:       token,
                resetTokenExpiry: { gt: new Date() },
            },
            select: { id: true },
        });

        if (!user) {
            return NextResponse.json(
                { error: 'Link inválido ou expirado. Solicite um novo.' },
                { status: 400 }
            );
        }

        const hash = await bcrypt.hash(password, 10);

        await prisma.user.update({
            where: { id: user.id },
            data:  {
                password:         hash,
                resetToken:       null,
                resetTokenExpiry: null,
            },
        });

        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error('[update-password]', error);
        return NextResponse.json({ error: 'Erro ao atualizar senha. Tente novamente.' }, { status: 500 });
    }
}
