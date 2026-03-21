// ─── Motor Global de Gamificação ──────────────────────────────────────────────
//
// Fonte única de verdade para XP, Levels e recompensas em toda a plataforma.
// Consumido por: Jejum (web + mobile), Cursos, Fórum.

import { prisma } from '@/lib/prisma'

// ─── Constantes de Level ──────────────────────────────────────────────────────

export const XP_PER_LEVEL = 2000

// ─── Dicionário de Eventos Fixos ──────────────────────────────────────────────

export const XP_EVENTS = {
    LESSON_COMPLETED:    50,
    FORUM_POST_CREATED:  20,
    FORUM_COMMENT_ADDED: 10,
} as const

// ─── Constantes Anti-Cheat (Jejum) ────────────────────────────────────────────

/** XP concedido por hora efetiva de jejum. */
const FASTING_XP_PER_HOUR = 50

/** Teto máximo de horas recompensadas no jejum. */
export const HARD_CAP_HOURS = 72

/**
 * Limiar de abandono do cronômetro.
 * Jejuns além desse ponto são encerrados como BROKEN sem XP.
 */
export const ABANDON_THRESHOLD_HOURS = 120

// ─── Helpers Puros ────────────────────────────────────────────────────────────

export function levelFromXp(xp: number): number {
    return Math.floor(xp / XP_PER_LEVEL) + 1
}

// ─── Calculadora de XP do Jejum (Dinâmica) ───────────────────────────────────

export type FastingXpReward = {
    /** Horas usadas no cálculo após aplicar todos os limites. */
    effectiveHours: number
    /** XP bruto ganho nesta sessão. */
    xpGained: number
    /**
     * true = cronômetro passou do limiar de abandono.
     * O chamador deve salvar o jejum como BROKEN e não conceder XP.
     */
    isAbandoned: boolean
}

/**
 * Calcula a recompensa de XP para um jejum concluído.
 * Aplica hard cap (72h) e detecção de abandono (>120h).
 */
export function computeFastingXpReward(rawElapsedHours: number): FastingXpReward {
    if (rawElapsedHours > ABANDON_THRESHOLD_HOURS) {
        return { effectiveHours: 0, xpGained: 0, isAbandoned: true }
    }
    const effectiveHours = Math.min(Math.floor(rawElapsedHours), HARD_CAP_HOURS)
    return { effectiveHours, xpGained: effectiveHours * FASTING_XP_PER_HOUR, isAbandoned: false }
}

// ─── Motor Central: awardUserXP ───────────────────────────────────────────────

export type XpAwardResult =
    | { success: true;  xpGained: number; totalXp: number; levelUp: boolean; newLevel: number }
    | { success: false; error: string }

/**
 * Concede XP ao usuário de forma atômica.
 *
 * @param userId   - ID do usuário no banco.
 * @param xpToAdd  - Quantidade de XP a adicionar.
 * @param options.badgeId - (Opcional) Badge a criar atomicamente na mesma transação (usado pelo Jejum).
 *
 * @returns Resultado com novo total de XP, level e flag de levelUp.
 */
export async function awardUserXP(
    userId: string,
    xpToAdd: number,
    options?: { badgeId?: string },
): Promise<XpAwardResult> {
    if (xpToAdd <= 0) {
        return { success: false, error: 'XP a conceder deve ser positivo.' }
    }

    try {
        const result = await prisma.$transaction(async (tx) => {
            const user = await tx.user.findUnique({
                where:  { id: userId },
                select: { xp: true },
            })
            if (!user) throw new Error('Usuário não encontrado.')

            const totalXp  = user.xp + xpToAdd
            const oldLevel = levelFromXp(user.xp)
            const newLevel = levelFromXp(totalXp)

            await tx.user.update({
                where: { id: userId },
                data:  { xp: totalXp, level: newLevel },
            })

            if (options?.badgeId) {
                await tx.userBadge.create({
                    data: { userId, badgeId: options.badgeId },
                })
            }

            return { xpGained: xpToAdd, totalXp, levelUp: newLevel > oldLevel, newLevel }
        })

        return { success: true, ...result }
    } catch (error) {
        const msg = error instanceof Error ? error.message : 'Erro ao conceder XP.'
        console.log('❌ [GAMIFICATION] awardUserXP falhou | userId:', userId, '| Motivo:', msg)
        return { success: false, error: msg }
    }
}
