import crypto from 'crypto';

/**
 * Converts a post title to a URL-friendly slug with a short collision-resistant hash.
 * Example: "Como quebrar o jejum?" → "como-quebrar-o-jejum-a1b2c3"
 */
export function generateForumSlug(title: string): string {
    const base = title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')   // remove diacritics
        .replace(/[^a-z0-9\s-]/g, '')      // keep alphanumeric, spaces, hyphens
        .trim()
        .replace(/\s+/g, '-')              // spaces → hyphens
        .replace(/-+/g, '-')               // collapse multiple hyphens
        .slice(0, 48);                     // max base length

    const hash = crypto.randomBytes(3).toString('hex'); // 6-char hash
    return `${base}-${hash}`;
}
