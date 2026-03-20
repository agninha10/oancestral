export function slugifyUsername(name: string): string {
    return name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9_]/g, '_')
        .replace(/_+/g, '_')
        .replace(/^_|_$/g, '')
        .slice(0, 28);
}

/** Returns the URL-safe segment for a user's profile. Falls back to id. */
export function profileSegment(username: string | null, id: string): string {
    return username ?? id;
}
