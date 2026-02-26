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

export async function sendPaymentConfirmation(
    recipientEmail: string,
    data: {
        customerName?: string
        planName: string
        amount: string
        roastUrl?: string
    }
) {
    try {
        const { data: emailData, error } = await resend.emails.send({
            from: 'Roasty <noreply@roastthis.site>',
            to: recipientEmail,
            subject: `✅ Payment Confirmed: Welcome to ${data.planName}!`,
            html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { margin: 0; padding: 0; background-color: #000000; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
        .wrapper { padding: 40px 20px; }
        .card { max-width: 600px; margin: 0 auto; background-color: #0a0a0a; border: 1px solid #1f1f1f; border-radius: 32px; padding: 48px; text-align: center; overflow: hidden; }
        .logo { margin-bottom: 32px; font-size: 24px; font-weight: 900; letter-spacing: -1px; color: #ffffff; }
        .flame { color: #fe0000; }
        .badge { display: inline-block; padding: 6px 12px; border-radius: 100px; background-color: rgba(34, 197, 94, 0.1); border: 1px solid rgba(34, 197, 94, 0.2); color: #22c55e; font-size: 10px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 24px; }
        h1 { color: #ffffff; font-size: 32px; font-weight: 900; margin-bottom: 16px; letter-spacing: -0.05em; }
        p { color: #a1a1aa; font-size: 16px; line-height: 24px; margin-bottom: 32px; }
        .button { display: inline-block; background-color: #ffffff; color: #000000 !important; font-weight: 900; font-size: 14px; padding: 20px 48px; border-radius: 16px; text-decoration: none; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 40px; }
        .summary { background: #111; border-radius: 20px; padding: 24px; text-align: left; border: 1px solid #1f1f1f; }
        .summary-title { font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; color: #52525b; margin-bottom: 16px; }
        .line { display: flex; justify-content: space-between; margin-bottom: 12px; color: #d4d4d8; font-size: 14px; }
        .line:last-child { margin-bottom: 0; }
        .val { color: #ffffff; font-weight: 700; }
        .footer { margin-top: 48px; color: #52525b; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 700; }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="card">
            <div class="logo">🔥 Roast<span class="flame">This</span></div>
            <div class="badge">Transaction Successful</div>
            <h1>You're in, ${data.customerName || 'Roaster'}!</h1>
            <p>
                Your payment for the <strong>${data.planName}</strong> was successful. 
                ${data.roastUrl ? `The full audit for <strong>${data.roastUrl}</strong> is now unlocked.` : 'Your account has been upgraded to Agency status.'}
            </p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" class="button">Access Dashboard</a>
            
            <div class="summary">
                <div class="summary-title">Transaction Details</div>
                <div class="line"><span>Plan:</span> <span class="val">${data.planName}</span></div>
                <div class="line"><span>Amount:</span> <span class="val">${data.amount}</span></div>
            </div>

            <div class="footer">Built with 😡 by RoastThis &bull; 2026</div>
        </div>
    </div>
</body>
</html>
                `
        })

        if (error) throw new Error(error.message)
        return { success: true, emailId: emailData?.id }
    } catch (error) {
        console.error('Payment email error:', error)
        throw error
    }
}
