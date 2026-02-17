import { NextResponse } from 'next/server'
import { getSession, setSession } from '@/lib/auth/session'
import { signToken } from '@/lib/auth/jwt'
import { prisma } from '@/lib/prisma'

export async function POST() {
    try {
        // Get current session
        const session = await getSession()

        if (!session) {
            return NextResponse.json(
                { error: 'No active session' },
                { status: 401 }
            )
        }

        // Verify user still exists
        const user = await prisma.user.findUnique({
            where: { id: session.userId },
            select: {
                id: true,
                email: true,
                role: true,
            },
        })

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 401 }
            )
        }

        // Generate new token
        const newToken = await signToken({
            userId: user.id,
            email: user.email,
            role: user.role,
        })

        // Set new session cookie
        await setSession(newToken)

        return NextResponse.json({
            message: 'Token refreshed',
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
            },
        })
    } catch (error) {
        console.error('Token refresh error:', error)
        return NextResponse.json(
            { error: 'Failed to refresh token' },
            { status: 500 }
        )
    }
}
