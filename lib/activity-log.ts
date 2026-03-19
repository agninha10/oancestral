import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'

export type ActivityAction =
  | 'LOGIN'
  | 'LOGIN_FAILED'
  | 'LOGOUT'
  | 'PAGE_ACCESS'
  | 'DASHBOARD_ACCESS'
  | 'DOWNLOAD'
  | 'EBOOK_DOWNLOAD'
  | 'PURCHASE'
  | 'COURSE_ENROLLMENT'
  | 'BLOG_POST_VIEW'

interface LogActivityParams {
  userId: string
  action: ActivityAction
  resource?: string
  metadata?: Record<string, any>
}

export async function logActivity({
  userId,
  action,
  resource,
  metadata = {},
}: LogActivityParams): Promise<void> {
  try {
    // Get request headers for additional metadata
    const headersList = await headers()
    const userAgent = headersList.get('user-agent') || undefined
    const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || undefined

    await prisma.activityLog.create({
      data: {
        userId,
        action,
        resource,
        metadata: {
          ...metadata,
          userAgent,
          ip,
          timestamp: new Date().toISOString(),
        },
      },
    })
  } catch (error) {
    // Don't throw — logging failures shouldn't break the app
    console.error('[ACTIVITY_LOG] Error logging activity:', error)
  }
}

export async function getUserActivityLog(
  userId: string,
  limit: number = 100,
  offset: number = 0
) {
  return prisma.activityLog.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: offset,
  })
}

export async function getUserActivityStats(userId: string) {
  const logs = await prisma.activityLog.groupBy({
    by: ['action'],
    where: { userId },
    _count: true,
  })

  return logs.map((log) => ({
    action: log.action,
    count: log._count,
  }))
}

export async function getAllUsersActivityLog(
  filters?: {
    action?: string
    userId?: string
    dateFrom?: Date
    dateTo?: Date
  },
  limit: number = 100,
  offset: number = 0
) {
  const where: any = {}

  if (filters?.action) where.action = filters.action
  if (filters?.userId) where.userId = filters.userId
  if (filters?.dateFrom || filters?.dateTo) {
    where.createdAt = {}
    if (filters.dateFrom) where.createdAt.gte = filters.dateFrom
    if (filters.dateTo) where.createdAt.lte = filters.dateTo
  }

  return prisma.activityLog.findMany({
    where,
    include: {
      user: {
        select: { id: true, email: true, name: true },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: offset,
  })
}
