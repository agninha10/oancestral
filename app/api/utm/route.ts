import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { source, medium, campaign, content, term, landing } = body

        // Only save if at least one UTM param is present
        if (!source && !medium && !campaign) {
            return NextResponse.json({ ok: false }, { status: 400 })
        }

        const session = await auth()

        await prisma.utmVisit.create({
            data: {
                source:   source   || null,
                medium:   medium   || null,
                campaign: campaign || null,
                content:  content  || null,
                term:     term     || null,
                landing:  landing  || null,
                userId:   session?.user?.id ?? null,
            },
        })

        return NextResponse.json({ ok: true })
    } catch {
        return NextResponse.json({ ok: false }, { status: 500 })
    }
}
