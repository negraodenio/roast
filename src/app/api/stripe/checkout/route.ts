import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

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

        const priceAgency = process.env.STRIPE_PRICE_AGENCY_MONTHLY
        const priceSingle = process.env.STRIPE_PRICE_SINGLE_REPORT

        // Map constants from frontend to actual IDs
        let finalPriceId = priceId
        if (priceId === 'price_single') finalPriceId = priceSingle
        if (priceId === 'price_agency') finalPriceId = priceAgency

        if (!finalPriceId) {
            return NextResponse.json({ error: 'Stripe is not fully configured.' }, { status: 500 })
        }

        // Determine mode
        let mode: Stripe.Checkout.SessionCreateParams.Mode = 'payment'
        if (finalPriceId === priceAgency) {
            if (!user) {
                return NextResponse.json({ error: 'Unauthorized. Please login to subscribe.' }, { status: 401 })
            }
            mode = 'subscription'
        } else {
            mode = 'payment'
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: finalPriceId,
                    quantity: 1,
                },
            ],
            mode: mode,
            success_url: roastId ? `${process.env.NEXT_PUBLIC_APP_URL}/roast/${roastId}?upgraded=true` : `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?upgraded=true`,
            cancel_url: roastId ? `${process.env.NEXT_PUBLIC_APP_URL}/roast/${roastId}` : `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing`,
            customer_email: user?.email || undefined,
            metadata: {
                userId: user?.id || null,
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
