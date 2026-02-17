'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    PlayCircle,
    BookOpen,
    User,
    Settings,
    LogOut,
} from 'lucide-react';
import { LogoutButton } from '@/components/auth/logout-button';

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    subscriptionStatus: string;
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
        name: 'Receitas',
        href: '/receitas',
        icon: BookOpen,
    },
    {
        name: 'Perfil',
        href: '/dashboard/perfil',
        icon: User,
    },
];

export function DashboardSidebar({ user }: DashboardSidebarProps) {
    const pathname = usePathname();

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
                <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-border bg-card px-6 pb-4">
                    {/* Logo/Brand */}
                    <div className="flex h-16 shrink-0 items-center">
                        <Link href="/" className="font-serif text-2xl font-bold text-primary">
                            O Ancestral
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="flex flex-1 flex-col">
                        <ul role="list" className="flex flex-1 flex-col gap-y-7">
                            <li>
                                <ul role="list" className="-mx-2 space-y-1">
                                    {navigation.map((item) => {
                                        const isActive = pathname === item.href;
                                        return (
                                            <li key={item.name}>
                                                <Link
                                                    href={item.href}
                                                    className={cn(
                                                        isActive
                                                            ? 'bg-primary text-primary-foreground'
                                                            : 'text-muted-foreground hover:text-foreground hover:bg-muted',
                                                        'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors'
                                                    )}
                                                >
                                                    <item.icon
                                                        className="h-5 w-5 shrink-0"
                                                        aria-hidden="true"
                                                    />
                                                    {item.name}
                                                </Link>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </li>

                            {/* User Info */}
                            <li className="mt-auto">
                                <div className="rounded-lg border border-border bg-background/50 p-4 space-y-3">
                                    <div className="flex items-center gap-x-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
                                            {user.name.charAt(0).toUpperCase()}
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
                            </li>
                        </ul>
                    </nav>
                </div>
            </aside>
        </>
    );
}
