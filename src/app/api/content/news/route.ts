import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

// =====================================================
// NEWS/PRESS RELEASE GENERATOR API
// Business Audience Copilot - Gerador de Notícias
// =====================================================

interface NewsArticle {
  meta: {
    generatedAt: string
    icpProfileId: string
    industry: string
    type: 'press_release' | 'news' | 'announcement'
  }
  headline: {
    main: string
    subtitle: string
  }
  lead: string
  body: {
    paragraphs: string[]
    quotes: Array<{
      text: string
      author: string
      role: string
    }>
    facts: string[]
  }
  boilerplate: string
  contact: {
    name: string
    email: string
    phone: string
  }
  distribution: {
    channels: string[]
    timing: string
    targetJournalists: string[]
  }
  socialMedia: {
    twitter: string
    linkedin: string
    instagram: string
    facebook: string
  }
  seo: {
    keywords: string[]
    tags: string[]
    category: string
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      icpProfile, 
      newsType, 
      subject, 
      keyPoints, 
      quotes, 
      contactInfo,
      targetDate 
    } = body

    if (!subject) {
      return NextResponse.json(
        { error: 'Assunto da notícia é obrigatório' },
        { status: 400 }
      )
    }

    if (!icpProfile) {
      return NextResponse.json(
        { error: 'ICP Profile é obrigatório' },
        { status: 400 }
      )
    }

    console.log('📰 Gerando notícia sobre:', subject)

    const zai = await ZAI.create()

    const icpContext = `
EMPRESA:
- Nome: ${icpProfile.businessName || icpProfile.name || 'Sua Empresa'}
- Indústria: ${icpProfile.industry || 'Não informado'}
- Valores: ${icpProfile.psychographics?.values?.join(', ') || 'Não informado'}
- Tom: ${icpProfile.brandVoice?.tone || 'Profissional'}
`

    const prompt = `Você é um especialista em relações públicas e comunicação corporativa. Crie uma notícia/press release PROFISSIONAL.

${icpContext}

TIPO: ${newsType || 'press_release'}
ASSUNTO: ${subject}
PONTOS-CHAVE: ${keyPoints?.join(', ') || 'Automático'}
${quotes ? `CITACÕES FORNECIDAS: ${quotes}` : ''}

Crie um press release COMPLETO em JSON:
{
  "headline": {
    "main": "Manchete impactante e clara",
    "subtitle": "Subtítulo explicativo"
  },
  "lead": "Primeiro parágrafo com as informações mais importantes (quem, o quê, quando, onde, por quê)",
  "body": {
    "paragraphs": ["parágrafo 1", "parágrafo 2", "parágrafo 3"],
    "quotes": [
      { "text": "Citação impactante", "author": "Nome", "role": "Cargo" }
    ],
    "facts": ["fato 1", "fato 2", "fato 3"]
  },
  "boilerplate": "Sobre a empresa - parágrafo padrão para releases",
  "contact": {
    "name": "Nome do contato",
    "email": "email@empresa.com",
    "phone": "(00) 00000-0000"
  },
  "distribution": {
    "channels": ["Canal 1", "Canal 2"],
    "timing": "Melhor momento para divulgação",
    "targetJournalists": ["Tipo de jornalista/veículo"]
  },
  "socialMedia": {
    "twitter": "Tweet para divulgação",
    "linkedin": "Post LinkedIn corporativo",
    "instagram": "Legenda Instagram",
    "facebook": "Post Facebook"
  },
  "seo": {
    "keywords": ["keyword1", "keyword2"],
    "tags": ["tag1", "tag2"],
    "category": "Categoria da notícia"
  }
}

REGRAS:
1. Tom jornalístico e profissional
2. Manchete que chame atenção de jornalistas
3. Lead com todas informações essenciais
4. Citações de executivos (crie se não fornecidas)
5. Boilerplate sobre a empresa
6. Sugestões de distribuição

Responda APENAS com JSON válido.`

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'Você é um especialista em RP e comunicação corporativa. Cria press releases que são publicados. Responda apenas com JSON.'
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 3000
    })

    const responseText = completion.choices?.[0]?.message?.content || ''

    let article: NewsArticle
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        article = {
          meta: {
            generatedAt: new Date().toISOString(),
            icpProfileId: icpProfile.id || 'unknown',
            industry: icpProfile.industry || 'general',
            type: newsType || 'press_release'
          },
          ...parsed,
          contact: {
            ...parsed.contact,
            ...(contactInfo || {})
          }
        }
      } else {
        throw new Error('No JSON found')
      }
    } catch {
      article = generateFallbackNews(subject, icpProfile, newsType, contactInfo)
    }

    console.log('✅ Notícia gerada:', article.headline.main)

    return NextResponse.json({
      success: true,
      article
    })

  } catch (error) {
    console.error('Erro ao gerar notícia:', error)
    return NextResponse.json(
      { error: 'Erro ao gerar notícia' },
      { status: 500 }
    )
  }
}

function generateFallbackNews(subject: string, icpProfile: Record<string, unknown>, newsType?: string, contactInfo?: Record<string, string>): NewsArticle {
  const businessName = (icpProfile.businessName as string) || (icpProfile.name as string) || 'Sua Empresa'
  const industry = (icpProfile.industry as string) || 'setor'
  
  return {
    meta: {
      generatedAt: new Date().toISOString(),
      icpProfileId: (icpProfile.id as string) || 'unknown',
      industry,
      type: newsType || 'press_release'
    },
    headline: {
      main: `${businessName} anuncia ${subject}`,
      subtitle: `Iniciativa reforça compromisso com inovação no setor de ${industry}`
    },
    lead: `${businessName}, empresa de referência no mercado de ${industry}, anuncia hoje ${subject}, reforçando seu compromisso com a excelência e inovação.`,
    body: {
      paragraphs: [
        `A iniciativa representa um passo importante na estratégia de crescimento da empresa, que busca constantemente oferecer soluções diferenciadas para seus clientes.`,
        `Com esta ação, a empresa demonstra sua capacidade de adaptação às demandas do mercado e às necessidades de seus clientes.`,
        `O mercado de ${industry} continua em expansão, e ${businessName} está preparada para liderar essa transformação.`
      ],
      quotes: [
        {
          text: `Esta é uma conquista importante para nossa empresa e reflete nosso compromisso contínuo com a inovação.`,
          author: 'Executivo',
          role: 'CEO'
        }
      ],
      facts: [
        `${businessName} atua há anos no mercado`,
        'Equipe especializada e certificada',
        'Portfolio diversificado de soluções'
      ]
    },
    boilerplate: `Sobre ${businessName}: Empresa líder no segmento de ${industry}, oferece soluções inovadoras para empresas que buscam crescimento sustentável.`,
    contact: {
      name: contactInfo?.name || 'Assessoria de Imprensa',
      email: contactInfo?.email || 'imprensa@empresa.com',
      phone: contactInfo?.phone || '(00) 00000-0000'
    },
    distribution: {
      channels: ['Portais de notícias', 'Veículos especializados', 'Redes sociais'],
      timing: 'Manhã de terça a quinta-feira',
      targetJournalists: ['Jornalistas de negócios', 'Veículos do setor']
    },
    socialMedia: {
      twitter: `📢 ${businessName} anuncia ${subject}. Saiba mais!`,
      linkedin: `🏢 Notícia importante: ${businessName} acaba de anunciar ${subject}.\n\nEsta iniciativa reforça nosso compromisso com a inovação.`,
      instagram: `🚀 Novidade!\n\n${businessName} anuncia ${subject}.\n\n#inovação #negocios`,
      facebook: `📰 Em destaque: ${businessName} anuncia ${subject}. Confira!`
    },
    seo: {
      keywords: [subject, industry, businessName],
      tags: ['release', industry, 'anúncio'],
      category: 'Comunicado'
    }
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'API de Geração de Notícias/Press Releases',
    types: ['press_release', 'news', 'announcement'],
    features: [
      'Press release profissional',
      'Citações de executivos',
      'Boilerplate sobre empresa',
      'Distribuição sugerida',
      'Snippets redes sociais'
    ]
  })
}
