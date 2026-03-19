/**
 * app/api/og/receitas/[slug]/route.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Dynamic OG image (1200 × 630) for recipe pages.
 *
 * Layout:
 *   • If recipe has coverImage: full-bleed food photo + dark gradient
 *   • Fallback: styled dark card
 *
 * Bottom overlay contains (bottom → top):
 *   URL · Recipe title · star rating + prep time row
 */

import { ImageResponse } from 'next/og';
import { type NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { buildFonts, absoluteUrl } from '@/lib/og/shared';

export const runtime = 'nodejs';

const AMBER   = '#f59e0b';
const ZINC950 = '#09090b';
const WHITE   = '#ffffff';

// ─── Star renderer (Unicode, no SVG needed) ───────────────────────────────────
function stars(value: number): string {
    const full  = Math.round(Math.min(Math.max(value, 0), 5));
    const empty = 5 - full;
    return '★'.repeat(full) + '☆'.repeat(empty);
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ slug: string }> },
) {
    const { slug } = await params;

    // ── Fetch recipe ──────────────────────────────────────────────────────────
    const recipe = await prisma.recipe.findFirst({
        where: { slug, published: true },
        select: {
            title: true,
            coverImage: true,
            prepTime: true,
            ratingValue: true,
            ratingCount: true,
        },
    });

    // ── Fonts ─────────────────────────────────────────────────────────────────
    const fonts = await buildFonts();
    const serif = fonts.length ? 'Crimson Pro' : 'Georgia, serif';

    // ── Derived values ────────────────────────────────────────────────────────
    const title       = recipe?.title       ?? 'Receitas Ancestrais';
    const coverUrl    = absoluteUrl(recipe?.coverImage);
    const ratingValue = recipe?.ratingValue ?? 5;
    const ratingCount = recipe?.ratingCount ?? 0;
    const prepTime    = recipe?.prepTime    ?? null;

    const titleSize  = title.length > 60 ? 48 : title.length > 40 ? 56 : 64;
    const starsStr   = stars(ratingValue);

    // ─── JSX Template ─────────────────────────────────────────────────────────

    return new ImageResponse(
        coverUrl ? (
            /* ── WITH food image ───────────────────────────────────────────── */
            <div style={{
                width: 1200, height: 630,
                display: 'flex', position: 'relative',
                overflow: 'hidden', backgroundColor: ZINC950,
            }}>
                {/* Food photo */}
                <img src={coverUrl} style={{
                    position: 'absolute', width: '100%', height: '100%',
                    objectFit: 'cover', objectPosition: 'center',
                }} />

                {/* Gradient: transparent top → very dark bottom (food should show) */}
                <div style={{
                    position: 'absolute', inset: 0, display: 'flex',
                    background: 'linear-gradient(to bottom, rgba(9,9,11,0.0) 0%, rgba(9,9,11,0.2) 35%, rgba(9,9,11,0.92) 75%, rgba(9,9,11,0.98) 100%)',
                }} />

                {/* Recipe badge — top left */}
                <div style={{
                    position: 'absolute', top: 44, left: 60,
                    padding: '7px 20px', borderRadius: 24,
                    backgroundColor: 'rgba(9,9,11,0.65)',
                    border: '1px solid rgba(245,158,11,0.35)',
                    backdropFilter: 'blur(8px)',
                    display: 'flex', alignItems: 'center',
                }}>
                    <span style={{
                        fontSize: 15, fontWeight: 700,
                        letterSpacing: '0.16em', color: AMBER,
                        fontFamily: 'sans-serif',
                    }}>
                        RECEITAS ANCESTRAIS
                    </span>
                </div>

                {/* Brand — top right */}
                <div style={{
                    position: 'absolute', top: 46, right: 64,
                    fontFamily: serif, fontWeight: 700,
                    fontSize: 24, color: AMBER,
                    letterSpacing: '0.06em', display: 'flex',
                }}>
                    O Ancestral
                </div>

                {/* Bottom content block */}
                <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    padding: '0 64px 48px',
                    display: 'flex', flexDirection: 'column', gap: 10,
                }}>
                    {/* Stars + meta row */}
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: 14,
                    }}>
                        {/* Stars */}
                        <span style={{
                            fontSize: 28, color: AMBER,
                            letterSpacing: '0.06em', display: 'flex',
                        }}>
                            {starsStr}
                        </span>

                        {/* Rating count */}
                        {ratingCount > 0 && (
                            <span style={{
                                fontSize: 18, color: 'rgba(255,255,255,0.55)',
                                fontFamily: 'sans-serif', display: 'flex',
                            }}>
                                ({ratingCount})
                            </span>
                        )}

                        {/* Separator + prep time */}
                        {prepTime !== null && (
                            <>
                                <div style={{
                                    width: 1, height: 18,
                                    backgroundColor: 'rgba(255,255,255,0.25)',
                                    display: 'flex',
                                }} />
                                <span style={{
                                    fontSize: 18, color: 'rgba(255,255,255,0.6)',
                                    fontFamily: 'sans-serif', display: 'flex',
                                }}>
                                    {prepTime} min
                                </span>
                            </>
                        )}
                    </div>

                    {/* Amber rule */}
                    <div style={{ width: 48, height: 3, backgroundColor: AMBER }} />

                    {/* Recipe title */}
                    <div style={{
                        fontFamily: serif, fontWeight: 700,
                        fontSize: titleSize, color: WHITE,
                        lineHeight: 1.08, maxWidth: 1040,
                        letterSpacing: '0.01em',
                    }}>
                        {title}
                    </div>

                    {/* URL */}
                    <div style={{
                        fontSize: 20, color: 'rgba(161,161,170,0.55)',
                        letterSpacing: '0.1em', fontFamily: 'sans-serif',
                    }}>
                        oancestral.com.br/receitas
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
                {/* Warm amber glow */}
                <div style={{
                    position: 'absolute', top: -80, right: -80,
                    width: 480, height: 480, borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(245,158,11,0.22) 0%, transparent 65%)',
                    display: 'flex',
                }} />
                <div style={{
                    position: 'absolute', bottom: -60, left: 60,
                    width: 300, height: 300, borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)',
                    display: 'flex',
                }} />

                {/* Top bar */}
                <div style={{
                    position: 'absolute', top: 52, left: 72, right: 72,
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                    <div style={{
                        padding: '7px 20px', borderRadius: 24,
                        backgroundColor: 'rgba(245,158,11,0.12)',
                        border: '1px solid rgba(245,158,11,0.28)',
                        fontSize: 14, fontWeight: 700,
                        letterSpacing: '0.18em', color: AMBER,
                        fontFamily: 'sans-serif', display: 'flex',
                    }}>
                        RECEITAS ANCESTRAIS
                    </div>

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
                    padding: '0 72px 56px',
                    display: 'flex', flexDirection: 'column', gap: 12,
                }}>
                    {/* Stars */}
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                    }}>
                        <span style={{
                            fontSize: 26, color: AMBER,
                            letterSpacing: '0.06em', display: 'flex',
                        }}>
                            {starsStr}
                        </span>
                        {prepTime !== null && (
                            <span style={{
                                fontSize: 17, color: 'rgba(255,255,255,0.5)',
                                fontFamily: 'sans-serif', display: 'flex',
                            }}>
                                · {prepTime} min
                            </span>
                        )}
                    </div>

                    <div style={{ width: 48, height: 3, backgroundColor: AMBER }} />

                    <div style={{
                        fontFamily: serif, fontWeight: 700,
                        fontSize: titleSize, color: WHITE,
                        lineHeight: 1.08, maxWidth: 1000,
                        letterSpacing: '0.01em',
                    }}>
                        {title}
                    </div>

                    <div style={{
                        fontSize: 20, color: 'rgba(161,161,170,0.55)',
                        letterSpacing: '0.1em', fontFamily: 'sans-serif',
                    }}>
                        oancestral.com.br/receitas
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
