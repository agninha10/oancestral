import { NextResponse } from 'next/server'
import { getSession, setSessionOnResponse } from '@/lib/auth/session'
import { signToken } from '@/lib/auth/jwt'
import { prisma } from '@/lib/prisma'

export async function POST() {
    try {
        const session = await getSession()

        if (!session) {
            return NextResponse.json({ error: 'No active session' }, { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: { id: session.userId },
            select: { id: true, email: true, role: true },
        })

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 401 })
        }

        const newToken = await signToken({
            userId: user.id,
            email: user.email,
            role: user.role,
        })

        const response = NextResponse.json({
            message: 'Token refreshed',
            user: { id: user.id, email: user.email, role: user.role },
        })

        setSessionOnResponse(response, newToken)

        return response
    } catch (error) {
        console.error('Token refresh error:', error)
        return NextResponse.json({ error: 'Failed to refresh token' }, { status: 500 })
    }
}
