import { NextRequest, NextResponse } from 'next/server'
import { renderToBuffer } from '@react-pdf/renderer'
import { RoastPdf } from '@/components/pdf/RoastPdf'
import { sendRoastReport, RoastReportData } from '@/lib/email'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { email, roastData, isPremium = false } = body

        // Validação básica
        if (!email || !roastData) {
            return NextResponse.json(
                { error: 'Email and roastData are required' },
                { status: 400 }
            )
        }

        // Validar estrutura de roastData
        const { url, score, roastText, timestamp } = roastData as RoastReportData
        if (!url || score === undefined || !roastText) {
            return NextResponse.json(
                { error: 'Invalid roastData structure' },
                { status: 400 }
            )
        }

        // Validar email básico
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: 'Invalid email format' },
                { status: 400 }
            )
        }

        // Gerar o PDF
        const pdfStream = await renderToBuffer(
            RoastPdf({
                url,
                score,
                roastText,
                timestamp: timestamp || new Date().toISOString(),
                isPremium,
            })
        )

        // Enviar email com PDF anexado
        const result = await sendRoastReport(
            email,
            {
                url,
                score,
                roastText,
                timestamp: timestamp || new Date().toISOString(),
            },
            pdfStream
        )

        return NextResponse.json({
            success: true,
            message: 'Report sent successfully',
            emailId: result.emailId,
        })
    } catch (error) {
        console.error('Send report error:', error)
        return NextResponse.json(
            {
                error: 'Failed to send report',
                details: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        )
    }
}
