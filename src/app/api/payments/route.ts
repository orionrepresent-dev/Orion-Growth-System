import { NextRequest, NextResponse } from 'next/server'
import { PLANS, PlanId, PaymentMethod, Transaction, formatPrice } from '@/lib/payments'
import { createPaymentPreference, getPublicKey } from '@/lib/mercadopago'
import { saveTransaction, generateTransactionId } from '@/lib/transactions'

// POST - Criar nova preferência de pagamento
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validação dos dados
    const { planId, paymentMethod, payerEmail, payerName, payerDocument, installments } = body
    
    if (!planId || !paymentMethod || !payerEmail) {
      return NextResponse.json(
        { error: 'Dados obrigatórios: planId, paymentMethod, payerEmail' },
        { status: 400 }
      )
    }
    
    // Verifica se o plano existe
    if (!PLANS[planId as PlanId]) {
      return NextResponse.json(
        { error: 'Plano não encontrado' },
        { status: 400 }
      )
    }
    
    const plan = PLANS[planId as PlanId]
    
    // Valida método de pagamento
    if (!['pix', 'credit_card'].includes(paymentMethod)) {
      return NextResponse.json(
        { error: 'Método de pagamento inválido. Use: pix ou credit_card' },
        { status: 400 }
      )
    }
    
    // Valida email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(payerEmail)) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      )
    }
    
    // Cria preferência no Mercado Pago
    const preference = await createPaymentPreference({
      planId,
      planName: plan.name,
      amount: plan.price,
      payerEmail,
      payerName,
      payerDocument,
      paymentMethod: paymentMethod as PaymentMethod,
      installments: installments || plan.installments
    })
    
    // Cria registro da transação
    const transaction: Transaction = {
      id: generateTransactionId(),
      externalReference: preference.externalReference,
      planId: planId as PlanId,
      planName: plan.name,
      amount: plan.price,
      paymentMethod: paymentMethod as PaymentMethod,
      status: 'pending',
      payerEmail,
      payerName,
      payerDocument,
      initPoint: preference.initPoint,
      installments: installments || plan.installments,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    // Salva a transação
    saveTransaction(transaction)
    
    // Retorna dados para o frontend
    return NextResponse.json({
      success: true,
      transaction: {
        id: transaction.id,
        externalReference: transaction.externalReference,
        planName: plan.name,
        amount: plan.price,
        formattedAmount: formatPrice(plan.price),
        paymentMethod,
        installments: paymentMethod === 'credit_card' ? installments || plan.installments : 1
      },
      preference: {
        id: preference.id,
        initPoint: preference.initPoint,
        sandboxInitPoint: preference.sandboxInitPoint
      }
    })
    
  } catch (error: any) {
    console.error('Erro ao processar pagamento:', error)
    return NextResponse.json(
      { error: error.message || 'Erro interno ao processar pagamento' },
      { status: 500 }
    )
  }
}

// GET - Buscar chave pública (para frontend)
export async function GET() {
  try {
    const publicKey = getPublicKey()
    return NextResponse.json({ publicKey })
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Erro ao obter configuração' },
      { status: 500 }
    )
  }
}
