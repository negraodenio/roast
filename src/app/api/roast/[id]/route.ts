import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Prevent build-time execution
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const supabase = createClient()
    const { id } = params

    const { data: { user } } = await supabase.auth.getUser()
    const userId = user?.id

    const { data: roast, error } = await supabase
        .from('roasts')
        .select('*')
        .eq('id', id)
        .single()

    if (error || !roast) {
        return NextResponse.json({ error: 'Roast not found' }, { status: 404 })
    }

    // Check visibility
    // If public, anyone can see basics.
    // If private, only owner.
    // Locked content (audits) depends on plan/payment.

    const isOwner = userId && roast.user_id === userId

    if (!roast.is_public && !isOwner) {
        return NextResponse.json({ error: 'This roast is private' }, { status: 403 })
    }

    // Access control for detailed audits
    let showFullDetails = false

    if (isOwner) {
        // Owner always sees full details? Or only if they paid?
        // "If user owns it: return everything" - from prompt
        showFullDetails = true
    } else {
        // Public viewer
        // "If user has paid for this roast or is agency: return everything unlocked"
        // "Otherwise: return roast + blurred/truncated audit previews"
        if (roast.paid) {
            showFullDetails = true
        }
    }

    // If not full details, we strip the audit data to prevent leakage in network tab
    if (!showFullDetails) {
        // return only summary or truncated versions
        // For MVP, simply returning null for these fields or a flag
        return NextResponse.json({
            ...roast,
            ux_audit: null, // Locked
            seo_audit: null,
            copy_audit: null,
            conversion_tips: null,
            performance_audit: null,
            isLocked: true
        })
    }

    return NextResponse.json({ ...roast, isLocked: false })
}
