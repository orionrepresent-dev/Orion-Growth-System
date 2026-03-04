'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import {
  ArrowRight,
  Check,
  RefreshCw,
  Edit3,
  X,
  Settings,
  Bot,
  ThumbsUp,
  Zap,
  Clock,
  Brain,
  Target,
  TrendingUp,
  Shield,
  Eye,
  BarChart3,
  Sparkles,
  MessageSquare,
  Calendar,
  Play,
  CheckCircle2,
  XCircle,
  Menu,
  Globe,
  Users,
  Award,
  Lightbulb,
  Layers,
  Search
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { OneClickActionCard, type OneClickContent } from '@/components/ui/one-click-card'

// ==================== DATA ====================

const friendlyPillars = [
  {
    icon: BarChart3,
    title: 'Análise',
    description: 'Entende contexto automaticamente',
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-50'
  },
  {
    icon: Sparkles,
    title: 'Projeção',
    description: 'Antecipa necessidades futuras',
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-50'
  },
  {
    icon: Settings,
    title: 'Correção',
    description: 'Ajusta automaticamente',
    color: 'from-amber-500 to-orange-500',
    bgColor: 'bg-amber-50'
  },
  {
    icon: RefreshCw,
    title: 'Adequação',
    description: 'Adapta a mudanças',
    color: 'from-teal-500 to-emerald-500',
    bgColor: 'bg-teal-50'
  },
  {
    icon: CheckCircle2,
    title: 'Padronização',
    description: 'Mantém qualidade',
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-50'
  },
  {
    icon: Eye,
    title: 'Monitoramento',
    description: 'Trabalha 24/7',
    color: 'from-indigo-500 to-blue-500',
    bgColor: 'bg-indigo-50'
  },
  {
    icon: Brain,
    title: 'Aprendizado',
    description: 'Evolui com feedback',
    color: 'from-rose-500 to-pink-500',
    bgColor: 'bg-rose-50'
  }
]

const howItWorksSteps = [
  {
    step: '1',
    title: 'Setup Único',
    subtitle: '5 minutos',
    description: 'Conta sobre seu negócio, público e objetivos',
    icon: Settings,
    color: 'from-slate-700 to-slate-800'
  },
  {
    step: '2',
    title: 'IA Trabalha',
    subtitle: '24/7',
    description: 'Monitora seu mercado e cria conteúdo automaticamente',
    icon: Bot,
    color: 'from-teal-500 to-emerald-500'
  },
  {
    step: '3',
    title: 'Você Aprova',
    subtitle: '1 clique',
    description: 'Revisa e aprova com um clique. Simples assim.',
    icon: ThumbsUp,
    color: 'from-emerald-500 to-green-500'
  }
]

const comparisonItems = [
  {
    traditional: 'Gera quando você pede',
    friendly: 'Gera ANTES de você precisar'
  },
  {
    traditional: 'Mesmo resultado sempre',
    friendly: 'Evolui e melhora com o tempo'
  },
  {
    traditional: 'Você configura toda vez',
    friendly: 'Setup único, valor contínuo'
  },
  {
    traditional: 'Sem memória do que funciona',
    friendly: 'Aprende com seu feedback'
  },
  {
    traditional: 'Reativo: espera seu comando',
    friendly: 'Proativo: antecipa suas necessidades'
  }
]

const plans = [
  {
    name: 'Starter',
    price: 'R$ 497',
    period: '/mês',
    headline: 'Friendly Automation básico',
    description: 'Para quem quer começar a automatizar',
    benefits: [
      '5 posts automáticos/semana',
      'Análise de tendências',
      'Aprovação por WhatsApp',
      'Relatório semanal'
    ],
    cta: 'Começar agora',
    color: 'from-slate-600 to-slate-700',
    borderColor: 'border-slate-200'
  },
  {
    name: 'Growth',
    price: 'R$ 997',
    period: '/mês',
    headline: 'Friendly Automation completo',
    description: 'Para quem quer resultados consistentes',
    benefits: [
      'Tudo do Starter +',
      'Business Audience completo',
      '3 posts + 2 artigos/semana',
      'Análise de concorrentes',
      'Dashboard em tempo real',
      'Sugestões proativas'
    ],
    cta: 'Escolher Growth',
    color: 'from-teal-500 to-emerald-600',
    borderColor: 'border-teal-300',
    popular: true
  },
  {
    name: 'Domination',
    price: 'R$ 1.497',
    period: '/mês',
    headline: 'Friendly Automation + Consultor',
    description: 'Para quem quer dominar o mercado',
    benefits: [
      'Tudo do Growth +',
      'Consultor dedicado',
      'Estratégia personalizada',
      'Relatórios em vídeo',
      'Suporte prioritário',
      'Campanhas pagas inclusas'
    ],
    cta: 'Dominar meu mercado',
    color: 'from-violet-500 to-purple-600',
    borderColor: 'border-violet-200'
  }
]

// Demo content for One-Click Actions
const demoContent: OneClickContent[] = [
  {
    id: '1',
    type: 'post',
    title: '5 estratégias de IA para seu negócio',
    preview: 'Descubra como a inteligência artificial está transformando pequenas empresas e como você pode aplicar hoje mesmo...',
    scheduledFor: 'Amanhã, 10:00',
    platform: 'linkedin',
    hashtags: ['IA', 'Negócios', 'Inovação', 'Crescimento']
  },
  {
    id: '2',
    type: 'article',
    title: 'Guia completo de SEO para 2024',
    preview: 'As últimas atualizações do Google mudaram tudo. Veja o que funciona agora e como adaptar sua estratégia...',
    platform: 'blog',
    hashtags: ['SEO', 'Marketing', 'Google']
  },
  {
    id: '3',
    type: 'post',
    title: 'Cliente satisfeito: +340% em agendamentos',
    preview: 'Rosangela do Salão Bela tinha dificuldade em atrair clientes. Veja como transformamos seu negócio...',
    scheduledFor: 'Quarta, 14:00',
    platform: 'instagram',
    hashtags: ['Depoimento', 'Resultado', 'Sucesso']
  }
]

// ==================== COMPONENTS ====================

function DemoOneClickSection() {
  const [approved, setApproved] = useState<string[]>([])
  const [feedback, setFeedback] = useState<Record<string, string>>({})

  const handleApprove = (id: string) => {
    setApproved([...approved, id])
  }

  const handleFeedback = (id: string, fb: string) => {
    setFeedback({ ...feedback, [id]: fb })
  }

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 border border-slate-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/20 flex items-center justify-center">
            <Bot className="w-5 h-5 text-teal-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold">Conteúdo Preparado</h3>
            <p className="text-slate-400 text-sm">Preparei 3 conteúdos para você</p>
          </div>
        </div>
        <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
          {approved.length}/{demoContent.length} aprovados
        </Badge>
      </div>

      {/* Content cards */}
      <div className="space-y-4">
        {demoContent.map((content) => (
          approved.includes(content.id) ? (
            <motion.div
              key={content.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 flex items-center gap-3"
            >
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              <div>
                <p className="text-emerald-300 font-medium">{content.title}</p>
                <p className="text-emerald-400/70 text-sm">Aprovado e agendado!</p>
              </div>
            </motion.div>
          ) : (
            <OneClickActionCard
              key={content.id}
              content={content}
              onApprove={() => handleApprove(content.id)}
              onVariation={() => {}}
              onEdit={() => {}}
              onSkip={() => setApproved([...approved, content.id])}
              onFeedback={(fb) => handleFeedback(content.id, fb)}
              className="bg-slate-800/50 border-slate-700"
            />
          )
        ))}
      </div>

      {/* Summary actions */}
      <div className="mt-6 pt-6 border-t border-slate-700 flex items-center justify-between">
        <p className="text-slate-400 text-sm">
          {approved.length === demoContent.length 
            ? '🎉 Todo conteúdo aprovado!' 
            : `${demoContent.length - approved.length} conteúdo${demoContent.length - approved.length > 1 ? 's' : ''} restante${demoContent.length - approved.length > 1 ? 's' : ''}`}
        </p>
        {approved.length > 0 && approved.length < demoContent.length && (
          <Button 
            className="bg-emerald-500 hover:bg-emerald-600 text-white"
            onClick={() => setApproved(demoContent.map(c => c.id))}
          >
            <Check className="w-4 h-4 mr-2" />
            Aprovar todos
          </Button>
        )}
      </div>
    </div>
  )
}

// ==================== MAIN PAGE ====================

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3">
              <Image 
                src="/logo.png" 
                alt="Orion Growth Studio" 
                width={140} 
                height={40}
                className="h-8 w-auto"
                priority
              />
            </Link>
            
            <div className="hidden md:flex items-center gap-6">
              <a href="#como-funciona" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                Como funciona
              </a>
              <a href="#pilares" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                Pilares
              </a>
              <a href="#planos" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                Planos
              </a>
            </div>

            <div className="hidden md:flex items-center gap-3">
              <Link href="/analyze">
                <Button variant="outline" size="sm" className="border-teal-500 text-teal-600 hover:bg-teal-50">
                  <Search className="w-4 h-4 mr-1" />
                  Análise grátis
                </Button>
              </Link>
              <Link href="/business-audience">
                <Button size="sm" className="bg-slate-900 hover:bg-slate-800 text-white">
                  Business Audience
                </Button>
              </Link>
            </div>

            <button
              className="md:hidden p-2 text-slate-600"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-white border-b border-slate-200"
          >
            <div className="px-4 py-4 space-y-4">
              <a href="#como-funciona" className="block text-sm font-medium text-slate-700">Como funciona</a>
              <a href="#pilares" className="block text-sm font-medium text-slate-700">Pilares</a>
              <a href="#planos" className="block text-sm font-medium text-slate-700">Planos</a>
              <div className="pt-4 space-y-2">
                <Link href="/business-audience" className="block">
                  <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white">
                    Business Audience
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </nav>

      {/* ==================== HERO - FRIENDLY AUTOMATION ==================== */}
      <section className="pt-20 pb-16 md:pt-28 md:pb-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Texto */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge className="bg-teal-500/20 text-teal-300 border-teal-500/30 mb-4 px-4 py-1.5 text-sm">
                <Zap className="w-4 h-4 mr-2" />
                Friendly Automation™
              </Badge>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Configure uma vez.
                <span className="block text-teal-400">A IA trabalha para você.</span>
              </h1>
              
              <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                Enquanto outras ferramentas esperam você pedir, o Growth Studio já preparou tudo. 
                <span className="text-white font-medium"> Você só aprova.</span>
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/business-audience">
                  <Button size="lg" className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-6 text-lg font-semibold">
                    <Play className="w-5 h-5 mr-2" />
                    Experimentar agora
                  </Button>
                </Link>
                <Link href="/analyze">
                  <Button size="lg" variant="outline" className="border-slate-600 text-white hover:bg-slate-700 px-6 py-6">
                    <Search className="w-5 h-5 mr-2" />
                    Análise grátis
                  </Button>
                </Link>
              </div>

              {/* Trust badges */}
              <div className="mt-10 flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <Check className="w-4 h-4 text-teal-400" />
                  <span>Setup em 5 min</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <Check className="w-4 h-4 text-teal-400" />
                  <span>IA trabalha 24/7</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <Check className="w-4 h-4 text-teal-400" />
                  <span>Aprovação com 1 clique</span>
                </div>
              </div>
            </motion.div>

            {/* Visual: Setup único → Valor contínuo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="bg-slate-800/50 border-slate-700 overflow-hidden">
                <CardContent className="p-6">
                  {/* Timeline visual */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center">
                        <Settings className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm">Setup</p>
                        <p className="text-slate-400 text-xs">5 minutos</p>
                      </div>
                    </div>
                    
                    <div className="flex-1 h-0.5 bg-gradient-to-r from-teal-500 via-teal-500/50 to-teal-500/20 mx-4" />
                    
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm">Valor contínuo</p>
                        <p className="text-slate-400 text-xs">Para sempre</p>
                      </div>
                    </div>
                  </div>

                  {/* Progress indicator */}
                  <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-400">Progresso do setup</span>
                      <span className="text-sm text-teal-400 font-medium">1/3</span>
                    </div>
                    <Progress value={33} className="h-2" />
                  </div>

                  {/* Preview cards */}
                  <div className="space-y-2">
                    {['Conteúdo automático preparado', 'Tendências detectadas', 'Sugestões de melhoria'].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 bg-slate-900/30 rounded-lg p-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          i === 0 ? 'bg-emerald-500' : 'bg-slate-700'
                        }`}>
                          {i === 0 ? (
                            <Check className="w-3 h-3 text-white" />
                          ) : (
                            <div className="w-2 h-2 rounded-full bg-slate-500" />
                          )}
                        </div>
                        <span className={`text-sm ${i === 0 ? 'text-white' : 'text-slate-500'}`}>
                          {item}
                        </span>
                        {i === 0 && (
                          <Badge className="ml-auto bg-teal-500/20 text-teal-300 border-0 text-xs">
                            Novo
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ==================== COMO FUNCIONA ==================== */}
      <section id="como-funciona" className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="bg-teal-100 text-teal-700 border-teal-200 mb-4">
              <Layers className="w-4 h-4 mr-2" />
              Como Funciona
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Simples como uma cafeteira
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Você abastece uma vez. A IA aprende, antecipa e prepara tudo. Você só aprova.
            </p>
          </motion.div>

          {/* Visual Steps */}
          <div className="relative">
            {/* Connection line */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-slate-200 via-teal-200 to-emerald-200 transform -translate-y-1/2 z-0" />
            
            <div className="grid md:grid-cols-3 gap-8 relative z-10">
              {howItWorksSteps.map((step, index) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                  className="relative"
                >
                  <Card className="border-slate-200 overflow-hidden hover:shadow-lg transition-shadow">
                    <div className={`h-2 bg-gradient-to-r ${step.color}`} />
                    <CardContent className="p-6">
                      {/* Step number */}
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-4`}>
                        <step.icon className="w-7 h-7 text-white" />
                      </div>
                      
                      <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">
                        Passo {step.step}
                      </span>
                      <h3 className="text-xl font-bold text-slate-900 mt-2 mb-1">{step.title}</h3>
                      <p className="text-sm text-teal-500 font-medium mb-2">{step.subtitle}</p>
                      <p className="text-slate-600 text-sm">{step.description}</p>
                    </CardContent>
                  </Card>
                  
                  {/* Arrow between steps */}
                  {index < howItWorksSteps.length - 1 && (
                    <div className="hidden lg:flex absolute top-1/2 -right-4 transform -translate-y-1/2 z-20">
                      <ArrowRight className="w-8 h-8 text-teal-400" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Value proposition */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <div className="inline-flex items-center gap-4 bg-gradient-to-r from-teal-50 to-emerald-50 rounded-2xl px-8 py-4 border border-teal-200">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-teal-600" />
                <span className="text-slate-700 font-medium">Setup único:</span>
                <span className="text-teal-600 font-bold">5 minutos</span>
              </div>
              <div className="w-px h-6 bg-teal-200" />
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                <span className="text-slate-700 font-medium">Valor:</span>
                <span className="text-emerald-600 font-bold">contínuo</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ==================== ONE-CLICK ACTIONS DEMO ==================== */}
      <section className="py-16 md:py-24 bg-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="bg-purple-100 text-purple-700 border-purple-200 mb-4">
              <MessageSquare className="w-4 h-4 mr-2" />
              One-Click Actions
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Você só aprova. A IA faz o resto.
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Experimente agora: a IA já preparou conteúdo para você. Clique em aprovar, variar ou editar.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <DemoOneClickSection />
          </motion.div>
        </div>
      </section>

      {/* ==================== 7 PILARES ==================== */}
      <section id="pilares" className="py-16 md:py-24 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Os 7 Pilares da Friendly Automation
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Cada pilar trabalha junto para entregar valor contínuo sem você precisar pedir.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
            {friendlyPillars.map((pilar, index) => (
              <motion.div
                key={pilar.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-800 rounded-2xl p-4 border border-slate-700 hover:border-slate-600 transition-all hover:-translate-y-1"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${pilar.color} flex items-center justify-center mb-3`}>
                  <pilar.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-semibold text-sm mb-1">{pilar.title}</h3>
                <p className="text-slate-400 text-xs">{pilar.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== COMPARATIVO ==================== */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Tradicional vs Friendly Automation
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              A diferença está em quem faz o trabalho pesado.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              {/* Traditional */}
              <div className="bg-red-50 rounded-2xl p-4 border border-red-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                    <XCircle className="w-4 h-4 text-red-500" />
                  </div>
                  <h3 className="font-bold text-red-700">Tradicional</h3>
                </div>
              </div>
              
              {/* Friendly */}
              <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  </div>
                  <h3 className="font-bold text-emerald-700">Friendly Automation</h3>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {comparisonItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="grid md:grid-cols-2 gap-4"
                >
                  <div className="bg-red-50 rounded-xl p-3 border border-red-100">
                    <p className="text-red-700 text-sm">{item.traditional}</p>
                  </div>
                  <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-100">
                    <p className="text-emerald-700 text-sm font-medium">{item.friendly}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ==================== PLANOS ==================== */}
      <section id="planos" className="py-16 md:py-24 bg-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Escolha seu nível de automação
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Todos os planos incluem Friendly Automation. A diferença é a intensidade.
            </p>
          </motion.div>

          {/* Cards de Planos */}
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative rounded-2xl border-2 ${plan.borderColor} bg-white overflow-hidden ${
                  plan.popular ? 'ring-2 ring-teal-300 ring-offset-2 scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-teal-500 to-emerald-500 text-white text-center py-1.5 text-sm font-semibold">
                    Mais escolhido
                  </div>
                )}

                <div className={`p-6 ${plan.popular ? 'pt-10' : ''}`}>
                  <h3 className="text-2xl font-bold text-slate-900 mb-1">{plan.name}</h3>

                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-4xl font-bold text-slate-900">{plan.price}</span>
                    <span className="text-slate-500">{plan.period}</span>
                  </div>

                  <p className={`text-lg font-semibold mb-2 bg-gradient-to-r ${plan.color} bg-clip-text text-transparent`}>
                    {plan.headline}
                  </p>

                  <p className="text-sm text-slate-600 mb-6">
                    {plan.description}
                  </p>

                  <ul className="space-y-3 mb-6">
                    {plan.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                        <CheckCircle2 className={`w-4 h-4 mt-0.5 shrink-0 ${
                          plan.popular ? 'text-teal-500' : 'text-slate-400'
                        }`} />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>

                  <Link href="/business-audience" className="block">
                    <Button 
                      className={`w-full bg-gradient-to-r ${plan.color} hover:opacity-90 text-white`}
                      size="lg"
                    >
                      {plan.cta}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Garantia */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <div className="inline-flex items-center gap-3 bg-white rounded-full px-6 py-3 border border-slate-200">
              <Shield className="w-5 h-5 text-teal-600" />
              <span className="text-sm text-slate-700">
                <strong>Garantia de 30 dias:</strong> se não gostar, devolvemos 100%.
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ==================== CTA FINAL ==================== */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Badge className="bg-teal-500/20 text-teal-300 border-teal-500/30 mb-4 px-4 py-1.5 text-sm">
              <Zap className="w-4 h-4 mr-2" />
              Pronto para começar?
            </Badge>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Pronto para parar de fazer<br />
              <span className="text-teal-400">manualmente?</span>
            </h2>
            
            <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
              Configure uma vez em 5 minutos e deixe a IA trabalhar 24/7 para você.
              Você só aprova com um clique.
            </p>

            <Link href="/business-audience">
              <Button size="lg" className="bg-teal-500 hover:bg-teal-600 text-white px-10 py-6 text-lg font-semibold">
                <Bot className="w-5 h-5 mr-2" />
                Ativar Friendly Automation
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>

            <p className="text-sm text-slate-400 mt-6">
              Sem cartão de crédito • Setup em 5 min • Cancele quando quiser
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Image 
                src="/logo.png" 
                alt="Orion Growth Studio" 
                width={120} 
                height={34}
                className="h-8 w-auto brightness-0 invert opacity-80"
              />
            </div>
            <p className="text-slate-500 text-sm">
              © {new Date().getFullYear()} Orion Growth Studio. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
