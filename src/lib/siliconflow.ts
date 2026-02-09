export async function callSiliconFlow(model: string, systemPrompt: string, userPrompt: string) {
    const apiKey = process.env.SILICONFLOW_API_KEY
    const baseUrl = process.env.SILICONFLOW_API_URL || 'https://api.siliconflow.com/v1'

    if (!apiKey) {
        throw new Error('SILICONFLOW_API_KEY is not defined')
    }

    try {
        const response = await fetch(`${baseUrl}/chat/completions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt },
                ],
                temperature: 0.7,
                max_tokens: 4096,
                response_format: { type: "json_object" } // Enforce JSON if model supports it
            }),
        })

        if (!response.ok) {
            const errorText = await response.text()
            console.error('SiliconFlow API Error:', response.status, errorText)
            throw new Error(`SiliconFlow API failed: ${response.status}`)
        }

        const data = await response.json()
        const content = data.choices?.[0]?.message?.content || ''

        // Remove markdown code blocks if present (sometimes models wrap JSON in ```json ... ```)
        const cleanContent = content.replace(/^```json\s*/, '').replace(/\s*```$/, '')

        return cleanContent
    } catch (error) {
        console.error('LLM Call Error:', error)
        throw error
    }
}
