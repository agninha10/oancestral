'use client'

import { useTokenRefresh } from '@/lib/hooks/useTokenRefresh'
import { ReactNode } from 'react'
import { NotificationProvider } from '@/components/dashboard/notification-provider'
import { SidebarProvider } from '@/components/dashboard/sidebar-context'

interface DashboardClientProps {
    children: ReactNode
}

export function DashboardClient({ children }: DashboardClientProps) {
    useTokenRefresh()

    return (
        <SidebarProvider>
            <NotificationProvider>
                {children}
            </NotificationProvider>
        </SidebarProvider>
    )
}
