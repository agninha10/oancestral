// ─── Motor Global de Gamificação ──────────────────────────────────────────────
//
// Fonte única de verdade para XP, Levels e recompensas em toda a plataforma.
// Consumido por: Jejum (web + mobile), Cursos, Fórum.

import { prisma } from '@/lib/prisma'

// ─── Constantes de Level ──────────────────────────────────────────────────────

export const XP_PER_LEVEL = 500

// ─── Dicionário de Eventos Fixos ──────────────────────────────────────────────

export const XP_EVENTS = {
    LESSON_COMPLETED:    50,
    FORUM_POST_CREATED:  20,
    FORUM_COMMENT_ADDED: 10,
} as const

// ─── Constantes Anti-Cheat (Jejum) ────────────────────────────────────────────

/** XP por hora efetiva de jejum (base progressiva). */
const FASTING_XP_PER_HOUR = 10

/** Bônus fixo concedido ao atingir a meta. */
const FASTING_BONUS_XP = 50

/** Teto máximo de horas recompensadas no jejum (anti-cheat). */
export const HARD_CAP_HOURS = 72

/**
 * Limiar de abandono do cronômetro.
 * Cronômetros esquecidos abertos além deste ponto são encerrados como BROKEN
 * e concede apenas o XP base capado em 72h (sem bônus de meta).
 */
export const ABANDON_THRESHOLD_HOURS = 120

// ─── Helpers Puros ────────────────────────────────────────────────────────────

export function levelFromXp(xp: number): number {
    return Math.floor(xp / XP_PER_LEVEL) + 1
}

// ─── Calculadora de XP do Jejum (Dinâmica) ───────────────────────────────────

export type FastingXpReward = {
    /** Horas capadas usadas no cálculo (para elegibilidade de badges). */
    effectiveHours: number
    /** Horas inteiras efetivas (Math.floor de effectiveHours). */
    hoursFasted: number
    /** XP base = hoursFasted × 10. */
    baseXp: number
    /** Bônus de meta = 50 se hitTarget, 0 caso contrário. */
    bonusXp: number
    /** XP total a conceder = baseXp + bonusXp. */
    xpGained: number
    /** true se o usuário atingiu ou superou a meta. */
    hitTarget: boolean
    /** true se o cronômetro passou do limiar de abandono (>120h). */
    isAbandoned: boolean
}

/**
 * Calcula a recompensa de XP para qualquer encerramento de jejum.
 *
 * Regras:
 * - XP base é sempre concedido (mesmo para BROKEN), proporcional às horas feitas.
 * - Bônus de +50 XP apenas se a meta foi atingida.
 * - Hard cap em 72h: cronômetros esquecidos não acumulam XP infinito.
 * - Limiar de abandono (>120h): isAbandoned = true, bônus zerado.
 *   O XP base capado ainda é concedido (penalidade leve vs fraude total).
 */
export function computeFastingXpReward(rawElapsedHours: number, targetHours: number): FastingXpReward {
    const isAbandoned  = rawElapsedHours > ABANDON_THRESHOLD_HOURS
    const effectiveHours = Math.min(rawElapsedHours, HARD_CAP_HOURS)
    const hoursFasted  = Math.floor(effectiveHours)
    const hitTarget    = !isAbandoned && rawElapsedHours >= targetHours
    const baseXp       = hoursFasted * FASTING_XP_PER_HOUR
    const bonusXp      = hitTarget ? FASTING_BONUS_XP : 0

    return { effectiveHours, hoursFasted, baseXp, bonusXp, xpGained: baseXp + bonusXp, hitTarget, isAbandoned }
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
