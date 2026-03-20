'use client';

import { type ReactNode } from 'react';
import { useSidebar } from '@/components/dashboard/sidebar-context';
import { cn } from '@/lib/utils';

export function DashboardMain({ children }: { children: ReactNode }) {
    const { collapsed } = useSidebar();

    return (
        <div
            className={cn(
                'flex-1 flex flex-col transition-all duration-300',
                collapsed ? 'lg:pl-16' : 'lg:pl-64'
            )}
        >
            {children}
        </div>
    );
}
