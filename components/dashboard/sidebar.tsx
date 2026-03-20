'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    PlayCircle,
    BookOpen,
    User,
    Download,
    Flame,
    ChevronLeft,
    ChevronRight,
    Swords,
} from 'lucide-react';
import { LogoutButton } from '@/components/auth/logout-button';
import { useSidebar } from '@/components/dashboard/sidebar-context';

interface User {
    id: string;
    name: string | null;
    email: string;
    role: string;
    subscriptionStatus: string;
    avatarUrl?: string | null;
}

interface DashboardSidebarProps {
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
        name: 'Meus Ebooks',
        href: '/dashboard/ebooks',
        icon: Download,
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

export function DashboardSidebar({ user }: DashboardSidebarProps) {
    const pathname = usePathname();
    const { collapsed, toggle } = useSidebar();

    return (
        <>
            {/* Desktop Sidebar */}
            <aside
                className={cn(
                    'hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:flex-col transition-all duration-300',
                    collapsed ? 'lg:w-16' : 'lg:w-64'
                )}
            >
                <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-border bg-card pb-4">
                    {/* Logo/Brand */}
                    <div className={cn(
                        'flex h-16 shrink-0 items-center',
                        collapsed ? 'justify-center px-2' : 'px-6'
                    )}>
                        {collapsed ? (
                            <Link href="/" title="O Ancestral" className="font-serif text-xl font-bold text-primary">
                                O
                            </Link>
                        ) : (
                            <Link href="/" className="font-serif text-2xl font-bold text-primary">
                                O Ancestral
                            </Link>
                        )}
                    </div>

                    {/* Navigation */}
                    <nav className={cn('flex flex-1 flex-col', collapsed ? 'px-2' : 'px-6')}>
                        <ul role="list" className="flex flex-1 flex-col gap-y-7">
                            <li>
                                <ul role="list" className={cn('space-y-1', collapsed ? '' : '-mx-2')}>
                                    {navigation.map((item) => {
                                        const isActive = pathname === item.href;
                                        return (
                                            <li key={item.name}>
                                                <Link
                                                    href={item.href}
                                                    title={collapsed ? item.name : undefined}
                                                    className={cn(
                                                        isActive
                                                            ? 'bg-primary text-primary-foreground'
                                                            : 'text-muted-foreground hover:text-foreground hover:bg-muted',
                                                        collapsed
                                                            ? 'flex items-center justify-center rounded-md p-2 transition-colors'
                                                            : 'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors'
                                                    )}
                                                >
                                                    <item.icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                                                    {!collapsed && item.name}
                                                </Link>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </li>

                            {/* User Info + Toggle */}
                            <li className="mt-auto space-y-2">
                                {collapsed ? (
                                    <div className="flex flex-col items-center gap-2">
                                        <Link href="/dashboard/perfil" title={`${user.name ?? 'Guerreiro'} — ${user.email}`}>
                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary text-primary-foreground font-semibold text-sm">
                                                {user.avatarUrl
                                                    ? <img src={user.avatarUrl} alt={user.name ?? ''} className="h-full w-full object-cover" />
                                                    : ( user.name ?? '?').charAt(0).toUpperCase()
                                                }
                                            </div>
                                        </Link>
                                        <LogoutButton
                                            variant="ghost"
                                            size="sm"
                                            showIcon={true}
                                            showText={false}
                                            className="h-9 w-9 p-0 justify-center"
                                        />
                                    </div>
                                ) : (
                                    <div className="rounded-lg border border-border bg-background/50 p-4 space-y-3">
                                        <div className="flex items-center gap-x-3">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary text-primary-foreground font-semibold">
                                                {user.avatarUrl
                                                    ? <img src={user.avatarUrl} alt={user.name ?? ''} className="h-full w-full object-cover" />
                                                    : ( user.name ?? '?').charAt(0).toUpperCase()
                                                }
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
                                            <div className="flex items-center justify-center rounded-md bg-primary/10 py-1.5 px-3">
                                                <span className="text-xs font-medium text-primary">
                                                    Premium Ativo
                                                </span>
                                            </div>
                                        )}
                                        <LogoutButton
                                            variant="outline"
                                            size="sm"
                                            className="w-full justify-center"
                                            showIcon={true}
                                            showText={true}
                                        />
                                    </div>
                                )}

                                {/* Toggle button */}
                                <button
                                    onClick={toggle}
                                    title={collapsed ? 'Expandir menu' : 'Recolher menu'}
                                    className={cn(
                                        'flex w-full items-center gap-x-2 rounded-md p-2 text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors',
                                        collapsed ? 'justify-center' : 'justify-end'
                                    )}
                                >
                                    {collapsed ? (
                                        <ChevronRight className="h-4 w-4" />
                                    ) : (
                                        <>
                                            <span>Recolher menu</span>
                                            <ChevronLeft className="h-4 w-4" />
                                        </>
                                    )}
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </aside>
        </>
    );
}
