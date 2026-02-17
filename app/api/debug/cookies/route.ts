import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

/**
 * Endpoint de debug para verificar cookies (apenas em desenvolvimento)
 */
export async function GET(request: NextRequest) {
    try {
        const cookieStore = await cookies()
        const allCookies = cookieStore.getAll()
        
        const authToken = request.cookies.get('auth-token')
        
        return NextResponse.json({
            requestCookies: {
                authToken: authToken ? {
                    name: authToken.name,
                    valueLength: authToken.value.length,
                    valuePreview: authToken.value.substring(0, 20) + '...'
                } : null,
                all: request.cookies.getAll().map(c => ({
                    name: c.name,
                    valueLength: c.value.length
                }))
            },
            serverCookies: allCookies.map(c => ({
                name: c.name,
                valueLength: c.value.length,
                valuePreview: c.name === 'auth-token' ? c.value.substring(0, 20) + '...' : undefined
            })),
            headers: {
                cookie: request.headers.get('cookie') || 'none',
                host: request.headers.get('host'),
                'user-agent': request.headers.get('user-agent'),
            }
        })
    } catch (error) {
        return NextResponse.json({
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 })
    }
}
