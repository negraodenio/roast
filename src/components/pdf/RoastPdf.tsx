import React from 'react'
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Font,
} from '@react-pdf/renderer'

// Registrar fonte (opcional, mas recomendado para estética)
// Font.register({
//     family: 'Inter',
//     src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2',
// })

const styles = StyleSheet.create({
    page: {
        backgroundColor: '#0a0a0a',
        color: '#ffffff',
        padding: 40,
        fontFamily: 'Helvetica',
    },
    header: {
        marginBottom: 30,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#ff4500',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 14,
        color: '#888888',
        marginBottom: 5,
    },
    scoreSection: {
        backgroundColor: '#1a1a1a',
        borderRadius: 8,
        padding: 20,
        marginBottom: 30,
        alignItems: 'center',
    },
    scoreLabel: {
        fontSize: 12,
        color: '#888888',
        marginBottom: 10,
    },
    scoreValue: {
        fontSize: 64,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    roastSection: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#ff4500',
        marginBottom: 15,
        borderBottomWidth: 2,
        borderBottomColor: '#ff4500',
        paddingBottom: 5,
    },
    roastText: {
        fontSize: 11,
        lineHeight: 1.6,
        color: '#cccccc',
    },
    blurredSection: {
        backgroundColor: '#1a1a1a',
        borderRadius: 8,
        padding: 20,
        marginTop: 30,
        alignItems: 'center',
    },
    blurredText: {
        fontSize: 12,
        color: '#666666',
        textAlign: 'center',
        marginBottom: 10,
    },
    lockIcon: {
        fontSize: 48,
        color: '#333333',
        marginBottom: 10,
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 40,
        right: 40,
        borderTopWidth: 1,
        borderTopColor: '#333333',
        paddingTop: 15,
    },
    footerText: {
        fontSize: 10,
        color: '#666666',
        textAlign: 'center',
    },
})

interface RoastPdfProps {
    url: string
    score: number
    roastText: string
    timestamp: string
    isPremium?: boolean
}

export const RoastPdf: React.FC<RoastPdfProps> = ({
    url,
    score,
    roastText,
    timestamp,
    isPremium = false,
}) => {
    const getScoreColor = (score: number) => {
        if (score >= 70) return '#22c55e'
        if (score >= 40) return '#f59e0b'
        return '#ef4444'
    }

    // Mostrar apenas 25% do roast text se não for premium
    const displayText = isPremium
        ? roastText
        : roastText.substring(0, Math.floor(roastText.length * 0.25)) + '...'

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <Text style={styles.title}>🔥 Roast Report</Text>
                    <Text style={styles.subtitle}>Análise de: {url}</Text>
                    <Text style={styles.subtitle}>
                        Gerado em: {new Date(timestamp).toLocaleString('pt-BR')}
                    </Text>
                </View>

                <View style={styles.scoreSection}>
                    <Text style={styles.scoreLabel}>SCORE GERAL</Text>
                    <Text
                        style={[
                            styles.scoreValue,
                            { color: getScoreColor(score) },
                        ]}
                    >
                        {score}/100
                    </Text>
                </View>

                <View style={styles.roastSection}>
                    <Text style={styles.sectionTitle}>Análise Completa</Text>
                    <Text style={styles.roastText}>{displayText}</Text>
                </View>

                {!isPremium && (
                    <View style={styles.blurredSection}>
                        <Text style={styles.lockIcon}>🔒</Text>
                        <Text style={styles.blurredText}>
                            Restante da análise (75%) disponível no plano premium
                        </Text>
                        <Text style={styles.blurredText}>
                            Visite roastthis.site para ver o relatório completo
                        </Text>
                    </View>
                )}

                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        Gerado por Roasty | roastthis.site
                    </Text>
                </View>
            </Page>
        </Document>
    )
}
