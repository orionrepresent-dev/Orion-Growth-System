import { NextRequest, NextResponse } from 'next/server'
import jsPDF from 'jspdf'

interface AnalysisData {
  url: string
  analyzedAt: string
  overallScore: number
  scores: {
    seo: number
    aeo: number
    geo: number
  }
  seoAnalysis: {
    score: number
    findings: Array<{
      category: string
      status: string
      message: string
    }>
    recommendations: string[]
  }
  aeoAnalysis: {
    score: number
    findings: Array<{
      category: string
      status: string
      message: string
    }>
    recommendations: string[]
  }
  geoAnalysis: {
    score: number
    findings: Array<{
      category: string
      status: string
      message: string
    }>
    recommendations: string[]
  }
  topRecommendations: Array<{
    priority: string
    title: string
    description: string
    impact: string
  }>
  quote: {
    minPrice: number
    maxPrice: number
    services: string[]
  }
}

function getScoreColor(score: number): [number, number, number] {
  if (score >= 70) return [16, 185, 129] // green
  if (score >= 50) return [245, 158, 11] // yellow
  return [239, 68, 68] // red
}

function getScoreLabel(score: number): string {
  if (score >= 70) return 'Bom'
  if (score >= 50) return 'Regular'
  return 'Crítico'
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { analysis, clientName, clientEmail } = body as {
      analysis: AnalysisData
      clientName: string
      clientEmail: string
    }

    if (!analysis) {
      return NextResponse.json(
        { error: 'Dados da análise são obrigatórios' },
        { status: 400 }
      )
    }

    // Create PDF
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    let y = 20

    // Header
    doc.setFillColor(124, 58, 237) // violet-600
    doc.rect(0, 0, pageWidth, 40, 'F')
    
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(24)
    doc.setFont('helvetica', 'bold')
    doc.text('Orion Growth Studio', 20, 25)
    
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text('Relatório de Análise SEO/AEO/GEO', 20, 33)

    y = 55

    // Client Info
    doc.setTextColor(30, 41, 59) // slate-800
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('Dados do Cliente', 20, y)
    y += 8

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(71, 85, 105) // slate-600
    doc.text(`Nome: ${clientName || 'Não informado'}`, 20, y)
    y += 6
    doc.text(`Email: ${clientEmail || 'Não informado'}`, 20, y)
    y += 6
    doc.text(`Site: ${analysis.url}`, 20, y)
    y += 6
    doc.text(`Data: ${new Date(analysis.analyzedAt).toLocaleDateString('pt-BR')}`, 20, y)
    y += 15

    // Overall Score
    doc.setFillColor(241, 245, 249) // slate-100
    doc.roundedRect(20, y, pageWidth - 40, 35, 3, 3, 'F')
    
    const [r, g, b] = getScoreColor(analysis.overallScore)
    doc.setTextColor(r, g, b)
    doc.setFontSize(32)
    doc.setFont('helvetica', 'bold')
    doc.text(`${analysis.overallScore}`, pageWidth / 2 - 15, y + 22)
    
    doc.setTextColor(71, 85, 105)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text('Score Geral', pageWidth / 2 - 20, y + 30)
    
    y += 45

    // Individual Scores
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(30, 41, 59)
    doc.text('Pontuação por Área', 20, y)
    y += 10

    const scores = [
      { name: 'SEO', score: analysis.scores.seo, desc: 'Search Engine Optimization' },
      { name: 'AEO', score: analysis.scores.aeo, desc: 'Answer Engine Optimization' },
      { name: 'GEO', score: analysis.scores.geo, desc: 'Generative Engine Optimization' }
    ]

    const boxWidth = (pageWidth - 60) / 3
    scores.forEach((s, i) => {
      const x = 20 + (i * (boxWidth + 10))
      const [sr, sg, sb] = getScoreColor(s.score)
      
      doc.setFillColor(248, 250, 252)
      doc.roundedRect(x, y, boxWidth, 30, 2, 2, 'F')
      
      doc.setTextColor(sr, sg, sb)
      doc.setFontSize(20)
      doc.setFont('helvetica', 'bold')
      doc.text(`${s.score}`, x + boxWidth/2 - 10, y + 14)
      
      doc.setTextColor(30, 41, 59)
      doc.setFontSize(10)
      doc.text(s.name, x + boxWidth/2 - 10, y + 22)
      
      doc.setTextColor(100, 116, 139)
      doc.setFontSize(7)
      doc.text(s.desc, x + 5, y + 28)
    })
    
    y += 45

    // Top Recommendations
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(30, 41, 59)
    doc.text('Principais Recomendações', 20, y)
    y += 10

    const priorityColors: Record<string, [number, number, number]> = {
      high: [239, 68, 68],    // red
      medium: [245, 158, 11], // yellow
      low: [34, 197, 94]      // green
    }

    const priorityLabels: Record<string, string> = {
      high: '🔴 Alta',
      medium: '🟡 Média',
      low: '🟢 Baixa'
    }

    analysis.topRecommendations?.slice(0, 5).forEach((rec, i) => {
      if (y > 250) {
        doc.addPage()
        y = 20
      }

      const [pr, pg, pb] = priorityColors[rec.priority] || [100, 100, 100]
      
      doc.setFillColor(254, 252, 232) // amber-50
      doc.roundedRect(20, y, pageWidth - 40, 18, 2, 2, 'F')
      
      doc.setTextColor(pr, pg, pb)
      doc.setFontSize(8)
      doc.setFont('helvetica', 'bold')
      doc.text(priorityLabels[rec.priority] || '', 25, y + 7)
      
      doc.setTextColor(30, 41, 59)
      doc.setFontSize(9)
      doc.text(rec.title, 60, y + 7)
      
      doc.setTextColor(100, 116, 139)
      doc.setFontSize(7)
      doc.text(rec.impact, 25, y + 14)
      
      y += 22
    })

    y += 5

    // Investment Quote
    if (y > 230) {
      doc.addPage()
      y = 20
    }

    doc.setFillColor(124, 58, 237)
    doc.roundedRect(20, y, pageWidth - 40, 30, 3, 3, 'F')
    
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text('Investimento Sugerido', pageWidth / 2 - 25, y + 10)
    
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text(
      `R$ ${analysis.quote?.minPrice?.toLocaleString('pt-BR') || '997'} - R$ ${analysis.quote?.maxPrice?.toLocaleString('pt-BR') || '2.997'}`,
      pageWidth / 2 - 40,
      y + 22
    )

    y += 40

    // Services Included
    if (analysis.quote?.services?.length > 0) {
      doc.setTextColor(30, 41, 59)
      doc.setFontSize(10)
      doc.setFont('helvetica', 'bold')
      doc.text('Serviços Incluídos:', 20, y)
      y += 8
      
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9)
      doc.setTextColor(71, 85, 105)
      
      analysis.quote.services.forEach((service, i) => {
        if (i < 4) {
          doc.text(`• ${service}`, 25, y)
          y += 5
        }
      })
    }

    y += 10

    // CTA
    if (y > 250) {
      doc.addPage()
      y = 20
    }

    doc.setFillColor(34, 197, 94) // green-500
    doc.roundedRect(20, y, pageWidth - 40, 20, 3, 3, 'F')
    
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text('Entre em contato: (51) 98182-9086 | pablo@orionconsultoria.com.br', pageWidth / 2 - 70, y + 12)

    // Footer
    const pageCount = doc.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.setTextColor(148, 163, 184)
      doc.setFontSize(8)
      doc.text(
        `Página ${i} de ${pageCount} | Orion Growth Studio | ${new Date().toLocaleDateString('pt-BR')}`,
        pageWidth / 2 - 40,
        285
      )
    }

    // Return PDF
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'))
    
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="relatorio-seo-${new Date().toISOString().split('T')[0]}.pdf"`,
        'Content-Length': pdfBuffer.length.toString()
      }
    })

  } catch (error) {
    console.error('Error generating PDF:', error)
    return NextResponse.json(
      { error: 'Erro ao gerar relatório PDF' },
      { status: 500 }
    )
  }
}
