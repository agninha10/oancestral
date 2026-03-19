'use client';

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
    useTransition,
    type ReactNode,
} from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import {
    getUserNotifications,
    markAsRead,
    markAllAsRead,
    type AppNotification,
} from '@/app/actions/notifications';

const POLL_INTERVAL_MS = 30_000;

const TYPE_EMOJI: Record<string, string> = {
    POST:   '✍️',
    RECIPE: '🍽️',
    COURSE: '🎓',
    SYSTEM: '🔔',
    MANUAL: '📣',
};

// ─── Context ──────────────────────────────────────────────────────────────────

interface NotificationContextValue {
    notifications: AppNotification[];
    loaded: boolean;
    isPending: boolean;
    refresh: () => void;
    handleMarkRead: (id: string) => void;
    handleMarkAllRead: () => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

export function useNotifications() {
    const ctx = useContext(NotificationContext);
    if (!ctx) throw new Error('useNotifications must be used inside NotificationProvider');
    return ctx;
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function NotificationProvider({ children }: { children: ReactNode }) {
    const router = useRouter();
    const [notifications, setNotifications] = useState<AppNotification[]>([]);
    const [loaded,        setLoaded]        = useState(false);
    const [isPending,     startTransition]  = useTransition();

    // IDs we've already shown toasts for — persists across polls
    const shownIds = useRef<Set<string>>(new Set());
    // Track whether this is the very first fetch (don't toast existing notifications)
    const isFirstFetch = useRef(true);

    const showToast = useCallback(
        (n: AppNotification) => {
            const emoji = TYPE_EMOJI[n.type] ?? '🔔';
            if (n.link) {
                toast(`${emoji} ${n.title}`, {
                    description: n.message,
                    duration: 7000,
                    action: {
                        label: 'Ver →',
                        onClick: () => router.push(n.link!),
                    },
                });
            } else {
                toast(`${emoji} ${n.title}`, {
                    description: n.message,
                    duration: 5000,
                });
            }
        },
        [router],
    );

    const refresh = useCallback(() => {
        startTransition(async () => {
            const data = await getUserNotifications();

            if (isFirstFetch.current) {
                // First load: mark everything as "already seen" — no toasts
                isFirstFetch.current = false;
                data.forEach((n) => shownIds.current.add(n.id));
                setNotifications(data);
                setLoaded(true);
                return;
            }

            // Subsequent polls: find truly new notifications
            const newUnread = data.filter(
                (n) => !n.isRead && !shownIds.current.has(n.id),
            );
            newUnread.forEach((n) => {
                shownIds.current.add(n.id);
                showToast(n);
            });

            setNotifications(data);
        });
    }, [showToast]);

    // Initial fetch + polling
    useEffect(() => {
        refresh();
        const id = setInterval(refresh, POLL_INTERVAL_MS);
        return () => clearInterval(id);
    }, [refresh]);

    const handleMarkRead = useCallback((notifId: string) => {
        setNotifications((prev) =>
            prev.map((n) => n.id === notifId ? { ...n, isRead: true } : n),
        );
        markAsRead(notifId).catch(() => {});
    }, []);

    const handleMarkAllRead = useCallback(() => {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        startTransition(() => markAllAsRead());
    }, []);

    return (
        <NotificationContext.Provider
            value={{ notifications, loaded, isPending, refresh, handleMarkRead, handleMarkAllRead }}
        >
            {children}
        </NotificationContext.Provider>
    );
}
