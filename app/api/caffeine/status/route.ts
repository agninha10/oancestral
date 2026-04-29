import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/caffeine/status
 *
 * Mobile-ready endpoint that returns the user's current caffeine detox status.
 * Returns elapsed time, current stage, and protocol info so the mobile app
 * can display the detox clock without needing the full web dashboard.
 */
export async function GET(_req: NextRequest) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: { id: session.userId },
        select: { subscriptionStatus: true },
    });

    if (!user || user.subscriptionStatus !== 'ACTIVE') {
        return NextResponse.json({ error: 'Acesso exclusivo para membros Premium' }, { status: 403 });
    }

    const ongoing = await prisma.caffeineDetoxSession.findFirst({
        where: { userId: session.userId, status: 'ONGOING' },
        orderBy: { createdAt: 'desc' },
        select: { id: true, startTime: true, protocol: true, status: true },
    });

    if (!ongoing) {
        const [completed, stats] = await Promise.all([
            prisma.caffeineDetoxSession.count({
                where: { userId: session.userId, status: 'COMPLETED' },
            }),
            prisma.caffeineDetoxSession.findFirst({
                where: { userId: session.userId, status: 'COMPLETED' },
                orderBy: { endTime: 'desc' },
                select: { startTime: true, endTime: true },
            }),
        ]);

        const longestHours = stats?.endTime
            ? Math.floor((stats.endTime.getTime() - stats.startTime.getTime()) / 3_600_000)
            : 0;

        return NextResponse.json({
            active: false,
            totalCompleted: completed,
            longestStreakHours: longestHours,
        });
    }

    const elapsedSeconds = Math.floor(
        (Date.now() - new Date(ongoing.startTime).getTime()) / 1000
    );
    const elapsedHours = elapsedSeconds / 3600;

    const stage = resolveStage(elapsedHours);

    return NextResponse.json({
        active: true,
        session: {
            id: ongoing.id,
            startTime: ongoing.startTime.toISOString(),
            protocol: ongoing.protocol,
            elapsedSeconds,
            elapsedHours: Math.floor(elapsedHours),
        },
        stage: {
            title: stage.title,
            subtitle: stage.subtitle,
            abstinenceIntensity: stage.intensity,
        },
    });
}

// ─── Lightweight stage resolver (mirrors caffeine-tracker.tsx logic) ──────────

type StageInfo = {
    title: string;
    subtitle: string;
    intensity: number;
};

function resolveStage(hours: number): StageInfo {
    if (hours < 6)   return { title: 'Cafeína Circulando',        subtitle: 'Sistema ainda sob influência',          intensity: 10 };
    if (hours < 12)  return { title: 'Primeiros Sinais',          subtitle: 'Receptores começam a "gritar"',          intensity: 40 };
    if (hours < 24)  return { title: 'Pico de Abstinência',       subtitle: 'Vasodilatação + dor de cabeça intensa', intensity: 90 };
    if (hours < 48)  return { title: 'Crise de Recalibração',     subtitle: 'Letargia máxima',                        intensity: 75 };
    if (hours < 72)  return { title: 'A Virada',                  subtitle: 'Abstinência diminuindo',                 intensity: 45 };
    if (hours < 168) return { title: 'Receptores Recalibrando',   subtitle: '72h — Marco de recalibração neural',     intensity: 25 };
    if (hours < 336) return { title: 'Sono REM Restaurado',       subtitle: '7 dias — Sonhos vívidos',               intensity: 10 };
    return              { title: 'Sistema Livre',                  subtitle: '14+ dias — Soberania biológica',         intensity: 0  };
}
