import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireMobileAuth } from '@/lib/auth/mobile-jwt'

const VALID_TARGET_HOURS = [12, 16, 18, 24, 36, 48, 72]

export async function POST(request: Request) {
    const auth = await requireMobileAuth(request)
    if (!auth.ok) return auth.response

    try {
        const body = await request.json()
        const { targetHours, retroactiveHours = 0 } = body as {
            targetHours?: number
            retroactiveHours?: number
        }

        if (!targetHours || !VALID_TARGET_HOURS.includes(targetHours)) {
            console.log('❌ [FASTING/START ERRO] Meta inválida:', targetHours)
            return NextResponse.json(
                { success: false, error: 'Meta de jejum inválida. Use: 12, 16, 18, 24, 36, 48 ou 72.' },
                { status: 400 },
            )
        }

        if (retroactiveHours < 0 || retroactiveHours >= targetHours) {
            console.log('❌ [FASTING/START ERRO] retroactiveHours inválido:', retroactiveHours)
            return NextResponse.json(
                { success: false, error: 'Horário retroativo inválido.' },
                { status: 400 },
            )
        }

        const existing = await prisma.fastingSession.findFirst({
            where: { userId: auth.payload.id, status: 'ONGOING' },
            select: { id: true, startTime: true, targetHours: true },
        })

        if (existing) {
            console.log('❌ [FASTING/START ERRO] Jejum já ativo para userId:', auth.payload.id)
            return NextResponse.json(
                { success: false, error: 'Você já tem um jejum ativo.' },
                { status: 409 },
            )
        }

        const startTime = new Date(Date.now() - retroactiveHours * 3_600_000)

        const fast = await prisma.fastingSession.create({
            data: { userId: auth.payload.id, startTime, targetHours, status: 'ONGOING' },
            select: { id: true, startTime: true, targetHours: true, status: true },
        })

        console.log('🔥 [FASTING/START SUCESSO] userId:', auth.payload.id, '| target:', targetHours, 'h | retro:', retroactiveHours, 'h')

        return NextResponse.json(
            { success: true, data: { fast } },
            { status: 201 },
        )
    } catch (error) {
        console.log('❌ [FASTING/START ERRO] Motivo:', error instanceof Error ? error.message : 'Erro desconhecido')
        return NextResponse.json(
            { success: false, error: 'Erro interno. Tente novamente.' },
            { status: 500 },
        )
    }
}
