import { ImageResponse } from '@vercel/og'
import { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'edge'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url)
        const id = searchParams.get('id')

        if (!id) {
            return new Response('Missing ID', { status: 400 })
        }

        const supabase = createClient(supabaseUrl, supabaseServiceRole)
        const { data: roast } = await supabase
            .from('roasts')
            .select('website_url, score, headline')
            .eq('id', id)
            .single()

        if (!roast) {
            return new Response('Roast not found', { status: 404 })
        }

        return new ImageResponse(
            (
                <div
                    style={{
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#000',
                        backgroundImage: 'radial-gradient(circle at 25% 25%, #1a1a1a 0%, #000 100%)',
                        padding: '40px',
                        color: 'white',
                        fontFamily: 'sans-serif',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px' }}>
                        <div style={{
                            fontSize: '48px',
                            fontWeight: '900',
                            background: 'white',
                            color: 'black',
                            padding: '10px 20px',
                            borderRadius: '12px'
                        }}>
                            ROASTY
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                        <div style={{ fontSize: '32px', color: '#888', marginBottom: '10px' }}>
                            {roast.website_url}
                        </div>
                        <div style={{ fontSize: '64px', fontWeight: '900', marginBottom: '20px', maxWidth: '800px' }}>
                            {roast.headline}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                            <div style={{
                                display: 'flex',
                                fontSize: '100px',
                                fontWeight: '900',
                                color: roast.score > 70 ? '#4ade80' : roast.score > 40 ? '#facc15' : '#ef4444'
                            }}>
                                {roast.score}
                            </div>
                            <div style={{ fontSize: '32px', color: '#888' }}>
                                / 100
                            </div>
                        </div>
                    </div>

                    <div style={{ position: 'absolute', bottom: '40px', fontSize: '24px', color: '#444' }}>
                        roasty.ai
                    </div>
                </div>
            ),
            {
                width: 1200,
                height: 630,
            }
        )
    } catch (e: unknown) {
        console.error(`${(e as Error).message}`)
        return new Response(`Failed to generate the image`, {
            status: 500,
        })
    }
}
