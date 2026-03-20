import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth/session';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Globe, Lock, Pencil } from 'lucide-react';
import { FaInstagram, FaXTwitter, FaYoutube, FaTiktok, FaLinkedin } from 'react-icons/fa6';

export const dynamic = 'force-dynamic';

interface PageProps {
    params: Promise<{ username: string }>;
}

const userSelect = {
    id: true,
    name: true,
    username: true,
    avatarUrl: true,
    bio: true,
    instagram: true,
    twitter: true,
    youtube: true,
    tiktok: true,
    linkedin: true,
    website: true,
    profilePublic: true,
    createdAt: true,
    _count: { select: { forumPosts: true } },
} as const;

async function findUser(slug: string) {
    return prisma.user.findFirst({
        where: { OR: [{ username: slug }, { id: slug }] },
        select: userSelect,
    });
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { username } = await params;
    const user = await findUser(username);
    if (!user) return {};
    return {
        title: `${user.name} (@${user.username ?? username}) | O Ancestral`,
        description: user.bio ?? `Perfil de ${user.name} na comunidade O Ancestral.`,
        alternates: { canonical: `/u/${user.username ?? user.id}` },
    };
}

const SOCIAL_LINKS = [
    { key: 'instagram' as const, label: 'Instagram', icon: FaInstagram, color: 'hover:text-pink-400',  prefix: 'https://instagram.com/' },
    { key: 'twitter'   as const, label: 'X',         icon: FaXTwitter,  color: 'hover:text-zinc-300',  prefix: 'https://x.com/' },
    { key: 'youtube'   as const, label: 'YouTube',   icon: FaYoutube,   color: 'hover:text-red-400',   prefix: 'https://youtube.com/' },
    { key: 'tiktok'    as const, label: 'TikTok',    icon: FaTiktok,    color: 'hover:text-zinc-200',  prefix: 'https://tiktok.com/@' },
    { key: 'linkedin'  as const, label: 'LinkedIn',  icon: FaLinkedin,  color: 'hover:text-sky-400',   prefix: 'https://linkedin.com/' },
    { key: 'website'   as const, label: 'Site',      icon: Globe,       color: 'hover:text-amber-400', prefix: '' },
];

function resolveUrl(value: string, prefix: string) {
    if (!value) return null;
    if (value.startsWith('http://') || value.startsWith('https://')) return value;
    const handle = value.startsWith('@') ? value.slice(1) : value;
    return prefix ? `${prefix}${handle}` : `https://${value}`;
}

export default async function UserProfilePage({ params }: PageProps) {
    const { username: slug } = await params;

    const [profileUser, session] = await Promise.all([findUser(slug), getSession()]);
    if (!profileUser) notFound();

    const isOwnProfile = session?.userId === profileUser.id;
    const showPrivate  = isOwnProfile || profileUser.profilePublic;

    const memberSince = formatDistanceToNow(new Date(profileUser.createdAt), {
        addSuffix: true,
        locale: ptBR,
    });

    const initials = profileUser.name
        .split(' ')
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase() ?? '')
        .join('');

    const recentPosts = await prisma.forumPost.findMany({
        where: { authorId: profileUser.id },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
            id: true,
            slug: true,
            title: true,
            createdAt: true,
            _count: { select: { replies: true, likes: true } },
        },
    });

    const activeSocials = SOCIAL_LINKS.filter(({ key }) => !!profileUser[key]);

    return (
        <div className="mx-auto max-w-2xl px-4 py-10 space-y-6">
            {/* Card principal */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8">
                <div className="flex items-start gap-5">
                    {/* Avatar */}
                    <div className="shrink-0">
                        {profileUser.avatarUrl ? (
                            <img
                                src={profileUser.avatarUrl}
                                alt={profileUser.name}
                                className="h-20 w-20 rounded-full object-cover ring-2 ring-amber-500/30"
                            />
                        ) : (
                            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-amber-500/20 text-2xl font-bold text-amber-400 ring-2 ring-amber-500/30">
                                {initials}
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <h1 className="font-serif text-2xl font-bold text-zinc-100">
                                {profileUser.name}
                            </h1>
                            {!profileUser.profilePublic && (
                                <span className="flex items-center gap-1 rounded-full border border-zinc-700 bg-zinc-800 px-2 py-0.5 text-[11px] text-zinc-500">
                                    <Lock className="h-3 w-3" /> Privado
                                </span>
                            )}
                        </div>

                        {profileUser.username && (
                            <p className="mt-0.5 text-sm font-mono text-zinc-500">@{profileUser.username}</p>
                        )}
                        <p className="mt-1 text-xs text-zinc-600">Membro {memberSince}</p>

                        {showPrivate && profileUser.bio && (
                            <p className="mt-3 text-sm text-zinc-400 leading-relaxed">{profileUser.bio}</p>
                        )}

                        {/* Social links */}
                        {showPrivate && activeSocials.length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-4">
                                {activeSocials.map(({ key, label, icon: Icon, color, prefix }) => {
                                    const href = resolveUrl(profileUser[key]!, prefix);
                                    if (!href) return null;
                                    return (
                                        <a
                                            key={key}
                                            href={href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            title={label}
                                            className={`flex items-center gap-1.5 text-zinc-500 transition-colors ${color}`}
                                        >
                                            <Icon className="h-4 w-4" />
                                            <span className="text-xs">{profileUser[key]}</span>
                                        </a>
                                    );
                                })}
                            </div>
                        )}

                        {!showPrivate && (
                            <p className="mt-3 text-xs text-zinc-600 italic">Este perfil é privado.</p>
                        )}
                    </div>

                    {/* Edit own profile */}
                    {isOwnProfile && (
                        <Link
                            href="/dashboard/perfil"
                            className="shrink-0 flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs text-zinc-400 hover:border-amber-500/50 hover:text-amber-400 transition-colors"
                        >
                            <Pencil className="h-3.5 w-3.5" />
                            Editar
                        </Link>
                    )}
                </div>

                {/* Stats */}
                <div className="mt-6 border-t border-zinc-800 pt-6 text-center">
                    <p className="text-2xl font-bold text-amber-400">{profileUser._count.forumPosts}</p>
                    <p className="text-xs text-zinc-500">posts na Forja</p>
                </div>
            </div>

            {/* Posts recentes */}
            {recentPosts.length > 0 && (
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 space-y-4">
                    <h2 className="font-serif text-sm font-semibold uppercase tracking-widest text-zinc-500">
                        Últimos posts na Forja
                    </h2>
                    <ul className="space-y-2">
                        {recentPosts.map((post) => {
                            const ago = formatDistanceToNow(new Date(post.createdAt), {
                                addSuffix: true,
                                locale: ptBR,
                            });
                            return (
                                <li key={post.id}>
                                    <Link
                                        href={`/comunidade/post/${post.slug ?? post.id}`}
                                        className="group flex items-start gap-3 rounded-xl border border-zinc-800/60 bg-zinc-900/40 p-3 hover:border-amber-500/30 transition-colors"
                                    >
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-zinc-200 group-hover:text-amber-400 transition-colors line-clamp-2">
                                                {post.title}
                                            </p>
                                            <p className="mt-0.5 text-xs text-zinc-600">{ago}</p>
                                        </div>
                                        <div className="flex shrink-0 items-center gap-2 text-xs text-zinc-600">
                                            <span>❤ {post._count.likes}</span>
                                            <span>💬 {post._count.replies}</span>
                                        </div>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
        </div>
    );
}
