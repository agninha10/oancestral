import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { addDays } from 'date-fns';

export async function POST(req: Request) {
    try {
        const secret = process.env.ABACATE_WEBHOOK_SECRET;

        // Security: Check header against secret
        // Supports both 'Authorization: Bearer <secret>' and 'abacate-secret: <secret>'
        const authHeader = req.headers.get('authorization');
        const secretHeader = req.headers.get('abacate-secret');

        const isAuthValid = (authHeader === `Bearer ${secret}`) || (secretHeader === secret);

        if (!secret || !isAuthValid) {
            console.warn('Webhook unauthorized attempt');
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const event = await req.json();

        // Payload handling: Locate user
        // Abacate usually sends customer data inside `data.customer`
        const data = event.data || {};
        const customer = data.customer || {};

        // Try finding by ID first, then Email
        const abacateId = customer.id;
        const customerEmail = customer.email;

        let user = null;

        if (abacateId) {
            user = await prisma.user.findUnique({ where: { abacateCustomerId: abacateId } });
        }

        if (!user && customerEmail) {
            user = await prisma.user.findUnique({ where: { email: customerEmail } });
        }

        if (!user) {
            console.warn(`User not found for Webhook. ID: ${abacateId}, Email: ${customerEmail}`);
            // Return 200 to prevent retries for unknown users
            return NextResponse.json({ received: true });
        }

        // Process Events
        // Switch keys based on AbacatePay docs (billing.paid, etc)
        // Note: 'event.type' assumption based on prompt "switch(event.type)"
        // Some providers use 'event' or 'type'. Checking prompt "monitorar: billing.paid...".
        // Assuming the event field is `event.type` or `event.event`. 
        // Prompt says "O Abacate manda um JSON... switch(event.type)". I will use `event.type` or `event.event` fallback.

        const eventType = event.type || event.event;

        console.log(`Processing Abacate Event: ${eventType} for User: ${user.email}`);

        switch (eventType) {
            case 'billing.paid':
                await prisma.user.update({
                    where: { id: user.id },
                    data: {
                        subscriptionStatus: 'ACTIVE',
                        subscriptionEndDate: addDays(new Date(), 30),
                        // Ensure ID is linked if we found by email
                        abacateCustomerId: abacateId || user.abacateCustomerId
                    }
                });
                break;

            case 'billing.failed':
                // Payment failed - downgrade to FREE immediately per strict MVP instructions
                await prisma.user.update({
                    where: { id: user.id },
                    data: { subscriptionStatus: 'FREE' }
                });
                break;

            case 'billing.disputed':
                // CRITICAL: Block access immediately and log
                console.warn(`DISPUTE DETECTED for user ${user.id} (${user.email})`);
                await prisma.user.update({
                    where: { id: user.id },
                    data: { subscriptionStatus: 'FREE' }
                });
                break;

            case 'billing.done': // Subscription cancelled/finished
                await prisma.user.update({
                    where: { id: user.id },
                    data: { subscriptionStatus: 'FREE' }
                });
                break;

            default:
                console.log(`Unhandled event type: ${eventType}`);
        }

        return NextResponse.json({ received: true });

    } catch (error) {
        console.error('Webhook processing error:', error);
        // Retrying for server errors might be desired, but prompt asks for "Responda status: 200 rapidamente" implication.
        // However error 500 triggers retries usually. 
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
