import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

// Lazy Stripe initialization to prevent build-time errors
function getStripe() {
    return new Stripe(process.env.STRIPE_SECRET_KEY || '', {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        apiVersion: '2024-06-20' as any,
    })
}

// Prevent build-time execution
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
    const stripe = getStripe()
    try {
        const { priceId, roastId } = await req.json() // priceId determines if single or sub

        // Auth check
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const priceAgency = process.env.STRIPE_PRICE_AGENCY_MONTHLY

        // Determine mode
        let mode: Stripe.Checkout.SessionCreateParams.Mode = 'payment'
        if (priceId === priceAgency) {
            mode = 'subscription'
        } else {
            mode = 'payment'
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: mode,
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/roast/${roastId}?upgraded=true`,
            cancel_url: roastId ? `${process.env.NEXT_PUBLIC_APP_URL}/roast/${roastId}` : `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing`,
            customer_email: user.email,
            metadata: {
                userId: user.id,
                roastId: roastId || '',
                plan: mode === 'subscription' ? 'agency' : 'single'
            },
        })

        return NextResponse.json({ sessionId: session.id, url: session.url })
    } catch (err: unknown) {
        console.error(err)
        return NextResponse.json({ error: (err as Error).message }, { status: 500 })
    }
}
