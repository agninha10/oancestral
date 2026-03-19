/**
 * app/api/og/blog/[slug]/route.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Dynamic OG image (1200 × 630) for blog post pages.
 *
 * Layout:
 *   • If post has coverImage: full-bleed photo + dark gradient overlay
 *   • Fallback: styled dark card with amber accent
 *
 * Typography:
 *   Top-left  — category pill (first tag, if any)
 *   Top-right — "O Ancestral" brand
 *   Bottom    — amber rule · post title (auto-sized) · site URL
 */

import { ImageResponse } from 'next/og';
import { type NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { buildFonts, absoluteUrl } from '@/lib/og/shared';

export const runtime = 'nodejs';

const AMBER   = '#f59e0b';
const ZINC950 = '#09090b';
const WHITE   = '#ffffff';

// ─── Route handler ────────────────────────────────────────────────────────────

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ slug: string }> },
) {
    const { slug } = await params;

    // ── Fetch post ────────────────────────────────────────────────────────────
    const post = await prisma.blogPost.findUnique({
        where: { slug, published: true },
        select: {
            title: true,
            excerpt: true,
            coverImage: true,
            tags: true,
        },
    });

    // ── Fonts ─────────────────────────────────────────────────────────────────
    const fonts = await buildFonts();
    const serif = fonts.length ? 'Crimson Pro' : 'Georgia, serif';

    // ── Resolve image ─────────────────────────────────────────────────────────
    const coverUrl = absoluteUrl(post?.coverImage);

    // ── Typography sizing: auto-shrink long titles ────────────────────────────
    const title = post?.title ?? 'O Ancestral — Nutrição Ancestral';
    const titleSize = title.length > 70 ? 44 : title.length > 50 ? 52 : title.length > 35 ? 60 : 68;

    // ── Category label (first tag, formatted) ─────────────────────────────────
    const tag = post?.tags?.[0]
        ? post.tags[0].replace(/-/g, ' ').toUpperCase()
        : null;

    // ─── JSX Template ─────────────────────────────────────────────────────────

    return new ImageResponse(
        coverUrl ? (
            /* ── WITH background image ─────────────────────────────────────── */
            <div style={{
                width: 1200, height: 630,
                display: 'flex', position: 'relative',
                overflow: 'hidden', backgroundColor: ZINC950,
            }}>
                {/* Full-bleed photo */}
                <img src={coverUrl} style={{
                    position: 'absolute', width: '100%', height: '100%',
                    objectFit: 'cover', objectPosition: 'center',
                }} />

                {/* Gradient: light top → heavy bottom for legibility */}
                <div style={{
                    position: 'absolute', inset: 0, display: 'flex',
                    background: 'linear-gradient(to bottom, rgba(9,9,11,0.25) 0%, rgba(9,9,11,0.45) 40%, rgba(9,9,11,0.95) 100%)',
                }} />

                {/* Top bar */}
                <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0,
                    padding: '44px 64px 0',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                    {/* Category pill */}
                    {tag ? (
                        <div style={{
                            padding: '6px 20px', borderRadius: 24,
                            backgroundColor: 'rgba(245,158,11,0.14)',
                            border: '1px solid rgba(245,158,11,0.35)',
                            fontSize: 15, fontWeight: 700,
                            letterSpacing: '0.16em', color: AMBER,
                            fontFamily: 'sans-serif', display: 'flex',
                        }}>
                            {tag}
                        </div>
                    ) : (
                        <div style={{ display: 'flex' }} />
                    )}

                    {/* Brand */}
                    <div style={{
                        fontFamily: serif, fontWeight: 700,
                        fontSize: 24, color: AMBER,
                        letterSpacing: '0.06em', display: 'flex',
                    }}>
                        O Ancestral
                    </div>
                </div>

                {/* Bottom content */}
                <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    padding: '0 64px 52px',
                    display: 'flex', flexDirection: 'column', gap: 12,
                }}>
                    {/* Amber rule */}
                    <div style={{ width: 48, height: 3, backgroundColor: AMBER }} />

                    {/* Title */}
                    <div style={{
                        fontFamily: serif, fontWeight: 700,
                        fontSize: titleSize, color: WHITE,
                        lineHeight: 1.1, maxWidth: 1050,
                        letterSpacing: '0.01em',
                    }}>
                        {title}
                    </div>

                    {/* Site URL */}
                    <div style={{
                        fontSize: 20, color: 'rgba(161,161,170,0.6)',
                        letterSpacing: '0.1em', fontFamily: 'sans-serif',
                    }}>
                        oancestral.com.br/blog
                    </div>
                </div>
            </div>
        ) : (
            /* ── FALLBACK: branded dark card ───────────────────────────────── */
            <div style={{
                width: 1200, height: 630,
                display: 'flex', flexDirection: 'column',
                position: 'relative', overflow: 'hidden',
                backgroundColor: ZINC950,
            }}>
                {/* Amber glow – top-right corner */}
                <div style={{
                    position: 'absolute', top: -120, right: -120,
                    width: 520, height: 520, borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(245,158,11,0.18) 0%, transparent 68%)',
                    display: 'flex',
                }} />

                {/* Faint pattern lines for texture */}
                <div style={{
                    position: 'absolute', top: 80, left: 64,
                    display: 'flex', flexDirection: 'column', gap: 28,
                }}>
                    {['NUTRIÇÃO', 'JEJUM', 'MENTALIDADE', 'ANCESTRALIDADE'].map((w) => (
                        <span key={w} style={{
                            fontSize: 13, letterSpacing: '0.3em',
                            color: 'rgba(245,158,11,0.06)', fontFamily: 'sans-serif',
                        }}>
                            {w}
                        </span>
                    ))}
                </div>

                {/* Top bar */}
                <div style={{
                    position: 'absolute', top: 52, left: 72, right: 72,
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                    {tag ? (
                        <div style={{
                            padding: '6px 18px', borderRadius: 24,
                            backgroundColor: 'rgba(245,158,11,0.12)',
                            border: '1px solid rgba(245,158,11,0.28)',
                            fontSize: 14, fontWeight: 700,
                            letterSpacing: '0.18em', color: AMBER,
                            fontFamily: 'sans-serif', display: 'flex',
                        }}>
                            {tag}
                        </div>
                    ) : (
                        <div style={{ display: 'flex' }} />
                    )}

                    <div style={{
                        fontFamily: serif, fontWeight: 700,
                        fontSize: 24, color: AMBER,
                        letterSpacing: '0.06em', display: 'flex',
                    }}>
                        O Ancestral
                    </div>
                </div>

                {/* Bottom content */}
                <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    padding: '0 72px 60px',
                    display: 'flex', flexDirection: 'column', gap: 14,
                }}>
                    <div style={{ width: 48, height: 3, backgroundColor: AMBER }} />

                    <div style={{
                        fontFamily: serif, fontWeight: 700,
                        fontSize: titleSize, color: WHITE,
                        lineHeight: 1.1, maxWidth: 1000,
                        letterSpacing: '0.01em',
                    }}>
                        {title}
                    </div>

                    <div style={{
                        fontSize: 20, color: 'rgba(161,161,170,0.55)',
                        letterSpacing: '0.1em', fontFamily: 'sans-serif',
                    }}>
                        oancestral.com.br/blog
                    </div>
                </div>
            </div>
        ),
        {
            width: 1200,
            height: 630,
            fonts,
            headers: {
                'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
            },
        },
    );
}
