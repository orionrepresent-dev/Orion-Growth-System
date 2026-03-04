import { NextRequest, NextResponse } from 'next/server'
import { getPayment } from '@/lib/mercadopago'
import { getTransactionByExternalRef, updateTransactionStatus } from '@/lib/transactions'
import { PaymentStatus, WebhookNotification } from '@/lib/payments'

// POST - Receber notificações do Mercado Pago
export async function POST(request: NextRequest) {
  try {
    const body: WebhookNotification = await request.json()
    
    console.log('[Webhook MP] Notificação recebida:', JSON.stringify(body, null, 2))
    
    // Verifica se é uma notificação de pagamento
    if (body.type === 'payment') {
      const paymentId = body.data.id
      
      if (!paymentId) {
        return NextResponse.json(
          { error: 'ID do pagamento não informado' },
          { status: 400 }
        )
      }
      
      // Busca detalhes do pagamento no Mercado Pago
      const payment = await getPayment(paymentId)
      
      console.log('[Webhook MP] Detalhes do pagamento:', {
        id: payment.id,
        status: payment.status,
        external_reference: payment.external_reference
      })
      
      // Mapeia status do MP para nosso status
      const statusMap: Record<string, PaymentStatus> = {
        pending: 'pending',
        approved: 'approved',
        authorized: 'authorized',
        in_process: 'in_process',
        in_mediation: 'in_mediation',
        rejected: 'rejected',
        cancelled: 'cancelled',
        refunded: 'refunded',
        charged_back: 'charged_back'
      }
      
      const status = statusMap[payment.status as string] || 'pending'
      const externalReference = payment.external_reference as string
      
      if (externalReference) {
        // Busca a transação pelo external reference
        const transaction = getTransactionByExternalRef(externalReference)
        
        if (transaction) {
          // Atualiza o status da transação
          const updated = updateTransactionStatus(
            externalReference,
            status,
            paymentId.toString()
          )
          
          console.log('[Webhook MP] Transação atualizada:', {
            externalReference,
            status,
            transactionId: updated?.id
          })
          
          // Envia email de confirmação se aprovado
          if (status === 'approved' && updated) {
            await sendConfirmationEmail(updated)
          }
        } else {
          console.warn('[Webhook MP] Transação não encontrada:', externalReference)
        }
      }
    }
    
    // Responde sucesso para o Mercado Pago
    return NextResponse.json({ received: true })
    
  } catch (error: any) {
    console.error('[Webhook MP] Erro:', error)
    return NextResponse.json(
      { error: 'Erro ao processar notificação' },
      { status: 500 }
    )
  }
}

// Envia email de confirmação de pagamento
async function sendConfirmationEmail(transaction: {
  id: string
  planName: string
  amount: number
  payerEmail: string
  payerName?: string
}) {
  try {
    // URL da API de email interna
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    
    await fetch(`${baseUrl}/api/email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: transaction.payerEmail,
        subject: `Pagamento Confirmado - ${transaction.planName} | Orion Growth Studio`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #0f172a, #1e293b); padding: 30px; text-align: center;">
              <h1 style="color: #2dd4bf; margin: 0;">Pagamento Confirmado!</h1>
            </div>
            <div style="padding: 30px; background: #f8fafc;">
              <p style="font-size: 16px; color: #334155;">
                Olá${transaction.payerName ? ` ${transaction.payerName}` : ''},
              </p>
              <p style="font-size: 16px; color: #334155;">
                Seu pagamento foi confirmado com sucesso! Estamos muito felizes em ter você conosco.
              </p>
              <div style="background: white; border-radius: 12px; padding: 20px; margin: 20px 0; border-left: 4px solid #2dd4bf;">
                <h3 style="margin: 0 0 10px 0; color: #0f172a;">Detalhes da Assinatura</h3>
                <p style="margin: 5px 0; color: #475569;"><strong>Plano:</strong> ${transaction.planName}</p>
                <p style="margin: 5px 0; color: #475569;"><strong>Valor:</strong> R$ ${transaction.amount.toFixed(2).replace('.', ',')}</p>
                <p style="margin: 5px 0; color: #475569;"><strong>ID da Transação:</strong> ${transaction.id}</p>
              </div>
              <p style="font-size: 16px; color: #334155;">
                Em breve entraremos em contato para iniciar os trabalhos. Enquanto isso, se tiver dúvidas, 
                responda este email ou fale conosco pelo WhatsApp.
              </p>
              <div style="text-align: center; margin-top: 30px;">
                <a href="https://wa.me/5551981829086" style="background: #22c55e; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block;">
                  Falar no WhatsApp
                </a>
              </div>
            </div>
            <div style="background: #0f172a; padding: 20px; text-align: center;">
              <p style="color: #94a3b8; margin: 0; font-size: 14px;">
                © ${new Date().getFullYear()} Orion Growth Studio - Autoridade Digital para seu Negócio
              </p>
            </div>
          </div>
        `
      })
    })
    
    console.log('[Webhook MP] Email de confirmação enviado para:', transaction.payerEmail)
  } catch (error) {
    console.error('[Webhook MP] Erro ao enviar email:', error)
  }
}

// GET - Verificação do webhook (para testes)
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  
  // Mercado Pago verifica o webhook enviando um GET com parâmetros
  const topic = searchParams.get('topic')
  const id = searchParams.get('id')
  
  console.log('[Webhook MP] GET recebido:', { topic, id })
  
  return NextResponse.json({ 
    status: 'ok',
    message: 'Webhook Orion Growth Studio ativo',
    timestamp: new Date().toISOString()
  })
}
