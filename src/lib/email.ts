import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export interface RoastReportData {
    url: string
    score: number
    roastText: string
    timestamp: string
    roastId?: string
}

export async function sendRoastReport(
    recipientEmail: string,
    roastData: RoastReportData,
    pdfBuffer: Buffer
) {
    try {
        const { data, error } = await resend.emails.send({
            from: 'Roasty <noreply@roastthis.site>',
            to: recipientEmail,
            subject: `🔥 Your Roast Report is ready! Score: ${roastData.score}/100`,
            html: `
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #000000; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #ffffff;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #0a0a0a; border: 1px solid #222;">
        
        <!-- Header -->
        <div style="padding: 30px; text-align: center; border-bottom: 1px solid #222;">
            <h1 style="margin: 0; color: #ff4500; font-size: 24px; letter-spacing: -1px;">🔥 RoastThis</h1>
        </div>

        <!-- Score Section -->
        <div style="padding: 40px 20px; text-align: center; background: radial-gradient(circle at center, #1a1a1a 0%, #0a0a0a 100%);">
            <p style="color: #888; margin: 0 0 10px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 2px;">Overall Roast Score</p>
            <div style="font-size: 80px; font-weight: 900; line-height: 1; color: ${roastData.score >= 70 ? '#22c55e' : roastData.score >= 40 ? '#f59e0b' : '#ef4444'}; margin-bottom: 20px;">
                ${roastData.score}
            </div>
            <p style="color: #ccc; font-size: 18px; margin: 0;">for <strong>${roastData.url}</strong></p>
        </div>

        <!-- Body -->
        <div style="padding: 40px 30px;">
            <p style="font-size: 16px; line-height: 1.6; color: #ddd; margin-bottom: 30px;">
                Your preliminary PDF report is attached. But the real value lies in the details that don't fit on paper.
            </p>
            
            <div style="background-color: #111; border-left: 4px solid #ff4500; padding: 20px; margin-bottom: 30px;">
                <p style="margin: 0; color: #fff; font-style: italic;">"Most sites lose 40% of conversions due to basic UX and Copy errors that we identified."</p>
            </div>

            <p style="font-size: 16px; line-height: 1.6; color: #ddd; margin-bottom: 30px;">
                Unlock the full analysis to see:
            </p>
            
            <ul style="color: #aaa; margin-bottom: 40px; padding-left: 20px; line-height: 1.8;">
                <li>✅ <strong>UX Audit:</strong> Where users get lost</li>
                <li>✅ <strong>SEO Check:</strong> Why Google ignores you</li>
                <li>✅ <strong>Copywriting:</strong> Phrases that kill sales</li>
                <li>✅ <strong>10 Conversion Tips:</strong> Immediate action plan</li>
            </ul>

            <!-- CTA Button -->
            <div style="text-align: center; margin-bottom: 40px;">
                <a href="https://roastthis.site/roast/${roastData.roastId || ''}" 
                   style="display: inline-block; background-color: #ff4500; color: #ffffff; padding: 18px 40px; font-size: 18px; font-weight: bold; text-decoration: none; border-radius: 50px; box-shadow: 0 4px 15px rgba(255, 69, 0, 0.3);">
                   See Full Analysis &rarr;
                </a>
            </div>
            
            <p style="font-size: 13px; color: #666; text-align: center;">
                Or access your dashboard at <a href="https://roastthis.site/dashboard" style="color: #888;">roastthis.site/dashboard</a>
            </p>
        </div>

        <!-- Footer -->
        <div style="padding: 20px; text-align: center; border-top: 1px solid #222; background-color: #050505;">
            <p style="margin: 0; font-size: 12px; color: #444;">
                Generated on ${new Date(roastData.timestamp).toLocaleString('en-US')} by RoastThis AI
            </p>
        </div>
    </div>
</body>
</html>
            `,
            attachments: [
                {
                    filename: `roast-report-${roastData.score}.pdf`,
                    content: pdfBuffer,
                },
            ],
        })

        if (error) {
            console.error('Resend error:', error)
            throw new Error(`Failed to send email: ${error.message}`)
        }

        return { success: true, emailId: data?.id }
    } catch (error) {
        console.error('Email sending error:', error)
        throw error
    }
}
