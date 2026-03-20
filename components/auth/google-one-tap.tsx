'use client';

import { useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';

declare global {
    interface Window {
        google?: {
            accounts: {
                id: {
                    initialize: (config: object) => void;
                    prompt:     (callback?: (notification: { isNotDisplayed: () => boolean; isSkippedMoment: () => boolean }) => void) => void;
                    cancel:     () => void;
                };
            };
        };
    }
}

export function GoogleOneTap() {
    const { status } = useSession();
    const router     = useRouter();
    const pathname   = usePathname();

    useEffect(() => {
        if (status !== 'unauthenticated') return;

        const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
        if (!clientId) return;

        let script: HTMLScriptElement | null = null;

        const init = () => {
            window.google?.accounts.id.initialize({
                client_id:             clientId,
                cancel_on_tap_outside: false,
                itp_support:           true,
                callback: async ({ credential }: { credential: string }) => {
                    const result = await signIn('google-one-tap', {
                        credential,
                        redirect:    false,
                        callbackUrl: pathname,
                    });
                    if (result?.ok) {
                        router.refresh();
                    }
                },
            });
            window.google?.accounts.id.prompt();
        };

        if (window.google?.accounts) {
            init();
        } else {
            script = document.createElement('script');
            script.src   = 'https://accounts.google.com/gsi/client';
            script.async = true;
            script.defer = true;
            script.onload = init;
            document.head.appendChild(script);
        }

        return () => {
            window.google?.accounts.id.cancel();
            if (script && document.head.contains(script)) {
                document.head.removeChild(script);
            }
        };
    }, [status, pathname, router]);

    return null;
}
