'use client'

import { useTokenRefresh } from '@/lib/hooks/useTokenRefresh'
import { ReactNode } from 'react'

interface DashboardClientProps {
    children: ReactNode
}

export function DashboardClient({ children }: DashboardClientProps) {
    // Renovar token periodicamente
    useTokenRefresh()

    return <>{children}</>
}
