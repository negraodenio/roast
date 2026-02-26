import React from 'react'
import { NextRequest, NextResponse } from 'next/server'
import { renderToBuffer } from '@react-pdf/renderer'
import { RoastPdf, RoastPdfProps } from '@/components/pdf/RoastPdf'
import { sendRoastReport, RoastReportData } from '@/lib/email'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { email, roastData, isPremium = false } = body

        console.log(`📧 Sending report to ${email}`)
        console.log(`📦 RoastData keys: ${Object.keys(roastData).join(', ')}`)
        console.log(`📊 SubScores present: ${!!roastData.subScores}`)
        console.log(`📝 Audits present: ${!!roastData.audits}`)
        if (roastData.subScores) console.log('SubScores:', JSON.stringify(roastData.subScores))

        // Validação básica
        if (!email || !roastData) {
            return NextResponse.json(
                { error: 'Email and roastData are required' },
                { status: 400 }
            )
        }

        // Validar estrutura de roastData
        const { url, score, roastText, timestamp, subScores, audits, roastId } = roastData as RoastReportData & {
            subScores?: {
                ux?: number
                seo?: number
                copy?: number
                conversion?: number
                security?: number
            }
            audits?: Record<string, { score: number; issues?: { severity: 'critical' | 'warning'; title: string; description: string; fix: string }[] }>
            roastId?: string
        }
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

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const pdfStream = (await renderToBuffer(
            React.createElement(RoastPdf, {
                url,
                score,
                roastText,
                timestamp: timestamp || new Date().toISOString(),
                isPremium,
                subScores,
                audits: audits as RoastPdfProps['audits'],
            } as RoastPdfProps) as unknown as React.ReactElement // react-pdf types are notoriously difficult with higher-level elements
        )) as Buffer

        // Enviar email com PDF anexado
        const result = await sendRoastReport(
            email,
            {
                url,
                score,
                roastText,
                timestamp: timestamp || new Date().toISOString(),
                roastId
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
