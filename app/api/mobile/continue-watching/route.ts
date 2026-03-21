import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireMobileAuth } from '@/lib/auth/mobile-jwt'

export async function GET(request: NextRequest) {
    const auth = await requireMobileAuth(request)
    if (!auth.ok) return auth.response

    const userId = auth.payload.id

    try {
        // 1. Fetch all enrollments with full course structure (modules + lessons in order)
        const enrollments = await prisma.courseEnrollment.findMany({
            where: { userId },
            select: {
                course: {
                    select: {
                        id: true,
                        title: true,
                        coverImage: true,
                        modules: {
                            orderBy: { order: 'asc' },
                            select: {
                                lessons: {
                                    orderBy: { order: 'asc' },
                                    select: {
                                        id: true,
                                        title: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        })

        if (enrollments.length === 0) {
            return NextResponse.json({ success: true, data: [] })
        }

        // Collect every lesson ID across all enrolled courses in a single pass
        const allLessonIds = enrollments.flatMap((e) =>
            e.course.modules.flatMap((m) => m.lessons.map((l) => l.id))
        )

        // 2. Single query: fetch all completed progress records for this user
        const completedProgress = await prisma.userProgress.findMany({
            where: {
                userId,
                lessonId: { in: allLessonIds },
                isCompleted: true,
            },
            select: {
                lessonId: true,
                updatedAt: true,
            },
        })

        const completedLessonIds = new Set(completedProgress.map((p) => p.lessonId))
        const progressByLesson = new Map(completedProgress.map((p) => [p.lessonId, p.updatedAt]))

        // 3. Build + filter the "continue watching" payload
        type CourseItem = {
            courseId: string
            title: string
            thumbnailUrl: string | null
            progressPercentage: number
            nextLessonId: string
            nextLessonTitle: string
            _lastActivity: Date
        }

        const continueWatching: CourseItem[] = []

        for (const { course } of enrollments) {
            const allLessons = course.modules.flatMap((m) => m.lessons)
            const totalLessons = allLessons.length

            if (totalLessons === 0) continue

            const completedCount = allLessons.filter((l) =>
                completedLessonIds.has(l.id)
            ).length

            // Only include courses that have been started but are not 100% done
            if (completedCount === 0 || completedCount === totalLessons) continue

            const progressPercentage = Math.round((completedCount / totalLessons) * 100)

            // Next lesson to watch: first lesson in curriculum order not yet completed
            const nextLesson = allLessons.find((l) => !completedLessonIds.has(l.id))
            if (!nextLesson) continue

            // Last activity timestamp: most recent completedAt among this course's lessons
            let lastActivity = new Date(0)
            for (const lesson of allLessons) {
                const updatedAt = progressByLesson.get(lesson.id)
                if (updatedAt && updatedAt > lastActivity) {
                    lastActivity = updatedAt
                }
            }

            continueWatching.push({
                courseId: course.id,
                title: course.title,
                thumbnailUrl: course.coverImage ?? null,
                progressPercentage,
                nextLessonId: nextLesson.id,
                nextLessonTitle: nextLesson.title,
                _lastActivity: lastActivity,
            })
        }

        // Sort by most recently accessed first
        continueWatching.sort(
            (a, b) => b._lastActivity.getTime() - a._lastActivity.getTime()
        )

        // Strip the internal sorting field before sending the response
        const data = continueWatching.map(
            ({ _lastActivity: _discarded, ...item }) => item
        )

        return NextResponse.json({ success: true, data })
    } catch (error) {
        console.error('[mobile/continue-watching] Erro:', error)
        return NextResponse.json(
            { success: false, error: 'Erro interno do servidor.' },
            { status: 500 }
        )
    }
}
