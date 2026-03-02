'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Suspense } from 'react'
import { motion } from 'framer-motion'
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ArrowRight, 
  MessageCircle,
  Calendar,
  Mail,
  Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { PLANS } from '@/lib/payments'

function SuccessContent() {
  const searchParams = useSearchParams()
  const status = searchParams.get('status') || 'pending'
  const planId = searchParams.get('plan') || 'autoridade'
  
  const plan = PLANS[planId as keyof typeof PLANS] || PLANS.autoridade
  
  // Configuração baseada no status
  const statusConfig = {
    success: {
      icon: CheckCircle2,
      iconColor: 'text-emerald-500',
      iconBg: 'bg-emerald-100',
      title: 'Pagamento Confirmado!',
      message: 'Seu pagamento foi processado com sucesso. Estamos muito felizes em ter você conosco!',
      description: 'Você receberá um email de confirmação em breve. Nossa equipe entrará em contato para iniciar os trabalhos.',
      cta: 'Ir para Dashboard',
      ctaHref: '/dashboard'
    },
    pending: {
      icon: Clock,
      iconColor: 'text-amber-500',
      iconBg: 'bg-amber-100',
      title: 'Pagamento em Análise',
      message: 'Seu pagamento está sendo processado. Isso pode levar alguns minutos.',
      description: 'Assim que o pagamento for confirmado, você receberá um email de confirmação.',
      cta: 'Ver Status',
      ctaHref: '/dashboard'
    },
    failure: {
      icon: XCircle,
      iconColor: 'text-red-500',
      iconBg: 'bg-red-100',
      title: 'Pagamento Não Realizado',
      message: 'Houve um problema com seu pagamento. Por favor, tente novamente.',
      description: 'Se o problema persistir, entre em contato conosco pelo WhatsApp.',
      cta: 'Tentar Novamente',
      ctaHref: '/checkout'
    }
  }
  
  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
  const Icon = config.icon
  
  return (
    <Card className="border-slate-200 overflow-hidden">
      {/* Header com status */}
      <div className={`text-center py-12 ${
        status === 'success' ? 'bg-gradient-to-br from-emerald-500 to-teal-600' :
        status === 'pending' ? 'bg-gradient-to-br from-amber-500 to-orange-600' :
        'bg-gradient-to-br from-red-500 to-rose-600'
      }`}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className={`w-20 h-20 rounded-full ${config.iconBg} flex items-center justify-center mx-auto mb-6`}
        >
          <Icon className={`w-10 h-10 ${config.iconColor}`} />
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-bold text-white mb-3"
        >
          {config.title}
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-white/90 text-lg max-w-md mx-auto px-4"
        >
          {config.message}
        </motion.p>
      </div>
      
      <CardContent className="p-6">
        {/* Detalhes do plano */}
        {status === 'success' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-6 p-4 bg-slate-50 rounded-xl"
          >
            <h3 className="font-semibold text-slate-900 mb-3">Detalhes da Assinatura</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Plano</span>
                <span className="font-medium text-slate-900">{plan.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Valor mensal</span>
                <span className="font-medium text-slate-900">R$ {plan.price.toFixed(2).replace('.', ',')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Próximos passos</span>
                <span className="font-medium text-teal-600">Nossa equipe entrará em contato</span>
              </div>
            </div>
          </motion.div>
        )}
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-slate-600 text-center mb-6"
        >
          {config.description}
        </motion.p>
        
        {/* Ações */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="space-y-3"
        >
          <Link href={config.ctaHref}>
            <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white py-6 text-lg font-semibold">
              {config.cta}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          
          {status !== 'success' && (
            <a href="https://wa.me/5551981829086" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="w-full py-6 text-lg">
                <MessageCircle className="w-5 h-5 mr-2" />
                Falar pelo WhatsApp
              </Button>
            </a>
          )}
        </motion.div>
        
        {/* Info adicional */}
        {status === 'success' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-6 pt-6 border-t border-slate-200"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center">
                  <Mail className="w-4 h-4 text-teal-600" />
                </div>
                <span className="text-slate-600">Email de confirmação enviado</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-teal-600" />
                </div>
                <span className="text-slate-600">Contato em até 24h úteis</span>
              </div>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  )
}

function LoadingFallback() {
  return (
    <Card className="border-slate-200 overflow-hidden">
      <div className="text-center py-12 bg-gradient-to-br from-slate-700 to-slate-900">
        <Loader2 className="w-12 h-12 text-white animate-spin mx-auto" />
        <p className="text-white/80 mt-4">Carregando...</p>
      </div>
    </Card>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-center">
            <Image 
              src="/logo.png" 
              alt="Orion Growth Studio" 
              width={120} 
              height={32}
              className="h-8 w-auto"
            />
          </div>
        </div>
      </header>
      
      <main className="max-w-2xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Suspense fallback={<LoadingFallback />}>
            <SuccessContent />
          </Suspense>
          
          {/* Suporte */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="mt-8 text-center"
          >
            <p className="text-slate-500 text-sm mb-3">
              Dúvidas? Entre em contato
            </p>
            <div className="flex items-center justify-center gap-4">
              <a 
                href="https://wa.me/5551981829086" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-teal-600 hover:text-teal-700 flex items-center gap-1"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </a>
              <span className="text-slate-300">|</span>
              <a 
                href="mailto:pablo@orionconsultoria.com.br"
                className="text-sm text-teal-600 hover:text-teal-700 flex items-center gap-1"
              >
                <Mail className="w-4 h-4" />
                Email
              </a>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  )
}
