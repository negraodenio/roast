export async function callSiliconFlow(model: string, systemPrompt: string, userPrompt: string) {
    const apiKey = process.env.SILICONFLOW_API_KEY
    const baseUrl = process.env.SILICONFLOW_API_URL || 'https://api.siliconflow.com/v1'

    const xaiKey = process.env.GROQ_API_KEY
    const xaiModel = process.env.GROQ_MODEL || 'grok-2-1212'

    if (!apiKey) {
        // If no SiliconFlow key, try xAI immediately if available
        if (xaiKey) return callXaiFallback(xaiModel, systemPrompt, userPrompt)
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
                response_format: { type: "json_object" }
            }),
        })

        if (!response.ok) {
            const errorText = await response.text()
            console.error('SiliconFlow API Error:', response.status, errorText)

            // Trigger fallback on error
            if (xaiKey) {
                console.log('Switching to xAI fallback...')
                return callXaiFallback(xaiModel, systemPrompt, userPrompt)
            }

            throw new Error(`SiliconFlow API failed: ${response.status}`)
        }

        const data = await response.json()
        const content = data.choices?.[0]?.message?.content || ''
        return cleanLLMContent(content)

    } catch (error) {
        console.error('Primary LLM Call Error:', error)

        if (groqKey) {
            console.log('Switching to Groq fallback after exception...')
            return callGroqFallback(groqModel, systemPrompt, userPrompt)
        }

        throw error
    }
}

async function callXaiFallback(model: string, systemPrompt: string, userPrompt: string) {
    const xaiKey = process.env.GROQ_API_KEY
    if (!xaiKey) throw new Error('xAI API key not found for fallback')

    console.log(`Calling xAI (Grok) fallback with model: ${model}`)
    const response = await fetch('https://api.x.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${xaiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt },
            ],
            temperature: 0.7,
            stream: false,
            response_format: { type: "json_object" }
        }),
    })

    if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`xAI (Grok) Fallback failed: ${response.status} ${errorText}`)
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content || ''
    return cleanLLMContent(content)
}

function cleanLLMContent(content: string) {
    return content.replace(/^```json\s*/, '').replace(/\s*```$/, '')
}
