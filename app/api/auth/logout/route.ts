import { NextRequest, NextResponse } from 'next/server'
import { clearSessionOnResponse } from '@/lib/auth/session'

export async function GET(request: NextRequest) {
    try {
        const url = new URL(request.url)
        const redirectTo = url.searchParams.get('redirect') || '/auth/login'

        const response = NextResponse.redirect(new URL(redirectTo, request.url))
        clearSessionOnResponse(response)
        response.headers.set('Cache-Control', 'no-store, must-revalidate')
        return response
    } catch (error) {
        console.error('Logout error:', error)
        return NextResponse.json({ error: 'Erro ao fazer logout' }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const response = NextResponse.json({ message: 'Logout realizado com sucesso' })
        clearSessionOnResponse(response)
        response.headers.set('Cache-Control', 'no-store, must-revalidate')
        return response
    } catch (error) {
        console.error('Logout error:', error)
        return NextResponse.json({ error: 'Erro ao fazer logout' }, { status: 500 })
    }
}


