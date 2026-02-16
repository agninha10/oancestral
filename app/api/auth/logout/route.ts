import { NextRequest, NextResponse } from 'next/server'
import { clearSession } from '@/lib/auth/session'

export async function GET(request: NextRequest) {
    try {
        await clearSession()

        const url = new URL(request.url)
        const redirectTo = url.searchParams.get('redirect') || '/'

        return NextResponse.redirect(new URL(redirectTo, request.url))
    } catch (error) {
        console.error('Logout error:', error)
        return NextResponse.json(
            { error: 'Erro ao fazer logout' },
            { status: 500 }
        )
    }
}

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
