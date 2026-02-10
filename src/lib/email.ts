import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export interface RoastReportData {
    url: string
    score: number
    roastText: string
    timestamp: string
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
            subject: `🔥 Seu Site Roast Report - Score: ${roastData.score}/100`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1 style="color: #ff4500;">🔥 Seu Roast está pronto!</h1>
                    <p>Analisamos <strong>${roastData.url}</strong> e o resultado foi...</p>
                    <h2 style="font-size: 48px; color: ${roastData.score >= 70 ? '#22c55e' : roastData.score >= 40 ? '#f59e0b' : '#ef4444'};">
                        ${roastData.score}/100
                    </h2>
                    <p style="color: #666;">
                        Veja o relatório completo em anexo para descobrir como melhorar seu site.
                    </p>
                    <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
                    <p style="font-size: 12px; color: #999;">
                        Esse relatório foi gerado em ${new Date(roastData.timestamp).toLocaleString('pt-BR')}
                        <br>
                        <a href="https://roastthis.site" style="color: #ff4500;">roastthis.site</a>
                    </p>
                </div>
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
