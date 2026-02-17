import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const secret = new TextEncoder().encode(process.env.JWT_SECRET!)

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('auth-token')?.value
    const pathname = request.nextUrl.pathname

    // Ignorar requests RSC (React Server Components) e prefetch
    if (request.headers.get('next-router-prefetch') || request.headers.get('rsc')) {
        return NextResponse.next()
    }

    // Log apenas para rotas importantes
    const shouldLog = pathname.startsWith('/dashboard') || pathname.startsWith('/admin') || pathname.startsWith('/auth')

    if (shouldLog) {
        console.log(`[MIDDLEWARE] ${pathname} - Token present: ${!!token}`)
    }

    const protectedPaths = ['/dashboard', '/perfil', '/cursos/meus', '/admin']
    const isProtectedPath = protectedPaths.some((path) =>
        request.nextUrl.pathname.startsWith(path)
    )

    const isAdminPath = request.nextUrl.pathname.startsWith('/admin')

    let isAuthenticated = false
    let userRole: string | null = null

    if (token) {
        try {
            const { payload } = await jwtVerify(token, secret)
            isAuthenticated = true
            userRole = payload.role as string

            if (shouldLog) {
                console.log(`[MIDDLEWARE] ${pathname} - Token valid, userId: ${payload.userId}, role: ${userRole}`)
            }
        } catch (error) {
            console.warn(`[MIDDLEWARE] ${pathname} - Token invalid: ${error instanceof Error ? error.message : 'Unknown'}`)

            if (isProtectedPath) {
                // Rota protegida com token inválido → redireciona para login e limpa cookie
                const url = request.nextUrl.clone()
                url.pathname = '/auth/login'
                url.searchParams.set('redirect', pathname)
                const response = NextResponse.redirect(url)
                response.cookies.delete('auth-token')
                return response
            }

            // Rota pública com token inválido → continua sem deletar cookie
            // (evita race conditions onde requests paralelas limpam o cookie)
            return NextResponse.next()
        }
    }

    // Redirect to login if accessing protected route without auth
    if (isProtectedPath && !isAuthenticated) {
        console.log(`[MIDDLEWARE] ${pathname} - No valid auth, redirecting to login (had token: ${!!token})`)
        const url = request.nextUrl.clone()
        url.pathname = '/auth/login'
        url.searchParams.set('redirect', pathname)
        return NextResponse.redirect(url)
    }

    // Redirect to home if accessing admin route without ADMIN role
    if (isAdminPath && (!isAuthenticated || userRole !== 'ADMIN')) {
        const url = request.nextUrl.clone()
        url.pathname = '/'
        return NextResponse.redirect(url)
    }

    // Redirect to dashboard if accessing auth pages while logged in
    const authPaths = ['/auth/login', '/auth/register']
    const isAuthPath = authPaths.some((path) =>
        request.nextUrl.pathname.startsWith(path)
    )

    if (isAuthPath && isAuthenticated) {
        const url = request.nextUrl.clone()
        url.pathname = '/dashboard'
        return NextResponse.redirect(url)
    }

    const response = NextResponse.next()

    if (isProtectedPath) {
        response.headers.set('Cache-Control', 'private, no-cache, no-store, must-revalidate')
        response.headers.set('Pragma', 'no-cache')
        response.headers.set('Expires', '0')
    }

    return response
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|public|favicon.ico|sitemap.xml|robots.txt|_rsc).*)',
    ],
}

