'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  Search,
  ArrowLeft,
  Globe,
  Zap,
  Shield,
  BarChart3,
  CheckCircle2,
  Loader2,
  AlertCircle,
  MessageCircle,
  Mail,
  User,
  Lock
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}

const benefits = [
  {
    icon: CheckCircle2,
    title: 'Análise Completa',
    description: 'Mais de 50 fatores de SEO avaliados'
  },
  {
    icon: BarChart3,
    title: 'Relatório Detalhado',
    description: 'Recomendações priorizadas por impacto'
  },
  {
    icon: Shield,
    title: 'Dados Seguros',
    description: 'Suas informações protegidas'
  }
]

export default function AnalyzePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    url: '',
    email: '',
    name: '',
    company: '',
    phone: '',
    goals: '',
    competitors: '',
    budget: '',
    timeline: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError(null)
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const validateUrl = (url: string) => {
    try {
      new URL(url.startsWith('http') ? url : `https://${url}`)
      return true
    } catch {
      return false
    }
  }

  const validatePhone = (phone: string) => {
    // Remove non-digits and check if has at least 10 digits (DDD + number)
    const digits = phone.replace(/\D/g, '')
    return digits.length >= 10 && digits.length <= 11
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!formData.url) {
      setError('Por favor, insira uma URL válida.')
      return
    }

    if (!validateUrl(formData.url)) {
      setError('Por favor, insira uma URL válida (ex: https://seusite.com.br)')
      return
    }

    if (!formData.name || formData.name.trim().length < 2) {
      setError('Por favor, insira seu nome completo.')
      return
    }

    if (!formData.email || !formData.email.includes('@')) {
      setError('Por favor, insira um email válido.')
      return
    }

    if (!formData.phone || !validatePhone(formData.phone)) {
      setError('Por favor, insira um WhatsApp válido com DDD (ex: 51 98182-9086)')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Erro ao processar análise')
      }

      const data = await response.json()
      
      // Store results in sessionStorage for the results page
      sessionStorage.setItem('analysisResults', JSON.stringify(data))
      sessionStorage.setItem('analysisFormData', JSON.stringify(formData))
      
      router.push('/results')
    } catch (err) {
      setError('Ocorreu um erro ao processar sua análise. Por favor, tente novamente.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <Image 
                src="/logo.png" 
                alt="Orion Growth Studio" 
                width={140} 
                height={32}
                className="h-8 w-auto"
              />
            </Link>
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial="initial"
          animate="animate"
          variants={fadeInUp}
          className="text-center mb-12"
        >
          <Badge className="bg-teal-100 text-teal-700 mb-4">
            <Zap className="w-4 h-4 mr-2" />
            Análise Gratuita
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Descubra como melhorar seu site
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Insira a URL do seu site e receba um relatório completo com pontuação e recomendações. 
            <span className="font-medium text-teal-600"> 100% gratuito.</span>
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="border-slate-200 shadow-lg">
              <CardHeader className="bg-slate-50 border-b border-slate-200">
                <CardTitle className="text-slate-900">Análise do Site</CardTitle>
                <CardDescription>
                  Preencha os dados abaixo para liberar sua análise gratuita
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* URL Input */}
                  <div className="space-y-2">
                    <Label htmlFor="url" className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-teal-600" />
                      URL do Site *
                    </Label>
                    <Input
                      id="url"
                      name="url"
                      type="text"
                      placeholder="https://seusite.com.br"
                      value={formData.url}
                      onChange={handleInputChange}
                      className="border-slate-300 focus:border-teal-500 focus:ring-teal-500"
                    />
                  </div>

                  {/* Required Contact Info */}
                  <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Lock className="w-4 h-4 text-teal-600" />
                      <span className="text-sm font-medium text-teal-700">
                        Informações obrigatórias para liberar a análise
                      </span>
                    </div>
                    
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="flex items-center gap-2">
                          <User className="w-4 h-4 text-slate-500" />
                          Nome completo *
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          placeholder="Seu nome"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="border-slate-300 focus:border-teal-500 focus:ring-teal-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-slate-500" />
                          Email *
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="seu@email.com"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="border-slate-300 focus:border-teal-500 focus:ring-teal-500"
                        />
                      </div>
                    </div>

                    <div className="mt-4 space-y-2">
                      <Label htmlFor="phone" className="flex items-center gap-2">
                        <MessageCircle className="w-4 h-4 text-slate-500" />
                        WhatsApp *
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="51 98182-9086"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="border-slate-300 focus:border-teal-500 focus:ring-teal-500"
                      />
                      <p className="text-xs text-slate-500">
                        Enviaremos o link do relatório completo por WhatsApp
                      </p>
                    </div>
                  </div>

                  {/* Optional Info */}
                  <details className="group">
                    <summary className="cursor-pointer text-sm text-slate-600 hover:text-slate-900 flex items-center gap-2">
                      <span className="group-open:hidden">+ Adicionar mais informações (opcional)</span>
                      <span className="hidden group-open:inline">- Ocultar informações opcionais</span>
                    </summary>
                    <div className="mt-4 space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="company">Empresa</Label>
                          <Input
                            id="company"
                            name="company"
                            type="text"
                            placeholder="Nome da empresa"
                            value={formData.company}
                            onChange={handleInputChange}
                            className="border-slate-300"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="budget">Orçamento Estimado</Label>
                          <Select onValueChange={(value) => handleSelectChange('budget', value)}>
                            <SelectTrigger className="border-slate-300">
                              <SelectValue placeholder="Selecione..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="under-500">Até R$ 500</SelectItem>
                              <SelectItem value="500-1000">R$ 500 - R$ 1.000</SelectItem>
                              <SelectItem value="1000-3000">R$ 1.000 - R$ 3.000</SelectItem>
                              <SelectItem value="3000-5000">R$ 3.000 - R$ 5.000</SelectItem>
                              <SelectItem value="above-5000">Acima de R$ 5.000</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="goals">Objetivos Principais</Label>
                        <Textarea
                          id="goals"
                          name="goals"
                          placeholder="Ex: Aumentar tráfego orgânico, melhorar posicionamento..."
                          value={formData.goals}
                          onChange={handleInputChange}
                          rows={2}
                          className="border-slate-300"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="competitors">Concorrentes (opcional)</Label>
                        <Textarea
                          id="competitors"
                          name="competitors"
                          placeholder="Liste URLs de concorrentes..."
                          value={formData.competitors}
                          onChange={handleInputChange}
                          rows={2}
                          className="border-slate-300"
                        />
                      </div>
                    </div>
                  </details>

                  {error && (
                    <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
                      <AlertCircle className="w-4 h-4" />
                      {error}
                    </div>
                  )}

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Analisando seu site...
                      </>
                    ) : (
                      <>
                        <Search className="w-5 h-5 mr-2" />
                        Liberar Análise Gratuita
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-center text-slate-500">
                    Ao continuar, você concorda em receber comunicações da Orion Growth Studio.
                  </p>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            {/* Benefits */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg text-slate-900">O que você recebe</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <benefit.icon className="w-5 h-5 text-teal-500 mt-0.5 shrink-0" />
                    <div>
                      <div className="font-medium text-sm text-slate-900">{benefit.title}</div>
                      <div className="text-xs text-slate-500">{benefit.description}</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Trust Badge */}
            <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-0 text-white">
              <CardContent className="pt-6 text-center">
                <Shield className="w-12 h-12 mx-auto mb-4 text-teal-400" />
                <h3 className="font-semibold mb-2">Seus dados seguros</h3>
                <p className="text-sm text-slate-300">
                  Utilizamos suas informações apenas para entregar sua análise e melhorar nossos serviços.
                </p>
              </CardContent>
            </Card>

            {/* Contact CTA */}
            <Card className="bg-emerald-50 border-emerald-200">
              <CardContent className="pt-6 text-center">
                <MessageCircle className="w-10 h-10 mx-auto mb-3 text-emerald-600" />
                <h3 className="font-semibold text-emerald-800 mb-2">Prefere falar direto?</h3>
                <a 
                  href="https://wa.me/5551981829086?text=Olá! Gostaria de saber mais sobre a análise de site." 
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                    Chamar no WhatsApp
                  </Button>
                </a>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
