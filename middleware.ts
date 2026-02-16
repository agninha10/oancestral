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
        } catch {
            // Invalid token
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

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|public|favicon.ico|sitemap.xml|robots.txt).*)',
    ],
}
