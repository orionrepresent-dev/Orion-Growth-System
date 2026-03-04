import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { icpProfile, platform, contentType, objective, additionalContext } = body

    if (!icpProfile) {
      return NextResponse.json({ error: 'ICP Profile is required' }, { status: 400 })
    }

    const zai = await ZAI.create()

    const copyPrompt = `You are a professional copywriter for ${platform}. Create compelling ${contentType} content.

Business: ${icpProfile.businessName}
Industry: ${icpProfile.industry}
Target: ${icpProfile.demographics.ageRange}, ${icpProfile.demographics.location}

Pain Points: ${icpProfile.painPoints?.map((p: { pain: string }) => p.pain).join(', ') || 'N/A'}
Desires: ${icpProfile.psychographics?.desires?.join(', ') || 'N/A'}
Brand Voice: ${icpProfile.brandVoice?.tone || 'Professional'}, ${icpProfile.brandVoice?.style || 'Direct'}
Language: Portuguese (Brazilian)

Objective: ${objective}
Context: ${additionalContext || 'None'}

Return ONLY valid JSON with:
{
  "headline": "Attention-grabbing headline (max 8 words)",
  "body": "Compelling body text (max 2 sentences)",
  "cta": "Call to action (max 4 words)",
  "hashtags": ["hashtag1", "hashtag2", "hashtag3"]
}`

    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are a marketing copywriter. Return only valid JSON.' },
        { role: 'user', content: copyPrompt }
      ],
      temperature: 0.8
    })

    const responseText = completion.choices?.[0]?.message?.content || ''
    
    let copy
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      copy = jsonMatch ? JSON.parse(jsonMatch[0]) : null
    } catch {
      copy = null
    }

    if (!copy) {
      copy = {
        headline: `Transforme seu ${icpProfile.industry}`,
        body: `${icpProfile.businessName} ajuda você a ${icpProfile.psychographics?.desires?.[0] || 'alcançar seus objetivos'}.`,
        cta: 'Saiba mais',
        hashtags: ['#marketing', '#negocios']
      }
    }

    return NextResponse.json({ success: true, copy })

  } catch (error) {
    console.error('Content generation error:', error)
    return NextResponse.json({ error: 'Failed to generate content' }, { status: 500 })
  }
}
