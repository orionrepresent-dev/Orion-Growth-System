'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckCircle2,
  Circle,
  Clock,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Play,
  Sparkles,
  Target,
  BarChart3,
  Calendar,
  DollarSign,
  Users,
  Heart,
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
  HelpCircle,
  Zap,
  Lightbulb,
  Settings,
  Bell,
  Crown,
  RefreshCw,
  Search,
  Brain,
  Megaphone,
  Rocket,
  Globe
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

// ==================== TIPOS ====================
interface Action {
  id: string
  title: string
  description: string
  objective: string
  goal: string
  deadline: string
  status: 'pending' | 'in_progress' | 'awaiting_approval' | 'completed' | 'skipped'
  justification: string
  expectedResult: string
  service: string
  week: number
  day?: string
}

interface Service {
  id: string
  name: string
  icon: React.ReactNode
  status: 'active' | 'paused' | 'completed'
  progress: number
  nextCheckpoint: string
  actionsThisWeek: number
  actionsCompleted: number
}

interface Journey {
  id: string
  name: string
  currentPhase: number
  phases: {
    id: number
    name: string
    description: string
    status: 'completed' | 'current' | 'upcoming'
  }[]
}

interface MetricCard {
  label: string
  value: string | number
  target: string
  trend: 'up' | 'stable' | 'down'
  context: string
  icon: React.ReactNode
}

// ==================== DADOS MOCK ====================
const userData = {
  name: 'Maria',
  businessName: 'Boutique da Maria',
  journeyName: 'Presença Digital Completa',
  memberSince: 'Janeiro 2024',
  currentWeek: 3
}

const journey: Journey = {
  id: 'j1',
  name: 'Presença Digital Completa',
  currentPhase: 3,
  phases: [
    { id: 1, name: 'Diagnóstico', description: 'Entendemos seu negócio', status: 'completed' },
    { id: 2, name: 'Planejamento', description: 'Criamos seu plano', status: 'completed' },
    { id: 3, name: 'Execução', description: 'Colocamos em prática', status: 'current' },
    { id: 4, name: 'Resultados', description: 'Medimos e otimizamos', status: 'upcoming' }
  ]
}

const services: Service[] = [
  {
    id: 's1',
    name: 'Análise SEO/AEO/GEO',
    icon: <Search className="w-5 h-5" />,
    status: 'active',
    progress: 75,
    nextCheckpoint: 'Revisar otimizações do site',
    actionsThisWeek: 4,
    actionsCompleted: 3
  },
  {
    id: 's2',
    name: 'Gestão de Redes Sociais',
    icon: <Megaphone className="w-5 h-5" />,
    status: 'active',
    progress: 60,
    nextCheckpoint: 'Aprovar posts da próxima semana',
    actionsThisWeek: 5,
    actionsCompleted: 3
  },
  {
    id: 's3',
    name: 'Business Audience (ICP)',
    icon: <Brain className="w-5 h-5" />,
    status: 'completed',
    progress: 100,
    nextCheckpoint: 'Concluído',
    actionsThisWeek: 2,
    actionsCompleted: 2
  }
]

const weeklyAgenda: Action[] = [
  {
    id: 'a1',
    title: 'Análise SEO do site',
    description: 'Verificar otimizações técnicas na homepage',
    objective: 'Melhorar indexação no Google',
    goal: 'Score SEO > 70/100',
    deadline: 'Seg, 18h',
    status: 'completed',
    justification: 'Sua página inicial não tem meta description otimizada.',
    expectedResult: '+15% de visibilidade em 30 dias',
    service: 'SEO',
    week: 3,
    day: 'Segunda'
  },
  {
    id: 'a2',
    title: 'Criar 2 posts para Instagram',
    description: 'Conteúdo educativo sobre seu segmento',
    objective: 'Aumentar engajamento e seguidores',
    goal: '20+ curtidas por post',
    deadline: 'Seg, 12h',
    status: 'completed',
    justification: 'Posts educativos geram 3x mais engajamento no seu nicho.',
    expectedResult: '5-10 novos seguidores por post',
    service: 'Social',
    week: 3,
    day: 'Segunda'
  },
  {
    id: 'a3',
    title: 'Otimizar meta tags',
    description: 'Implementar melhorias na homepage',
    objective: 'Melhorar CTR nas buscas',
    goal: 'CTR > 3%',
    deadline: 'Ter, 17h',
    status: 'awaiting_approval',
    justification: 'Identificamos 5 palavras-chave que seus concorrentes usam e você não.',
    expectedResult: '+200 visitantes orgânicos/mês',
    service: 'SEO',
    week: 3,
    day: 'Terça'
  },
  {
    id: 'a4',
    title: 'Responder comentários',
    description: 'Interagir com seguidores nos últimos posts',
    objective: 'Aumentar conexão com audiência',
    goal: '100% de resposta em 24h',
    deadline: 'Ter, 15h',
    status: 'in_progress',
    justification: 'Responder em até 2h aumenta engajamento em 40%.',
    expectedResult: 'Maior visibilidade no algoritmo',
    service: 'Social',
    week: 3,
    day: 'Terça'
  },
  {
    id: 'a5',
    title: 'Publicar post Instagram',
    description: 'Post agendado: "3 dicas para..."',
    objective: 'Gerar engajamento',
    goal: '25+ interações',
    deadline: 'Qua, 09h',
    status: 'pending',
    justification: 'Horário de maior atividade do seu público.',
    expectedResult: 'Alcance orgânico +200 pessoas',
    service: 'Social',
    week: 3,
    day: 'Quarta'
  },
  {
    id: 'a6',
    title: 'Checkpoint: Aprovar posts',
    description: 'Revisar posts para próxima semana',
    objective: 'Garantir alinhamento com sua marca',
    goal: 'Aprovação do cliente',
    deadline: 'Qua, 18h',
    status: 'pending',
    justification: 'Você sempre aprova antes de publicar.',
    expectedResult: 'Posts alinhados com sua mensagem',
    service: 'Social',
    week: 3,
    day: 'Quarta'
  },
  {
    id: 'a7',
    title: 'Publicar post LinkedIn',
    description: 'Conteúdo profissional sobre seu negócio',
    objective: 'Autoridade no segmento',
    goal: '10+ conexões novas',
    deadline: 'Qui, 12h',
    status: 'pending',
    justification: 'LinkedIn funciona melhor para B2B às 12h.',
    expectedResult: 'Conexões com potenciais parceiros',
    service: 'Social',
    week: 3,
    day: 'Quinta'
  }
]

const metrics: MetricCard[] = [
  {
    label: 'Novos seguidores',
    value: 47,
    target: '30-60/mês',
    trend: 'up',
    context: 'Dentro da meta! Seu conteúdo está atraindo o público certo.',
    icon: <Users className="w-5 h-5" />
  },
  {
    label: 'Engajamento médio',
    value: '4.2%',
    target: '> 3%',
    trend: 'up',
    context: 'Acima da média do seu segmento (2.8%).',
    icon: <Heart className="w-5 h-5" />
  },
  {
    label: 'Visitantes do site',
    value: 234,
    target: '200+/mês',
    trend: 'up',
    context: 'As otimizações SEO já estão trazendo resultados.',
    icon: <Globe className="w-5 h-5" />
  },
  {
    label: 'ROI Atual',
    value: '3.8x',
    target: '> 3x',
    trend: 'up',
    context: 'Para cada R$1 investido, você recebe R$3,80 de volta.',
    icon: <DollarSign className="w-5 h-5" />
  }
]

const pendingDecisions = [
  {
    id: 'd1',
    title: 'Aprovar otimização de meta tags',
    description: 'Encontramos 5 melhorias que podem aumentar seu tráfego em 15%',
    deadline: 'Terça, 17h',
    impact: '+200 visitantes/mês'
  },
  {
    id: 'd2',
    title: 'Revisar posts da próxima semana',
    description: '3 posts prontos para sua aprovação',
    deadline: 'Quarta, 18h',
    impact: 'Continuidade do conteúdo'
  }
]

// ==================== COMPONENTES ====================

function JourneyPhaseIndicator({ journey }: { journey: Journey }) {
  return (
    <div className="bg-white rounded-2xl border border-purple-100 p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 text-sm text-purple-600 mb-1">
            <Rocket className="w-4 h-4" />
            <span>Sua Jornada</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900">{journey.name}</h2>
        </div>
        <Badge className="bg-purple-100 text-purple-700 border-0 text-sm px-3 py-1">
          Semana {userData.currentWeek}
        </Badge>
      </div>
      
      <div className="grid grid-cols-4 gap-2">
        {journey.phases.map((phase) => (
          <motion.div
            key={phase.id}
            className={`relative p-3 rounded-xl text-center ${
              phase.status === 'completed' 
                ? 'bg-purple-50 border-2 border-purple-200' 
                : phase.status === 'current'
                ? 'bg-purple-100 border-2 border-purple-400'
                : 'bg-gray-50 border-2 border-gray-100'
            }`}
          >
            <div className="flex justify-center mb-2">
              {phase.status === 'completed' ? (
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
              ) : phase.status === 'current' ? (
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center animate-pulse">
                  <Play className="w-4 h-4 text-white" />
                </div>
              ) : (
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-gray-500 text-sm font-medium">{phase.id}</span>
                </div>
              )}
            </div>
            <p className={`text-sm font-medium ${
              phase.status === 'current' ? 'text-purple-700' : 
              phase.status === 'completed' ? 'text-purple-600' : 'text-gray-400'
            }`}>
              {phase.name}
            </p>
            {phase.status === 'current' && (
              <p className="text-xs text-purple-500 mt-1">📍 Você está aqui</p>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function ServiceCard({ service }: { service: Service }) {
  return (
    <div className={`bg-white rounded-xl border p-4 ${
      service.status === 'active' ? 'border-purple-200' : 
      service.status === 'completed' ? 'border-emerald-200' : 'border-gray-200'
    }`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            service.status === 'active' ? 'bg-purple-100 text-purple-600' :
            service.status === 'completed' ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-400'
          }`}>
            {service.icon}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-sm">{service.name}</h3>
            <p className="text-xs text-gray-500">
              {service.actionsCompleted}/{service.actionsThisWeek} ações esta semana
            </p>
          </div>
        </div>
      </div>
      
      <div className="mb-2">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-gray-500">Progresso</span>
          <span className="font-medium text-gray-700">{service.progress}%</span>
        </div>
        <Progress value={service.progress} className="h-1.5" />
      </div>
      
      {service.status === 'active' && (
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <Clock className="w-3 h-3 text-amber-500" />
          <span>Próximo: {service.nextCheckpoint}</span>
        </div>
      )}
    </div>
  )
}

function ActionCard({ action }: { action: Action }) {
  const [showJustification, setShowJustification] = useState(false)
  
  const getStatusStyles = () => {
    switch (action.status) {
      case 'completed':
        return { bg: 'bg-emerald-50', border: 'border-emerald-200', icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" /> }
      case 'in_progress':
        return { bg: 'bg-blue-50', border: 'border-blue-200', icon: <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" /> }
      case 'awaiting_approval':
        return { bg: 'bg-amber-50', border: 'border-amber-300', icon: <AlertTriangle className="w-4 h-4 text-amber-500" /> }
      default:
        return { bg: 'bg-white', border: 'border-gray-200', icon: <Circle className="w-4 h-4 text-gray-300" /> }
    }
  }
  
  const styles = getStatusStyles()
  
  return (
    <div className={`${styles.bg} border ${styles.border} rounded-lg p-3`}>
      <div className="flex items-start gap-2 mb-2">
        <div className="mt-0.5">{styles.icon}</div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 text-sm truncate">{action.title}</h4>
          <p className="text-xs text-gray-500 truncate">{action.description}</p>
        </div>
        <Badge variant="outline" className="text-[10px] px-1.5 py-0 shrink-0">
          {action.service}
        </Badge>
      </div>
      
      {action.status === 'awaiting_approval' && (
        <div className="mt-2 pt-2 border-t border-amber-200">
          <button
            onClick={() => setShowJustification(!showJustification)}
            className="text-xs text-amber-700 flex items-center gap-1 mb-2"
          >
            <HelpCircle className="w-3 h-3" />
            Por que esta ação?
          </button>
          
          <AnimatePresence>
            {showJustification && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="text-xs bg-white rounded p-2 mb-2"
              >
                <p className="text-gray-600">{action.justification}</p>
                <p className="text-purple-600 mt-1">💡 {action.expectedResult}</p>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="flex gap-1.5">
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white h-7 text-xs flex-1">
              <ThumbsUp className="w-3 h-3 mr-1" />
              Aprovar
            </Button>
            <Button size="sm" variant="outline" className="border-red-300 text-red-600 h-7 text-xs flex-1">
              <ThumbsDown className="w-3 h-3 mr-1" />
              Pular
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

function WeeklyAgenda({ actions }: { actions: Action[] }) {
  const days = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta']
  const actionsByDay = days.map(day => ({
    day,
    actions: actions.filter(a => a.day === day)
  }))
  
  return (
    <div className="bg-white rounded-2xl border border-purple-100 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
          <Calendar className="w-5 h-5 text-purple-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Agenda da Semana</h3>
          <p className="text-sm text-gray-500">Suas ações planejadas</p>
        </div>
      </div>
      
      <div className="grid grid-cols-5 gap-3">
        {actionsByDay.map(({ day, actions }) => (
          <div key={day}>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-700 text-sm">{day}</h4>
              <Badge variant="outline" className="text-[10px] px-1">
                {actions.length}
              </Badge>
            </div>
            <div className="space-y-2">
              {actions.map(action => (
                <ActionCard key={action.id} action={action} />
              ))}
              {actions.length === 0 && (
                <div className="h-16 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-xs">
                  Sem ações
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function MetricsWithContent({ metrics }: { metrics: MetricCard[] }) {
  return (
    <div className="bg-white rounded-2xl border border-purple-100 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
          <BarChart3 className="w-5 h-5 text-purple-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Seus Resultados</h3>
          <p className="text-sm text-gray-500">O que está acontecendo</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 rounded-xl bg-gray-50"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="text-gray-400">{metric.icon}</div>
              {metric.trend === 'up' && <TrendingUp className="w-4 h-4 text-emerald-500" />}
            </div>
            <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
            <p className="text-sm text-gray-600">{metric.label}</p>
            <p className="text-xs text-gray-400 mt-1">Meta: {metric.target}</p>
            <p className="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-200">
              {metric.context}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function PendingDecisionsCard({ decisions }: { decisions: typeof pendingDecisions }) {
  if (decisions.length === 0) return null
  
  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-5 mb-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Decisões Pendentes</h3>
          <p className="text-sm text-amber-700">{decisions.length} ações aguardam você</p>
        </div>
      </div>
      
      <div className="space-y-2">
        {decisions.map((decision) => (
          <div key={decision.id} className="bg-white rounded-lg p-3 border border-amber-100">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="font-medium text-gray-900 text-sm">{decision.title}</h4>
                <p className="text-xs text-gray-600 mt-0.5">{decision.description}</p>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {decision.deadline}
                  </span>
                  <span className="flex items-center gap-1">
                    <Zap className="w-3 h-3 text-amber-500" />
                    {decision.impact}
                  </span>
                </div>
              </div>
              <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white h-7 text-xs shrink-0">
                Decidir
                <ChevronRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function InvestmentCard() {
  return (
    <div className="bg-gradient-to-br from-purple-600 to-violet-700 rounded-2xl p-5 text-white">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
          <DollarSign className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-semibold">Seu Investimento</h3>
          <p className="text-sm text-purple-200">Transparência total</p>
        </div>
      </div>
      
      <div className="space-y-2 mb-4 text-sm">
        <div className="flex justify-between">
          <span className="text-purple-200">Redes Sociais</span>
          <span>R$ 497/mês</span>
        </div>
        <div className="flex justify-between">
          <span className="text-purple-200">Análise SEO</span>
          <span>R$ 297/mês</span>
        </div>
        <div className="flex justify-between">
          <span className="text-purple-200">Dashboard</span>
          <span className="text-emerald-300">Grátis</span>
        </div>
      </div>
      
      <div className="pt-3 border-t border-white/20">
        <div className="flex justify-between items-center mb-2">
          <span className="text-purple-200">Total</span>
          <span className="text-xl font-bold">R$ 794/mês</span>
        </div>
        <div className="bg-white/10 rounded-lg p-2.5">
          <div className="flex items-center gap-2 text-sm">
            <Zap className="w-4 h-4 text-amber-300" />
            <span className="font-medium">ROI: 3.8x</span>
          </div>
          <p className="text-xs text-purple-200 mt-1">Cada R$1 vira R$3,80 em retorno</p>
        </div>
      </div>
    </div>
  )
}

function WeeklyTip() {
  return (
    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
          <Lightbulb className="w-5 h-5 text-indigo-600" />
        </div>
        <h3 className="font-semibold text-gray-900">Dica da Semana</h3>
      </div>
      <p className="text-sm text-gray-700">
        Responder comentários nas primeiras 2 horas aumenta o engajamento em até 
        <strong className="text-purple-600"> 40%</strong>!
      </p>
    </div>
  )
}

// ==================== PÁGINA PRINCIPAL ====================
export default function JourneyDashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/30 via-white to-violet-50/20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-3">
                <Image 
                  src="/logo.png" 
                  alt="Orion Growth Studio" 
                  width={140} 
                  height={32}
                  className="h-8 w-auto"
                />
              </Link>
              <Badge className="bg-purple-100 text-purple-700 border-0 hidden sm:flex">
                <Crown className="w-3 h-3 mr-1" />
                Jornada Ativa
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="w-5 h-5 text-gray-600" />
              </Button>
              <Avatar className="w-9 h-9 border-2 border-purple-200">
                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-violet-500 text-white text-sm font-medium">
                  {userData.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Welcome */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Olá, <span className="text-purple-600">{userData.name}</span>! 👋
            </h1>
            <p className="text-gray-600">{userData.businessName}</p>
          </div>
          <Badge variant="outline" className="text-sm py-1 px-3 hidden sm:flex">
            <Calendar className="w-4 h-4 mr-1" />
            Semana {userData.currentWeek}
          </Badge>
        </div>
        
        {/* Journey Phase */}
        <JourneyPhaseIndicator journey={journey} />
        
        {/* Pending Decisions */}
        <PendingDecisionsCard decisions={pendingDecisions} />
        
        {/* Services Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {services.map(service => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
        
        {/* Agenda da Semana */}
        <div className="mb-6">
          <WeeklyAgenda actions={weeklyAgenda} />
        </div>
        
        {/* Metrics & Investment */}
        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <MetricsWithContent metrics={metrics} />
          </div>
          <div className="space-y-6">
            <InvestmentCard />
            <WeeklyTip />
          </div>
        </div>
        
        {/* Help */}
        <div className="bg-white rounded-2xl border border-purple-100 p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <HelpCircle className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">Precisa de ajuda?</h3>
              <p className="text-sm text-gray-500">Estamos aqui para você</p>
            </div>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              Falar agora
              <MessageCircle className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="mt-12 border-t border-purple-100 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
            <span>© 2024 Orion Growth Studio • IA FIRST BUSINESS</span>
            <div className="flex items-center gap-4">
              <Link href="#" className="hover:text-purple-600">Ajuda</Link>
              <Link href="#" className="hover:text-purple-600">Termos</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
