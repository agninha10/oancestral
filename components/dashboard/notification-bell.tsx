'use client';

import { useState, useEffect, useTransition, useCallback } from 'react';
import { Bell } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import {
    getUserNotifications,
    markAsRead,
    markAllAsRead,
    type AppNotification,
} from '@/app/actions/notifications';

const TYPE_EMOJI: Record<string, string> = {
    POST:    '✍️',
    RECIPE:  '🍽️',
    COURSE:  '🎓',
    SYSTEM:  '🔔',
    MANUAL:  '📣',
};

export function NotificationBell() {
    const router = useRouter();
    const [open,          setOpen]          = useState(false);
    const [notifications, setNotifications] = useState<AppNotification[]>([]);
    const [loaded,        setLoaded]        = useState(false);
    const [isPending,     startTransition]  = useTransition();

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    // Fetch on mount so the badge count is correct immediately
    const fetchNotifications = useCallback(() => {
        startTransition(async () => {
            const data = await getUserNotifications();
            setNotifications(data);
            setLoaded(true);
        });
    }, []);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    // Re-fetch when popover is opened (in case new ones arrived)
    const handleOpenChange = (next: boolean) => {
        setOpen(next);
        if (next && loaded) fetchNotifications();
    };

    const handleClickNotification = (n: AppNotification) => {
        // Optimistic update
        setNotifications((prev) =>
            prev.map((x) => x.id === n.id ? { ...x, isRead: true } : x),
        );
        // Background server update — fire and forget
        markAsRead(n.id).catch(() => {});

        if (n.link) {
            setOpen(false);
            router.push(n.link);
        }
    };

    const handleMarkAllRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        startTransition(() => markAllAsRead());
    };

    return (
        <Popover open={open} onOpenChange={handleOpenChange}>
            <PopoverTrigger asChild>
                <button
                    aria-label="Notificações"
                    className="relative flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                    <Bell className="h-5 w-5" />

                    {unreadCount > 0 && (
                        <span className="absolute right-1 top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-black leading-none text-white">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </button>
            </PopoverTrigger>

            <PopoverContent
                align="end"
                sideOffset={8}
                className="w-80 border-zinc-800 bg-zinc-950 p-0 text-zinc-100 shadow-2xl shadow-black/60"
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
                    <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold">Notificações</h3>
                        {unreadCount > 0 && (
                            <span className="rounded-full bg-red-500/15 px-1.5 py-px text-[10px] font-bold text-red-400">
                                {unreadCount}
                            </span>
                        )}
                    </div>
                    {unreadCount > 0 && (
                        <button
                            onClick={handleMarkAllRead}
                            disabled={isPending}
                            className="text-[11px] text-amber-500 transition-colors hover:text-amber-400 disabled:opacity-40"
                        >
                            Marcar todas como lidas
                        </button>
                    )}
                </div>

                {/* Body */}
                <div className="max-h-[400px] overflow-y-auto">
                    {!loaded ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-700 border-t-amber-500" />
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="flex flex-col items-center gap-3 py-12 text-center">
                            <Bell className="h-9 w-9 text-zinc-700" />
                            <p className="text-sm text-zinc-600">Tudo em dia por aqui.</p>
                        </div>
                    ) : (
                        <ul className="divide-y divide-zinc-800/50">
                            {notifications.map((n) => (
                                <li key={n.id}>
                                    <button
                                        onClick={() => handleClickNotification(n)}
                                        className={cn(
                                            'w-full px-4 py-3.5 text-left transition-colors',
                                            'hover:bg-zinc-900',
                                            !n.isRead && 'bg-zinc-900/60',
                                        )}
                                    >
                                        <div className="flex items-start gap-3">
                                            <span className="mt-0.5 shrink-0 text-base leading-none">
                                                {TYPE_EMOJI[n.type] ?? '🔔'}
                                            </span>

                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-1.5">
                                                    <p className={cn(
                                                        'truncate text-sm font-semibold leading-snug',
                                                        n.isRead ? 'text-zinc-400' : 'text-zinc-100',
                                                    )}>
                                                        {n.title}
                                                    </p>
                                                    {!n.isRead && (
                                                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                                                    )}
                                                </div>
                                                <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-zinc-500">
                                                    {n.message}
                                                </p>
                                                <p className="mt-1.5 text-[10px] text-zinc-700">
                                                    {formatDistanceToNow(new Date(n.createdAt), {
                                                        addSuffix: true,
                                                        locale: ptBR,
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Footer */}
                {loaded && notifications.length > 0 && (
                    <div className="border-t border-zinc-800 px-4 py-2">
                        <p className="text-center text-[10px] text-zinc-700">
                            Mostrando as últimas {notifications.length} notificações
                        </p>
                    </div>
                )}
            </PopoverContent>
        </Popover>
    );
}
