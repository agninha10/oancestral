import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateToken, sendPasswordResetEmail } from '@/lib/auth/email';

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json();

        if (!email || typeof email !== 'string') {
            return NextResponse.json({ error: 'E-mail inválido.' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where:  { email: email.toLowerCase().trim() },
            select: { id: true, name: true, email: true },
        });

        // Always return 200 to avoid user enumeration
        if (!user) {
            return NextResponse.json({ ok: true });
        }

        const token   = generateToken();
        const expiry  = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

        await prisma.user.update({
            where: { id: user.id },
            data:  { resetToken: token, resetTokenExpiry: expiry },
        });

        await sendPasswordResetEmail(user.email!, token, user.name ?? undefined);

        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error('[forgot-password]', error);
        return NextResponse.json({ error: 'Erro ao enviar e-mail. Tente novamente.' }, { status: 500 });
    }
}
