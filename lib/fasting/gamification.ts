// Re-exporta do motor global. Arquivo mantido por compatibilidade.
// Prefira importar diretamente de '@/lib/gamification'.
export {
    XP_PER_LEVEL,
    HARD_CAP_HOURS,
    ABANDON_THRESHOLD_HOURS,
    levelFromXp,
    computeFastingXpReward as computeXpReward,
    type FastingXpReward as XpReward,
} from '@/lib/gamification'
