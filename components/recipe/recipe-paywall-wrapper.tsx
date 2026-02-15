'use client';

import { PaywallBlur } from '@/components/paywall/paywall-blur';
import { ReactNode } from 'react';

interface RecipePaywallWrapperProps {
    children: ReactNode;
    isPremium: boolean;
    userSubscriptionStatus?: 'FREE' | 'ACTIVE';
}

export function RecipePaywallWrapper({
    children,
    isPremium,
    userSubscriptionStatus = 'FREE',
}: RecipePaywallWrapperProps) {
    const shouldBlur = isPremium && userSubscriptionStatus !== 'ACTIVE';

    return (
        <PaywallBlur isBlurred={shouldBlur} className="min-h-[400px]">
            {children}
        </PaywallBlur>
    );
}
