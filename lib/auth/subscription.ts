import { prisma } from '@/lib/prisma';
import { User, SubscriptionStatus } from '@prisma/client';

/**
 * Get user's subscription status by user ID
 */
export async function getUserSubscriptionStatus(
    userId: string
): Promise<SubscriptionStatus> {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { subscriptionStatus: true },
    });

    return user?.subscriptionStatus || 'FREE';
}

/**
 * Check if user can access premium content
 */
export function canAccessPremiumContent(
    user: Pick<User, 'subscriptionStatus'> | null | undefined
): boolean {
    if (!user) return false;
    return user.subscriptionStatus === 'ACTIVE';
}

/**
 * Check if content is marked as premium
 */
export function isContentPremium(content: { isPremium?: boolean }): boolean {
    return content.isPremium === true;
}

/**
 * Check if content should be blurred for the current user
 */
export function shouldBlurContent(
    content: { isPremium?: boolean },
    user: Pick<User, 'subscriptionStatus'> | null | undefined
): boolean {
    return isContentPremium(content) && !canAccessPremiumContent(user);
}
