import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyMobileToken } from '@/lib/auth/mobile-jwt'

export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> },
) {
    const { slug } = await params

    // ── Auth opcional: sem token → hasAccess = false, não retorna 401 ──────────
    let userId: string | null = null
    let userRole: string | null = null
    let subscriptionStatus: string | null = null

    const authHeader = request.headers.get('Authorization')
    if (authHeader?.startsWith('Bearer ')) {
        try {
            const payload = await verifyMobileToken(authHeader.slice(7))
            userId = payload.id
            userRole = payload.role

            // Busca subscriptionStatus — não está no JWT, precisa do banco
            const user = await prisma.user.findUnique({
                where: { id: payload.id },
                select: { subscriptionStatus: true },
            })
            subscriptionStatus = user?.subscriptionStatus ?? null
        } catch {
            // Token inválido/expirado → trata como anônimo
        }
    }

    // ── Busca o curso ──────────────────────────────────────────────────────────
    const course = await prisma.course.findUnique({
        where: { slug, published: true },
        select: {
            id: true,
            title: true,
            slug: true,
            description: true,
            coverImage: true,
            isPremium: true,
            price: true,
            kiwifyUrl: true,
            modules: {
                orderBy: { order: 'asc' },
                select: {
                    id: true,
                    title: true,
                    order: true,
                    lessons: {
                        orderBy: { order: 'asc' },
                        select: {
                            id: true,
                            title: true,
                            slug: true,
                            videoUrl: true,
                            thumbnailUrl: true,
                            content: true,
                            isFree: true,
                            order: true,
                        },
                    },
                },
            },
        },
    })

    if (!course) {
        return NextResponse.json(
            { success: false, error: 'Curso não encontrado.' },
            { status: 404 },
        )
    }

    // ── Regra de acesso ────────────────────────────────────────────────────────
    // ADMIN → acesso total
    // Assinatura ACTIVE → acesso total
    // CourseEnrollment (compra individual) → acesso total
    // isFree lesson → sempre entrega o vídeo independente de hasAccess
    let hasAccess = false

    if (userId) {
        if (userRole === 'ADMIN') {
            hasAccess = true
        } else if (subscriptionStatus === 'ACTIVE') {
            hasAccess = true
        } else {
            const enrollment = await prisma.courseEnrollment.findUnique({
                where: { userId_courseId: { userId, courseId: course.id } },
                select: { id: true },
            })
            hasAccess = !!enrollment
        }
    }

    // ── Payload inteligente: remove videoUrl se sem acesso ────────────────────
    const modules = course.modules.map((module) => ({
        id: module.id,
        title: module.title,
        order: module.order,
        lessons: module.lessons.map((lesson) => {
            const canWatch = hasAccess || lesson.isFree
            return {
                id: lesson.id,
                title: lesson.title,
                slug: lesson.slug,
                thumbnailUrl: lesson.thumbnailUrl,
                isFree: lesson.isFree,
                order: lesson.order,
                // videoUrl e content: retornam null quando sem acesso (ou sem valor)
                videoUrl: canWatch ? lesson.videoUrl : null,
                content: canWatch ? lesson.content : null,
            }
        }),
    }))

    return NextResponse.json({
        success: true,
        hasAccess,
        course: {
            id: course.id,
            title: course.title,
            slug: course.slug,
            description: course.description,
            thumbnailUrl: course.coverImage,
            isPremium: course.isPremium,
            price: course.price,
            kiwifyUrl: hasAccess ? null : course.kiwifyUrl, // só expõe link de compra para quem não tem acesso
            modules,
        },
    })
}
