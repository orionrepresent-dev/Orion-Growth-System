import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

// =====================================================
// BLOG ARTICLE GENERATOR API
// Business Audience Copilot - Gerador de Artigos de Blog
// =====================================================

interface BlogArticle {
  meta: {
    generatedAt: string
    icpProfileId: string
    industry: string
    wordCount: number
    readingTime: string
  }
  seo: {
    title: string
    metaDescription: string
    slug: string
    focusKeyword: string
    secondaryKeywords: string[]
    tags: string[]
  }
  content: {
    headline: string
    introduction: string
    sections: Array<{
      title: string
      content: string
      bulletPoints?: string[]
      includeImage: boolean
      imageSuggestion?: string
    }>
    conclusion: string
    callToAction: {
      text: string
      link: string
    }
  }
  socialSnippets: {
    twitter: string
    linkedin: string
    instagram: string
    facebook: string
  }
  internalLinks: Array<{
    anchor: string
    suggestedTopic: string
  }>
  faq: Array<{
    question: string
    answer: string
  }>
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      icpProfile, 
      topic, 
      keywords, 
      tone, 
      length, 
      includeFAQ, 
      targetAudience,
      objective 
    } = body

    if (!topic) {
      return NextResponse.json(
        { error: 'Tópico é obrigatório' },
        { status: 400 }
      )
    }

    if (!icpProfile) {
      return NextResponse.json(
        { error: 'ICP Profile é obrigatório para personalização do conteúdo' },
        { status: 400 }
      )
    }

    console.log('📝 Gerando artigo de blog sobre:', topic)

    const zai = await ZAI.create()

    const icpContext = `
ICP (Ideal Customer Profile):
- Negócio: ${icpProfile.businessName || icpProfile.name || 'Não informado'}
- Indústria: ${icpProfile.industry || 'Não informado'}
- Público: ${icpProfile.demographics?.ageRange || 'Não informado'}, ${icpProfile.demographics?.location || 'Brasil'}
- Dores: ${icpProfile.painPoints?.primary?.join(', ') || icpProfile.painPoints?.map((p: {pain: string}) => p.pain).join(', ') || 'Não informado'}
- Desejos: ${icpProfile.psychographics?.desires?.join(', ') || 'Não informado'}
- Valores: ${icpProfile.psychographics?.values?.join(', ') || 'Não informado'}
- Tom de voz: ${icpProfile.brandVoice?.tone || 'Profissional'}, ${icpProfile.brandVoice?.style || 'Direto'}
`

    const prompt = `Você é um copywriter especialista em SEO e conteúdo de alto desempenho. Crie um artigo de blog COMPLETO e OTIMIZADO.

${icpContext}

TÓPICO: ${topic}
PALAVRAS-CHAVE: ${keywords?.join(', ') || 'automático'}
TOM: ${tone || 'profissional'}
TAMANHO: ${length || 'longo'} (1500-2500 palavras)
OBJETIVO: ${objective || 'engajamento e autoridade'}

Crie um artigo COMPLETO em JSON seguindo esta estrutura:
{
  "seo": {
    "title": "Título otimizado para SEO (max 60 chars)",
    "metaDescription": "Meta description persuasiva (max 160 chars)",
    "slug": "slug-otimizada-para-url",
    "focusKeyword": "palavra-chave principal",
    "secondaryKeywords": ["keyword2", "keyword3"],
    "tags": ["tag1", "tag2", "tag3"]
  },
  "content": {
    "headline": "Headline impactante (H1)",
    "introduction": "Introdução que prende a atenção (2-3 parágrafos)",
    "sections": [
      {
        "title": "H2 - Subtítulo da seção",
        "content": "Conteúdo da seção (2-3 parágrafos)",
        "bulletPoints": ["ponto1", "ponto2"],
        "includeImage": true,
        "imageSuggestion": "Descrição da imagem"
      }
    ],
    "conclusion": "Conclusão com resumo (2 parágrafos)",
    "callToAction": { "text": "CTA persuasivo", "link": "/proximo-passo" }
  },
  "socialSnippets": {
    "twitter": "Tweet promocional",
    "linkedin": "Post para LinkedIn",
    "instagram": "Legenda Instagram",
    "facebook": "Post Facebook"
  },
  "internalLinks": [{ "anchor": "texto âncora", "suggestedTopic": "tópico relacionado" }],
  "faq": [{ "question": "Pergunta?", "answer": "Resposta" }]
}

REGRAS:
1. Linguagem NATURAL em português brasileiro
2. Conteúdo SUBSTANCIAL, não genérico
3. Use gatilhos que ressoem com as dores do ICP
4. Crie 4-6 seções bem desenvolvidas
5. Inclua 3-5 FAQs

Responda APENAS com JSON válido.`

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'Você é um copywriter especialista em SEO. Responda apenas com JSON válido.'
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0.8,
      max_tokens: 4000
    })

    const responseText = completion.choices?.[0]?.message?.content || ''

    let article: BlogArticle
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        
        const fullText = `${parsed.content?.headline || ''} ${parsed.content?.introduction || ''} ${
          parsed.content?.sections?.map((s: { title: string; content: string }) => `${s.title} ${s.content}`).join(' ') || ''
        } ${parsed.content?.conclusion || ''}`
        const wordCount = fullText.split(/\s+/).length
        const readingTime = Math.ceil(wordCount / 200)

        article = {
          meta: {
            generatedAt: new Date().toISOString(),
            icpProfileId: icpProfile.id || 'unknown',
            industry: icpProfile.industry || 'general',
            wordCount,
            readingTime: `${readingTime} min de leitura`
          },
          seo: parsed.seo || {},
          content: parsed.content || {},
          socialSnippets: parsed.socialSnippets || {},
          internalLinks: parsed.internalLinks || [],
          faq: includeFAQ !== false ? (parsed.faq || []) : []
        }
      } else {
        throw new Error('No JSON found')
      }
    } catch {
      article = generateFallbackArticle(topic, icpProfile, keywords)
    }

    console.log('✅ Artigo de blog gerado:', article.seo.title)

    return NextResponse.json({
      success: true,
      article
    })

  } catch (error) {
    console.error('Erro ao gerar artigo:', error)
    return NextResponse.json(
      { error: 'Erro ao gerar artigo de blog' },
      { status: 500 }
    )
  }
}

function generateFallbackArticle(topic: string, icpProfile: Record<string, unknown>, keywords?: string[]): BlogArticle {
  const industry = (icpProfile.industry as string) || 'negócios'
  return {
    meta: {
      generatedAt: new Date().toISOString(),
      icpProfileId: (icpProfile.id as string) || 'unknown',
      industry,
      wordCount: 1500,
      readingTime: '8 min de leitura'
    },
    seo: {
      title: `Guia Completo: ${topic} para ${industry}`,
      metaDescription: `Descubra tudo sobre ${topic}. Guia prático com dicas e estratégias.`,
      slug: topic.toLowerCase().replace(/\s+/g, '-'),
      focusKeyword: keywords?.[0] || topic,
      secondaryKeywords: keywords?.slice(1) || [],
      tags: [topic, industry, 'guia']
    },
    content: {
      headline: `${topic}: O Guia Definitivo`,
      introduction: `Você está buscando maneiras de melhorar seus resultados com ${topic}? Neste guia completo, vamos explorar tudo o que você precisa saber.`,
      sections: [
        { title: 'O Que é e Por Que Importa', content: 'Compreender os fundamentos é essencial.', bulletPoints: ['Conceito principal', 'Benefícios'], includeImage: true, imageSuggestion: 'Infográfico' },
        { title: 'Como Começar', content: 'Passo a passo para implementação.', bulletPoints: ['Passo 1', 'Passo 2'], includeImage: true, imageSuggestion: 'Diagrama' },
        { title: 'Erros Comuns', content: 'Aprenda com os erros dos outros.', includeImage: false },
        { title: 'Próximos Passos', content: 'Hora de colocar em prática.', includeImage: false }
      ],
      conclusion: `${topic} é uma ferramenta poderosa. Comece pequeno e expanda conforme aprende.`,
      callToAction: { text: 'Quer implementar? Agende uma consultoria.', link: '/contato' }
    },
    socialSnippets: {
      twitter: `📌 Novo artigo: ${topic}! Confira o guia completo.`,
      linkedin: `📢 "${topic} - O Guia Definitivo"\n\nConfira insights práticos.`,
      instagram: `🚀 Novo conteúdo!\n\n${topic}\n\n#marketing #negocios`,
      facebook: `📖 Artigo novo: "${topic}"\n\nClique para ler!`
    },
    internalLinks: [
      { anchor: 'estratégias de marketing', suggestedTopic: 'Marketing Digital' }
    ],
    faq: [
      { question: `Quanto tempo leva para ver resultados?`, answer: '30-90 dias com implementação consistente.' },
      { question: `Funciona para qualquer negócio?`, answer: 'Sim, adaptado ao seu contexto.' }
    ]
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'API de Geração de Artigos de Blog',
    features: [
      'Artigo completo otimizado SEO',
      'Meta tags automáticas',
      'Seções estruturadas',
      'Snippets redes sociais',
      'FAQ automático'
    ]
  })
}
