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

export const RoastPdf: React.FC<RoastPdfProps> = ({
    url,
    score,
    roastText,
    timestamp,
    isPremium = false,
    subScores,
    audits,
}) => {
    const getScoreColor = (score: number) => {
        if (score >= 70) return '#22c55e'
        if (score >= 40) return '#f59e0b'
        return '#ef4444'
    }

    const getSeverityColor = (severity: 'critical' | 'warning') => {
        return severity === 'critical' ? '#ef4444' : '#f59e0b'
    }

    // Calculate total issues
    const totalIssues = Object.values(audits || {}).reduce((sum, audit) =>
        sum + (audit?.issues?.length || 0), 0
    )

    const shownIssuesCount = Object.values(audits || {}).reduce((sum, audit) =>
        sum + Math.min(2, audit?.issues?.length || 0), 0
    )

    const hiddenPercentage = totalIssues > 0
        ? Math.round(((totalIssues - shownIssuesCount) / totalIssues) * 100)
        : 0

    const categories = [
        { key: 'ux', label: 'UX', icon: '🎨' },
        { key: 'seo', label: 'SEO', icon: '🔍' },
        { key: 'copy', label: 'Copywriting', icon: '✍️' },
        { key: 'conversion', label: 'CRO', icon: '📈' },
        { key: 'security', label: 'Security & Tech', icon: '🔐' },
    ]

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

                {/* Score Principal + Sub-scores */}
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
                {!isPremium && hiddenPercentage > 0 && (
                    <View style={styles.premiumBlock}>
                        <Text style={styles.lockIcon}>🔒</Text>
                        <Text style={styles.premiumTitle}>
                            {hiddenPercentage}% das Correções Bloqueadas
                        </Text>
                        <Text style={styles.premiumText}>
                            Você está vendo apenas {shownIssuesCount} de {totalIssues} issues encontradas.
                        </Text>
                        <Text style={styles.premiumText}>
                            Desbloqueie análises detalhadas de UX, SEO, Copywriting, CRO e Security
                        </Text>
                        <Text style={styles.premiumText}>
                            com ações práticas para aumentar suas conversões.
                        </Text>
                        <Text style={styles.premiumCTA}>
                            👉 Assine Premium em roastthis.site
                        </Text>
                    </View>
                )}

                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        Gerado por Roasty | roastthis.site | Powered by DeepSeek V3 AI
                    </Text>
                </View>
            </Page>
        </Document>
    )
}
