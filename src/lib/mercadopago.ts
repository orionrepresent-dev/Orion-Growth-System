import MercadoPago, { Preference, Payment } from 'mercadopago'

// Configuração do cliente Mercado Pago
function getMercadoPagoClient() {
  const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN
  
  if (!accessToken) {
    throw new Error('MERCADO_PAGO_ACCESS_TOKEN não configurado')
  }
  
  return new MercadoPago({ accessToken })
}

// Cria preferência de pagamento
export async function createPaymentPreference(params: {
  planId: string
  planName: string
  amount: number
  payerEmail: string
  payerName?: string
  payerDocument?: string
  paymentMethod: 'pix' | 'credit_card'
  installments?: number
}) {
  const client = getMercadoPagoClient()
  const preference = new Preference(client)
  
  const { planId, planName, amount, payerEmail, payerName, payerDocument, paymentMethod, installments } = params
  
  // URL base do site
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  
  // ID único para referência externa
  const externalReference = `ORION-${planId.toUpperCase()}-${Date.now()}`
  
  // Configuração base da preferência
  const preferenceData: any = {
    items: [
      {
        id: planId,
        title: `Orion Growth Studio - ${planName}`,
        description: `Plano ${planName} - Consultoria de Marketing Digital`,
        category_id: 'professional_services',
        quantity: 1,
        unit_price: amount,
        currency_id: 'BRL'
      }
    ],
    payer: {
      email: payerEmail,
      ...(payerName && { name: payerName.split(' ')[0], surname: payerName.split(' ').slice(1).join(' ') }),
      ...(payerDocument && { identification: { type: 'CPF', number: payerDocument } })
    },
    back_urls: {
      success: `${baseUrl}/checkout/success?status=success&plan=${planId}`,
      failure: `${baseUrl}/checkout/success?status=failure&plan=${planId}`,
      pending: `${baseUrl}/checkout/success?status=pending&plan=${planId}`
    },
    auto_return: 'approved',
    external_reference: externalReference,
    notification_url: `${baseUrl}/api/webhooks/mercadopago`,
    statement_descriptor: 'ORION GROWTH',
    expires: true,
    expiration_date_from: new Date().toISOString(),
    expiration_date_to: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 horas
  }
  
  // Configurações específicas por método de pagamento
  if (paymentMethod === 'pix') {
    preferenceData.payment_methods = {
      excluded_payment_methods: [{ id: 'credit_card' }, { id: 'debit_card' }, { id: 'ticket' }],
      installments: 1
    }
  } else {
    // Cartão com parcelamento
    preferenceData.payment_methods = {
      excluded_payment_methods: [{ id: 'pix' }, { id: 'ticket' }],
      installments: installments || 12,
      default_installments: 1
    }
  }
  
  try {
    const response = await preference.create({ body: preferenceData })
    
    return {
      id: response.id,
      initPoint: response.init_point,
      sandboxInitPoint: response.sandbox_init_point,
      externalReference
    }
  } catch (error: any) {
    console.error('Erro ao criar preferência:', error)
    throw new Error(`Erro ao criar preferência de pagamento: ${error.message}`)
  }
}

// Busca informações do pagamento
export async function getPayment(paymentId: string) {
  const client = getMercadoPagoClient()
  const payment = new Payment(client)
  
  try {
    const response = await payment.get({ id: paymentId })
    return response
  } catch (error: any) {
    console.error('Erro ao buscar pagamento:', error)
    throw new Error(`Erro ao buscar pagamento: ${error.message}`)
  }
}

// Obtém a chave pública para o frontend
export function getPublicKey() {
  const publicKey = process.env.MERCADO_PAGO_PUBLIC_KEY
  if (!publicKey) {
    throw new Error('MERCADO_PAGO_PUBLIC_KEY não configurado')
  }
  return publicKey
}
