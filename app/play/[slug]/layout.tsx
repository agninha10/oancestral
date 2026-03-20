import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/session';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { ArrowLeft, BookOpen } from 'lucide-react';

export default async function PlayLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ slug: string }>;
}) {
    const session = await getSession();
    if (!session) redirect('/login?redirect=/dashboard/cursos');

    const { slug } = await params;

    const course = await prisma.course.findUnique({
        where: { slug },
        select: { title: true },
    });

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100">
            {/* Minimal top bar */}
            <header className="sticky top-0 z-50 flex h-14 items-center gap-4 border-b border-zinc-800 bg-zinc-950/90 px-4 backdrop-blur lg:px-6">
                <Link
                    href="/dashboard/cursos"
                    className="flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-white"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Meus Cursos
                </Link>

                {course && (
                    <>
                        <span className="text-zinc-700">|</span>
                        <span className="flex items-center gap-1.5 text-sm font-medium text-zinc-300 line-clamp-1">
                            <BookOpen className="h-3.5 w-3.5 flex-shrink-0 text-amber-500" />
                            {course.title}
                        </span>
                    </>
                )}
            </header>

            {children}
        </div>
    );
}
