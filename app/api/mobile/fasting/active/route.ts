import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireMobileAuth } from '@/lib/auth/mobile-jwt'

export async function GET(request: Request) {
    const auth = await requireMobileAuth(request)
    if (!auth.ok) return auth.response

    try {
        const fast = await prisma.fastingSession.findFirst({
            where: { userId: auth.payload.id, status: 'ONGOING' },
            orderBy: { startTime: 'desc' },
            select: { id: true, startTime: true, targetHours: true, status: true },
        })

        return NextResponse.json({ success: true, data: { fast } })
    } catch (error) {
        console.log('❌ [FASTING/ACTIVE ERRO] Motivo:', error instanceof Error ? error.message : 'Erro desconhecido')
        return NextResponse.json(
            { success: false, error: 'Erro interno. Tente novamente.' },
            { status: 500 },
        )
    }
}
