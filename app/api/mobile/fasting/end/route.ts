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

        // ── 2. Calcula duração, recompensa e status ───────────────────────────

        const endTime         = new Date()
        const durationMs      = endTime.getTime() - fast.startTime.getTime()
        const elapsedHours    = durationMs / 3_600_000
        const durationSeconds = Math.floor(durationMs / 1000)

        // Recompensa sempre calculada — nunca null
        const reward = computeFastingXpReward(elapsedHours, fast.targetHours)
        const status = reward.hitTarget ? 'COMPLETED' : 'BROKEN'

        if (reward.isAbandoned) {
            console.log(`⚠️ [ANTI-CHEAT] Abandono detectado — userId: ${userId} | ${elapsedHours.toFixed(1)}h > ${ABANDON_THRESHOLD_HOURS}h`)
        }

        await prisma.fastingSession.update({
            where: { id: fast.id },
            data:  { endTime, status },
        })

        // ── 3. Lê estado do usuário (oldLevel + badges) ───────────────────────

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

        // ── 4. Elegibilidade de badges ────────────────────────────────────────

        const ownedBadgeIds  = new Set(user.userBadges.map((ub) => ub.badgeId))
        const eligibleBadges = reward.effectiveHours > 0
            ? await prisma.badge.findMany({
                  where:   { requiredHours: { lte: reward.effectiveHours } },
                  orderBy: { requiredHours: 'desc' },
              })
            : []
        const newBadge = eligibleBadges.find((b) => !ownedBadgeIds.has(b.id)) ?? null

        // ── 5. Concede XP via motor global (transação atômica) ────────────────

        // Lifetime stats: atualiza para qualquer jejum com XP (BROKEN ou COMPLETED)
        // exceto abandono. fastingCount só sobe em COMPLETED.
        const statsHours = !reward.isAbandoned
            ? Math.min(elapsedHours, ABANDON_THRESHOLD_HOURS)
            : undefined

        const currentLevel = levelFromXp(user.xp)
        const award = reward.xpGained > 0
            ? await awardUserXP(userId, reward.xpGained, {
                  badgeId:      newBadge?.id,
                  fastingStats: statsHours !== undefined
                      ? { statsHours, incrementCount: reward.hitTarget }
                      : undefined,
              })
            : { success: true as const, xpGained: 0, totalXp: user.xp, levelUp: false, newLevel: currentLevel }

        if (!award.success) {
            return NextResponse.json(
                { success: false, error: award.error },
                { status: 500 },
            )
        }

        const responseData = {
            status,
            durationSeconds,
            gamification: {
                xpEarned:     award.xpGained,
                newTotalXp:   award.totalXp,
                levelUp:      award.levelUp,
                newLevel:     award.newLevel,
                hitTarget:    reward.hitTarget,
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
