'use client';

import { useEffect } from 'react';

/**
 * Componente invisível que registra uma visualização da página /links.
 * Disparado uma única vez no mount, não bloqueia a renderização.
 */
export function TrackView() {
    useEffect(() => {
        fetch('/api/links/view', { method: 'POST' }).catch(() => {/* silencioso */});
    }, []);

    return null;
}
