import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireMobileAuth } from '@/lib/auth/mobile-jwt'

const XP_PER_HOUR  = 50
const XP_PER_LEVEL = 2000

function levelFromXp(xp: number): number {
    return Math.floor(xp / XP_PER_LEVEL) + 1
}

export async function POST(request: Request) {
    const auth = await requireMobileAuth(request)
    if (!auth.ok) return auth.response

    const userId = auth.payload.id

    try {
        // ── 1. Busca o jejum ativo ────────────────────────────────────────────

        const fast = await prisma.fastingSession.findFirst({
            where: { userId, status: 'ONGOING' },
            orderBy: { startTime: 'desc' },
            select: { id: true, startTime: true, targetHours: true },
        })

        if (!fast) {
            console.log('❌ [FASTING/END ERRO] Nenhum jejum ativo para userId:', userId)
            return NextResponse.json(
                { success: false, error: 'Nenhum jejum ativo encontrado.' },
                { status: 404 },
            )
        }

        // ── 2. Calcula duração e status ───────────────────────────────────────

        const endTime         = new Date()
        const durationMs      = endTime.getTime() - fast.startTime.getTime()
        const elapsedHours    = durationMs / 3_600_000
        const durationSeconds = Math.floor(durationMs / 1000)
        const status          = elapsedHours >= fast.targetHours ? 'COMPLETED' : 'BROKEN'

        await prisma.fastingSession.update({
            where: { id: fast.id },
            data: { endTime, status },
        })

        // ── 3. Jejum quebrado — retorna sem gamificação ───────────────────────

        if (status === 'BROKEN') {
            console.log('🔥 [FASTING/END SUCESSO] userId:', userId, '| status: BROKEN |', durationSeconds, 's')
            return NextResponse.json({
                success: true,
                data: {
                    status: 'BROKEN',
                    durationSeconds,
                    gamification: null,
                },
            })
        }

        // ── 4. Gamificação (apenas para COMPLETED) ────────────────────────────

        const completedHours = Math.floor(elapsedHours)
        const xpGained       = completedHours * XP_PER_HOUR

        const user = await prisma.user.findUnique({
            where: { id: userId },
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

        const oldXp    = user.xp
        const totalXp  = oldXp + xpGained
        const oldLevel = levelFromXp(oldXp)
        const newLevel = levelFromXp(totalXp)
        const levelUp  = newLevel > oldLevel

        // Badge mais alta que o usuário ainda não possui
        const ownedBadgeIds  = new Set(user.userBadges.map((ub) => ub.badgeId))
        const eligibleBadges = await prisma.badge.findMany({
            where: { requiredHours: { lte: completedHours } },
            orderBy: { requiredHours: 'desc' },
        })
        const newBadge = eligibleBadges.find((b) => !ownedBadgeIds.has(b.id)) ?? null

        // Transação atômica: XP + level + badge
        await prisma.$transaction(async (tx) => {
            await tx.user.update({
                where: { id: userId },
                data: { xp: totalXp, level: newLevel },
            })

            if (newBadge) {
                await tx.userBadge.create({
                    data: { userId, badgeId: newBadge.id },
                })
            }
        })

        const responseData = {
            status: 'COMPLETED',
            durationSeconds,
            gamification: {
                xpGained,
                totalXp,
                levelUp,
                newLevel,
                badgeUnlocked: newBadge
                    ? { id: newBadge.id, name: newBadge.name, iconUrl: newBadge.icon }
                    : null,
            },
        }

        console.log('🔥 [FASTING/END SUCESSO] userId:', userId, '| Payload:', JSON.stringify(responseData))

        return NextResponse.json({ success: true, data: responseData })
    } catch (error) {
        console.log('❌ [FASTING/END ERRO] Motivo:', error instanceof Error ? error.message : 'Erro desconhecido')
        return NextResponse.json(
            { success: false, error: 'Erro interno. Tente novamente.' },
            { status: 500 },
        )
    }
}
