import { ImageResponse } from 'next/og'
import { createClient } from '@supabase/supabase-js' // use direct client for speed/edge if needed, or fetch

export const runtime = 'edge'

export async function GET(req: Request, { params }: { params: { id: string } }) {
    // We need to fetch the roast data. 
    // Since we are in edge, we can't use node postgres or normal supabase-js with generic fetch if envs are not set for edge?
    // Actually supabase-js works in edge.

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { data: roast } = await supabase
        .from('roasts')
        .select('score, url, roast_text')
        .eq('id', params.id)
        .single()

    if (!roast) {
        return new ImageResponse(
            (
                <div
                    style={{
                        fontSize: 40,
                        color: 'white',
                        background: 'black',
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        textAlign: 'center',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    Roast not found
                </div>
            ),
            {
                width: 1200,
                height: 630,
            }
        )
    }

    const score = roast.score
    let color = '#FF4444' // red
    let emoji = '🗑️'

    if (score > 30) { color = '#FF8800'; emoji = '🚑' }
    if (score > 50) { color = '#FFCC00'; emoji = '😐' }
    if (score > 70) { color = '#00CC88'; emoji = '👀' }
    if (score > 85) { color = '#FFD700'; emoji = '🤌' }

    // Parse roast text if it is JSON string, otherwise use it as is
    let headline = "Your Website Sucks."
    try {
        if (typeof roast.roast_text === 'string') {
            const parsed = JSON.parse(roast.roast_text)
            headline = parsed.headline || headline
        } else if (typeof roast.roast_text === 'object') {
            headline = (roast.roast_text as { headline?: string }).headline || headline
        }
    } catch { }

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
                    backgroundColor: '#09090b', // zinc-950
                    backgroundImage: 'radial-gradient(circle at 25px 25px, #27272a 2%, transparent 0%), radial-gradient(circle at 75px 75px, #27272a 2%, transparent 0%)',
                    backgroundSize: '100px 100px',
                    color: 'white',
                    fontFamily: '"Inter", sans-serif',
                }}
            >
                <div style={{ display: 'flex', fontSize: 60, fontWeight: 'bold', marginBottom: 20 }}>
                    {roast.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                </div>

                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{
                        display: 'flex',
                        fontSize: 180,
                        fontWeight: '900',
                        color: color,
                        textShadow: '0 0 40px ' + color + '40'
                    }}>
                        {score}
                    </div>
                    <div style={{ fontSize: 100, marginLeft: 30 }}>{emoji}</div>
                </div>

                <div style={{
                    fontSize: 40,
                    marginTop: 40,
                    padding: '0 60px',
                    textAlign: 'center',
                    color: '#a1a1aa',
                    fontWeight: 500
                }}>
                    &quot;{headline}&quot;
                </div>

                <div style={{ position: 'absolute', bottom: 40, right: 40, fontSize: 30, color: '#52525b' }}>
                    roastthis.site
                </div>
            </div>
        ),
        {
            width: 1200,
            height: 630,
        }
    )
}
