import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

// =====================================================
// EBOOK/WHITEPAPER GENERATOR API
// Business Audience Copilot - Gerador de Ebooks
// =====================================================

interface EbookContent {
  meta: {
    generatedAt: string
    icpProfileId: string
    industry: string
    estimatedPages: number
    estimatedReadTime: string
  }
  title: {
    main: string
    subtitle: string
  }
  cover: {
    title: string
    subtitle: string
    suggestedImage: string
  }
  tableOfContents: Array<{
    chapter: number
    title: string
    pageEstimate: number
  }>
  chapters: Array<{
    number: number
    title: string
    introduction: string
    sections: Array<{
      title: string
      content: string
      bulletPoints?: string[]
      includeVisual: boolean
      visualSuggestion?: string
    }>
    keyTakeaways: string[]
    chapterSummary: string
  }>
  conclusion: {
    summary: string
    callToAction: string
    nextSteps: string[]
  }
  appendix: {
    glossary: Array<{ term: string; definition: string }>
    resources: Array<{ title: string; url: string; description: string }>
    references: string[]
  }
  design: {
    colorScheme: string[]
    typography: string
    style: string
  }
  leadMagnet: {
    suggestedLandingPageCopy: string
    emailSequence: Array<{ day: number; subject: string; preview: string }>
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      icpProfile, 
      topic, 
      ebookType, 
      targetLength, 
      includeGlossary,
      includeResources,
      mainObjective
    } = body

    if (!topic) {
      return NextResponse.json(
        { error: 'Tópico do ebook é obrigatório' },
        { status: 400 }
      )
    }

    if (!icpProfile) {
      return NextResponse.json(
        { error: 'ICP Profile é obrigatório' },
        { status: 400 }
      )
    }

    console.log('📚 Gerando ebook sobre:', topic)

    const zai = await ZAI.create()

    const icpContext = `
ICP (Ideal Customer Profile):
- Negócio: ${icpProfile.businessName || icpProfile.name || 'Não informado'}
- Indústria: ${icpProfile.industry || 'Não informado'}
- Público: ${icpProfile.demographics?.ageRange || 'Não informado'}
- Dores: ${icpProfile.painPoints?.primary?.join(', ') || icpProfile.painPoints?.map((p: {pain: string}) => p.pain).join(', ') || 'Não informado'}
- Desejos: ${icpProfile.psychographics?.desires?.join(', ') || 'Não informado'}
- Tom: ${icpProfile.brandVoice?.tone || 'Profissional'}
`

    const prompt = `Você é um especialista em criação de ebooks e whitepapers de alto valor. Crie um ebook COMPLETO e PROFISSIONAL.

${icpContext}

TÓPICO: ${topic}
TIPO: ${ebookType || 'ebook'}
TAMANHO ALVO: ${targetLength || 'medio'} (10-20 páginas)
OBJETIVO: ${mainObjective || 'lead generation'}

Crie um ebook COMPLETO em JSON:
{
  "title": {
    "main": "Título principal do ebook",
    "subtitle": "Subtítulo descritivo"
  },
  "cover": {
    "title": "Título para capa",
    "subtitle": "Subtítulo para capa",
    "suggestedImage": "Descrição da imagem de capa"
  },
  "tableOfContents": [
    { "chapter": 1, "title": "Capítulo 1", "pageEstimate": 3 }
  ],
  "chapters": [
    {
      "number": 1,
      "title": "Título do Capítulo",
      "introduction": "Introdução do capítulo",
      "sections": [
        {
          "title": "Seção 1",
          "content": "Conteúdo detalhado (200-300 palavras)",
          "bulletPoints": ["ponto1", "ponto2"],
          "includeVisual": true,
          "visualSuggestion": "Descrição do gráfico/imagem"
        }
      ],
      "keyTakeaways": ["Aprendizado 1", "Aprendizado 2"],
      "chapterSummary": "Resumo do capítulo"
    }
  ],
  "conclusion": {
    "summary": "Resumo geral do ebook",
    "callToAction": "CTA principal",
    "nextSteps": ["Passo 1", "Passo 2"]
  },
  "appendix": {
    "glossary": [{ "term": "Termo", "definition": "Definição" }],
    "resources": [{ "title": "Recurso", "url": "#", "description": "Descrição" }],
    "references": ["Referência 1"]
  },
  "design": {
    "colorScheme": ["#cor1", "#cor2"],
    "typography": "Sugestão tipográfica",
    "style": "Estilo visual"
  },
  "leadMagnet": {
    "suggestedLandingPageCopy": "Copy para landing page",
    "emailSequence": [{ "day": 1, "subject": "Assunto", "preview": "Preview" }]
  }
}

REGRAS:
1. Crie 5-7 capítulos bem estruturados
2. Cada capítulo com 2-4 seções
3. Conteúdo denso e valioso
4. Inclua dados e estatísticas quando relevante
5. Visual suggestions para gráficos/diagramas
6. Key takeaways claros
7. Email sequence para nurturing

Responda APENAS com JSON válido.`

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'Você é um especialista em content marketing e criação de ebooks. Responda apenas com JSON.'
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0.8,
      max_tokens: 6000
    })

    const responseText = completion.choices?.[0]?.message?.content || ''

    let ebook: EbookContent
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        const chapterCount = parsed.chapters?.length || 5
        const estimatedPages = chapterCount * 3 + 5 // Cover + TOC + chapters + appendix
        
        ebook = {
          meta: {
            generatedAt: new Date().toISOString(),
            icpProfileId: icpProfile.id || 'unknown',
            industry: icpProfile.industry || 'general',
            estimatedPages,
            estimatedReadTime: `${Math.ceil(estimatedPages * 3)} min`
          },
          title: parsed.title || {},
          cover: parsed.cover || {},
          tableOfContents: parsed.tableOfContents || [],
          chapters: parsed.chapters || [],
          conclusion: parsed.conclusion || {},
          appendix: includeGlossary !== false ? (parsed.appendix || { glossary: [], resources: [], references: [] }) : { glossary: [], resources: [], references: [] },
          design: parsed.design || {},
          leadMagnet: parsed.leadMagnet || {}
        }
      } else {
        throw new Error('No JSON found')
      }
    } catch {
      ebook = generateFallbackEbook(topic, icpProfile, ebookType)
    }

    console.log('✅ Ebook gerado:', ebook.title.main)

    return NextResponse.json({
      success: true,
      ebook
    })

  } catch (error) {
    console.error('Erro ao gerar ebook:', error)
    return NextResponse.json(
      { error: 'Erro ao gerar ebook' },
      { status: 500 }
    )
  }
}

function generateFallbackEbook(topic: string, icpProfile: Record<string, unknown>, ebookType?: string): EbookContent {
  const industry = (icpProfile.industry as string) || 'negócios'
  
  return {
    meta: {
      generatedAt: new Date().toISOString(),
      icpProfileId: (icpProfile.id as string) || 'unknown',
      industry,
      estimatedPages: 15,
      estimatedReadTime: '45 min'
    },
    title: {
      main: `Guia Completo: ${topic}`,
      subtitle: `Tudo que você precisa saber sobre ${topic} no mercado de ${industry}`
    },
    cover: {
      title: topic,
      subtitle: `Guia Definitivo para ${industry}`,
      suggestedImage: 'Imagem profissional representando o tema'
    },
    tableOfContents: [
      { chapter: 1, title: 'Introdução', pageEstimate: 2 },
      { chapter: 2, title: 'Fundamentos', pageEstimate: 3 },
      { chapter: 3, title: 'Implementação', pageEstimate: 3 },
      { chapter: 4, title: 'Cases de Sucesso', pageEstimate: 3 },
      { chapter: 5, title: 'Próximos Passos', pageEstimate: 2 }
    ],
    chapters: [
      {
        number: 1,
        title: 'Introdução',
        introduction: `Neste capítulo, vamos entender o contexto e a importância de ${topic}.`,
        sections: [
          { title: 'O Contexto Atual', content: 'O mercado está em transformação...', includeVisual: true, visualSuggestion: 'Gráfico de tendências' },
          { title: 'Por Que Importa', content: 'Entender isso é fundamental para...', includeVisual: false }
        ],
        keyTakeaways: ['Contexto é fundamental', 'Mercado em transformação'],
        chapterSummary: 'Entendemos a importância do tema.'
      },
      {
        number: 2,
        title: 'Fundamentos',
        introduction: `Vamos explorar os conceitos essenciais de ${topic}.`,
        sections: [
          { title: 'Conceitos Básicos', content: 'Os fundamentos incluem...', bulletPoints: ['Conceito 1', 'Conceito 2'], includeVisual: false },
          { title: 'Framework Principal', content: 'O framework consiste em...', includeVisual: true, visualSuggestion: 'Diagrama do framework' }
        ],
        keyTakeaways: ['Fundamentos dominados', 'Framework claro'],
        chapterSummary: 'Conceitos básicos estabelecidos.'
      },
      {
        number: 3,
        title: 'Implementação',
        introduction: 'Como colocar em prática.',
        sections: [
          { title: 'Passo a Passo', content: 'Siga estes passos...', bulletPoints: ['Passo 1', 'Passo 2', 'Passo 3'], includeVisual: false },
          { title: 'Ferramentas', content: 'As principais ferramentas são...', includeVisual: false }
        ],
        keyTakeaways: ['Passos claros', 'Ferramentas identificadas'],
        chapterSummary: 'Implementação estruturada.'
      },
      {
        number: 4,
        title: 'Cases de Sucesso',
        introduction: 'Exemplos reais de implementação.',
        sections: [
          { title: 'Case 1', content: 'Empresa X implementou e obteve...', includeVisual: true, visualSuggestion: 'Gráfico de resultados' }
        ],
        keyTakeaways: ['Resultados comprovados'],
        chapterSummary: 'Casos validam a abordagem.'
      },
      {
        number: 5,
        title: 'Próximos Passos',
        introduction: 'Como continuar a jornada.',
        sections: [
          { title: 'Plano de Ação', content: 'Próximos passos recomendados...', bulletPoints: ['Ação 1', 'Ação 2'], includeVisual: false }
        ],
        keyTakeaways: ['Pronto para implementar'],
        chapterSummary: 'Jornada definida.'
      }
    ],
    conclusion: {
      summary: `Este ebook apresentou os fundamentos de ${topic} e como aplicá-los.`,
      callToAction: 'Pronto para começar? Agende uma consultoria gratuita.',
      nextSteps: ['Revisar conceitos', 'Definir prioridades', 'Começar implementação']
    },
    appendix: {
      glossary: [
        { term: topic, definition: 'Definição do termo principal' }
      ],
      resources: [
        { title: 'Ferramenta Recomendada', url: '#', description: 'Descrição' }
      ],
      references: ['Referência bibliográfica']
    },
    design: {
      colorScheme: ['#1F4E79', '#10B981', '#F59E0B'],
      typography: 'Sans-serif moderna',
      style: 'Profissional e clean'
    },
    leadMagnet: {
      suggestedLandingPageCopy: `Baixe gratuitamente o Guia Completo de ${topic} e transforme seus resultados.`,
      emailSequence: [
        { day: 0, subject: `Aqui está seu ebook sobre ${topic}`, preview: 'Obrigado por baixar!' },
        { day: 2, subject: 'Dica extra sobre o tema', preview: 'Que tal um conteúdo adicional?' },
        { day: 5, subject: 'Vamos colocar em prática?', preview: 'Está pronto para começar?' }
      ]
    }
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'API de Geração de Ebooks/Whitepapers',
    types: ['ebook', 'whitepaper', 'guide', 'manual'],
    features: [
      'Estrutura completa com capítulos',
      'Sumário automático',
      'Seções com sugestões visuais',
      'Apêndice com glossário',
      'Sequência de emails para nurturing',
      'Copy para landing page'
    ]
  })
}
