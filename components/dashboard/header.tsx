'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Menu, X, Sun, Moon, LayoutDashboard, PlayCircle, BookOpen, User, Flame, Swords } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LogoutButton } from '@/components/auth/logout-button';
import { NotificationBell } from '@/components/dashboard/notification-bell';

interface User {
    id: string;
    name: string | null;
    email: string;
    role: string;
    subscriptionStatus: string;
    avatarUrl?: string | null;
}

interface DashboardHeaderProps {
    user: User;
}

const navigation = [
    {
        name: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
    },
    {
        name: 'Meus Cursos',
        href: '/dashboard/cursos',
        icon: PlayCircle,
    },
    {
        name: 'Protocolo de Jejum',
        href: '/dashboard/jejum',
        icon: Flame,
    },
    {
        name: 'Receitas',
        href: '/receitas',
        icon: BookOpen,
    },
    {
        name: 'A Forja',
        href: '/comunidade',
        icon: Swords,
    },
    {
        name: 'Perfil',
        href: '/dashboard/perfil',
        icon: User,
    },
];

export function DashboardHeader({ user }: DashboardHeaderProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const { theme, setTheme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <>
            {/* Mobile header */}
            <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-border bg-card px-4 shadow-sm lg:hidden">
                <button
                    type="button"
                    className="-m-2.5 p-2.5 text-foreground lg:hidden"
                    onClick={() => setMobileMenuOpen(true)}
                >
                    <span className="sr-only">Abrir menu</span>
                    <Menu className="h-6 w-6" aria-hidden="true" />
                </button>

                <div className="flex-1 font-serif text-xl font-bold text-primary">
                    O Ancestral
                </div>

                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setTheme(isDark ? 'light' : 'dark')}
                        title={isDark ? 'Modo claro' : 'Modo escuro'}
                        className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    >
                        {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    </button>
                    <NotificationBell />
                    <Link href="/dashboard/perfil">
                        <div className="flex h-8 w-8 overflow-hidden items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                            {user.avatarUrl
                                ? <img src={user.avatarUrl} alt={user.name ?? ''} className="h-full w-full object-cover" />
                                : ( user.name ?? '?').charAt(0).toUpperCase()
                            }
                        </div>
                    </Link>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileMenuOpen && (
                <div className="lg:hidden">
                    <div className="fixed inset-0 z-50" />
                    <div className="fixed inset-y-0 left-0 z-50 w-full overflow-y-auto bg-card px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-border">
                        <div className="flex items-center justify-between">
                            <Link href="/" className="font-serif text-2xl font-bold text-primary">
                                O Ancestral
                            </Link>
                            <button
                                type="button"
                                className="-m-2.5 rounded-md p-2.5 text-muted-foreground"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <span className="sr-only">Fechar menu</span>
                                <X className="h-6 w-6" aria-hidden="true" />
                            </button>
                        </div>
                        <div className="mt-6 flow-root">
                            <div className="-my-6 divide-y divide-border">
                                <div className="space-y-2 py-6">
                                    {navigation.map((item) => {
                                        const isActive = pathname === item.href;
                                        return (
                                            <Link
                                                key={item.name}
                                                href={item.href}
                                                className={cn(
                                                    isActive
                                                        ? 'bg-primary text-primary-foreground'
                                                        : 'text-muted-foreground hover:text-foreground hover:bg-muted',
                                                    'group flex gap-x-3 rounded-md p-3 text-base leading-6 font-semibold transition-colors'
                                                )}
                                                onClick={() => setMobileMenuOpen(false)}
                                            >
                                                <item.icon
                                                    className="h-6 w-6 shrink-0"
                                                    aria-hidden="true"
                                                />
                                                {item.name}
                                            </Link>
                                        );
                                    })}
                                </div>
                                <div className="py-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-x-3">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
                                                {( user.name ?? '?').charAt(0).toUpperCase()}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold truncate">
                                                    {user.name}
                                                </p>
                                                <p className="text-xs text-muted-foreground truncate">
                                                    {user.email}
                                                </p>
                                            </div>
                                        </div>
                                        {user.subscriptionStatus === 'ACTIVE' && (
                                            <div className="flex items-center justify-center rounded-md bg-primary/10 py-2 px-3">
                                                <span className="text-sm font-medium text-primary">
                                                    Premium Ativo
                                                </span>
                                            </div>
                                        )}
                                        <button
                                            onClick={() => setTheme(isDark ? 'light' : 'dark')}
                                            className="flex w-full items-center justify-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                                        >
                                            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                                            {isDark ? 'Modo claro' : 'Modo escuro'}
                                        </button>
                                        <LogoutButton
                                            variant="outline"
                                            size="default"
                                            className="w-full justify-center"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
