/**
 * app/api/og/cursos/[slug]/route.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Dynamic OG image (1200 × 630) for course pages.
 *
 * Priority chain for background:
 *   1. /public/images/image_1.png  (if file exists on disk)
 *   2. course.ogImage              (Cloudinary / absolute URL from DB)
 *   3. course.coverImage           (same)
 *   4. Pure dark branded card      (zero-dependency fallback)
 *
 * For the jejum course slug the main heading always reads
 * "CURSO DE JEJUM ANCESTRAL" (never "Mentoria de …").
 */

import { ImageResponse } from 'next/og';
import { type NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { buildFonts, localImage, absoluteUrl } from '@/lib/og/shared';

export const runtime = 'nodejs'; // needs fs (localImage) and prisma

// The exact DB slug for the jejum course
const JEJUM_SLUG = 'mentoria-de-jejum-ancestral-o-caminho-da-saude-integral';

// ─── Amber colour tokens ──────────────────────────────────────────────────────
const AMBER = '#f59e0b';
const ZINC950 = '#09090b';
const WHITE = '#ffffff';

// ─── Route handler ────────────────────────────────────────────────────────────

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ slug: string }> },
) {
    const { slug } = await params;

    // ── 1. Fetch course (light select – no heavy joins) ───────────────────────
    const course = await prisma.course.findFirst({
        where: { slug, published: true },
        select: { title: true, slug: true, coverImage: true, ogImage: true },
    });

    // ── 2. Fonts ──────────────────────────────────────────────────────────────
    const fonts = await buildFonts();
    const serif = fonts.length ? 'Crimson Pro' : 'Georgia, serif';

    // ── 3. Resolve background ─────────────────────────────────────────────────
    const isJejum = slug === JEJUM_SLUG;

    // For the jejum course try the rustic photo first
    const bgDataURI: string | null = isJejum ? localImage('images/image_1.png') : null;

    // For all courses: fall back to DB images (absolute URL)
    const dbImageUrl: string | null =
        bgDataURI == null
            ? (absoluteUrl(course?.ogImage) ?? absoluteUrl(course?.coverImage) ?? null)
            : null;

    const hasBg = bgDataURI !== null || dbImageUrl !== null;
    const bgSrc = bgDataURI ?? dbImageUrl;

    // ── 4. Display title ──────────────────────────────────────────────────────
    const heading = isJejum ? 'CURSO DE JEJUM ANCESTRAL' : (course?.title ?? 'O Ancestral');
    const fontSize = heading.length > 40 ? 52 : heading.length > 28 ? 62 : 72;

    // ─────────────────────────────────────────────────────────────────────────
    // JSX Template
    // All styles are inline – Tailwind classes are NOT supported by Satori.
    // ─────────────────────────────────────────────────────────────────────────

    return new ImageResponse(
        hasBg ? (
            /* ── TEMPLATE A: photo / image background ─────────────────────── */
            <div
                style={{
                    width: 1200, height: 630,
                    display: 'flex', position: 'relative', overflow: 'hidden',
                    backgroundColor: ZINC950,
                }}
            >
                {/* Full-bleed background image */}
                <img
                    src={bgSrc!}
                    style={{
                        position: 'absolute', width: '100%', height: '100%',
                        objectFit: 'cover', objectPosition: 'center top',
                    }}
                />

                {/* Vignette: light at top, heavy at bottom */}
                <div style={{
                    position: 'absolute', inset: 0, display: 'flex',
                    background: 'linear-gradient(to bottom, rgba(9,9,11,0.15) 0%, rgba(9,9,11,0.5) 55%, rgba(9,9,11,0.96) 100%)',
                }} />

                {/* Site brand — top left */}
                <div style={{
                    position: 'absolute', top: 44, left: 64,
                    fontFamily: serif, fontWeight: 700, fontSize: 26,
                    color: AMBER, letterSpacing: '0.06em', display: 'flex',
                }}>
                    O Ancestral
                </div>

                {/* Bottom content block */}
                <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    padding: '0 64px 52px',
                    display: 'flex', flexDirection: 'column', gap: 10,
                }}>
                    {/* Amber rule */}
                    <div style={{ width: 56, height: 3, backgroundColor: AMBER, marginBottom: 6 }} />

                    {/* Heading */}
                    <div style={{
                        fontFamily: serif, fontWeight: 700,
                        fontSize: isJejum ? 68 : fontSize,
                        color: AMBER,
                        letterSpacing: isJejum ? '0.12em' : '0.04em',
                        lineHeight: 1.04,
                        textShadow: '0 2px 16px rgba(0,0,0,0.9)',
                    }}>
                        {heading}
                    </div>

                    {/* URL */}
                    <div style={{
                        fontSize: 22, color: 'rgba(255,255,255,0.55)',
                        letterSpacing: '0.1em', fontFamily: 'sans-serif',
                        marginTop: 4,
                    }}>
                        oancestral.com.br
                    </div>
                </div>
            </div>
        ) : (
            /* ── TEMPLATE B: branded dark card (no image) ─────────────────── */
            <div style={{
                width: 1200, height: 630,
                display: 'flex', flexDirection: 'column',
                position: 'relative', overflow: 'hidden',
                backgroundColor: ZINC950,
            }}>
                {/* Amber radial glow – top right */}
                <div style={{
                    position: 'absolute', top: -100, right: -100,
                    width: 500, height: 500, borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(245,158,11,0.20) 0%, transparent 65%)',
                    display: 'flex',
                }} />

                {/* Subtle amber glow – bottom left */}
                <div style={{
                    position: 'absolute', bottom: -80, left: -80,
                    width: 320, height: 320, borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)',
                    display: 'flex',
                }} />

                {/* Brand — top left */}
                <div style={{
                    position: 'absolute', top: 52, left: 72,
                    fontFamily: serif, fontWeight: 700, fontSize: 26,
                    color: AMBER, letterSpacing: '0.06em', display: 'flex',
                }}>
                    O Ancestral
                </div>

                {/* CURSO badge — top right */}
                <div style={{
                    position: 'absolute', top: 48, right: 72,
                    display: 'flex', alignItems: 'center',
                    padding: '7px 20px', borderRadius: 24,
                    backgroundColor: 'rgba(245,158,11,0.12)',
                    border: '1px solid rgba(245,158,11,0.3)',
                }}>
                    <span style={{
                        fontSize: 15, fontWeight: 700,
                        letterSpacing: '0.18em', color: AMBER, fontFamily: 'sans-serif',
                    }}>
                        CURSO ONLINE
                    </span>
                </div>

                {/* Main content – vertically centred in lower half */}
                <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    padding: '0 72px 60px',
                    display: 'flex', flexDirection: 'column', gap: 14,
                }}>
                    {/* Amber rule */}
                    <div style={{ width: 56, height: 3, backgroundColor: AMBER }} />

                    {/* Title */}
                    <div style={{
                        fontFamily: serif, fontWeight: 700,
                        fontSize, color: WHITE,
                        lineHeight: 1.07, maxWidth: 900, letterSpacing: '0.01em',
                    }}>
                        {heading}
                    </div>

                    {/* URL */}
                    <div style={{
                        fontSize: 22, color: 'rgba(161,161,170,0.6)',
                        letterSpacing: '0.1em', fontFamily: 'sans-serif',
                    }}>
                        oancestral.com.br/cursos
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
