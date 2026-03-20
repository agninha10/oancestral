import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireMobileAuth } from '@/lib/auth/mobile-jwt'

// ─── Constants (mirrored from fasting/actions.ts) ─────────────────────────
const VALID_TARGET_HOURS = [12, 16, 18, 24, 36, 48, 72] as const
const XP_PER_HOUR = 50
const XP_PER_LEVEL = 2000

function levelFromXp(xp: number): number {
    return Math.floor(xp / XP_PER_LEVEL) + 1
}

// ─── POST /api/mobile/fasting — start a new fasting session ───────────────
// Body: { targetHours: number, offsetHours?: number }

export async function POST(request: Request) {
    const auth = await requireMobileAuth(request)
    if (!auth.ok) return auth.response

    try {
        const body = await request.json()
        const { targetHours, offsetHours = 0 } = body as {
            targetHours?: number
            offsetHours?: number
        }

        if (!targetHours || !(VALID_TARGET_HOURS as readonly number[]).includes(targetHours)) {
            return NextResponse.json(
                {
                    success: false,
                    error: `Meta de jejum inválida. Valores aceitos: ${VALID_TARGET_HOURS.join(', ')} horas.`,
                },
                { status: 400 },
            )
        }

        if (offsetHours < 0 || offsetHours >= targetHours) {
            return NextResponse.json(
                { success: false, error: 'Horário retroativo inválido.' },
                { status: 400 },
            )
        }

        const existing = await prisma.fastingSession.findFirst({
            where: { userId: auth.payload.id, status: 'ONGOING' },
            select: { id: true },
        })
        if (existing) {
            return NextResponse.json(
                { success: false, error: 'Você já tem um jejum ativo.' },
                { status: 409 },
            )
        }

        const startTime = new Date(Date.now() - offsetHours * 3_600_000)

        const fast = await prisma.fastingSession.create({
            data: { userId: auth.payload.id, startTime, targetHours, status: 'ONGOING' },
            select: { id: true, startTime: true, targetHours: true, status: true },
        })

        return NextResponse.json({ success: true, data: { fast } }, { status: 201 })
    } catch (error) {
        console.error('[mobile/fasting POST]', error)
        return NextResponse.json(
            { success: false, error: 'Erro interno. Tente novamente.' },
            { status: 500 },
        )
    }
}

// ─── PUT /api/mobile/fasting — end a fasting session ──────────────────────
// Body: { sessionId: string }

export async function PUT(request: Request) {
    const auth = await requireMobileAuth(request)
    if (!auth.ok) return auth.response

    try {
        const body = await request.json()
        const { sessionId } = body as { sessionId?: string }

        if (!sessionId) {
            return NextResponse.json(
                { success: false, error: 'sessionId é obrigatório.' },
                { status: 400 },
            )
        }

        const fast = await prisma.fastingSession.findUnique({
            where: { id: sessionId },
            select: { userId: true, startTime: true, targetHours: true, status: true },
        })

        if (!fast) {
            return NextResponse.json(
                { success: false, error: 'Jejum não encontrado.' },
                { status: 404 },
            )
        }

        if (fast.userId !== auth.payload.id) {
            return NextResponse.json(
                { success: false, error: 'Não autorizado.' },
                { status: 403 },
            )
        }

        if (fast.status !== 'ONGOING') {
            return NextResponse.json(
                { success: false, error: 'Este jejum não está ativo.' },
                { status: 409 },
            )
        }

        const endTime = new Date()
        const elapsedHours = (endTime.getTime() - fast.startTime.getTime()) / 3_600_000
        const fastStatus = elapsedHours >= fast.targetHours ? 'COMPLETED' : 'BROKEN'

        await prisma.fastingSession.update({
            where: { id: sessionId },
            data: { endTime, status: fastStatus },
        })

        // ── BROKEN: no XP awarded ────────────────────────────────────────────
        if (fastStatus === 'BROKEN') {
            return NextResponse.json({
                success: true,
                data: {
                    status: 'BROKEN',
                    gamification: null,
                },
            })
        }

        // ── COMPLETED: award XP + check badges ───────────────────────────────
        const completedHours = Math.floor(elapsedHours)
        const xpEarned = completedHours * XP_PER_HOUR

        const user = await prisma.user.findUnique({
            where: { id: auth.payload.id },
            select: {
                xp: true,
                level: true,
                userBadges: { select: { badgeId: true } },
            },
        })
        if (!user) {
            return NextResponse.json(
                { success: false, error: 'Usuário não encontrado.' },
                { status: 404 },
            )
        }

        const oldXp = user.xp
        const newXp = oldXp + xpEarned
        const oldLevel = levelFromXp(oldXp)
        const newLevel = levelFromXp(newXp)

        const ownedBadgeIds = new Set(user.userBadges.map((ub) => ub.badgeId))
        const eligibleBadges = await prisma.badge.findMany({
            where: { requiredHours: { lte: completedHours } },
            orderBy: { requiredHours: 'desc' },
        })
        const newBadge = eligibleBadges.find((b) => !ownedBadgeIds.has(b.id)) ?? null

        await prisma.$transaction(async (tx) => {
            await tx.user.update({
                where: { id: auth.payload.id },
                data: { xp: newXp, level: newLevel },
            })

            if (newBadge) {
                await tx.userBadge.create({
                    data: { userId: auth.payload.id, badgeId: newBadge.id },
                })
            }
        })

        return NextResponse.json({
            success: true,
            data: {
                status: 'COMPLETED',
                gamification: {
                    xpEarned,
                    totalXp: newXp,
                    oldLevel,
                    newLevel,
                    leveledUp: newLevel > oldLevel,
                    badgeUnlocked: newBadge
                        ? {
                              id: newBadge.id,
                              name: newBadge.name,
                              description: newBadge.description,
                              icon: newBadge.icon,
                          }
                        : null,
                },
            },
        })
    } catch (error) {
        console.error('[mobile/fasting PUT]', error)
        return NextResponse.json(
            { success: false, error: 'Erro interno. Tente novamente.' },
            { status: 500 },
        )
    }
}
