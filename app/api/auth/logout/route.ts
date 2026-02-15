import { NextResponse } from 'next/server'
import { clearSession } from '@/lib/auth/session'

export async function POST() {
    try {
        await clearSession()

        return NextResponse.json({
            message: 'Logout realizado com sucesso',
        })
    } catch (error) {
        console.error('Logout error:', error)
        return NextResponse.json(
            { error: 'Erro ao fazer logout' },
            { status: 500 }
        )
    }
}
