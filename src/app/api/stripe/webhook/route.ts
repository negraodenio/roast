import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

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
            await supabase
                .from('roasts')
                .update({ paid: true })
                .eq('id', roastId)
        } else if (plan === 'agency' && userId) {
            // Upgrade user to agency
            await supabase
                .from('profiles')
                .update({ plan: 'agency', credits: -1 }) // -1 implies unlimited
                .eq('id', userId)
        }
    }

    return NextResponse.json({ received: true })
}
