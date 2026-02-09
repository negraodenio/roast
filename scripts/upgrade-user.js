const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials in .env.local')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function upgradeUser(email) {
    console.log(`Searching for user: ${email}...`)

    // 1. Get user ID from auth.users (requires service role)
    const { data: { users }, error: authError } = await supabase.auth.admin.listUsers()

    if (authError) {
        console.error('Error fetching users:', authError)
        return
    }

    const user = users.find(u => u.email === email)

    if (!user) {
        console.error(`User not found with email: ${email}`)
        return
    }

    console.log(`Found user ID: ${user.id}. Upgrading profile...`)

    // 2. Update profile
    const { error: profileError } = await supabase
        .from('profiles')
        .update({
            plan: 'agency',
            credits: 9999
        })
        .eq('id', user.id)

    if (profileError) {
        console.error('Error updating profile:', profileError)
    } else {
        console.log(`✅ Success! User ${email} is now on 'agency' plan with 9999 credits.`)
    }
}

const targetEmail = 'deniolisbon@gmail.com'
upgradeUser(targetEmail)
