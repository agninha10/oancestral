'use client'

import { useTokenRefresh } from '@/lib/hooks/useTokenRefresh'
import { ReactNode } from 'react'
import { NotificationProvider } from '@/components/dashboard/notification-provider'

interface DashboardClientProps {
    children: ReactNode
}

export function DashboardClient({ children }: DashboardClientProps) {
    useTokenRefresh()

    return (
        <NotificationProvider>
            {children}
        </NotificationProvider>
    )
}
