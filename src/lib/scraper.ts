import * as cheerio from 'cheerio'

export interface ScrapeResult {
    title: string
    metaDescription: string
    headings: string[]
    bodyText: string
    imageCount: number
    linkCount: number
    hasHttps: boolean
    formCount: number
    buttonCount: number
    ctaTexts: string[]
    techStack: string[]
}

export async function scrapeWebsite(url: string): Promise<ScrapeResult> {
    try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 10000) // 10s timeout

        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            },
            signal: controller.signal,
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
            throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`)
        }

        const html = await response.text()
        const $ = cheerio.load(html)

        // Remove scripts, styles, and comments to clean up text
        $('script, style, noscript, iframe, svg').remove()

        const headings = $('h1, h2, h3, h4').map((_, el) => $(el).text().trim()).get().filter(t => t.length > 0)

        // Find CTA buttons/links (simple heuristic: look for 'button' or links with specific classes or text)
        const ctaTexts = $('a, button')
            .filter((_, el) => {
                const text = $(el).text().trim().toLowerCase()
                return text.length > 0 && text.length < 50 &&
                    (text.includes('sign') || text.includes('get') || text.includes('try') || text.includes('buy') || text.includes('join') || text.includes('start'))
            })
            .map((_, el) => $(el).text().trim())
            .get()
            .filter((v, i, a) => a.indexOf(v) === i) // unique

        return {
            title: $('title').text().trim(),
            metaDescription: $('meta[name="description"]').attr('content') || '',
            headings: headings.slice(0, 20),
            bodyText: $('body').text().replace(/\s+/g, ' ').trim().substring(0, 5000),
            imageCount: $('img').length,
            linkCount: $('a').length,
            hasHttps: url.startsWith('https'),
            formCount: $('form').length,
            buttonCount: $('button').length,
            ctaTexts: ctaTexts.slice(0, 10),
            techStack: [], // Difficult to detect purely from HTML, would need headers/wappalyzer
        }
    } catch (error) {
        console.error('Scraping error:', error)
        throw new Error(`Could not scrape ${url}. It might be blocking bots or unreachable.`)
    }
}
