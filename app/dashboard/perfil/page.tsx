import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/session';
import { prisma } from '@/lib/prisma';
import { Crown, PlayCircle, BookOpen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ProfileForm } from '@/components/dashboard/profile-form';

export default async function ProfilePage() {
    const session = await getSession();
    if (!session) redirect('/login');

    const [user, completedLessons] = await Promise.all([
        prisma.user.findUnique({
            where: { id: session.userId },
            select: {
                id: true,
                name: true,
                email: true,
                emailVerified: true,
                username: true,
                avatarUrl: true,
                whatsapp: true,
                weight: true,
                height: true,
                birthdate: true,
                pendingEmail: true,
                subscriptionStatus: true,
                subscriptionEndDate: true,
                bio: true,
                instagram: true,
                twitter: true,
                youtube: true,
                tiktok: true,
                linkedin: true,
                website: true,
                profilePublic: true,
                enrollments: { select: { courseId: true } },
            },
        }),
        prisma.userProgress.count({
            where: { userId: session.userId, isCompleted: true },
        }),
    ]);

    if (!user) redirect('/login');

    const isPremium = user.subscriptionStatus === 'ACTIVE';

    return (
        <div className="p-6 lg:p-8 space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl lg:text-4xl font-bold font-serif">Meu Perfil</h1>
                <p className="mt-1 text-muted-foreground">
                    Gerencie sua conta e acompanhe seu progresso
                </p>
            </div>

            {/* Stats strip */}
            <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col items-center gap-1 rounded-xl border border-border bg-card p-4">
                    <PlayCircle className="h-5 w-5 text-primary" />
                    <span className="text-2xl font-bold">{user.enrollments.length}</span>
                    <span className="text-xs text-muted-foreground text-center">Cursos</span>
                </div>
                <div className="flex flex-col items-center gap-1 rounded-xl border border-border bg-card p-4">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <span className="text-2xl font-bold">{completedLessons}</span>
                    <span className="text-xs text-muted-foreground text-center">Aulas concluídas</span>
                </div>
                <div className="flex flex-col items-center gap-1 rounded-xl border border-border bg-card p-4">
                    <Crown className="h-5 w-5 text-primary" />
                    <span className="text-lg font-bold">
                        {isPremium ? 'Premium' : 'Gratuito'}
                    </span>
                    {isPremium && (
                        <Badge className="bg-primary text-primary-foreground text-[10px] py-0">Ativo</Badge>
                    )}
                    {isPremium && user.subscriptionEndDate && (
                        <span className="text-xs text-muted-foreground">
                            até {new Date(user.subscriptionEndDate).toLocaleDateString('pt-BR')}
                        </span>
                    )}
                </div>
            </div>

            {/* Editable form */}
            <ProfileForm
                user={{
                    id:            user.id,
                    name:          user.name,
                    username:      user.username,
                    email:         user.email,
                    emailVerified: user.emailVerified,
                    avatarUrl:     user.avatarUrl,
                    whatsapp:      user.whatsapp,
                    weight:        user.weight,
                    height:        user.height,
                    birthdate:     user.birthdate,
                    pendingEmail:  user.pendingEmail,
                    bio:           user.bio,
                    instagram:     user.instagram,
                    twitter:       user.twitter,
                    youtube:       user.youtube,
                    tiktok:        user.tiktok,
                    linkedin:      user.linkedin,
                    website:       user.website,
                    profilePublic: user.profilePublic,
                }}
            />
        </div>
    );
}
