'use client';

import { signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LogoutButtonProps {
    variant?: 'default' | 'destructive' | 'outline' | 'ghost';
    size?: 'default' | 'sm' | 'lg';
    className?: string;
    showIcon?: boolean;
    showText?: boolean;
}

export function LogoutButton({
    variant = 'outline',
    size = 'default',
    className = '',
    showIcon = true,
    showText = true,
}: LogoutButtonProps) {
    return (
        <Button
            onClick={() => signOut({ callbackUrl: '/' })}
            variant={variant}
            size={size}
            className={`flex items-center gap-2 ${className}`}
        >
            {showIcon && <LogOut className="h-4 w-4" />}
            {showText && 'Sair'}
        </Button>
    );
}
