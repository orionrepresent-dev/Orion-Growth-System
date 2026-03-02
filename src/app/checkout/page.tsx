'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { 
  CheckCircle2, 
  ArrowLeft, 
  QrCode, 
  CreditCard, 
  Shield, 
  Clock,
  ChevronRight,
  Loader2,
  AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { PLANS, PlanId, formatPrice, calculateInstallment } from '@/lib/payments'

export default function CheckoutPage() {
  const [selectedPlan, setSelectedPlan] = useState<PlanId>('autoridade')
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'credit_card'>('pix')
  const [installments, setInstallments] = useState<number>(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Form fields
  const [payerName, setPayerName] = useState('')
  const [payerEmail, setPayerEmail] = useState('')
  const [payerDocument, setPayerDocument] = useState('')
  
  const plan = PLANS[selectedPlan]
  
  // Processa o pagamento
  const handlePayment = async () => {
    setError(null)
    
    // Validações
    if (!payerEmail) {
      setError('Email é obrigatório')
      return
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(payerEmail)) {
      setError('Email inválido')
      return
    }
    
    if (!payerName) {
      setError('Nome é obrigatório')
      return
    }
    
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: selectedPlan,
          paymentMethod,
          payerEmail,
          payerName,
          payerDocument: payerDocument.replace(/\D/g, ''),
          installments
        })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao processar pagamento')
      }
      
      // Redireciona para o Mercado Pago
      if (data.preference?.initPoint) {
        window.location.href = data.preference.initPoint
      } else {
        throw new Error('Erro ao gerar link de pagamento')
      }
      
    } catch (err: any) {
      setError(err.message)
      setIsLoading(false)
    }
  }
  
  // Formata CPF/CNPJ
  const formatDocument = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 11) {
      return numbers
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1')
    }
    return numbers
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1')
  }
  
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-slate-600 hover:text-slate-900">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Voltar</span>
            </Link>
            <Image 
              src="/logo.png" 
              alt="Orion Growth Studio" 
              width={120} 
              height={32}
              className="h-8 w-auto"
            />
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Shield className="w-4 h-4 text-teal-500" />
              <span>Ambiente Seguro</span>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Coluna esquerda - Seleção de plano */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 mb-2">Finalizar Assinatura</h1>
              <p className="text-slate-600">Escolha seu plano e método de pagamento</p>
            </div>
            
            {/* Seleção de Plano */}
            <Card className="border-slate-200">
              <CardContent className="p-6">
                <h2 className="font-semibold text-slate-900 mb-4">Selecione o Plano</h2>
                <RadioGroup value={selectedPlan} onValueChange={(v) => setSelectedPlan(v as PlanId)}>
                  <div className="space-y-3">
                    {Object.entries(PLANS).map(([id, p]) => (
                      <motion.div
                        key={id}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <Label
                          htmlFor={id}
                          className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            selectedPlan === id 
                              ? 'border-teal-500 bg-teal-50' 
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <RadioGroupItem value={id} id={id} className="mt-1" />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="font-semibold text-slate-900">{p.name}</span>
                                {id === 'autoridade' && (
                                  <Badge className="ml-2 bg-teal-500 text-white text-xs">Mais vendido</Badge>
                                )}
                              </div>
                              <div className="text-right">
                                <span className="text-lg font-bold text-slate-900">{formatPrice(p.price)}</span>
                                <span className="text-slate-500 text-sm">/mês</span>
                              </div>
                            </div>
                            <p className="text-sm text-slate-600 mt-1">{p.description}</p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {p.features.slice(0, 3).map((feature, i) => (
                                <span key={i} className="text-xs text-slate-500 flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3 text-teal-500" />
                                  {feature}
                                </span>
                              ))}
                            </div>
                          </div>
                        </Label>
                      </motion.div>
                    ))}
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
            
            {/* Método de Pagamento */}
            <Card className="border-slate-200">
              <CardContent className="p-6">
                <h2 className="font-semibold text-slate-900 mb-4">Método de Pagamento</h2>
                <RadioGroup value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as 'pix' | 'credit_card')}>
                  <div className="grid grid-cols-2 gap-4">
                    {/* PIX */}
                    <Label
                      htmlFor="pix"
                      className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        paymentMethod === 'pix' 
                          ? 'border-teal-500 bg-teal-50' 
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <RadioGroupItem value="pix" id="pix" className="sr-only" />
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        paymentMethod === 'pix' ? 'bg-teal-500' : 'bg-slate-100'
                      }`}>
                        <QrCode className={`w-6 h-6 ${paymentMethod === 'pix' ? 'text-white' : 'text-slate-600'}`} />
                      </div>
                      <div className="text-center">
                        <span className="font-semibold text-slate-900 block">PIX</span>
                        <span className="text-xs text-teal-600 font-medium">Aprovação instantânea</span>
                      </div>
                    </Label>
                    
                    {/* Cartão */}
                    <Label
                      htmlFor="credit_card"
                      className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        paymentMethod === 'credit_card' 
                          ? 'border-teal-500 bg-teal-50' 
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <RadioGroupItem value="credit_card" id="credit_card" className="sr-only" />
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        paymentMethod === 'credit_card' ? 'bg-teal-500' : 'bg-slate-100'
                      }`}>
                        <CreditCard className={`w-6 h-6 ${paymentMethod === 'credit_card' ? 'text-white' : 'text-slate-600'}`} />
                      </div>
                      <div className="text-center">
                        <span className="font-semibold text-slate-900 block">Cartão de Crédito</span>
                        <span className="text-xs text-teal-600 font-medium">Em até 12x</span>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
                
                {/* Parcelamento */}
                <AnimatePresence>
                  {paymentMethod === 'credit_card' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 overflow-hidden"
                    >
                      <Separator className="mb-4" />
                      <Label className="text-sm text-slate-600 mb-2 block">Parcelas</Label>
                      <div className="grid grid-cols-4 gap-2">
                        {Array.from({ length: plan.installments }, (_, i) => i + 1).map((n) => (
                          <button
                            key={n}
                            onClick={() => setInstallments(n)}
                            className={`p-2 rounded-lg text-sm font-medium transition-all ${
                              installments === n
                                ? 'bg-teal-500 text-white'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            {n}x
                            <span className="block text-xs opacity-80">
                              {formatPrice(calculateInstallment(plan.price, n))}
                            </span>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </div>
          
          {/* Coluna direita - Formulário e Resumo */}
          <div className="space-y-6">
            {/* Dados do comprador */}
            <Card className="border-slate-200">
              <CardContent className="p-6">
                <h2 className="font-semibold text-slate-900 mb-4">Seus Dados</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nome completo *</Label>
                    <Input
                      id="name"
                      placeholder="Seu nome completo"
                      value={payerName}
                      onChange={(e) => setPayerName(e.target.value)}
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={payerEmail}
                      onChange={(e) => setPayerEmail(e.target.value)}
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="document">CPF/CNPJ (opcional)</Label>
                    <Input
                      id="document"
                      placeholder="000.000.000-00"
                      value={payerDocument}
                      onChange={(e) => setPayerDocument(formatDocument(e.target.value))}
                      maxLength={18}
                      className="mt-1.5"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Resumo do pedido */}
            <Card className="border-slate-200 bg-slate-900">
              <CardContent className="p-6">
                <h2 className="font-semibold text-white mb-4">Resumo do Pedido</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Plano</span>
                    <span className="text-white font-medium">{plan.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Método</span>
                    <span className="text-white font-medium">
                      {paymentMethod === 'pix' ? 'PIX' : `Cartão - ${installments}x`}
                    </span>
                  </div>
                  <Separator className="bg-slate-700" />
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Valor</span>
                    <span className="text-white font-medium">
                      {paymentMethod === 'credit_card' && installments > 1
                        ? `${installments}x de ${formatPrice(calculateInstallment(plan.price, installments))}`
                        : formatPrice(plan.price)
                      }
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-lg text-white font-semibold">Total</span>
                    <span className="text-2xl font-bold text-teal-400">{formatPrice(plan.price)}</span>
                  </div>
                </div>
                
                {/* Benefícios do PIX */}
                {paymentMethod === 'pix' && (
                  <div className="mt-4 p-3 bg-teal-500/20 rounded-lg border border-teal-500/30">
                    <div className="flex items-center gap-2 text-teal-300 text-sm">
                      <Clock className="w-4 h-4" />
                      <span>Pagamento aprovado instantaneamente</span>
                    </div>
                  </div>
                )}
                
                {/* Erro */}
                {error && (
                  <div className="mt-4 p-3 bg-red-500/20 rounded-lg border border-red-500/30">
                    <div className="flex items-center gap-2 text-red-300 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{error}</span>
                    </div>
                  </div>
                )}
                
                {/* Botão de pagamento */}
                <Button
                  onClick={handlePayment}
                  disabled={isLoading}
                  className="w-full mt-6 bg-teal-500 hover:bg-teal-600 text-white py-6 text-lg font-semibold"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    <>
                      {paymentMethod === 'pix' ? 'Pagar com PIX' : `Pagar em ${installments}x`}
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
                
                <p className="text-xs text-slate-500 text-center mt-4">
                  Ao continuar, você será redirecionado para o ambiente seguro do Mercado Pago
                </p>
              </CardContent>
            </Card>
            
            {/* Garantia */}
            <div className="flex items-center gap-3 bg-white rounded-xl p-4 border border-slate-200">
              <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                <Shield className="w-5 h-5 text-teal-600" />
              </div>
              <div>
                <p className="font-semibold text-slate-900 text-sm">Garantia de 90 dias</p>
                <p className="text-xs text-slate-500">Se não ver resultados, devolvemos 100% do valor</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
