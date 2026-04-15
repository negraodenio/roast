import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
import { sendPaymentConfirmation } from '@/lib/email'

// Runtime guard — fail loudly if critical env is missing
function getStripe() {
    const key = process.env.STRIPE_SECRET_KEY
    if (!key || key.trim() === '') {
        throw new Error('CRITICAL: STRIPE_SECRET_KEY is not configured. Payments are disabled.')
    }
    return new Stripe(key, {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        apiVersion: '2024-06-20' as any,
    })
}

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || ''

// Prevent this route from being statically analyzed during build
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
    const stripe = getStripe()
    const body = await req.text()
    const sig = req.headers.get('stripe-signature')!

    let event: Stripe.Event

    try {
        event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
    } catch (err: unknown) {
        console.error(`Webhook signature verification failed.`, (err as Error).message)
        return NextResponse.json({ error: 'Webhook Error' }, { status: 400 })
    }

    // Init Supabase Admin
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.userId
        const roastId = session.metadata?.roastId
        const plan = session.metadata?.plan
        const customerId = session.customer as string

        if (userId && customerId) {
            // Save stripe_customer_id to profile for Customer Portal access
            await supabase
                .from('profiles')
                .update({ stripe_customer_id: customerId })
                .eq('id', userId)
        }

        if (plan === 'single' && roastId) {
            // SECURITY: Verify roastId ownership before unlocking
            const { data: roastCheck } = await supabase
                .from('roasts')
                .select('user_id, paid')
                .eq('id', roastId)
                .single()

            if (!roastCheck) {
                console.error('SECURITY: Webhook received unknown roastId:', roastId)
                return NextResponse.json({ received: true }) // Don't expose this error to Stripe
            }

            // If roast has an owner, the paying user must match
            if (roastCheck.user_id && roastCheck.user_id !== userId) {
                console.error('SECURITY: roastId does not belong to paying user!', { roastId, userId, roastOwner: roastCheck.user_id })
                return NextResponse.json({ received: true }) // Silently reject
            }

            if (!roastCheck.paid) {
                await supabase
                    .from('roasts')
                    .update({ paid: true })
                    .eq('id', roastId)

                // Send Email Confirmation
                if (session.customer_details?.email) {
                    await sendPaymentConfirmation(session.customer_details.email, {
                        customerName: session.customer_details.name || undefined,
                        planName: 'Single Roast Report',
                        amount: '9,99€',
                        roastUrl: session.metadata?.roastUrl
                    })
                }
            }
        } else if (plan === 'agency' && userId) {
            // Upgrade user to agency
            await supabase
                .from('profiles')
                .update({ plan: 'agency', credits: -1 }) // -1 implies unlimited
                .eq('id', userId)

            // Send Email Confirmation
            if (session.customer_details?.email) {
                await sendPaymentConfirmation(session.customer_details.email, {
                    customerName: session.customer_details.name || undefined,
                    planName: 'Agency Plan',
                    amount: '49,00€/mo'
                })
            }
        }
    } else if (event.type === 'customer.subscription.deleted') {
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata?.userId
        if (userId) {
            const customerId = subscription.customer as string
            // Revoke agency access but keep the customer ID
            await supabase
                .from('profiles')
                .update({
                    plan: 'free',
                    credits: 3,
                    stripe_customer_id: customerId // Ensure it's stored if they just canceled
                })
                .eq('id', userId)
        }
    }

    return NextResponse.json({ received: true })
}
