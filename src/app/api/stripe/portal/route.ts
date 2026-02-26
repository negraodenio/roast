import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

function getStripe() {
    return new Stripe(process.env.STRIPE_SECRET_KEY || '', {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        apiVersion: '2024-06-20' as any,
    })
}

export async function POST(req: NextRequest) {
    try {
        const stripe = getStripe()
        const supabase = createClient()

        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Get the customer ID from Supabase
        const { data: profile } = await supabase
            .from('profiles')
            .select('stripe_customer_id')
            .eq('id', user.id)
            .single()

        if (!profile?.stripe_customer_id) {
            // If no customer ID, they haven't purchased anything yet.
            // Redirect them to the billing page or a success page with a message.
            return NextResponse.json({ error: 'No active subscription found. Please upgrade first.' }, { status: 400 })
        }

        const session = await stripe.billingPortal.sessions.create({
            customer: profile.stripe_customer_id,
            return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing`,
        })

        return NextResponse.json({ url: session.url })
    } catch (error: any) {
        console.error('Portal error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
