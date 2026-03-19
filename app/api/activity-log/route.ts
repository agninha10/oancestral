import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'
import { logActivity } from '@/lib/activity-log'

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const body = await request.json()
    const { action, resource, metadata } = body

    if (!action) {
      return NextResponse.json({ error: 'Action is required' }, { status: 400 })
    }

    await logActivity({
      userId: session.userId,
      action,
      resource,
      metadata,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[ACTIVITY_LOG_API] Error:', error)
    return NextResponse.json(
      { error: 'Failed to log activity' },
      { status: 500 }
    )
  }
}
