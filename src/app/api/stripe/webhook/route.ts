import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
import { sendPaymentConfirmation } from '@/lib/email'

// Lazy Stripe initialization to prevent build-time errors
function getStripe() {
    return new Stripe(process.env.STRIPE_SECRET_KEY || '', {
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

        if (plan === 'single' && roastId) {
            // Unlock single roast
            // Audit Skill Tip: Idempotency check
            const { data: existing } = await supabase
                .from('roasts')
                .select('paid')
                .eq('id', roastId)
                .single()

            if (existing && !existing.paid) {
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
                        roastUrl: session.metadata.roastUrl // Assuming we add this or use website_url
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
            // Revoke agency access
            await supabase
                .from('profiles')
                .update({ plan: 'free', credits: 3 }) // Reset to default free credits or whatever your policy is
                .eq('id', userId)
        }
    }

    return NextResponse.json({ received: true })
}
