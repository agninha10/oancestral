import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireMobileAuth } from '@/lib/auth/mobile-jwt'

export async function GET(request: Request) {
    const auth = await requireMobileAuth(request)
    if (!auth.ok) return auth.response

    try {
        const user = await prisma.user.findUnique({
            where: { id: auth.payload.id },
            select: {
                id: true,
                email: true,
                name: true,
                avatarUrl: true,
                role: true,
                xp: true,
                level: true,
                subscriptionStatus: true,
                subscriptionEndDate: true,
                fastingSessions: {
                    where: { status: 'ONGOING' },
                    orderBy: { startTime: 'desc' },
                    take: 1,
                    select: {
                        id: true,
                        startTime: true,
                        targetHours: true,
                        status: true,
                    },
                },
            },
        })

        if (!user) {
            return NextResponse.json(
                { success: false, error: 'Usuário não encontrado.' },
                { status: 404 },
            )
        }

        const { fastingSessions, ...profile } = user
        const currentFast = fastingSessions[0] ?? null

        return NextResponse.json({
            success: true,
            data: {
                user: profile,
                currentFast,
            },
        })
    } catch (error) {
        console.error('[mobile/me]', error)
        return NextResponse.json(
            { success: false, error: 'Erro interno. Tente novamente.' },
            { status: 500 },
        )
    }
}
