'use client';

import { CheckCircle2, XCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { FastingHistory } from '@/app/dashboard/fasting/actions';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function pad(n: number) { return String(n).padStart(2, '0'); }

function fmtDuration(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

function fmtDate(date: Date): string {
    return new Date(date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
    });
}

// ─── FastingHistoryList ───────────────────────────────────────────────────────

export function FastingHistoryList({ history }: { history: FastingHistory[] }) {
    if (history.length === 0) {
        return (
            <div className="rounded-2xl border border-zinc-800/40 bg-zinc-900/20 px-5 py-8 text-center">
                <Clock className="mx-auto mb-2 h-7 w-7 text-zinc-700" />
                <p className="text-sm text-zinc-600">Nenhum protocolo finalizado ainda.</p>
                <p className="mt-1 text-xs text-zinc-700">Seus jejuns concluídos aparecerão aqui.</p>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {history.map((item) => {
                const isCompleted = item.status === 'COMPLETED';
                const metaPct = item.durationSeconds
                    ? Math.round((item.durationSeconds / (item.targetHours * 3600)) * 100)
                    : 0;
                const reachedGoal = metaPct >= 100;

                return (
                    <div
                        key={item.id}
                        className={cn(
                            'flex items-center gap-3 rounded-xl border px-4 py-3',
                            isCompleted
                                ? 'border-emerald-900/40 bg-emerald-950/20'
                                : 'border-red-900/30 bg-red-950/10',
                        )}
                    >
                        {/* Status icon */}
                        {isCompleted ? (
                            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                        ) : (
                            <XCircle className="h-4 w-4 shrink-0 text-red-700" />
                        )}

                        {/* Date + target */}
                        <div className="min-w-0 flex-1">
                            <div className="flex items-baseline gap-2">
                                <span className="font-mono text-sm font-bold text-zinc-200">
                                    {fmtDate(item.startTime)}
                                </span>
                                <span className="text-xs text-zinc-600">
                                    meta {item.targetHours}h
                                </span>
                            </div>
                            {item.durationSeconds !== null && (
                                <p className="text-[11px] text-zinc-600">
                                    Duração: {fmtDuration(item.durationSeconds)}
                                    {' · '}
                                    <span className={cn(
                                        'font-semibold',
                                        reachedGoal ? 'text-emerald-500' : 'text-amber-600',
                                    )}>
                                        {metaPct}% da meta
                                    </span>
                                </p>
                            )}
                        </div>

                        {/* Status badge */}
                        <span
                            className={cn(
                                'shrink-0 rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider',
                                isCompleted
                                    ? 'bg-emerald-900/40 text-emerald-400'
                                    : 'bg-red-900/30 text-red-600',
                            )}
                        >
                            {isCompleted ? 'Completo' : 'Quebrado'}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}
