import type { Metadata } from 'next';
import Image from 'next/image';
import { Playfair_Display } from 'next/font/google';
import { ExternalLink, ChevronRight } from 'lucide-react';
import { getActiveLinks } from '@/app/actions/quick-links';
import { TrackView } from './track-view';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const playfair = Playfair_Display({
    subsets: ['latin'],
    weight: ['400', '700', '900'],
    style: ['normal', 'italic'],
    variable: '--font-playfair',
    display: 'swap',
});

export const metadata: Metadata = {
    title: '@oancestral — Links',
    description:
        'Soberania Biológica e Mental. Acesse os recursos, cursos e comunidade de O Ancestral.',
    robots: { index: true, follow: true },
    openGraph: {
        title: '@oancestral — Links',
        description: 'Soberania Biológica e Mental.',
        type: 'website',
        url: 'https://oancestral.com.br/links',
    },
};

// ─── Componente de link rastreável ────────────────────────────────────────────

function LinkCard({
    id,
    title,
    url,
    emoji,
    imageUrl,
    highlight,
}: {
    id: string;
    title: string;
    url: string;
    emoji?: string | null;
    imageUrl?: string | null;
    highlight: boolean;
}) {
    // Redireciona via API route para registrar o clique.
    const href = `/api/links/${id}/click`;
    const isExternal = url.startsWith('http');

    return (
        <a
            href={href}
            target={isExternal ? '_blank' : '_self'}
            rel={isExternal ? 'noopener noreferrer' : undefined}
            className={[
                'link-card group relative flex items-center gap-4',
                'w-full rounded-2xl border px-5 py-4 sm:py-5',
                'transition-all duration-200',
                highlight
                    ? 'border-amber-500/60 bg-zinc-900 highlight-pulse'
                    : 'border-zinc-800/80 bg-zinc-900/60 hover:border-amber-500/50 hover:bg-zinc-900',
            ].join(' ')}
        >
            {/* Glow decorativo no hover */}
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-amber-500/5 to-transparent pointer-events-none" aria-hidden="true" />

            {/* Thumbnail / emoji icon */}
            <div className="flex-shrink-0 w-12 h-12 rounded-xl overflow-hidden bg-zinc-800 border border-zinc-700/50 flex items-center justify-center text-2xl leading-none select-none">
                {imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt={title}
                        width={48}
                        height={48}
                        className="object-cover w-full h-full"
                    />
                ) : (
                    <span>{emoji ?? '🔗'}</span>
                )}
            </div>

            {/* Título */}
            <span className={`flex-1 font-[family-name:var(--font-playfair)] text-base sm:text-lg font-bold text-white leading-snug ${highlight ? 'text-amber-50' : ''}`}>
                {title}
                {highlight && (
                    <span className="ml-2 inline-flex items-center text-[10px] uppercase tracking-widest font-sans font-semibold text-amber-400 bg-amber-950/60 border border-amber-700/50 px-2 py-0.5 rounded-full align-middle">
                        Destaque
                    </span>
                )}
            </span>

            {/* Seta */}
            <ChevronRight
                className="flex-shrink-0 w-5 h-5 text-zinc-600 group-hover:text-amber-400 group-hover:translate-x-1 transition-all"
                aria-hidden="true"
            />
        </a>
    );
}

// ─── Página principal ─────────────────────────────────────────────────────────

export default async function LinksPage() {
    const links = await getActiveLinks();

    return (
        <>
            <style>{`
        /* Textura de grão */
        body { background-color: #09090b; }
        .grain-bg::before {
          content: '';
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          opacity: 0.04;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          background-size: 128px 128px;
        }

        /* Pulsação âmbar nos links em destaque */
        @keyframes highlightPulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(245,158,11,0); border-color: rgba(245,158,11,0.4); }
          50%      { box-shadow: 0 0 18px 2px rgba(245,158,11,0.2); border-color: rgba(245,158,11,0.8); }
        }
        .highlight-pulse { animation: highlightPulse 2.8s ease-in-out infinite; }

        /* Fade up na entrada */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.55s ease-out forwards; }
        .link-card:nth-child(1) { animation: fadeUp 0.55s 0.05s ease-out both; }
        .link-card:nth-child(2) { animation: fadeUp 0.55s 0.12s ease-out both; }
        .link-card:nth-child(3) { animation: fadeUp 0.55s 0.19s ease-out both; }
        .link-card:nth-child(4) { animation: fadeUp 0.55s 0.26s ease-out both; }
        .link-card:nth-child(5) { animation: fadeUp 0.55s 0.33s ease-out both; }
        .link-card:nth-child(6) { animation: fadeUp 0.55s 0.40s ease-out both; }
        .link-card:nth-child(n+7) { animation: fadeUp 0.55s 0.47s ease-out both; }
      `}</style>

            <div className={`${playfair.variable} grain-bg min-h-screen bg-zinc-950 text-zinc-100`}>

                {/* Gradiente radial de profundidade */}
                <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(120,53,15,0.18)_0%,transparent_55%)] pointer-events-none" aria-hidden="true" />

                <TrackView />
                <main className="relative z-10 flex flex-col items-center px-4 py-14 sm:py-20 min-h-screen">
                    <div className="w-full max-w-md space-y-4">

                        {/* ── Header / Perfil ── */}
                        <header className="fade-up flex flex-col items-center text-center mb-8 space-y-4">
                            {/* Avatar */}
                            <div className="relative">
                                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-amber-500/50 shadow-lg shadow-amber-900/30">
                                    <Image
                                        src="/images/image_1.png"
                                        alt="O Ancestral"
                                        width={96}
                                        height={96}
                                        className="object-cover w-full h-full"
                                        priority
                                    />
                                </div>
                                {/* Anel âmbar decorativo */}
                                <div className="absolute -inset-1 rounded-full border border-amber-500/20 pointer-events-none" aria-hidden="true" />
                            </div>

                            {/* Handle e nome */}
                            <div>
                                <h1 className="font-[family-name:var(--font-playfair)] text-2xl font-black text-white">
                                    O Ancestral
                                </h1>
                                <p className="text-zinc-500 text-sm font-medium mt-0.5">@oancestral</p>
                            </div>

                            {/* Bio de autoridade */}
                            <p className="text-zinc-400 text-sm max-w-xs leading-relaxed">
                                <span className="text-amber-400 font-semibold">Soberania Biológica e Mental.</span>
                                {' '}Nutrição ancestral, jejum, força e liberdade do sistema.
                            </p>
                        </header>

                        {/* ── Lista de Links ── */}
                        <section className="space-y-3" aria-label="Links">
                            {links.length === 0 ? (
                                <p className="text-center text-zinc-600 text-sm py-8">
                                    Nenhum link disponível no momento.
                                </p>
                            ) : (
                                links.map((link) => (
                                    <LinkCard
                                        key={link.id}
                                        id={link.id}
                                        title={link.title}
                                        url={link.url}
                                        emoji={link.emoji}
                                        imageUrl={link.imageUrl}
                                        highlight={link.highlight}
                                    />
                                ))
                            )}
                        </section>

                        {/* ── Rodapé ── */}
                        <footer className="pt-10 text-center space-y-2">
                            <a
                                href="/"
                                className="inline-flex items-center gap-1.5 text-zinc-600 hover:text-amber-400 text-xs transition-colors"
                            >
                                <ExternalLink className="w-3 h-3" aria-hidden="true" />
                                oancestral.com.br
                            </a>
                            <p className="text-zinc-800 text-xs">
                                © {new Date().getFullYear()} O Ancestral
                            </p>
                        </footer>
                    </div>
                </main>
            </div>
        </>
    );
}
