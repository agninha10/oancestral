'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { User, Settings, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogoutButton } from '@/components/auth/logout-button';

interface UserData {
    id: string;
    name: string;
    email: string;
    role?: string;
}

interface UserNavProps {
    isMobile?: boolean;
    showDashboardButton?: boolean;
}

export function UserNav({ isMobile = false, showDashboardButton = false }: UserNavProps) {
    const [user, setUser] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const response = await fetch('/api/auth/me');
            if (response.ok) {
                const data = await response.json();
                setUser(data.user);
            }
        } catch (error) {
            console.error('Auth check failed:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return isMobile ? (
            <div className="flex items-center space-x-3 px-4 py-3">
                <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
                <div className="flex-1 space-y-2">
                    <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                    <div className="h-3 w-32 bg-muted animate-pulse rounded" />
                </div>
            </div>
        ) : (
            <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
        );
    }

    if (!user) {
        return isMobile ? (
            <div className="flex flex-col space-y-3 px-4">
                <Button asChild variant="outline" size="lg" className="w-full justify-center">
                    <Link href="/auth/login">Entrar</Link>
                </Button>
                <Button asChild size="lg" className="w-full justify-center">
                    <Link href="/auth/register">Começar Grátis</Link>
                </Button>
            </div>
        ) : (
            <>
                <Button asChild variant="ghost">
                    <Link href="/auth/login">Entrar</Link>
                </Button>
                <Button asChild>
                    <Link href="/auth/register">Começar Grátis</Link>
                </Button>
            </>
        );
    }

    const initials = user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    // Mobile view - show user card with actions
    if (isMobile) {
        return (
            <div className="flex flex-col space-y-4">
                {/* User Info Card */}
                <div className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-muted/50">
                    <Avatar className="h-12 w-12">
                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} alt={user.name} />
                        <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{user.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col space-y-2 px-4">
                    <Button asChild variant="default" size="lg" className="w-full justify-start">
                        <Link href="/dashboard">
                            <Home className="mr-2 h-4 w-4" />
                            Acessar o Clã Ancestral
                        </Link>
                    </Button>
                    
                    {user.role === 'ADMIN' && (
                        <Button asChild variant="outline" size="lg" className="w-full justify-start">
                            <Link href="/admin/dashboard">
                                <Settings className="mr-2 h-4 w-4" />
                                Admin
                            </Link>
                        </Button>
                    )}

                    <LogoutButton
                        variant="ghost"
                        size="lg"
                        className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                    />
                </div>
            </div>
        );
    }

    // Desktop view - show dropdown or dashboard button
    return (
        <>
            {showDashboardButton && (
                <Button asChild variant="default">
                    <Link href="/dashboard">
                        <Home className="mr-2 h-4 w-4" />
                        Acessar o Clã Ancestral
                    </Link>
                </Button>
            )}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                        <Avatar className="h-10 w-10">
                            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} alt={user.name} />
                            <AvatarFallback>{initials}</AvatarFallback>
                        </Avatar>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">{user.name}</p>
                            <p className="text-xs leading-none text-muted-foreground">
                                {user.email}
                            </p>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                        <Link href="/dashboard" className="cursor-pointer">
                            <User className="mr-2 h-4 w-4" />
                            Dashboard
                        </Link>
                    </DropdownMenuItem>
                    {user.role === 'ADMIN' && (
                        <DropdownMenuItem asChild>
                            <Link href="/admin/dashboard" className="cursor-pointer">
                                <Settings className="mr-2 h-4 w-4" />
                                Admin
                            </Link>
                        </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                        <LogoutButton
                            variant="ghost"
                            size="default"
                            className="w-full justify-start cursor-pointer"
                            showIcon={true}
                            showText={true}
                        />
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}
