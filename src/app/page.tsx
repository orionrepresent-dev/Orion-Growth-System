'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Image from 'next/image'
import {
  Search,
  ArrowRight,
  CheckCircle2,
  Shield,
  Users,
  TrendingUp,
  Globe,
  Bot,
  MessageCircle,
  Calendar,
  Clock,
  ChevronDown,
  ChevronUp,
  Menu,
  X,
  Zap,
  MapPin,
  Phone,
  Star,
  BarChart3,
  Target,
  Eye,
  Layers,
  Award,
  Building2,
  MonitorSmartphone,
  MessageSquare,
  PenTool,
  LineChart,
  ArrowUpRight,
  CheckCheck,
  Sparkles,
  DollarSign,
  Mail,
  ExternalLink
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

// Animações
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: 'easeOut' }
}

// PILARES DA AUTORIDADE DIGITAL - Visual
const pilaresAutoridade = [
  {
    icon: Globe,
    title: 'Google',
    subtitle: 'SEO + Meu Negócio',
    description: 'Apareça nas buscas e no mapa',
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-600'
  },
  {
    icon: Users,
    title: 'Redes Sociais',
    subtitle: 'Gestão Completa',
    description: 'Conteúdo que conecta',
    color: 'from-pink-500 to-rose-500',
    bgColor: 'bg-pink-50',
    iconColor: 'text-pink-600'
  },
  {
    icon: MonitorSmartphone,
    title: 'Site Otimizado',
    subtitle: 'Performance & SEO',
    description: 'Conversão desde dia 1',
    color: 'from-violet-500 to-purple-600',
    bgColor: 'bg-violet-50',
    iconColor: 'text-violet-600'
  },
  {
    icon: Star,
    title: 'Avaliações',
    subtitle: 'Reputação Online',
    description: '5 estrelas atraem clientes',
    color: 'from-amber-500 to-orange-500',
    bgColor: 'bg-amber-50',
    iconColor: 'text-amber-600'
  },
  {
    icon: PenTool,
    title: 'Conteúdo',
    subtitle: 'Estratégia Editorial',
    description: 'Autoridade no seu nicho',
    color: 'from-emerald-500 to-teal-500',
    bgColor: 'bg-emerald-50',
    iconColor: 'text-emerald-600'
  }
]

// METODOLOGIA DE COMPETITIVIDADE - Visual Steps
const metodologiaSteps = [
  {
    step: '01',
    title: 'Diagnóstico',
    description: 'Analisamos sua presença atual e concorrentes',
    icon: Search
  },
  {
    step: '02',
    title: 'Estratégia',
    description: 'Criamos plano personalizado para seu negócio',
    icon: Target
  },
  {
    step: '03',
    title: 'Execução',
    description: 'Implementamos todas as ações necessárias',
    icon: Zap
  },
  {
    step: '04',
    title: 'Resultados',
    description: 'Medimos e otimizamos continuamente',
    icon: TrendingUp
  }
]

// Tiers de oferta
const plans = [
  {
    name: 'Presença Digital',
    price: 'R$ 497',
    period: '/mês',
    headline: 'Seu negócio aparece. Ponto.',
    description: 'Para quem está cansado de depender só de indicação.',
    benefits: [
      'Google Meu Negócio otimizado',
      '2 posts semanais nas redes sociais',
      'Relatório mensal de resultados',
      'Suporte por WhatsApp'
    ],
    idealFor: 'Para quem: "Ninguém me encontra"',
    cta: 'Começar a aparecer',
    color: 'from-slate-600 to-slate-700',
    bgColor: 'bg-slate-50',
    borderColor: 'border-slate-200'
  },
  {
    name: 'Autoridade Local',
    price: 'R$ 997',
    period: '/mês',
    headline: 'Você vira a referência na região.',
    description: 'Para quem quer ser a escolha óbvia.',
    benefits: [
      'Tudo do plano anterior, mais:',
      'Site ou landing page otimizada',
      'Gestão completa de redes sociais',
      'Análise de concorrentes',
      'Dashboard de resultados em tempo real'
    ],
    idealFor: 'Para quem: "Quero ser a primeira opção"',
    cta: 'Virar referência',
    color: 'from-teal-500 to-emerald-600',
    bgColor: 'bg-teal-50',
    borderColor: 'border-teal-200',
    popular: true
  },
  {
    name: 'Dominação de Mercado',
    price: 'R$ 1.497',
    period: '/mês',
    headline: 'Seus concorrentes param de ser problema.',
    description: 'Para quem quer ser inegável.',
    benefits: [
      'Tudo do plano anterior, mais:',
      'Estratégia completa de conteúdo',
      'Campanhas pagas (incluso até R$ 500)',
      'Consultor dedicado',
      'Relatórios quinzenais por vídeo'
    ],
    idealFor: 'Para quem: "Quero dominar"',
    cta: 'Dominar meu mercado',
    color: 'from-violet-500 to-purple-600',
    bgColor: 'bg-violet-50',
    borderColor: 'border-violet-200'
  }
]

// Serviços Complementares
const servicosComplementares = [
  {
    title: 'Site que Aparece no Google',
    price: 'R$ 1.997',
    period: 'único',
    icon: Globe,
    color: 'from-violet-500 to-purple-600',
    description: 'Site profissional criado do zero, otimizado para Google, buscas por voz e IA desde o dia 1.',
    benefits: ['Pronto em até 14 dias', 'SEO/AEO/GEO implementados', 'Hospedagem grátis 1 ano', 'Design que converte'],
    cta: 'Quero meu site'
  },
  {
    title: 'Tráfego Pago',
    price: 'R$ 997',
    period: '/mês + verba',
    icon: Zap,
    color: 'from-blue-500 to-cyan-500',
    description: 'Gestão completa de campanhas no Google Ads e Meta Ads. Escala real de resultados.',
    benefits: ['Google Ads + Meta Ads', 'Criação de anúncios', 'Otimização contínua', 'Relatórios semanais'],
    cta: 'Quero tráfego pago'
  },
  {
    title: 'Análise de Público-alvo',
    price: 'R$ 497',
    period: 'único',
    icon: Target,
    color: 'from-rose-500 to-pink-500',
    description: 'Mapeamento completo do seu cliente ideal e posicionamento competitivo no mercado.',
    benefits: ['ICP detalhado', 'Análise de concorrentes', 'Oportunidades de mercado', 'PDF executivo'],
    cta: 'Quero analisar meu público'
  },
  {
    title: 'Plano de Negócios',
    price: 'R$ 1.497',
    period: 'único',
    icon: Building2,
    color: 'from-amber-500 to-orange-500',
    description: 'Para quem quer empreender e não sabe por onde começar. Plano completo e executável.',
    benefits: ['Análise de viabilidade', 'Estratégia de entrada', 'Projeção financeira', 'Roadmap de execução'],
    cta: 'Quero meu plano'
  },
  {
    title: 'Mentoria Growth Business',
    price: 'R$ 797',
    period: '/mês',
    icon: LineChart,
    color: 'from-emerald-500 to-teal-500',
    description: 'Acompanhamento mensal com especialista para acelerar o crescimento do seu negócio.',
    benefits: ['2 calls mensais', 'Análise de métricas', 'Planejamento estratégico', 'Suporte via WhatsApp'],
    cta: 'Quero mentoria'
  }
]

// Métricas de resultado
const resultadosMetricas = [
  { value: '+340%', label: 'Aumento em agendamentos', icon: Calendar },
  { value: '3.8x', label: 'ROI médio dos clientes', icon: TrendingUp },
  { value: '89%', label: 'Taxa de renovação', icon: CheckCheck },
  { value: '<30d', label: 'Para ver primeiros resultados', icon: Zap }
]

// Dados antes/depois visual
const antesDepois = {
  antes: [
    'Ninguém me encontra no Google',
    'Dependo só de indicação',
    'Site que não traz nada',
    'Redes sociais paradas',
    'Zero avalizações'
  ],
  depois: [
    'Apareço na primeira página',
    'Clientes me procuram',
    'Site que converte visitantes',
    'Redes ativas e engajadas',
    '5 estrelas no Google'
  ]
}

// Depoimentos
const testimonials = [
  {
    quote: 'Antes eu passava semanas sem cliente novo. Agora tenho que agendar. Não é mágica, é trabalho bem feito.',
    author: 'Rosangela Ferreira',
    role: 'Salão de Beleza - Belo Horizonte',
    time: 'Cliente há 8 meses',
    result: '+340% em agendamentos'
  },
  {
    quote: 'Já tinha tentado 3 agências antes. A diferença é que aqui eu entendo o que estão fazendo.',
    author: 'Carlos Eduardo',
    role: 'Escritório de Contabilidade - Curitiba',
    time: 'Cliente há 1 ano',
    result: '2x mais leads'
  },
  {
    quote: 'O painel me mostra tudo. Sei exatamente o que meu dinheiro rendeu.',
    author: 'Ana Paula Mendes',
    role: 'Clínica de Estética - São Paulo',
    time: 'Cliente há 6 meses',
    result: 'ROI de 4.2x'
  }
]

// FAQ
const faqs = [
  {
    question: 'Preciso entender de tecnologia?',
    answer: 'Não. Nós fazemos tudo. Você só precisa aprovar. Se souber usar WhatsApp, já dá.'
  },
  {
    question: 'Quanto tempo para ver resultados?',
    answer: 'Em 30 dias você já vê diferença. Em 90 dias, a transformação é clara.'
  },
  {
    question: 'Posso cancelar quando quiser?',
    answer: 'Pode. Sem multa, sem burocracia. Queremos cliente satisfeito, não preso.'
  },
  {
    question: 'Vocês usam IA?',
    answer: 'Sim, com pessoas no meio. IA faz o braçal, humanos garantem qualidade.'
  }
]

// Dashboard preview
const dashboardPreview = {
  week: 3,
  actions: [
    { task: 'Análise SEO do site', status: 'completed' },
    { task: 'Criar posts da semana', status: 'completed' },
    { task: 'Otimizar Google Meu Negócio', status: 'in_progress' },
    { task: 'Responder comentários', status: 'pending' }
  ],
  metrics: [
    { label: 'Novos seguidores', value: '+47', target: 'Meta: 30-60' },
    { label: 'Visitantes do site', value: '234', target: 'Meta: 200+' },
    { label: 'ROI', value: '3.8x', target: 'Meta: > 3x' }
  ]
}

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

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
              <a href="#metodologia" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                Metodologia
              </a>
              <a href="#pilares" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                O que fazemos
              </a>
              <a href="#ofertas" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                Planos
              </a>
              <a href="#resultados" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                Resultados
              </a>
            </div>

            <div className="hidden md:flex items-center gap-3">
              <Link href="/analyze">
                <Button variant="outline" size="sm" className="border-teal-500 text-teal-600 hover:bg-teal-50">
                  <Search className="w-4 h-4 mr-1" />
                  Análise grátis
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="sm" className="bg-slate-900 hover:bg-slate-800 text-white">
                  Área do cliente
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
              <a href="#metodologia" className="block text-sm font-medium text-slate-700">Metodologia</a>
              <a href="#pilares" className="block text-sm font-medium text-slate-700">O que fazemos</a>
              <a href="#ofertas" className="block text-sm font-medium text-slate-700">Planos</a>
              <a href="#resultados" className="block text-sm font-medium text-slate-700">Resultados</a>
              <div className="pt-4 space-y-2">
                <Link href="/analyze" className="block">
                  <Button variant="outline" className="w-full border-teal-500 text-teal-600 hover:bg-teal-50">
                    <Search className="w-4 h-4 mr-1" />
                    Análise grátis
                  </Button>
                </Link>
                <Link href="/dashboard" className="block">
                  <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white">Área do cliente</Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </nav>

      {/* ==================== HERO - DIRETO ==================== */}
      <section className="pt-20 pb-12 md:pt-28 md:pb-16 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Texto DIRETO */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge className="bg-teal-500/20 text-teal-300 border-teal-500/30 mb-4 px-4 py-1.5 text-sm">
                <Award className="w-4 h-4 mr-2" />
                Autoridade Digital
              </Badge>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Autoridade Digital
                <span className="block text-teal-400">para seu negócio</span>
              </h1>
              
              <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                Colocamos sua empresa na internet da maneira correta. 
                <span className="text-white font-medium"> Todos os elementos necessários para gerar resultados e crescimento.</span>
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <a href="#ofertas">
                  <Button size="lg" className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-6 text-lg font-semibold">
                    Quero ter Autoridade Digital
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </a>
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
                  <CheckCircle2 className="w-4 h-4 text-teal-400" />
                  <span>Sem fidelidade</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-teal-400" />
                  <span>Resultados em 30 dias</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-teal-400" />
                  <span>Suporte humano</span>
                </div>
              </div>
            </motion.div>

            {/* VISUAL: Diagrama dos Pilares */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-slate-800/50 rounded-3xl border border-slate-700 p-6 lg:p-8">
                <h3 className="text-white font-semibold text-lg mb-6 text-center">
                  Os 5 Pilares da Autoridade Digital
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {pilaresAutoridade.map((pilar, index) => (
                    <motion.div
                      key={pilar.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className={`${pilar.bgColor} rounded-xl p-4 text-center ${index === 4 ? 'col-span-2 sm:col-span-1 sm:col-start-2' : ''}`}
                    >
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${pilar.color} flex items-center justify-center mx-auto mb-3`}>
                        <pilar.icon className="w-6 h-6 text-white" />
                      </div>
                      <p className="font-bold text-slate-900">{pilar.title}</p>
                      <p className="text-xs text-slate-600 mt-1">{pilar.subtitle}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Resultado final */}
                <div className="mt-6 p-4 bg-gradient-to-r from-teal-500/20 to-emerald-500/20 rounded-xl border border-teal-500/30">
                  <div className="flex items-center justify-center gap-3 text-teal-300">
                    <TrendingUp className="w-5 h-5" />
                    <span className="font-semibold">Resultado: Mais clientes encontrando você</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ==================== MÉTRICAS GRANDES ==================== */}
      <section className="py-8 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {resultadosMetricas.map((metrica, index) => (
              <motion.div
                key={metrica.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <p className="text-3xl sm:text-4xl font-bold text-slate-900">{metrica.value}</p>
                <p className="text-sm text-slate-500 mt-1">{metrica.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== METODOLOGIA DE COMPETITIVIDADE ==================== */}
      <section id="metodologia" className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="bg-slate-100 text-slate-700 border-slate-200 mb-4">
              <Layers className="w-4 h-4 mr-2" />
              Metodologia de Competitividade
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Um processo que atende várias demandas
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Não é sorte. É metodologia. Cada passo é pensado para gerar resultados previsíveis.
            </p>
          </motion.div>

          {/* Visual Steps */}
          <div className="relative">
            {/* Connection line */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-slate-200 via-teal-200 to-emerald-200 transform -translate-y-1/2 z-0" />
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
              {metodologiaSteps.map((step, index) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                  className="relative"
                >
                  <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 h-full hover:border-teal-300 transition-colors">
                    {/* Step number */}
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center mb-4">
                      <step.icon className="w-7 h-7 text-teal-400" />
                    </div>
                    
                    <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">
                      Passo {step.step}
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 mt-2 mb-2">{step.title}</h3>
                    <p className="text-slate-600 text-sm">{step.description}</p>
                  </div>
                  
                  {/* Arrow between steps */}
                  {index < metodologiaSteps.length - 1 && (
                    <div className="hidden lg:flex absolute top-1/2 -right-3 transform -translate-y-1/2 z-20">
                      <ArrowRight className="w-6 h-6 text-teal-400" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ==================== PILARES DA AUTORIDADE DIGITAL ==================== */}
      <section id="pilares" className="py-16 md:py-24 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              O que é Autoridade Digital?
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              São 5 pilares trabalhados em conjunto para que seu negócio seja encontrado, respeitado e escolhido.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
            {pilaresAutoridade.map((pilar, index) => (
              <motion.div
                key={pilar.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-800 rounded-2xl p-6 border border-slate-700 hover:border-slate-600 transition-all hover:-translate-y-1"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${pilar.color} flex items-center justify-center mb-4`}>
                  <pilar.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">{pilar.title}</h3>
                <p className="text-sm text-teal-400 mb-2">{pilar.subtitle}</p>
                <p className="text-sm text-slate-400">{pilar.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== ANTES → DEPOIS ==================== */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              A transformação é visível
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              O que muda quando você tem Autoridade Digital
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* ANTES */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-red-50 rounded-2xl border border-red-200 p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <X className="w-5 h-5 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-red-700">ANTES</h3>
              </div>
              <ul className="space-y-3">
                {antesDepois.antes.map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-red-800">
                    <X className="w-4 h-4 text-red-400 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* DEPOIS */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-emerald-50 rounded-2xl border border-emerald-200 p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                </div>
                <h3 className="text-xl font-bold text-emerald-700">DEPOIS</h3>
              </div>
              <ul className="space-y-3">
                {antesDepois.depois.map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ==================== OFERTAS ==================== */}
      <section id="ofertas" className="py-16 md:py-24 bg-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Escolha seu nível de Autoridade
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Não vendemos pacotes. Entregamos transformações.
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
                className={`relative rounded-2xl border-2 ${plan.borderColor} ${plan.bgColor} overflow-hidden ${
                  plan.popular ? 'ring-2 ring-teal-300 ring-offset-2 scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-teal-500 to-emerald-500 text-white text-center py-1.5 text-sm font-semibold">
                    Mais escolhido
                  </div>
                )}

                <div className={`p-6 ${plan.popular ? 'pt-10' : ''}`}>
                  <p className="text-sm font-medium text-slate-500 mb-1">{plan.idealFor}</p>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">{plan.name}</h3>

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
                          plan.popular ? 'text-teal-500' : 'text-slate-500'
                        }`} />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>

                  <Link href="/analyze" className="block">
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
                <strong>Garantia de 90 dias:</strong> se não ver resultados, devolvemos 100%.
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ==================== SERVIÇOS COMPLEMENTARES ==================== */}
      <section id="servicos" className="py-16 md:py-24 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="bg-white/10 text-white border-white/20 mb-4">
              <Layers className="w-4 h-4 mr-2" />
              Serviços Complementares
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Soluções extras para acelerar seu crescimento
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Serviços avulsos ou complementares aos planos. Escolha o que seu negócio precisa agora.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {servicosComplementares.map((servico, index) => (
              <motion.div
                key={servico.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden hover:border-slate-600 transition-all group"
              >
                {/* Header */}
                <div className={`bg-gradient-to-r ${servico.color} p-5`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                        <servico.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">{servico.title}</h3>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-baseline gap-1 mb-3">
                    <span className="text-2xl font-bold text-white">{servico.price}</span>
                    <span className="text-slate-400 text-sm">{servico.period}</span>
                  </div>

                  <p className="text-slate-400 text-sm mb-4">
                    {servico.description}
                  </p>

                  <ul className="space-y-2 mb-5">
                    {servico.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>

                  <Link href="/analyze" className="block">
                    <Button 
                      className={`w-full bg-gradient-to-r ${servico.color} hover:opacity-90 text-white`}
                    >
                      {servico.cta}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA especial */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-8 max-w-2xl mx-auto">
              <p className="text-white text-lg font-medium mb-2">
                Não sabe qual serviço você precisa?
              </p>
              <p className="text-slate-400 text-sm mb-6">
                Fale com nosso time que a gente te orienta sem compromisso.
              </p>
              <a href="https://wa.me/5551981829086" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-white">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Falar no WhatsApp
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ==================== RESULTADOS ==================== */}
      <section id="resultados" className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Resultados comprovados
            </h2>
            <p className="text-lg text-slate-600">
              Histórias reais de quem construiu Autoridade Digital
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-50 rounded-2xl p-6 border border-slate-200"
              >
                {/* Result badge */}
                <div className="mb-4">
                  <Badge className="bg-teal-100 text-teal-700 border-0">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {testimonial.result}
                  </Badge>
                </div>

                {/* Quote */}
                <p className="text-slate-700 mb-6 leading-relaxed">
                  "{testimonial.quote}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-slate-200 text-slate-600 text-sm">
                      {testimonial.author.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-slate-900 text-sm">{testimonial.author}</p>
                    <p className="text-xs text-slate-500">{testimonial.role}</p>
                    <p className="text-xs text-slate-400">{testimonial.time}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== DASHBOARD PREVIEW ==================== */}
      <section className="py-16 md:py-24 bg-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Transparência total
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Você vê tudo: o que fizemos, o que falta, e quanto está retornando.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xl max-w-4xl mx-auto"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-800 to-slate-700 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Image src="/logo.png" alt="Orion" width={100} height={28} className="h-7 w-auto brightness-0 invert" />
                  <span className="text-white/80 text-sm">Painel do Cliente</span>
                </div>
                <Badge className="bg-teal-500/20 text-teal-300 border-0">
                  Semana {dashboardPreview.week}
                </Badge>
              </div>
            </div>

            <div className="p-6">
              {/* Métricas */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                {dashboardPreview.metrics.map((metric) => (
                  <div key={metric.label} className="bg-slate-50 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-slate-900">{metric.value}</p>
                    <p className="text-sm text-slate-600">{metric.label}</p>
                    <p className="text-xs text-slate-400 mt-1">{metric.target}</p>
                  </div>
                ))}
              </div>

              {/* Ações */}
              <div>
                <h4 className="font-medium text-slate-900 mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Ações desta semana
                </h4>
                <div className="space-y-2">
                  {dashboardPreview.actions.map((action, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      {action.status === 'completed' ? (
                        <CheckCircle2 className="w-5 h-5 text-teal-500" />
                      ) : action.status === 'in_progress' ? (
                        <Clock className="w-5 h-5 text-amber-500" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-slate-300" />
                      )}
                      <span className={`text-sm ${action.status === 'completed' ? 'text-slate-500 line-through' : 'text-slate-700'}`}>
                        {action.task}
                      </span>
                      {action.status === 'in_progress' && (
                        <Badge variant="outline" className="text-amber-600 border-amber-200 text-xs">Em andamento</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          <div className="text-center mt-8">
            <Link href="/dashboard">
              <Button variant="outline" className="border-slate-300 text-slate-700">
                <Eye className="w-4 h-4 mr-2" />
                Ver painel completo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ==================== FAQ ==================== */}
      <section id="faq" className="py-16 md:py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Dúvidas frequentes
            </h2>
          </motion.div>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="font-medium text-slate-900 pr-4">{faq.question}</span>
                  {expandedFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                  )}
                </button>
                {expandedFaq === index && (
                  <div className="px-5 pb-5 pt-0">
                    <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== CTA FINAL ==================== */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-slate-800 to-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Pronto para ter Autoridade Digital?
            </h2>
            <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
              Comece hoje com uma análise gratuita. Sem compromisso.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/analyze">
                <Button size="lg" className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-6 text-lg font-semibold">
                  Começar análise grátis
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <a href="https://wa.me/5551981829086" target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="border-slate-600 text-white hover:bg-slate-700 px-6 py-6">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  WhatsApp
                </Button>
              </a>
            </div>

            <div className="mt-12 flex flex-wrap justify-center gap-8 text-slate-400 text-sm">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>Dados protegidos</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Resposta em 24h</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>São Paulo, SP</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="py-12 bg-slate-950 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <Image src="/logo.png" alt="Orion" width={120} height={32} className="h-7 w-auto brightness-0 invert mb-4" />
              <p className="text-slate-400 text-sm">
                Autoridade Digital para negócios que querem crescer.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4 text-sm">Links</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#metodologia" className="hover:text-white transition-colors">Metodologia</a></li>
                <li><a href="#pilares" className="hover:text-white transition-colors">O que fazemos</a></li>
                <li><a href="#ofertas" className="hover:text-white transition-colors">Planos</a></li>
                <li><a href="#resultados" className="hover:text-white transition-colors">Resultados</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4 text-sm">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Termos de uso</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacidade</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4 text-sm">Contato</h4>
              <ul className="space-y-3 text-sm text-slate-400">
                <li className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-emerald-500" />
                  <a href="https://wa.me/5551981829086" className="hover:text-white transition-colors">(51) 98182-9086</a>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-400" />
                  <a href="mailto:pablo@orionconsultoria.com.br" className="hover:text-white transition-colors">pablo@orionconsultoria.com.br</a>
                </li>
                <li className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-violet-400" />
                  <a href="https://orionrepresentacao.com.br" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1">
                    orionrepresentacao.com.br
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-rose-400" />
                  <span>Porto Alegre, RS</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-800 text-center text-slate-500 text-sm">
            <p>© {new Date().getFullYear()} Orion Growth Studio. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
