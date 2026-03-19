/**
 * lib/og/shared.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Shared utilities for all /api/og/* route handlers.
 *
 * • SITE_URL     – canonical production base URL (never localhost)
 * • localImage   – reads a file from /public and returns a data URI (no HTTP round-trip)
 * • loadFont     – fetches a Google Font as ArrayBuffer for Satori
 */

import fs from 'fs';
import path from 'path';

// ─── Canonical base URL ───────────────────────────────────────────────────────

export const SITE_URL = (() => {
    const env = process.env.NEXT_PUBLIC_BASE_URL ?? '';
    return env.startsWith('https://') ? env.replace(/\/$/, '') : 'https://oancestral.com.br';
})();

// ─── Local /public image → base64 data URI ───────────────────────────────────

/**
 * Reads a file from the /public directory synchronously and returns it
 * as a base64 data URI.  The `relPath` is relative to /public, e.g.
 * `'images/image_1.png'` or `'/images/image_1.png'`.
 *
 * Returns `null` when the file does not exist – callers should fall back
 * to an absolute URL or a fully-designed fallback template.
 */
export function localImage(relPath: string): string | null {
    try {
        const filepath = path.join(process.cwd(), 'public', relPath.replace(/^\//, ''));
        const buf = fs.readFileSync(filepath);
        const ext = path.extname(relPath).slice(1).toLowerCase();
        const mime =
            ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' :
            ext === 'webp' ? 'image/webp' :
            `image/${ext}`;
        return `data:${mime};base64,${buf.toString('base64')}`;
    } catch {
        return null;
    }
}

// ─── Google Font → ArrayBuffer ────────────────────────────────────────────────

/**
 * Downloads a Google Font as an ArrayBuffer suitable for Satori/ImageResponse.
 *
 * Uses an IE11 User-Agent so that Google Fonts returns WOFF instead of WOFF2
 * (Satori's bundled renderer works best with WOFF/TTF).
 *
 * The response is cached for 24 h by Next.js's built-in fetch cache.
 * Returns `null` on any error so callers can degrade gracefully to system fonts.
 */
export async function loadFont(
    family: string,
    weight: 400 | 700 = 700,
): Promise<ArrayBuffer | null> {
    try {
        const cssUrl =
            `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@${weight}`;

        const css = await fetch(cssUrl, {
            headers: {
                // IE11 UA → Google Fonts responds with WOFF (not WOFF2)
                'User-Agent':
                    'Mozilla/5.0 (compatible; MSIE 11.0; Windows NT 6.1; Trident/7.0)',
            },
            next: { revalidate: 86400 },
        }).then((r) => r.text());

        const url = css.match(/src:\s*url\(([^)]+)\)/)?.[1];
        if (!url) return null;

        return fetch(url, {
            next: { revalidate: 86400 },
        }).then((r) => r.arrayBuffer());
    } catch {
        return null;
    }
}

// ─── Font options builder ─────────────────────────────────────────────────────

export type SatoriFont = {
    name: string;
    data: ArrayBuffer;
    weight: 400 | 700;
    style: 'normal' | 'italic';
};

export async function buildFonts(): Promise<SatoriFont[]> {
    const data = await loadFont('Crimson Pro', 700);
    return data
        ? [{ name: 'Crimson Pro', data, weight: 700, style: 'normal' }]
        : [];
}

// ─── Absolute URL helper ──────────────────────────────────────────────────────

/**
 * Ensures an image URL is absolute.
 * Cloudinary / S3 URLs are passed through unchanged.
 * Relative paths (e.g. `/images/foo.jpg`) are prefixed with SITE_URL.
 */
export function absoluteUrl(src: string | null | undefined): string | null {
    if (!src) return null;
    if (src.startsWith('http://') || src.startsWith('https://')) return src;
    return `${SITE_URL}${src.startsWith('/') ? '' : '/'}${src}`;
}
