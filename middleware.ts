import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const secret = new TextEncoder().encode(process.env.JWT_SECRET!)

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('auth-token')?.value

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
        } catch (error) {
            console.warn('[AUTH] Token verification failed:', error instanceof Error ? error.message : 'Unknown error')
            // Invalid token - clear it
            const response = NextResponse.next()
            response.cookies.delete('auth-token')
            return response
        }
    }

    // Redirect to login if accessing protected route without auth
    if (isProtectedPath && !isAuthenticated) {
        const url = request.nextUrl.clone()
        url.pathname = '/auth/login'
        url.searchParams.set('redirect', request.nextUrl.pathname)
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
    
    // Add cache control headers for protected routes
    if (isProtectedPath) {
        response.headers.set('Cache-Control', 'private, no-cache, no-store, must-revalidate')
        response.headers.set('Pragma', 'no-cache')
        response.headers.set('Expires', '0')
    }

    return response
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|public|favicon.ico|sitemap.xml|robots.txt).*)',
    ],
}
