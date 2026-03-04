import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import ZAI from 'z-ai-web-dev-sdk'

interface EmailRequest {
  to: string
  subject: string
  leadData: {
    name: string
    email: string
    phone?: string
    company?: string
    url?: string
    budget?: string
    timeline?: string
  }
  analysisResult?: {
    overallScore: number
    scores: { seo: number; aeo: number; geo: number }
    quote: { minPrice: number; maxPrice: number; services: string[] }
    topRecommendations: Array<{ title: string; priority: string }>
  }
}

// Initialize Resend
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

// Email configuration
const EMAIL_FROM = process.env.EMAIL_FROM || 'onboarding@resend.dev'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'contato@orionconsultoria.com.br'

// Generate HTML email for client
function generateClientEmail(data: EmailRequest): string {
  const { leadData, analysisResult } = data
  
  const analysisSection = analysisResult ? `
    <div style="background: #f1f5f9; padding: 20px; border-radius: 12px; margin: 20px 0;">
      <h3 style="color: #7c3aed; margin-top: 0;">📊 Resultado da Análise</h3>
      
      <div style="display: flex; gap: 20px; margin: 20px 0;">
        <div style="flex: 1; text-align: center; background: white; padding: 15px; border-radius: 8px;">
          <div style="font-size: 32px; font-weight: bold; color: ${analysisResult.overallScore >= 70 ? '#10b981' : analysisResult.overallScore >= 50 ? '#f59e0b' : '#ef4444'};">${analysisResult.overallScore}</div>
          <div style="color: #64748b;">Score Geral</div>
        </div>
        <div style="flex: 1; text-align: center; background: white; padding: 15px; border-radius: 8px;">
          <div style="font-size: 32px; font-weight: bold; color: #7c3aed;">${analysisResult.scores.seo}</div>
          <div style="color: #64748b;">SEO</div>
        </div>
        <div style="flex: 1; text-align: center; background: white; padding: 15px; border-radius: 8px;">
          <div style="font-size: 32px; font-weight: bold; color: #3b82f6;">${analysisResult.scores.aeo}</div>
          <div style="color: #64748b;">AEO</div>
        </div>
        <div style="flex: 1; text-align: center; background: white; padding: 15px; border-radius: 8px;">
          <div style="font-size: 32px; font-weight: bold; color: #8b5cf6;">${analysisResult.scores.geo}</div>
          <div style="color: #64748b;">GEO</div>
        </div>
      </div>

      ${analysisResult.topRecommendations.length > 0 ? `
        <h4 style="color: #1e293b;">🎯 Principais Recomendações:</h4>
        <ul style="padding-left: 20px;">
          ${analysisResult.topRecommendations.slice(0, 5).map(r => `
            <li style="margin: 8px 0; color: #475569;">
              <strong style="color: ${r.priority === 'high' ? '#ef4444' : r.priority === 'medium' ? '#f59e0b' : '#64748b'};">
                ${r.priority === 'high' ? '🔴' : r.priority === 'medium' ? '🟡' : '🟢'} ${r.title}
              </strong>
            </li>
          `).join('')}
        </ul>
      ` : ''}

      <div style="background: linear-gradient(135deg, #7c3aed, #8b5cf6); color: white; padding: 20px; border-radius: 8px; margin-top: 20px;">
        <h4 style="margin: 0 0 10px 0;">💰 Investimento Sugerido</h4>
        <div style="font-size: 24px; font-weight: bold;">
          R$ ${analysisResult.quote.minPrice.toLocaleString('pt-BR')} - R$ ${analysisResult.quote.maxPrice.toLocaleString('pt-BR')}
        </div>
        <div style="margin-top: 10px; font-size: 14px;">
          Inclui: ${analysisResult.quote.services.slice(0, 3).join(', ')}
        </div>
      </div>
    </div>
  ` : ''

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; background: #f8fafc; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto;">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #7c3aed, #8b5cf6); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 28px;">🚀 Growth Business Copilot</h1>
      <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">by Orion Consultoria</p>
    </div>

    <!-- Content -->
    <div style="background: white; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
      
      <h2 style="color: #1e293b; margin-top: 0;">Olá, ${leadData.name}! 👋</h2>
      
      <p style="color: #475569; line-height: 1.6;">
        Obrigado por solicitar uma análise do seu site! Nossa equipe de especialistas já recebeu suas informações e está preparando as melhores estratégias para alavancar sua presença digital.
      </p>

      ${analysisSection}

      <h3 style="color: #1e293b;">📋 Próximos Passos</h3>
      <ol style="color: #475569; line-height: 1.8;">
        <li>Nossa equipe vai analisar seu caso em detalhes</li>
        <li>Entraremos em contato em até <strong>24 horas úteis</strong></li>
        <li>Você receberá uma proposta personalizada</li>
        <li>Ao aprovar, iniciamos a implementação imediatamente</li>
      </ol>

      <!-- CTA -->
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://wa.me/5511999999999?text=Olá! Sou ${encodeURIComponent(leadData.name)} e gostaria de falar sobre a análise do meu site: ${encodeURIComponent(leadData.url || '')}" 
           style="display: inline-block; background: #22c55e; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 5px;">
          📱 Falar pelo WhatsApp
        </a>
      </div>

      <div style="background: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b;">
        <p style="margin: 0; color: #92400e; font-size: 14px;">
          <strong>💡 Dica:</strong> Quanto mais rápido você tomar ação, mais rápido verá resultados. 
          Nossos clientes costumam ver melhorias em 30-90 dias!
        </p>
      </div>

    </div>

    <!-- Footer -->
    <div style="text-align: center; padding: 20px; color: #64748b; font-size: 12px;">
      <p style="margin: 0;">
        Growth Business Copilot by Orion Consultoria<br>
        Este email foi enviado para ${leadData.email}
      </p>
    </div>

  </div>
</body>
</html>
  `
}

// Generate admin notification email HTML
function generateAdminEmailHtml(data: EmailRequest): string {
  const { leadData, analysisResult } = data
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; background: #f8fafc; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto;">
    
    <div style="background: linear-gradient(135deg, #7c3aed, #8b5cf6); padding: 20px; border-radius: 12px 12px 0 0; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 24px;">🚀 NOVO LEAD!</h1>
    </div>

    <div style="background: white; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
      
      <h2 style="color: #1e293b; margin-top: 0;">👤 Dados do Lead</h2>
      
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; color: #64748b;">Nome:</td>
          <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; font-weight: bold;">${leadData.name}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; color: #64748b;">Email:</td>
          <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;"><a href="mailto:${leadData.email}" style="color: #7c3aed;">${leadData.email}</a></td>
        </tr>
        <tr>
          <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; color: #64748b;">Telefone:</td>
          <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">${leadData.phone || 'Não informado'}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; color: #64748b;">Empresa:</td>
          <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">${leadData.company || 'Não informado'}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; color: #64748b;">Site:</td>
          <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;"><a href="${leadData.url}" target="_blank" style="color: #7c3aed;">${leadData.url || 'Não informado'}</a></td>
        </tr>
        <tr>
          <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; color: #64748b;">Orçamento:</td>
          <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">${leadData.budget || 'Não informado'}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #64748b;">Prazo:</td>
          <td style="padding: 8px 0;">${leadData.timeline || 'Não informado'}</td>
        </tr>
      </table>

      ${analysisResult ? `
        <h2 style="color: #1e293b; margin-top: 30px;">📊 Análise Preliminar</h2>
        
        <div style="display: flex; gap: 15px; margin: 20px 0;">
          <div style="flex: 1; text-align: center; background: #f1f5f9; padding: 15px; border-radius: 8px;">
            <div style="font-size: 28px; font-weight: bold; color: #7c3aed;">${analysisResult.overallScore}</div>
            <div style="color: #64748b; font-size: 12px;">Score Geral</div>
          </div>
          <div style="flex: 1; text-align: center; background: #f1f5f9; padding: 15px; border-radius: 8px;">
            <div style="font-size: 28px; font-weight: bold; color: #7c3aed;">${analysisResult.scores.seo}</div>
            <div style="color: #64748b; font-size: 12px;">SEO</div>
          </div>
          <div style="flex: 1; text-align: center; background: #f1f5f9; padding: 15px; border-radius: 8px;">
            <div style="font-size: 28px; font-weight: bold; color: #3b82f6;">${analysisResult.scores.aeo}</div>
            <div style="color: #64748b; font-size: 12px;">AEO</div>
          </div>
          <div style="flex: 1; text-align: center; background: #f1f5f9; padding: 15px; border-radius: 8px;">
            <div style="font-size: 28px; font-weight: bold; color: #8b5cf6;">${analysisResult.scores.geo}</div>
            <div style="color: #64748b; font-size: 12px;">GEO</div>
          </div>
        </div>

        <div style="background: linear-gradient(135deg, #7c3aed, #8b5cf6); color: white; padding: 20px; border-radius: 8px; text-align: center;">
          <div style="font-size: 14px; margin-bottom: 5px;">💰 Orçamento Sugerido</div>
          <div style="font-size: 24px; font-weight: bold;">
            R$ ${analysisResult.quote.minPrice.toLocaleString('pt-BR')} - R$ ${analysisResult.quote.maxPrice.toLocaleString('pt-BR')}
          </div>
        </div>
      ` : ''}

      <div style="margin-top: 30px; text-align: center;">
        <a href="https://wa.me/55${leadData.phone?.replace(/\D/g, '') || ''}" 
           style="display: inline-block; background: #22c55e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 5px;">
          📱 WhatsApp
        </a>
        <a href="mailto:${leadData.email}" 
           style="display: inline-block; background: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 5px;">
          ✉️ Enviar Email
        </a>
      </div>

    </div>

    <div style="text-align: center; padding: 20px; color: #64748b; font-size: 12px;">
      <p style="margin: 0;">
        Enviado em: ${new Date().toLocaleString('pt-BR')}
      </p>
    </div>

  </div>
</body>
</html>
  `
}

export async function POST(request: NextRequest) {
  try {
    const body: EmailRequest = await request.json()
    const { to, subject, leadData, analysisResult } = body

    if (!leadData) {
      return NextResponse.json(
        { error: 'Dados do lead são obrigatórios' },
        { status: 400 }
      )
    }

    // Generate emails
    const clientEmailHtml = generateClientEmail({ to, subject, leadData, analysisResult })
    const adminEmailHtml = generateAdminEmailHtml({ to, subject, leadData, analysisResult })

    const results = {
      clientEmail: null as { success: boolean; id?: string; error?: string } | null,
      adminEmail: null as { success: boolean; id?: string; error?: string } | null
    }

    // Send emails via Resend if configured
    if (resend) {
      try {
        // Send to client
        const clientResult = await resend.emails.send({
          from: EMAIL_FROM,
          to: leadData.email,
          subject: subject || 'Sua Análise SEO - Growth Business Copilot',
          html: clientEmailHtml
        })
        
        results.clientEmail = {
          success: true,
          id: clientResult.data?.id
        }
        
        console.log('✅ Email enviado para o cliente:', leadData.email, '- ID:', clientResult.data?.id)
      } catch (clientError) {
        console.error('❌ Erro ao enviar email para cliente:', clientError)
        results.clientEmail = {
          success: false,
          error: clientError instanceof Error ? clientError.message : 'Erro desconhecido'
        }
      }

      try {
        // Send notification to admin
        const adminResult = await resend.emails.send({
          from: EMAIL_FROM,
          to: ADMIN_EMAIL,
          subject: `🚀 Novo Lead: ${leadData.name} - ${leadData.company || leadData.url || 'Novo cliente'}`,
          html: adminEmailHtml
        })
        
        results.adminEmail = {
          success: true,
          id: adminResult.data?.id
        }
        
        console.log('✅ Notificação enviada para admin:', ADMIN_EMAIL, '- ID:', adminResult.data?.id)
      } catch (adminError) {
        console.error('❌ Erro ao enviar notificação para admin:', adminError)
        results.adminEmail = {
          success: false,
          error: adminError instanceof Error ? adminError.message : 'Erro desconhecido'
        }
      }
    } else {
      // Log emails if Resend is not configured
      console.log('═══════════════════════════════════════════════════════')
      console.log('⚠️ RESEND não configurado. Emails seriam enviados para:')
      console.log('═══════════════════════════════════════════════════════')
      console.log('📧 CLIENTE:', leadData.email)
      console.log('📧 ADMIN:', ADMIN_EMAIL)
      console.log('═══════════════════════════════════════════════════════')
      
      // Mark as successful in dev mode
      results.clientEmail = { success: true, id: 'dev-mode' }
      results.adminEmail = { success: true, id: 'dev-mode' }
    }

    // Generate personalized message using LLM
    let personalizedMessage = ''
    try {
      const zai = await ZAI.create()
      const summaryPrompt = `Gere uma mensagem curta e amigável (máximo 100 palavras) para um cliente chamado ${leadData.name} que acabou de solicitar uma análise de site. O site analisado foi ${leadData.url}. Inclua uma frase motivacional sobre crescimento digital. Seja caloroso e profissional.`

      const completion = await zai.chat.completions.create({
        messages: [
          { role: 'system', content: 'Você é um assistente de marketing digital amigável e profissional.' },
          { role: 'user', content: summaryPrompt }
        ]
      })

      personalizedMessage = completion.choices?.[0]?.message?.content || ''
    } catch {
      console.log('Could not generate personalized message')
    }

    const allSuccess = results.clientEmail?.success && results.adminEmail?.success

    return NextResponse.json({
      success: allSuccess,
      message: allSuccess ? 'Emails enviados com sucesso!' : 'Alguns emails falharam',
      results,
      personalizedMessage,
      preview: {
        to: leadData.email,
        subject: subject || 'Sua Análise SEO - Growth Business Copilot',
        hasAnalysis: !!analysisResult
      }
    })
  } catch (error) {
    console.error('Error processing email:', error)
    return NextResponse.json(
      { error: 'Erro ao processar email' },
      { status: 500 }
    )
  }
}
