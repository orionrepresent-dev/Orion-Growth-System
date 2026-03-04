'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  Users,
  Heart,
  MessageCircle,
  Calendar,
  ChevronRight,
  Sparkles,
  Target,
  Lightbulb,
  Instagram,
  Linkedin,
  Facebook,
  Bell,
  Settings,
  ArrowRight,
  Eye,
  ThumbsUp,
  Share2,
  DollarSign,
  BarChart3,
  Rocket,
  Zap,
  Crown,
  Info,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Play,
  BookOpen,
  Star,
  Gift
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

// ==================== TIPOS ====================
interface JourneyStep {
  id: number
  title: string
  description: string
  status: 'completed' | 'current' | 'pending'
  icon: React.ReactNode
}

interface SocialPost {
  id: string
  platform: 'instagram' | 'linkedin' | 'facebook'
  content: string
  status: 'approved' | 'pending_approval' | 'scheduled' | 'published'
  scheduledDate: string
  scheduledTime: string
  objective: string
  hashtags: string[]
}

interface Service {
  id: string
  title: string
  icon: React.ReactNode
  monthlyPrice: number
  description: string
  posts: SocialPost[]
  expectedResults: string
  basedOn: string[]
}

interface ActionResult {
  type: 'followers' | 'likes' | 'comments' | 'reach' | 'engagement'
  value: number
  target: string
  trend: 'up' | 'stable' | 'down'
  icon: React.ReactNode
}

interface PendingAction {
  id: string
  priority: 'urgent' | 'important' | 'optional'
  title: string
  description: string
  actionLabel: string
  estimatedTime: string
  benefit: string
}

interface Insight {
  title: string
  discoveries: string[]
  conclusion: string
}

// ==================== DADOS MOCK ====================
const userData = {
  name: 'Maria',
  businessName: 'Boutique da Maria',
  planName: 'Crescimento',
  memberSince: 'Janeiro 2024',
  avatar: null
}

const journeySteps: JourneyStep[] = [
  {
    id: 1,
    title: 'Diagnóstico',
    description: 'Entendemos seu negócio',
    status: 'completed',
    icon: <Target className="w-5 h-5" />
  },
  {
    id: 2,
    title: 'Conteúdo',
    description: 'Criando suas publicações',
    status: 'current',
    icon: <Sparkles className="w-5 h-5" />
  },
  {
    id: 3,
    title: 'Resultados',
    description: 'Veja o crescimento',
    status: 'pending',
    icon: <TrendingUp className="w-5 h-5" />
  },
  {
    id: 4,
    title: 'Escala',
    description: 'Crescer mais ainda',
    status: 'pending',
    icon: <Rocket className="w-5 h-5" />
  }
]

const socialMediaService: Service = {
  id: 'social-media',
  title: 'Suas Publicações',
  icon: <Instagram className="w-5 h-5" />,
  monthlyPrice: 497,
  description: 'Posts criados especialmente para você esta semana',
  expectedResults: '15-30 novos seguidores/mês',
  basedOn: [
    'Seu segmento de negócio',
    'Análise dos concorrentes',
    'Tendências atuais do mercado'
  ],
  posts: [
    {
      id: '1',
      platform: 'instagram',
      content: 'Dica de como aumentar suas vendas no fim de semana! 3 estratégias simples que você pode aplicar hoje mesmo...',
      status: 'approved',
      scheduledDate: '15/03',
      scheduledTime: '09:00',
      objective: 'Engajamento + Alcance',
      hashtags: ['#dicasdevendas', '#pequenoempreendedor', '#negócios']
    },
    {
      id: '2',
      platform: 'instagram',
      content: '5 erros que você pode estar cometendo no seu negócio e como corrigir cada um deles rapidamente...',
      status: 'pending_approval',
      scheduledDate: '17/03',
      scheduledTime: '18:00',
      objective: 'Autoridade + Seguidores',
      hashtags: ['#erroscomuns', '#empreendedorismo', '#sucesso']
    },
    {
      id: '3',
      platform: 'linkedin',
      content: 'Como transformei minha paixão em um negócio rentável: lições que aprendi no caminho...',
      status: 'approved',
      scheduledDate: '19/03',
      scheduledTime: '12:00',
      objective: 'Conexões + Autoridade profissional',
      hashtags: ['#empreendedorismo', '#historia', '#inspiração']
    }
  ]
}

const results: ActionResult[] = [
  {
    type: 'followers',
    value: 23,
    target: '15-30',
    trend: 'up',
    icon: <Users className="w-5 h-5" />
  },
  {
    type: 'likes',
    value: 156,
    target: '100+',
    trend: 'up',
    icon: <Heart className="w-5 h-5" />
  },
  {
    type: 'comments',
    value: 34,
    target: '20+',
    trend: 'up',
    icon: <MessageCircle className="w-5 h-5" />
  }
]

const pendingActions: PendingAction[] = [
  {
    id: '1',
    priority: 'urgent',
    title: 'Aprovar 2 posts antes de quinta-feira',
    description: 'Temos posts aguardando sua aprovação para serem publicados.',
    actionLabel: 'Aprovar agora',
    estimatedTime: '2 minutos',
    benefit: 'Garante que suas publicações saiam no horário certo'
  },
  {
    id: '2',
    priority: 'important',
    title: 'Responder 5 comentários no Instagram',
    description: 'Seus seguidores estão interagindo! Responder aumenta o engajamento.',
    actionLabel: 'Ver comentários',
    estimatedTime: '5 minutos',
    benefit: 'Aumenta o engajamento e a conexão com seus clientes'
  },
  {
    id: '3',
    priority: 'optional',
    title: 'Sugerir tema para próximos posts',
    description: 'Tem alguma ideia ou tema que gostaria de ver nas próximas publicações?',
    actionLabel: 'Enviar ideia',
    estimatedTime: '1 minuto',
    benefit: 'Conteúdo mais personalizado para seu negócio'
  }
]

const insight: Insight = {
  title: 'Por que criamos esses posts para você?',
  discoveries: [
    'Seus clientes estão no Instagram principalmente às 9h e 18h',
    'Posts sobre "dicas" têm 3x mais engajamento no seu segmento',
    'Seus concorrentes postam 4x por semana - você precisa acompanhar'
  ],
  conclusion: 'Por isso, criamos posts educativos nos melhores horários para maximizar seu alcance!'
}

// ==================== COMPONENTES ====================

// Componente JourneyProgress - Barra de progresso da jornada
function JourneyProgress({ steps, currentStep }: { steps: JourneyStep[], currentStep: number }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-purple-100 p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">🎯</span>
        <h2 className="text-xl font-semibold text-gray-900">
          Bem-vinda de volta, <span className="text-purple-600">{userData.name}</span>!
        </h2>
      </div>
      
      <p className="text-gray-600 mb-6">Veja onde você está na sua jornada de crescimento</p>
      
      {/* Progress Steps */}
      <div className="relative">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex-1 relative">
              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div className="absolute top-5 left-1/2 w-full h-1 -translate-y-1/2">
                  <div className={`h-full rounded-full transition-all duration-500 ${
                    step.status === 'completed' ? 'bg-purple-500' : 'bg-gray-200'
                  }`} />
                </div>
              )}
              
              {/* Step Circle */}
              <div className="relative flex flex-col items-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                    step.status === 'completed'
                      ? 'bg-purple-500 text-white shadow-lg shadow-purple-200'
                      : step.status === 'current'
                      ? 'bg-white border-3 border-purple-500 text-purple-600 shadow-lg shadow-purple-100'
                      : 'bg-gray-100 text-gray-400 border-2 border-gray-200'
                  }`}
                >
                  {step.status === 'completed' ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : step.status === 'current' ? (
                    <Clock className="w-6 h-6 animate-pulse" />
                  ) : (
                    <span className="text-lg font-medium">{step.id}</span>
                  )}
                </motion.div>
                
                {/* Step Label */}
                <div className="mt-3 text-center">
                  <p className={`font-medium ${
                    step.status === 'current' ? 'text-purple-600' : 
                    step.status === 'completed' ? 'text-gray-900' : 'text-gray-400'
                  }`}>
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5 hidden sm:block">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Current Step Highlight */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-6 p-4 bg-purple-50 rounded-xl border border-purple-100"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
            <MapPin className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-purple-600 font-medium">📍 Você está aqui</p>
            <p className="text-gray-900 font-medium">Etapa 2: Criando seu conteúdo personalizado</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

// Helper component for MapPin icon (not in lucide-react default)
function MapPin({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  )
}

// Componente ServiceCard - Card de serviço com status detalhado
function ServiceCard({ service }: { service: Service }) {
  const [expandedPost, setExpandedPost] = useState<string | null>(null)
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-0">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Aprovado por você
          </Badge>
        )
      case 'pending_approval':
        return (
          <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-0 animate-pulse">
            <Clock className="w-3 h-3 mr-1" />
            Aguardando sua aprovação
          </Badge>
        )
      case 'scheduled':
        return (
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-0">
            <Calendar className="w-3 h-3 mr-1" />
            Agendado
          </Badge>
        )
      case 'published':
        return (
          <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100 border-0">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Publicado
          </Badge>
        )
      default:
        return <Badge>{status}</Badge>
    }
  }
  
  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'instagram':
        return <Instagram className="w-4 h-4 text-pink-500" />
      case 'linkedin':
        return <Linkedin className="w-4 h-4 text-blue-600" />
      case 'facebook':
        return <Facebook className="w-4 h-4 text-blue-500" />
      default:
        return null
    }
  }
  
  const getPlatformBgColor = (platform: string) => {
    switch (platform) {
      case 'instagram':
        return 'bg-gradient-to-br from-pink-50 to-purple-50'
      case 'linkedin':
        return 'bg-blue-50'
      case 'facebook':
        return 'bg-blue-50'
      default:
        return 'bg-gray-50'
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-purple-100 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">📱</span>
          <h3 className="text-xl font-semibold text-gray-900">{service.title}</h3>
        </div>
        <p className="text-gray-600">{service.description}</p>
      </div>
      
      {/* Posts */}
      <div className="divide-y divide-gray-50">
        {service.posts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-5"
          >
            <div className={`rounded-xl p-4 ${getPlatformBgColor(post.platform)}`}>
              {/* Post Header */}
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-2">
                  {getPlatformIcon(post.platform)}
                  <span className="text-sm font-medium text-gray-700">
                    Post {index + 1}
                  </span>
                </div>
                {getStatusBadge(post.status)}
              </div>
              
              {/* Post Content */}
              <p className="text-gray-800 text-sm leading-relaxed mb-3">
                "{post.content}"
              </p>
              
              {/* Post Details */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>Agendado: {post.scheduledDate} às {post.scheduledTime}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Target className="w-3 h-3" />
                  <span>{post.objective}</span>
                </div>
              </div>
              
              {/* Hashtags */}
              <div className="flex flex-wrap gap-1 mt-3">
                {post.hashtags.map((tag, i) => (
                  <span key={i} className="text-xs text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
              
              {/* Action Button for pending posts */}
              {post.status === 'pending_approval' && (
                <div className="mt-4 flex gap-2">
                  <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
                    <ThumbsUp className="w-4 h-4 mr-1" />
                    Aprovar
                  </Button>
                  <Button size="sm" variant="outline" className="border-purple-200 text-purple-600">
                    <Eye className="w-4 h-4 mr-1" />
                    Ver completo
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Footer - Investment & Results */}
      <div className="p-5 bg-gradient-to-r from-purple-50 to-violet-50 border-t border-purple-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div>
              <p className="text-xs text-gray-500 mb-0.5">💰 Seu investimento</p>
              <p className="text-lg font-bold text-gray-900">R$ {service.monthlyPrice}/mês</p>
            </div>
            <div className="hidden sm:block w-px h-10 bg-purple-200" />
            <div>
              <p className="text-xs text-gray-500 mb-0.5">📊 Resultado esperado</p>
              <p className="text-sm font-medium text-purple-700">{service.expectedResults}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="border-purple-200 text-purple-600">
              Ver todos os posts
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-600">
              Editar preferências
            </Button>
          </div>
        </div>
        
        {/* Based on */}
        <div className="mt-4 pt-4 border-t border-purple-200/50">
          <p className="text-xs text-gray-500 mb-2">🎯 Baseado em:</p>
          <div className="flex flex-wrap gap-2">
            {service.basedOn.map((item, i) => (
              <span key={i} className="text-xs bg-white px-2 py-1 rounded-full text-gray-600 border border-purple-100">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Componente InsightBox - Caixa de explicação "por que fizemos isso"
function InsightBox({ insight }: { insight: Insight }) {
  const [isExpanded, setIsExpanded] = useState(false)
  
  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-5 flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
            <span className="text-xl">🧠</span>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">{insight.title}</h4>
            <p className="text-sm text-gray-500">Clique para entender nossas decisões</p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-purple-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-purple-500" />
        )}
      </button>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5">
              <div className="bg-white rounded-xl p-4 space-y-3">
                <p className="text-sm font-medium text-gray-700">Analisamos seu negócio e descobrimos que:</p>
                <ul className="space-y-2">
                  {insight.discoveries.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="text-purple-500 mt-0.5">🔍</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="pt-3 mt-3 border-t border-gray-100">
                  <p className="text-sm font-medium text-purple-700">
                    💡 {insight.conclusion}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Componente ResultsDashboard - Dashboard de resultados claros
function ResultsDashboard({ results }: { results: ActionResult[] }) {
  const getResultLabel = (type: string) => {
    switch (type) {
      case 'followers': return 'novos seguidores'
      case 'likes': return 'curtidas nos posts'
      case 'comments': return 'comentários respondidos'
      case 'reach': return 'pessoas alcançadas'
      case 'engagement': return 'taxa de engajamento'
      default: return type
    }
  }
  
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-purple-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <span className="text-2xl">📊</span>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Seus Resultados</h3>
            <p className="text-gray-600 text-sm">O que está acontecendo este mês</p>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        {/* Results Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {results.map((result, index) => (
            <motion.div
              key={result.type}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-br from-gray-50 to-purple-50 rounded-xl p-4 text-center"
            >
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                <div className="text-purple-600">
                  {result.icon}
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">{result.value}</p>
              <p className="text-sm text-gray-600">{getResultLabel(result.type)}</p>
              <div className="mt-2 flex items-center justify-center gap-1">
                <span className="text-xs text-gray-500">Meta: {result.target}</span>
                {result.trend === 'up' && (
                  <TrendingUp className="w-3 h-3 text-emerald-500" />
                )}
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Success Message */}
        <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
              <Star className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="font-medium text-emerald-800">🎯 Você está dentro da meta! Parabéns!</p>
              <p className="text-sm text-emerald-600 mt-0.5">
                Você cresceu 12% mais que a média do seu segmento em São Paulo.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Componente ActionList - Lista de ações pendentes
function ActionList({ actions }: { actions: PendingAction[] }) {
  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return {
          badge: (
            <Badge className="bg-red-100 text-red-700 border-0">
              🔴 URGENTE
            </Badge>
          ),
          border: 'border-l-red-400',
          bg: 'bg-red-50/50'
        }
      case 'important':
        return {
          badge: (
            <Badge className="bg-amber-100 text-amber-700 border-0">
              🟡 IMPORTANTE
            </Badge>
          ),
          border: 'border-l-amber-400',
          bg: 'bg-amber-50/50'
        }
      case 'optional':
        return {
          badge: (
            <Badge className="bg-green-100 text-green-700 border-0">
              🟢 OPCIONAL
            </Badge>
          ),
          border: 'border-l-green-400',
          bg: 'bg-green-50/50'
        }
      default:
        return {
          badge: null,
          border: 'border-l-gray-400',
          bg: 'bg-gray-50'
        }
    }
  }
  
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-purple-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <span className="text-2xl">✅</span>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Suas Próximas Ações</h3>
            <p className="text-gray-600 text-sm">Simples e rápidas para manter tudo em dia</p>
          </div>
        </div>
      </div>
      
      <div className="divide-y divide-gray-50">
        {actions.map((action, index) => {
          const styles = getPriorityStyles(action.priority)
          
          return (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-5 border-l-4 ${styles.border} ${styles.bg}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {styles.badge}
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1">{action.title}</h4>
                  <p className="text-sm text-gray-600 mb-3">{action.description}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {action.estimatedTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <Gift className="w-3 h-3" />
                      {action.benefit}
                    </span>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  className={`shrink-0 ${
                    action.priority === 'urgent' 
                      ? 'bg-red-600 hover:bg-red-700' 
                      : 'bg-purple-600 hover:bg-purple-700'
                  }`}
                >
                  {action.actionLabel}
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

// Componente TimelineView - Linha do tempo de publicações
function TimelineView({ posts }: { posts: SocialPost[] }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-purple-100 p-6">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-2xl">📅</span>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Agenda da Semana</h3>
          <p className="text-sm text-gray-500">Veja quando seus posts serão publicados</p>
        </div>
      </div>
      
      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-purple-100" />
        
        <div className="space-y-4">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative flex gap-4 pl-12"
            >
              {/* Timeline Dot */}
              <div className={`absolute left-4 w-4 h-4 rounded-full border-2 ${
                post.status === 'approved' 
                  ? 'bg-purple-500 border-purple-500' 
                  : post.status === 'pending_approval'
                  ? 'bg-amber-400 border-amber-400 animate-pulse'
                  : 'bg-gray-200 border-gray-300'
              }`} />
              
              <div className="flex-1 p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-purple-600">
                    {post.scheduledDate} às {post.scheduledTime}
                  </span>
                  <div className="flex items-center gap-1">
                    {post.platform === 'instagram' && <Instagram className="w-4 h-4 text-pink-500" />}
                    {post.platform === 'linkedin' && <Linkedin className="w-4 h-4 text-blue-600" />}
                  </div>
                </div>
                <p className="text-sm text-gray-700 line-clamp-2">{post.content}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Componente CostBreakdown - Detalhamento de custos
function CostBreakdown() {
  return (
    <div className="bg-gradient-to-br from-purple-600 to-violet-700 rounded-2xl p-6 text-white">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-2xl">💰</span>
        <div>
          <h3 className="text-lg font-semibold">Seu Investimento</h3>
          <p className="text-sm text-purple-200">Transparência total nos custos</p>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center py-2 border-b border-white/20">
          <span className="text-purple-100">Gestão de Redes Sociais</span>
          <span className="font-medium">R$ 497/mês</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-white/20">
          <span className="text-purple-100">Análise SEO Mensal</span>
          <span className="font-medium">R$ 297/mês</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-white/20">
          <span className="text-purple-100">Dashboard de Resultados</span>
          <span className="font-medium text-emerald-300">Grátis</span>
        </div>
        <div className="flex justify-between items-center pt-3">
          <span className="font-semibold">Total</span>
          <span className="text-2xl font-bold">R$ 794/mês</span>
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-white/10 rounded-xl">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-300" />
          <span className="font-medium">ROI Atual: 3.2x</span>
        </div>
        <p className="text-sm text-purple-200 mt-1">
          Para cada R$ 1 investido, você recebe R$ 3,20 de volta
        </p>
      </div>
    </div>
  )
}

// ==================== PÁGINA PRINCIPAL ====================
export default function DashboardV2Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/50 via-white to-violet-50/30">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-3">
                <Image 
                  src="/logo.png" 
                  alt="Orion Growth Studio" 
                  width={140} 
                  height={32}
                  className="h-8 w-auto"
                />
              </Link>
              <div className="hidden sm:block h-6 w-px bg-purple-200" />
              <Badge variant="secondary" className="hidden sm:flex bg-purple-100 text-purple-700 border-0">
                <Crown className="w-3 h-3 mr-1 text-purple-500" />
                Plano {userData.planName}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
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
        {/* Journey Progress */}
        <JourneyProgress steps={journeySteps} currentStep={2} />
        
        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Service Card - Social Media */}
            <ServiceCard service={socialMediaService} />
            
            {/* Insight Box */}
            <InsightBox insight={insight} />
            
            {/* Results Dashboard */}
            <ResultsDashboard results={results} />
            
            {/* Timeline */}
            <TimelineView posts={socialMediaService.posts} />
          </div>
          
          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Action List */}
            <ActionList actions={pendingActions} />
            
            {/* Cost Breakdown */}
            <CostBreakdown />
            
            {/* Quick Help Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-purple-100 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Precisa de ajuda?</h4>
                  <p className="text-sm text-gray-500">Estamos aqui para você</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start border-purple-200 text-gray-700 hover:bg-purple-50">
                  <Play className="w-4 h-4 mr-2 text-purple-500" />
                  Ver tutorial rápido
                </Button>
                <Button variant="outline" className="w-full justify-start border-purple-200 text-gray-700 hover:bg-purple-50">
                  <MessageCircle className="w-4 h-4 mr-2 text-purple-500" />
                  Falar com especialista
                </Button>
                <Button variant="outline" className="w-full justify-start border-purple-200 text-gray-700 hover:bg-purple-50">
                  <BookOpen className="w-4 h-4 mr-2 text-purple-500" />
                  Central de ajuda
                </Button>
              </div>
            </div>
            
            {/* Achievement Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl border border-amber-200 p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">🏆</span>
                <div>
                  <h4 className="font-semibold text-gray-900">Conquista Desbloqueada!</h4>
                  <p className="text-sm text-amber-700">Primeiro mês completo!</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Você completou seu primeiro mês conosco! Continue assim para alcançar ainda mais resultados.
              </p>
              <div className="mt-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                <Star className="w-5 h-5 text-gray-300" />
                <Star className="w-5 h-5 text-gray-300" />
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Bottom Section - Tips */}
        <div className="mt-8 bg-gradient-to-r from-purple-600 to-violet-600 rounded-2xl p-6 md:p-8 text-white">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-6 h-6" />
                <h3 className="text-xl font-semibold">Dica da Semana</h3>
              </div>
              <p className="text-purple-100 mb-4">
                Responder aos comentários nas primeiras 2 horas após a publicação pode aumentar 
                seu engajamento em até 40%! Seus clientes adoram se sentir ouvidos.
              </p>
              <Button className="bg-white text-purple-600 hover:bg-purple-50">
                Ver mais dicas
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
            <div className="hidden md:block">
              <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-6xl">💡</span>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="mt-12 border-t border-purple-100 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>© 2024 Orion Growth Studio</span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline">Cliente desde {userData.memberSince}</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <Link href="#" className="hover:text-purple-600 transition-colors">Central de Ajuda</Link>
              <Link href="#" className="hover:text-purple-600 transition-colors">Termos de Uso</Link>
              <Link href="#" className="hover:text-purple-600 transition-colors">Privacidade</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
