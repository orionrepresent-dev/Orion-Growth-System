// Planos disponíveis para pagamento
export const PLANS = {
  presenca: {
    id: 'presenca',
    name: 'Presença Digital',
    price: 497,
    installments: 12,
    description: 'Seu negócio aparece. Ponto.',
    features: [
      'Google Meu Negócio otimizado',
      '2 posts semanais nas redes sociais',
      'Relatório mensal de resultados',
      'Suporte por WhatsApp'
    ]
  },
  autoridade: {
    id: 'autoridade',
    name: 'Autoridade Local',
    price: 997,
    installments: 12,
    description: 'Você vira a referência na região.',
    features: [
      'Tudo do plano anterior, mais:',
      'Site ou landing page otimizada',
      'Gestão completa de redes sociais',
      'Análise de concorrentes',
      'Dashboard de resultados em tempo real'
    ]
  },
  dominacao: {
    id: 'dominacao',
    name: 'Dominação de Mercado',
    price: 1497,
    installments: 12,
    description: 'Seus concorrentes param de ser problema.',
    features: [
      'Tudo do plano anterior, mais:',
      'Estratégia completa de conteúdo',
      'Campanhas pagas (incluso até R$ 500)',
      'Consultor dedicado',
      'Relatórios quinzenais por vídeo'
    ]
  }
} as const

export type PlanId = keyof typeof PLANS
export type Plan = typeof PLANS[PlanId]

// Tipos de pagamento
export type PaymentMethod = 'pix' | 'credit_card'

// Status de pagamento do Mercado Pago
export type PaymentStatus = 
  | 'pending'
  | 'approved'
  | 'authorized'
  | 'in_process'
  | 'in_mediation'
  | 'rejected'
  | 'cancelled'
  | 'refunded'
  | 'charged_back'

// Interface para transação
export interface Transaction {
  id: string
  externalReference: string
  planId: PlanId
  planName: string
  amount: number
  paymentMethod: PaymentMethod
  status: PaymentStatus
  payerEmail: string
  payerName?: string
  payerDocument?: string
  qrCode?: string
  qrCodeBase64?: string
  ticketUrl?: string
  initPoint?: string
  installments?: number
  createdAt: string
  updatedAt: string
  mercadoPagoId?: string
}

// Interface para resposta do webhook
export interface WebhookNotification {
  type: 'payment' | 'merchant_order' | 'preference'
  data: {
    id: string
  }
}

// Calcula valor da parcela
export function calculateInstallment(amount: number, installments: number): number {
  return Math.round((amount / installments) * 100) / 100
}

// Formata preço em reais
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(price)
}

// Mapeia status do MP para status legível
export function getStatusLabel(status: PaymentStatus): string {
  const labels: Record<PaymentStatus, string> = {
    pending: 'Pendente',
    approved: 'Aprovado',
    authorized: 'Autorizado',
    in_process: 'Em análise',
    in_mediation: 'Em mediação',
    rejected: 'Rejeitado',
    cancelled: 'Cancelado',
    refunded: 'Devolvido',
    charged_back: 'Estornado'
  }
  return labels[status]
}

// Mapeia status para cor
export function getStatusColor(status: PaymentStatus): string {
  const colors: Record<PaymentStatus, string> = {
    pending: 'yellow',
    approved: 'green',
    authorized: 'blue',
    in_process: 'orange',
    in_mediation: 'purple',
    rejected: 'red',
    cancelled: 'gray',
    refunded: 'gray',
    charged_back: 'red'
  }
  return colors[status]
}
