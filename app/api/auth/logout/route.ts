import { NextRequest, NextResponse } from 'next/server'
import { clearSession } from '@/lib/auth/session'

export async function GET(request: NextRequest) {
    try {
        await clearSession()

        const url = new URL(request.url)
        const redirectTo = url.searchParams.get('redirect') || '/auth/login'

        const response = NextResponse.redirect(new URL(redirectTo, request.url))
        
        // Adicionar headers para desabilitar cache
        response.headers.set('Cache-Control', 'private, no-cache, no-store, must-revalidate')
        response.headers.set('Pragma', 'no-cache')
        response.headers.set('Expires', '0')
        
        return response
    } catch (error) {
        console.error('Logout error:', error)
        return NextResponse.json(
            { error: 'Erro ao fazer logout' },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        await clearSession()

        const response = NextResponse.json({
            message: 'Logout realizado com sucesso',
        })
        
        // Adicionar headers para desabilitar cache
        response.headers.set('Cache-Control', 'private, no-cache, no-store, must-revalidate')
        response.headers.set('Pragma', 'no-cache')
        response.headers.set('Expires', '0')
        
        return response
    } catch (error) {
        console.error('Logout error:', error)
        return NextResponse.json(
            { error: 'Erro ao fazer logout' },
            { status: 500 }
        )
    }
}

