'use client'

import { useEffect } from 'react'
import { useSearchParams, usePathname } from 'next/navigation'
import { Suspense } from 'react'

function UtmTrackerInner() {
    const params   = useSearchParams()
    const pathname = usePathname()

    useEffect(() => {
        const source   = params.get('utm_source')
        const medium   = params.get('utm_medium')
        const campaign = params.get('utm_campaign')
        const content  = params.get('utm_content')
        const term     = params.get('utm_term')

        if (!source && !medium && !campaign) return

        // Deduplicate within the same browser session per campaign
        const key = `utm_tracked_${source}_${medium}_${campaign}`
        if (sessionStorage.getItem(key)) return
        sessionStorage.setItem(key, '1')

        fetch('/api/utm', {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ source, medium, campaign, content, term, landing: pathname }),
        }).catch(() => {/* silently ignore */})
    }, [params, pathname])

    return null
}

export default function UtmTracker() {
    return (
        <Suspense fallback={null}>
            <UtmTrackerInner />
        </Suspense>
    )
}
