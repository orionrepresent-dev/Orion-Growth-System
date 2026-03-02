'use client'

import { useState, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  Search,
  ArrowLeft,
  Download,
  Share2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  TrendingUp,
  Globe,
  Zap,
  Brain,
  ExternalLink,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Target,
  DollarSign,
  BarChart3,
  Rocket,
  MessageCircle,
  Send,
  Loader2,
  Mail,
  Phone
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'

interface AnalysisResult {
  url: string
  analyzedAt: string
  overallScore: number
  scores: { seo: number; aeo: number; geo: number }
  seoAnalysis: { score: number; findings: { category: string; status: 'good' | 'warning' | 'error'; message: string; details?: string }[]; recommendations: string[] }
  aeoAnalysis: { score: number; findings: { category: string; status: 'good' | 'warning' | 'error'; message: string }[]; recommendations: string[] }
  geoAnalysis: { score: number; findings: { category: string; status: 'good' | 'warning' | 'error'; message: string }[]; recommendations: string[] }
  topRecommendations: { priority: 'high' | 'medium' | 'low'; title: string; description: string; impact: string }[]
  quote: { minPrice: number; maxPrice: number; services: string[] }
  competitors?: { url: string; score: number; strengths: string[] }[]
}

interface FormData {
  name: string
  email: string
  phone?: string
  company?: string
  url: string
  goals?: string
  competitors?: string
  budget?: string
  timeline?: string
}

const fadeInUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 } }

const getScoreColor = (score: number) => {
  if (score >= 80) return 'text-emerald-500'
  if (score >= 60) return 'text-yellow-500'
  if (score >= 40) return 'text-orange-500'
  return 'text-red-500'
}

const getScoreGradient = (score: number) => {
  if (score >= 80) return 'from-emerald-500 to-teal-500'
  if (score >= 60) return 'from-yellow-500 to-amber-500'
  if (score >= 40) return 'from-orange-500 to-amber-500'
  return 'from-red-500 to-orange-500'
}

const getStatusIcon = (status: 'good' | 'warning' | 'error') => {
  switch (status) {
    case 'good': return <CheckCircle2 className="w-5 h-5 text-emerald-500" />
    case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />
    case 'error': return <XCircle className="w-5 h-5 text-red-500" />
  }
}

const getPriorityBadge = (priority: 'high' | 'medium' | 'low') => {
  switch (priority) {
    case 'high': return <Badge variant="destructive">Alta Prioridade</Badge>
    case 'medium': return <Badge variant="secondary">Média Prioridade</Badge>
    case 'low': return <Badge variant="outline">Baixa Prioridade</Badge>
  }
}

// WhatsApp Floating Button Component
function WhatsAppButton({ phone, message }: { phone: string; message: string }) {
  const whatsappUrl = `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
  
  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 1, type: 'spring' }}
      className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 group"
    >
      <MessageCircle className="w-6 h-6" />
      <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 whitespace-nowrap font-medium">
        Falar com Especialista
      </span>
    </motion.a>
  )
}

export default function ResultsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')
  const [showAllRecommendations, setShowAllRecommendations] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  // Get data from sessionStorage
  const { results, formData, shouldRedirect } = useMemo(() => {
    if (typeof window === 'undefined') return { results: null, formData: null, shouldRedirect: false }
    
    const storedResults = sessionStorage.getItem('analysisResults')
    const storedFormData = sessionStorage.getItem('analysisFormData')

    if (!storedResults) return { results: null, formData: null, shouldRedirect: true }

    try {
      return {
        results: JSON.parse(storedResults) as AnalysisResult,
        formData: storedFormData ? JSON.parse(storedFormData) : null,
        shouldRedirect: false
      }
    } catch {
      return { results: null, formData: null, shouldRedirect: true }
    }
  }, [])

  // Save lead automatically
  useEffect(() => {
    if (results && formData && !saved) {
      saveLead()
    }
  }, [results, formData])

  const saveLead = async () => {
    if (!formData || saved) return
    
    setSaving(true)
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'analysis',
          data: formData,
          quote: results?.quote
        })
      })
      
      if (response.ok) {
        setSaved(true)
        console.log('Lead salvo com sucesso!')
      }
    } catch (error) {
      console.error('Erro ao salvar lead:', error)
    } finally {
      setSaving(false)
    }
  }

  const sendEmailToClient = async () => {
    if (!formData || !results) return
    
    setSaving(true)
    try {
      const response = await fetch('/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: formData.email,
          subject: 'Sua Análise SEO - Growth Business Copilot',
          leadData: formData,
          analysisResult: results
        })
      })
      
      if (response.ok) {
        setEmailSent(true)
        alert(`Relatório enviado para ${formData.email}! Verifique sua caixa de entrada.`)
      }
    } catch (error) {
      console.error('Erro ao enviar email:', error)
    } finally {
      setSaving(false)
    }
  }

  if (shouldRedirect) {
    router.push('/analyze')
    return null
  }

  if (!results) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-violet-500 animate-pulse" />
          <p className="text-muted-foreground">Carregando resultados...</p>
        </div>
      </div>
    )
  }

  const whatsappMessage = `Olá! Sou ${formData?.name || 'Cliente'} e gostaria de falar sobre a análise do meu site: ${results.url}\n\nScore Geral: ${results.overallScore}/100\nOrçamento: R$ ${results.quote.minPrice} - R$ ${results.quote.maxPrice}`

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={sendEmailToClient} disabled={saving || emailSent}>
                {emailSent ? <CheckCircle2 className="w-4 h-4 mr-2" /> : <Mail className="w-4 h-4 mr-2" />}
                {emailSent ? 'Enviado!' : 'Receber por Email'}
              </Button>
              <Link href="/analyze">
                <Button size="sm" className="bg-gradient-to-r from-purple-600 to-violet-600">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Nova Análise
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
        {/* Lead Saved Notification */}
        {saved && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-lg flex items-center gap-3"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <span className="text-emerald-700 dark:text-emerald-300">
              Suas informações foram enviadas para nossa equipe! Entraremos em contato em até 24h.
            </span>
          </motion.div>
        )}

        {/* URL Info */}
        <motion.div initial="initial" animate="animate" variants={fadeInUp} className="mb-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Globe className="w-4 h-4" />
            <span>Análise realizada em {new Date(results.analyzedAt).toLocaleString('pt-BR')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Resultado da Análise</h1>
          <div className="flex items-center gap-2">
            <a href={results.url} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-700 flex items-center gap-1">
              {results.url}
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </motion.div>

        {/* Main Score Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-8">
          <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white overflow-hidden relative">
            <CardContent className="relative pt-8 pb-8">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                <div className="text-center lg:text-left">
                  <p className="text-slate-400 mb-2">Pontuação Geral</p>
                  <div className="flex items-center gap-4">
                    <div className={`text-6xl sm:text-7xl font-bold bg-gradient-to-r ${getScoreGradient(results.overallScore)} bg-clip-text text-transparent`}>
                      {results.overallScore}
                    </div>
                    <div className="text-slate-400 text-2xl">/100</div>
                  </div>
                  <p className="text-slate-400 mt-2">
                    {results.overallScore >= 80 ? 'Excelente! Seu site está bem otimizado.' :
                     results.overallScore >= 60 ? 'Bom, mas há espaço para melhorias.' :
                     results.overallScore >= 40 ? 'Atenção necessária. Várias melhorias possíveis.' :
                     'Crítico. Seu site precisa de otimização urgente.'}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-6 w-full lg:w-auto">
                  {[
                    { label: 'SEO', score: results.scores.seo, Icon: Search, color: 'text-purple-500' },
                    { label: 'AEO', score: results.scores.aeo, Icon: Zap, color: 'text-blue-500' },
                    { label: 'GEO', score: results.scores.geo, Icon: Brain, color: 'text-violet-500' }
                  ].map(({ label, score, Icon, color }) => (
                    <div key={label} className="text-center">
                      <div className="w-20 h-20 mx-auto mb-2 relative">
                        <svg className="w-20 h-20 transform -rotate-90">
                          <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="none" className="text-slate-700" />
                          <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="none" strokeDasharray={`${score * 2.26} 226`} className={getScoreColor(score)} />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Icon className={`w-6 h-6 ${color}`} />
                        </div>
                      </div>
                      <p className="text-slate-400 text-xs">{label}</p>
                      <p className={`font-bold ${getScoreColor(score)}`}>{score}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
            <TabsTrigger value="aeo">AEO</TabsTrigger>
            <TabsTrigger value="geo">GEO</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Quote Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className="bg-gradient-to-r from-purple-600 to-violet-600 border-0 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Orçamento Estimado
                  </CardTitle>
                  <CardDescription className="text-white/80">Para implementação completa das melhorias</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold mb-4">
                    R$ {results.quote.minPrice.toLocaleString('pt-BR')} - R$ {results.quote.maxPrice.toLocaleString('pt-BR')}
                  </div>
                  <div className="space-y-2 mb-6">
                    {results.quote.services.map((service, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-white/90">
                        <CheckCircle2 className="w-4 h-4 text-white/70" />
                        {service}
                      </div>
                    ))}
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <a 
                      href={`https://wa.me/5551981829086?text=${encodeURIComponent(whatsappMessage)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button size="lg" className="w-full bg-green-500 hover:bg-green-600">
                        <MessageCircle className="w-5 h-5 mr-2" />
                        WhatsApp Imediato
                      </Button>
                    </a>
                    <Link href="/builder">
                      <Button size="lg" variant="secondary" className="w-full">
                        <Send className="w-5 h-5 mr-2" />
                        Solicitar Proposta
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-500" />
                  Recomendações Priorizadas
                </CardTitle>
                <CardDescription>Ações que terão maior impacto na sua pontuação</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(showAllRecommendations ? results.topRecommendations : results.topRecommendations.slice(0, 3)).map((rec, index) => (
                    <div key={index} className="p-4 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h4 className="font-medium">{rec.title}</h4>
                        {getPriorityBadge(rec.priority)}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{rec.description}</p>
                      <p className="text-xs text-purple-600 font-medium">
                        <TrendingUp className="w-3 h-3 inline mr-1" />
                        {rec.impact}
                      </p>
                    </div>
                  ))}
                </div>
                {results.topRecommendations.length > 3 && (
                  <Button variant="ghost" className="w-full mt-4" onClick={() => setShowAllRecommendations(!showAllRecommendations)}>
                    {showAllRecommendations ? <><ChevronUp className="w-4 h-4 mr-2" /> Ver menos</> : <><ChevronDown className="w-4 h-4 mr-2" /> Ver todas as {results.topRecommendations.length} recomendações</>}
                  </Button>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* SEO, AEO, GEO Tabs */}
          {[
            { value: 'seo', label: 'SEO', analysis: results.seoAnalysis, icon: Search, color: 'text-purple-500' },
            { value: 'aeo', label: 'AEO', analysis: results.aeoAnalysis, icon: Zap, color: 'text-blue-500' },
            { value: 'geo', label: 'GEO', analysis: results.geoAnalysis, icon: Brain, color: 'text-violet-500' }
          ].map(({ value, label, analysis, icon: Icon, color }) => (
            <TabsContent key={value} value={value}>
              <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2"><Icon className={`w-5 h-5 ${color}`} />Análise {label}</CardTitle>
                      <div className={`text-3xl font-bold ${getScoreColor(analysis.score)}`}>{analysis.score}</div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Progress value={analysis.score} className="h-3 mb-6" />
                    <div className="space-y-3">
                      {analysis.findings.map((finding, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                          {getStatusIcon(finding.status)}
                          <div>
                            <div className="font-medium text-sm">{finding.category}</div>
                            <div className="text-xs text-muted-foreground">{finding.message}</div>
                            {'details' in finding && finding.details && <div className="text-xs text-muted-foreground mt-1">{finding.details}</div>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader><CardTitle>Recomendações {label}</CardTitle></CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[400px] pr-4">
                      <div className="space-y-2">
                        {analysis.recommendations.map((rec, index) => (
                          <div key={index} className="flex items-start gap-2 p-2 rounded hover:bg-muted/30">
                            <CheckCircle2 className={`w-4 h-4 ${color} mt-0.5 shrink-0`} />
                            <span className="text-sm">{rec}</span>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* ICP Analysis CTA */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-8">
          <Card className="bg-gradient-to-br from-purple-600 to-violet-700 text-white border-0 overflow-hidden relative">
            <div className="absolute inset-0 bg-[url('/hero-bg.png')] bg-cover bg-center opacity-10" />
            <CardContent className="relative pt-8 pb-8">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                    <Brain className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-1">Análise ICP Avançada</h3>
                    <p className="text-white/80">
                      Descubra seu cliente ideal com análise de mercado, concorrentes, regionalismos e tendências.
                    </p>
                  </div>
                </div>
                <Button
                  size="lg"
                  variant="secondary"
                  className="shrink-0"
                  onClick={() => {
                    if (formData) {
                      sessionStorage.setItem('icpFormData', JSON.stringify({
                        businessName: formData.company || 'Minha Empresa',
                        industry: 'Tecnologia',
                        description: formData.goals || '',
                        website: formData.url || '',
                        mainProducts: '',
                        valueProposition: '',
                        competitors: formData.competitors || '',
                        targetAudience: ''
                      }))
                      router.push('/icp')
                    }
                  }}
                >
                  <Target className="w-5 h-5 mr-2" />
                  Analisar ICP Agora
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* CTA - Análise Completa em PDF */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="mt-8">
          <Card className="border-2 border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50 overflow-hidden">
            <CardContent className="pt-8 pb-8">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shrink-0 shadow-lg">
                    <Download className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <Badge className="bg-amber-100 text-amber-800 mb-2">Recomendações de ajuste em PDF</Badge>
                    <h3 className="text-2xl font-bold text-slate-900 mb-1">Análise Completa do Site</h3>
                    <p className="text-slate-600">
                      Receba um documento completo com todas as recomendações detalhadas, 
                      prioridades de implementação e estimativa de resultados.
                    </p>
                  </div>
                </div>
                <div className="text-center lg:text-right shrink-0">
                  <div className="text-3xl font-bold text-slate-900 mb-1">R$ 297</div>
                  <p className="text-sm text-slate-500 mb-3">Análise completa em PDF</p>
                  <a 
                    href="https://wa.me/5551981829086?text=Olá! Vi a análise do meu site e gostaria de adquirir a Análise Completa em PDF por R$ 297."
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button size="lg" className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white">
                      <Download className="w-5 h-5 mr-2" />
                      Quero a Análise Completa
                    </Button>
                  </a>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-amber-200">
                <p className="text-sm text-slate-600 mb-3">O que está incluso:</p>
                <div className="grid sm:grid-cols-3 gap-3">
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-amber-500" />
                    <span>Todas as recomendações detalhadas</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-amber-500" />
                    <span>Prioridades de implementação</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-amber-500" />
                    <span>Estimativa de resultados por ação</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-amber-500" />
                    <span>Checklist de implementação</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-amber-500" />
                    <span>Comparativo com concorrentes</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-amber-500" />
                    <span>Suporte para dúvidas via WhatsApp</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Final CTA */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mt-8">
          <Card className="bg-slate-900 text-white">
            <CardContent className="pt-8 pb-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Quer Melhorar Seu Site Agora?</h2>
              <p className="text-slate-400 mb-6 max-w-xl mx-auto">Nossa equipe está pronta para implementar todas as recomendações.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a href={`https://wa.me/5511999999999?text=${encodeURIComponent(whatsappMessage)}`} target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="bg-green-500 hover:bg-green-600">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Falar no WhatsApp
                  </Button>
                </a>
                <Link href="/builder">
                  <Button size="lg" variant="outline" className="border-slate-700 text-white hover:bg-slate-800">
                    <Send className="w-5 h-5 mr-2" />
                    Briefing Completo
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>

      {/* Floating WhatsApp Button */}
      <WhatsAppButton phone="5551981829086" message={whatsappMessage} />
    </div>
  )
}
