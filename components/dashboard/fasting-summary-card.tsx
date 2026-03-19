import Link from 'next/link';
import { Flame, ChevronRight, Clock } from 'lucide-react';
import { type OngoingFast } from '@/app/dashboard/fasting/actions';

interface FastingSummaryCardProps {
    currentFast: OngoingFast | null;
}

function formatElapsed(startTime: Date): string {
    const elapsed = Math.floor((Date.now() - new Date(startTime).getTime()) / 1000);
    const h = Math.floor(elapsed / 3600);
    const m = Math.floor((elapsed % 3600) / 60);
    return `${String(h).padStart(2, '0')}h ${String(m).padStart(2, '0')}m`;
}

export function FastingSummaryCard({ currentFast }: FastingSummaryCardProps) {
    return (
        <Link
            href="/dashboard/jejum"
            className="group flex items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 transition-all hover:border-amber-500/40 hover:bg-zinc-900"
        >
            {/* Icon */}
            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${currentFast ? 'bg-amber-500/15' : 'bg-zinc-800'}`}>
                <Flame className={`h-5 w-5 ${currentFast ? 'text-amber-400' : 'text-zinc-500'}`} />
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-zinc-200">Protocolo de Jejum</p>
                {currentFast ? (
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-amber-400">
                        <Clock className="h-3 w-3" />
                        Em jejum · {formatElapsed(currentFast.startTime)} / {currentFast.targetHours}h
                    </p>
                ) : (
                    <p className="mt-0.5 text-xs text-zinc-500">
                        Nenhum protocolo ativo
                    </p>
                )}
            </div>

            {/* Arrow */}
            <ChevronRight className="h-4 w-4 shrink-0 text-zinc-600 transition-transform group-hover:translate-x-0.5 group-hover:text-amber-500" />
        </Link>
    );
}
