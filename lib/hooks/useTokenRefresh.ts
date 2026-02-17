'use client'

import { useEffect } from 'react'

/**
 * Hook para renovar o token JWT antes da expiração
 * Renova a cada 6 dias (token dura 7 dias)
 */
export function useTokenRefresh() {
    useEffect(() => {
        // Renovar token a cada 6 dias (6 * 24 * 60 * 60 * 1000 ms)
        const refreshInterval = 6 * 24 * 60 * 60 * 1000

        const interval = setInterval(async () => {
            try {
                const response = await fetch('/api/auth/refresh', {
                    method: 'POST',
                    credentials: 'include',
                })

                if (!response.ok) {
                    console.warn('Token refresh failed')
                    // Se falhar, redirecionar para login
                    window.location.href = '/auth/login'
                }
            } catch (error) {
                console.error('Token refresh error:', error)
            }
        }, refreshInterval)

        // Limpar intervalo ao desmontar
        return () => clearInterval(interval)
    }, [])
}
