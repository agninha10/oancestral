import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireMobileAuth } from '@/lib/auth/mobile-jwt'
import {
    ABANDON_THRESHOLD_HOURS,
    levelFromXp,
    computeFastingXpReward,
    awardUserXP,
} from '@/lib/gamification'

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

        // Anti-cheat: abandono detectado → encerra como BROKEN sem XP
        const isAbandoned = elapsedHours > ABANDON_THRESHOLD_HOURS
        const status       = !isAbandoned && elapsedHours >= fast.targetHours ? 'COMPLETED' : 'BROKEN'

        await prisma.fastingSession.update({
            where: { id: fast.id },
            data: { endTime, status },
        })

        // ── 3. Jejum quebrado — retorna sem gamificação ───────────────────────

        if (status === 'BROKEN') {
            if (isAbandoned) {
                console.log(`⚠️ [ANTI-CHEAT] Abandono detectado — userId: ${userId} | ${elapsedHours.toFixed(1)}h > ${ABANDON_THRESHOLD_HOURS}h`)
            }
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

        // Hard cap + anti-cheat via motor global
        const { effectiveHours, xpGained } = computeFastingXpReward(elapsedHours)

        // Lê estado atual para determinar oldLevel e elegibilidade de badges
        const user = await prisma.user.findUnique({
            where:  { id: userId },
            select: { xp: true, userBadges: { select: { badgeId: true } } },
        })

        if (!user) {
            return NextResponse.json(
                { success: false, error: 'Usuário não encontrado.' },
                { status: 404 },
            )
        }

        // Badge mais alta que o usuário ainda não possui
        const ownedBadgeIds  = new Set(user.userBadges.map((ub) => ub.badgeId))
        const eligibleBadges = await prisma.badge.findMany({
            where:   { requiredHours: { lte: effectiveHours } },
            orderBy: { requiredHours: 'desc' },
        })
        const newBadge = eligibleBadges.find((b) => !ownedBadgeIds.has(b.id)) ?? null

        // Delega XP + level + badge para o motor global (transação atômica)
        const award = await awardUserXP(userId, xpGained, { badgeId: newBadge?.id })
        if (!award.success) {
            return NextResponse.json(
                { success: false, error: award.error },
                { status: 500 },
            )
        }

        const responseData = {
            status: 'COMPLETED',
            durationSeconds,
            gamification: {
                xpGained:     award.xpGained,
                totalXp:      award.totalXp,
                levelUp:      award.levelUp,
                newLevel:     award.newLevel,
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
