import React from 'react'
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Font,
} from '@react-pdf/renderer'

const styles = StyleSheet.create({
    page: {
        backgroundColor: '#0a0a0a',
        color: '#ffffff',
        padding: 40,
        fontFamily: 'Helvetica',
    },
    header: {
        marginBottom: 25,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#ff4500',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 11,
        color: '#888888',
        marginBottom: 4,
    },
    scoreSection: {
        backgroundColor: '#1a1a1a',
        borderRadius: 8,
        padding: 20,
        marginBottom: 20,
        alignItems: 'center',
    },
    scoreLabel: {
        fontSize: 11,
        color: '#888888',
        marginBottom: 8,
    },
    scoreValue: {
        fontSize: 52,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    subScoresGrid: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 15,
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: '#333',
        width: '100%',
    },
    subScoreItem: {
        alignItems: 'center',
    },
    subScoreLabel: {
        fontSize: 8,
        color: '#888',
        marginBottom: 3,
    },
    subScoreValue: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    categorySection: {
        marginBottom: 20,
    },
    categoryHeader: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#ff4500',
        marginBottom: 10,
        borderBottomWidth: 1.5,
        borderBottomColor: '#ff4500',
        paddingBottom: 4,
    },
    issueCard: {
        backgroundColor: '#1a1a1a',
        borderRadius: 6,
        padding: 12,
        marginBottom: 8,
        borderLeftWidth: 3,
    },
    issueTitle: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 4,
    },
    issueDescription: {
        fontSize: 9,
        color: '#cccccc',
        lineHeight: 1.4,
        marginBottom: 6,
    },
    issueFix: {
        fontSize: 9,
        color: '#22c55e',
        lineHeight: 1.4,
    },
    premiumBlock: {
        backgroundColor: '#1a1a1a',
        borderRadius: 8,
        padding: 25,
        marginTop: 20,
        marginBottom: 20,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#ff4500',
    },
    lockIcon: {
        fontSize: 36,
        marginBottom: 12,
    },
    premiumTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#ff4500',
        marginBottom: 8,
        textAlign: 'center',
    },
    premiumText: {
        fontSize: 11,
        color: '#aaaaaa',
        textAlign: 'center',
        marginBottom: 5,
        lineHeight: 1.5,
    },
    premiumCTA: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#ffffff',
        marginTop: 10,
        textAlign: 'center',
    },
    footer: {
        position: 'absolute',
        bottom: 25,
        left: 40,
        right: 40,
        borderTopWidth: 1,
        borderTopColor: '#333333',
        paddingTop: 12,
    },
    footerText: {
        fontSize: 9,
        color: '#666666',
        textAlign: 'center',
    },
    teaserBadge: {
        backgroundColor: '#ff4500',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 4,
        marginTop: 5,
        alignSelf: 'flex-start',
    },
    teaserText: {
        fontSize: 9,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    roastSection: {
        marginBottom: 25,
        backgroundColor: '#151515',
        padding: 20,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#333',
    },
    roastHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#ff4500', // Primary color
        marginBottom: 10,
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#ffffff',
        marginTop: 10,
        marginBottom: 5,
    },
    textParagraph: {
        fontSize: 10,
        color: '#cccccc',
        lineHeight: 1.5,
        marginBottom: 6,
    },
    listItem: {
        fontSize: 10,
        color: '#cccccc',
        lineHeight: 1.5,
        marginBottom: 4,
        paddingLeft: 10,
    },
})

interface AuditIssue {
    severity: 'critical' | 'warning'
    title: string
    description: string
    fix: string
}

interface AuditData {
    score: number
    issues?: AuditIssue[]
}

interface RoastPdfProps {
    url: string
    score: number
    roastText: string
    timestamp: string
    isPremium?: boolean
    subScores?: {
        ux?: number
        seo?: number
        copy?: number
        conversion?: number
        security?: number
    }
    audits?: {
        ux?: AuditData
        seo?: AuditData
        copy?: AuditData
        conversion?: AuditData
        security?: AuditData
    }
}

const renderFormattedText = (text: string) => {
    if (!text) return null

    // Remove "The Savage Truth" header if it exists in the text since we add our own or it's redundant
    const cleanText = text.replace(/^#*\s*The Savage Truth\s*/i, '').trim()

    return cleanText.split('\n').map((line, i) => {
        const trimmed = line.trim()
        if (!trimmed) return <View key={i} style={{ height: 8 }} />

        // Headers / Sections
        if (trimmed.startsWith('#') || trimmed.startsWith('🚨') || trimmed.startsWith('⚽')) {
            return (
                <Text key={i} style={styles.sectionTitle}>
                    {trimmed.replace(/^#+\s*/, '')}
                </Text>
            )
        }

        // List items
        if (trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
            return (
                <Text key={i} style={styles.listItem}>
                    • {trimmed.substring(2)}
                </Text>
            )
        }

        // Normal paragraphs
        return (
            <Text key={i} style={styles.textParagraph}>
                {trimmed}
            </Text>
        )
    })
}

return (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.header}>
                <Text style={styles.title}>🔥 Roast Report</Text>
                <Text style={styles.subtitle}>Análise de: {url}</Text>
                <Text style={styles.subtitle}>
                    Gerado em: {new Date(timestamp).toLocaleString('pt-BR')}
                </Text>
                {!isPremium && (
                    <View style={styles.teaserBadge}>
                        <Text style={styles.teaserText}>VERSÃO PRELIMINAR GRATUITA</Text>
                    </View>
                )}
            </View>

            {/* Score Principal + Sub-scores */}
            <View style={styles.scoreSection}>
                <Text style={styles.scoreLabel}>SCORE GERAL</Text>
                <Text style={[styles.scoreValue, { color: getScoreColor(score) }]}>
                    {score}/100
                </Text>

                {subScores && (
                    <View style={styles.subScoresGrid}>
                        <View style={styles.subScoreItem}>
                            <Text style={styles.subScoreLabel}>UX</Text>
                            <Text style={[styles.subScoreValue, { color: getScoreColor(subScores.ux || 0) }]}>
                                {subScores.ux || '--'}
                            </Text>
                        </View>
                        <View style={styles.subScoreItem}>
                            <Text style={styles.subScoreLabel}>SEO</Text>
                            <Text style={[styles.subScoreValue, { color: getScoreColor(subScores.seo || 0) }]}>
                                {subScores.seo || '--'}
                            </Text>
                        </View>
                        <View style={styles.subScoreItem}>
                            <Text style={styles.subScoreLabel}>COPY</Text>
                            <Text style={[styles.subScoreValue, { color: getScoreColor(subScores.copy || 0) }]}>
                                {subScores.copy || '--'}
                            </Text>
                        </View>
                        <View style={styles.subScoreItem}>
                            <Text style={styles.subScoreLabel}>CRO</Text>
                            <Text style={[styles.subScoreValue, { color: getScoreColor(subScores.conversion || 0) }]}>
                                {subScores.conversion || '--'}
                            </Text>
                        </View>
                        <View style={styles.subScoreItem}>
                            <Text style={styles.subScoreLabel}>TECH</Text>
                            <Text style={[styles.subScoreValue, { color: getScoreColor(subScores.security || 0) }]}>
                                {subScores.security || '--'}
                            </Text>
                        </View>
                    </View>
                )}
            </View>

            {/* Roast Text Section */}
            <View style={styles.roastSection}>
                <Text style={styles.roastHeader}>The Savage Truth</Text>
                {renderFormattedText(roastText)}
            </View>

            {/* Preview de Issues (2 primeiros de cada categoria) */}
            {categories.map(category => {
                const audit = audits?.[category.key as keyof typeof audits]
                const issues = audit?.issues?.slice(0, 2) || []

                if (issues.length === 0) return null

                return (
                    <View key={category.key} style={styles.categorySection}>
                        <Text style={styles.categoryHeader}>
                            {category.icon} {category.label} - {audit?.score || 0}/100
                        </Text>
                        {issues.map((issue, idx) => (
                            <View
                                key={idx}
                                style={[
                                    styles.issueCard,
                                    { borderLeftColor: getSeverityColor(issue.severity) }
                                ]}
                            >
                                <Text style={styles.issueTitle}>
                                    {issue.severity === 'critical' ? '🔴' : '🟠'} {issue.title}
                                </Text>
                                <Text style={styles.issueDescription}>
                                    {issue.description}
                                </Text>
                                <Text style={styles.issueFix}>
                                    ✓ {issue.fix}
                                </Text>
                            </View>
                        ))}
                    </View>
                )
            })}

            {/* Premium Upgrade Block */}
            {!isPremium && (
                <View style={styles.premiumBlock}>
                    <Text style={styles.lockIcon}>🔒</Text>
                    <Text style={styles.premiumTitle}>
                        Relatório Completo Bloqueado
                    </Text>
                    <Text style={styles.premiumText}>
                        Esta é apenas uma amostra grátis. Para ver o relatório completo
                        com todas as correções detalhadas e guias passo-a-passo:
                    </Text>
                    <Text style={styles.premiumCTA}>
                        Faça Login em roastthis.site
                    </Text>
                    <Text style={{ fontSize: 9, color: '#666', marginTop: 5, textAlign: 'center' }}>
                        (Seus dados já estão salvos em nossa plataforma)
                    </Text>
                </View>
            )}

            <View style={styles.footer}>
                <Text style={styles.footerText}>
                    Gerado por Roasty | roastthis.site | Powered by AI
                </Text>
            </View>
        </Page>
    </Document>
)
}
