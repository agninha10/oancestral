import { NextResponse } from 'next/server'
import { clearSession, getSession } from '@/lib/auth/session'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const session = await getSession()

        if (!session) {
            return NextResponse.json(
                { error: 'Não autenticado' },
                { status: 401 }
            )
        }

        const user = await prisma.user.findUnique({
            where: { id: session.userId },
            select: {
                id: true,
                email: true,
                name: true,
                whatsapp: true,
                birthdate: true,
                emailVerified: true,
                role: true,
                createdAt: true,
            },
        })

        if (!user) {
            await clearSession()
            return NextResponse.json(
                { error: 'Usuário não encontrado' },
                { status: 401 }
            )
        }

        return NextResponse.json({ user })
    } catch (error) {
        console.error('Get user error:', error)
        return NextResponse.json(
            { error: 'Erro ao buscar dados do usuário' },
            { status: 500 }
        )
    }
}
