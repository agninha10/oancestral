'use client'

import { useTokenRefresh } from '@/lib/hooks/useTokenRefresh'
import { ReactNode } from 'react'

interface AdminClientProps {
    children: ReactNode
}

export function AdminClient({ children }: AdminClientProps) {
    // Renovar token periodicamente
    useTokenRefresh()

    return <>{children}</>
}
