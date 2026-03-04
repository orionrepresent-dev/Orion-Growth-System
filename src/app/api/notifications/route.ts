import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import ZAI from 'z-ai-web-dev-sdk'

// ==================== TIPOS ====================
interface NotificationAction {
  id: string
  title: string
  description: string
  deadline: string
  priority: 'urgent' | 'important' | 'optional'
  service: string
  actionUrl?: string
}

interface NotificationRequest {
  type: 'reminder' | 'checkpoint' | 'weekly_summary' | 'action_required'
  userId: string
  userName: string
  userEmail: string
  userPhone?: string
  channels: ('email' | 'whatsapp')[]
  actions: NotificationAction[]
  customMessage?: string
}

// Initialize Resend
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null
const EMAIL_FROM = process.env.EMAIL_FROM || 'onboarding@resend.dev'

// ==================== TEMPLATES DE EMAIL ====================

function generateReminderEmailHtml(data: NotificationRequest): string {
  const { userName, actions, customMessage } = data
  
  const priorityEmoji = {
    urgent: '🔴',
    important: '🟡', 
    optional: '🟢'
  }
  
  const priorityLabel = {
    urgent: 'URGENTE',
    important: 'IMPORTANTE',
    optional: 'OPCIONAL'
  }

  const actionsHtml = actions.map(action => `
    <div style="background: ${action.priority === 'urgent' ? '#fef2f2' : action.priority === 'important' ? '#fffbeb' : '#f0fdf4'}; 
                border-left: 4px solid ${action.priority === 'urgent' ? '#ef4444' : action.priority === 'important' ? '#f59e0b' : '#22c55e'}; 
                padding: 15px; margin: 12px 0; border-radius: 8px;">
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
        <span style="font-size: 16px;">${priorityEmoji[action.priority]}</span>
        <span style="font-size: 12px; font-weight: 600; color: ${action.priority === 'urgent' ? '#dc2626' : action.priority === 'important' ? '#d97706' : '#16a34a'};">
          ${priorityLabel[action.priority]}
        </span>
        <span style="font-size: 12px; color: #64748b;">• ${action.service}</span>
      </div>
      <h4 style="margin: 0 0 5px 0; color: #1e293b;">${action.title}</h4>
      <p style="margin: 0; color: #64748b; font-size: 14px;">${action.description}</p>
      <div style="margin-top: 10px; display: flex; align-items: center; gap: 8px;">
        <span style="font-size: 12px; color: #64748b;">⏰ ${action.deadline}</span>
        ${action.actionUrl ? `
          <a href="${action.actionUrl}" style="font-size: 12px; background: #7c3aed; color: white; padding: 6px 12px; border-radius: 6px; text-decoration: none;">
            Fazer agora →
          </a>
        ` : ''}
      </div>
    </div>
  `).join('')

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
    <div style="background: linear-gradient(135deg, #7c3aed, #8b5cf6); padding: 25px; border-radius: 12px 12px 0 0; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 24px;">📅 Lembrete da Semana</h1>
      <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0;">Orion Growth Studio</p>
    </div>

    <!-- Content -->
    <div style="background: white; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
      
      <h2 style="color: #1e293b; margin-top: 0;">Olá, ${userName}! 👋</h2>
      
      ${customMessage ? `<p style="color: #64748b; margin-bottom: 20px;">${customMessage}</p>` : ''}
      
      <p style="color: #475569; line-height: 1.6;">
        Você tem <strong style="color: #7c3aed;">${actions.length} ação(ões)</strong> pendentes na sua Agenda da Semana. 
        Aqui está um resumo rápido para você ficar em dia:
      </p>

      <!-- Actions List -->
      <div style="margin: 25px 0;">
        ${actionsHtml}
      </div>

      <!-- Quick Stats -->
      <div style="background: #f1f5f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <div style="display: flex; justify-content: space-around; text-align: center;">
          <div>
            <div style="font-size: 24px; font-weight: bold; color: #ef4444;">${actions.filter(a => a.priority === 'urgent').length}</div>
            <div style="font-size: 12px; color: #64748b;">Urgentes</div>
          </div>
          <div>
            <div style="font-size: 24px; font-weight: bold; color: #f59e0b;">${actions.filter(a => a.priority === 'important').length}</div>
            <div style="font-size: 12px; color: #64748b;">Importantes</div>
          </div>
          <div>
            <div style="font-size: 24px; font-weight: bold; color: #22c55e;">${actions.filter(a => a.priority === 'optional').length}</div>
            <div style="font-size: 12px; color: #64748b;">Opcionais</div>
          </div>
        </div>
      </div>

      <!-- CTA -->
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://studio-app.orionconsultoria.cloud/journey" 
           style="display: inline-block; background: linear-gradient(135deg, #7c3aed, #8b5cf6); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
          📋 Ver Agenda Completa
        </a>
      </div>

      <!-- Tip -->
      <div style="background: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b;">
        <p style="margin: 0; color: #92400e; font-size: 14px;">
          <strong>💡 Dica:</strong> Reservar 10 minutos por dia para revisar sua agenda mantém tudo em dia e evita acumular tarefas!
        </p>
      </div>

    </div>

    <!-- Footer -->
    <div style="text-align: center; padding: 20px; color: #64748b; font-size: 12px;">
      <p style="margin: 0;">
        © 2024 Orion Growth Studio • IA FIRST BUSINESS<br>
        Você recebeu este email porque faz parte da nossa jornada de crescimento.
      </p>
      <p style="margin: 10px 0 0 0;">
        <a href="#" style="color: #7c3aed;">Central de Ajuda</a> • 
        <a href="#" style="color: #7c3aed;">Preferências de Notificação</a>
      </p>
    </div>

  </div>
</body>
</html>
  `
}

// ==================== MENSAGEM WHATSAPP ====================

function generateWhatsAppMessage(data: NotificationRequest): string {
  const { userName, actions, customMessage } = data
  
  const urgentActions = actions.filter(a => a.priority === 'urgent')
  const importantActions = actions.filter(a => a.priority === 'important')
  
  let message = `👋 Olá, ${userName}!\n\n`
  
  if (customMessage) {
    message += `${customMessage}\n\n`
  }
  
  message += `📅 *Sua Agenda da Semana*\n\n`
  
  if (urgentActions.length > 0) {
    message += `🔴 *URGENTE (${urgentActions.length})*\n`
    urgentActions.forEach(a => {
      message += `• ${a.title}\n  ⏰ ${a.deadline}\n\n`
    })
  }
  
  if (importantActions.length > 0) {
    message += `🟡 *IMPORTANTE (${importantActions.length})*\n`
    importantActions.forEach(a => {
      message += `• ${a.title}\n  ⏰ ${a.deadline}\n\n`
    })
  }
  
  message += `👉 Acesse sua agenda completa:\n`
  message += `https://studio-app.orionconsultoria.cloud/journey\n\n`
  message += `_Orion Growth Studio - Sua agência automática_ 🚀`
  
  return message
}

// ==================== ENVIO WHATSAPP ====================

async function sendWhatsApp(phone: string, message: string): Promise<{ success: boolean; error?: string }> {
  // WhatsApp Business API via Z-API (exemplo de integração)
  // Você pode usar: Z-API, Twilio, Evolution API, etc.
  
  const ZAPI_TOKEN = process.env.ZAPI_TOKEN
  const ZAPI_INSTANCE = process.env.ZAPI_INSTANCE
  
  if (!ZAPI_TOKEN || !ZAPI_INSTANCE) {
    console.log('⚠️ WhatsApp não configurado. Mensagem seria enviada para:', phone)
    console.log('📱 Mensagem:', message.substring(0, 100) + '...')
    return { success: true } // Retorna sucesso em dev mode
  }
  
  try {
    const response = await fetch(`https://api.z-api.io/instances/${ZAPI_INSTANCE}/token/${ZAPI_TOKEN}/send-text`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone: phone.replace(/\D/g, ''),
        message: message
      })
    })
    
    if (!response.ok) {
      throw new Error(`Z-API error: ${response.status}`)
    }
    
    const result = await response.json()
    console.log('✅ WhatsApp enviado:', result)
    return { success: true }
    
  } catch (error) {
    console.error('❌ Erro ao enviar WhatsApp:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Erro desconhecido' 
    }
  }
}

// ==================== ENDPOINT PRINCIPAL ====================

export async function POST(request: NextRequest) {
  try {
    const body: NotificationRequest = await request.json()
    const { type, userName, userEmail, userPhone, channels, actions, customMessage } = body

    if (!actions || actions.length === 0) {
      return NextResponse.json(
        { error: 'Nenhuma ação fornecida' },
        { status: 400 }
      )
    }

    const results = {
      email: null as { success: boolean; id?: string; error?: string } | null,
      whatsapp: null as { success: boolean; error?: string } | null
    }

    // Gerar mensagem personalizada com IA se não fornecida
    let message = customMessage || ''
    if (!message) {
      try {
        const zai = await ZAI.create()
        const prompt = `Gere uma mensagem curta e motivacional (máximo 50 palavras) para ${userName} que tem ${actions.length} ações pendentes na sua agenda de marketing digital. Seja encorajador e amigável. Não use emojis excessivos.`
        
        const completion = await zai.chat.completions.create({
          messages: [
            { role: 'system', content: 'Você é um assistente de marketing digital amigável e motivador.' },
            { role: 'user', content: prompt }
          ]
        })
        
        message = completion.choices?.[0]?.message?.content || ''
      } catch {
        message = 'Você está quase lá! Mais algumas ações e sua presença digital vai decolar! 🚀'
      }
    }

    // Enviar Email
    if (channels.includes('email') && resend) {
      try {
        const emailHtml = generateReminderEmailHtml({ ...body, customMessage: message })
        
        const emailResult = await resend.emails.send({
          from: EMAIL_FROM,
          to: userEmail,
          subject: `📅 Lembrete: ${actions.length} ações pendentes na sua Agenda`,
          html: emailHtml
        })
        
        results.email = {
          success: true,
          id: emailResult.data?.id
        }
        
        console.log('✅ Email de lembrete enviado para:', userEmail)
      } catch (emailError) {
        console.error('❌ Erro ao enviar email:', emailError)
        results.email = {
          success: false,
          error: emailError instanceof Error ? emailError.message : 'Erro desconhecido'
        }
      }
    }

    // Enviar WhatsApp
    if (channels.includes('whatsapp') && userPhone) {
      const waMessage = generateWhatsAppMessage({ ...body, customMessage: message })
      results.whatsapp = await sendWhatsApp(userPhone, waMessage)
    }

    const allSuccess = 
      (!channels.includes('email') || results.email?.success) &&
      (!channels.includes('whatsapp') || !userPhone || results.whatsapp?.success)

    return NextResponse.json({
      success: allSuccess,
      message: allSuccess 
        ? 'Notificações enviadas com sucesso!' 
        : 'Algumas notificações falharam',
      results,
      preview: {
        type,
        userName,
        userEmail,
        userPhone: userPhone ? `${userPhone.substring(0, 5)}*****` : null,
        actionsCount: actions.length,
        channelsUsed: channels
      }
    })

  } catch (error) {
    console.error('Error processing notification:', error)
    return NextResponse.json(
      { error: 'Erro ao processar notificação' },
      { status: 500 }
    )
  }
}

// Endpoint para listar canais disponíveis
export async function GET() {
  return NextResponse.json({
    channels: {
      email: {
        available: !!process.env.RESEND_API_KEY,
        provider: 'Resend'
      },
      whatsapp: {
        available: !!(process.env.ZAPI_TOKEN && process.env.ZAPI_INSTANCE),
        provider: 'Z-API',
        note: 'Configure ZAPI_TOKEN e ZAPI_INSTANCE nas variáveis de ambiente'
      }
    },
    notificationTypes: [
      { type: 'reminder', description: 'Lembrete de ações pendentes' },
      { type: 'checkpoint', description: 'Checkpoint alcançado na jornada' },
      { type: 'weekly_summary', description: 'Resumo semanal de atividades' },
      { type: 'action_required', description: 'Ação requer aprovação do cliente' }
    ]
  })
}
