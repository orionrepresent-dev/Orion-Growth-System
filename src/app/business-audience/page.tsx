'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import {
  Bot,
  Bell,
  Check,
  RefreshCw,
  Edit3,
  X,
  Settings,
  ThumbsUp,
  Zap,
  Clock,
  Brain,
  Target,
  TrendingUp,
  Eye,
  BarChart3,
  Sparkles,
  MessageSquare,
  Calendar,
  FileText,
  Users,
  Lightbulb,
  ArrowRight,
  Menu,
  Search,
  Home,
  Newspaper,
  BookOpen,
  Flame,
  Play,
  CheckCircle2,
  Image as ImageIcon,
  ChevronRight,
  ExternalLink
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { OneClickActionCard, type OneClickContent } from '@/components/ui/one-click-card'
import { 
  FriendlyNotificationList, 
  type FriendlyNotificationProps 
} from '@/components/ui/friendly-notification'
import { LearningPanel, type LearningInsight } from '@/components/ui/learning-panel'
import { GrowthScore, GrowthScoreMini, type GrowthLevel } from '@/components/ui/growth-score'

// ==================== DATA ====================

const mockNotifications: FriendlyNotificationProps[] = [
  {
    id: '1',
    type: 'ready',
    title: 'Conteúdo preparado',
    message: 'Preparei 5 posts para a próxima semana. Dê uma olhada!',
    timestamp: 'Agora',
    actions: [
      { label: 'Ver conteúdo', onClick: () => {}, variant: 'default' },
      { label: 'Ignorar', onClick: () => {}, variant: 'ghost' }
    ]
  },
  {
    id: '2',
    type: 'trend',
    title: 'Tendência detectada',
    message: '"IA no varejo" está em alta no seu setor. Que tal criar conteúdo sobre isso?',
    timestamp: '2h atrás',
    actions: [
      { label: 'Criar agora', onClick: () => {}, variant: 'default' },
      { label: 'Ver mais', onClick: () => {}, variant: 'outline' }
    ]
  },
  {
    id: '3',
    type: 'opportunity',
    title: 'Oportunidade de engajamento',
    message: 'Seu post de ontem teve 200% mais engajamento. Publiquei um follow-up sugerido.',
    timestamp: '5h atrás',
    actions: [
      { label: 'Ver sugestão', onClick: () => {}, variant: 'default' }
    ]
  }
]

const mockContent: OneClickContent[] = [
  {
    id: '1',
    type: 'post',
    title: '5 estratégias de IA que vão transformar seu negócio',
    preview: 'A inteligência artificial não é mais ficção científica. Ela está aqui, e empresas de todos os tamanhos estão colhendo os benefícios. Descubra como aplicar...',
    scheduledFor: 'Amanhã, 10:00',
    platform: 'linkedin',
    hashtags: ['IA', 'Negócios', 'Inovação', 'TransformaçãoDigital']
  },
  {
    id: '2',
    type: 'article',
    title: 'Guia completo de SEO para 2024: o que mudou',
    preview: 'As atualizações recentes do Google mudaram as regras do jogo. Neste artigo, vou te mostrar exatamente o que funciona agora e como adaptar sua estratégia...',
    platform: 'blog',
    hashtags: ['SEO', 'Marketing', 'Google', 'Conteúdo']
  },
  {
    id: '3',
    type: 'post',
    title: 'Cliente satisfeito: +340% em agendamentos em 30 dias',
    preview: 'Rosangela do Salão Bela tinha dificuldade em atrair novos clientes. Veja como transformamos sua presença digital em apenas um mês...',
    scheduledFor: 'Quarta, 14:00',
    platform: 'instagram',
    hashtags: ['Depoimento', 'Resultado', 'Sucesso', 'Crescimento']
  },
  {
    id: '4',
    type: 'news',
    title: 'Nova funcionalidade do Instagram que você precisa conhecer',
    preview: 'O Instagram lançou mais uma ferramenta para criadores. Saiba como usar para aumentar seu alcance e engajamento...',
    scheduledFor: 'Quinta, 09:00',
    platform: 'instagram',
    hashtags: ['Instagram', 'Novidade', 'Dicas']
  }
]

const mockLearningInsights: LearningInsight[] = [
  {
    id: '1',
    category: 'tom',
    insight: 'Tom direto funciona melhor (90% aprovação)',
    confidence: 92,
    metric: '+12%',
    trend: 'up'
  },
  {
    id: '2',
    category: 'tamanho',
    insight: 'Posts curtos performam 3x mais',
    confidence: 85,
    metric: '3x',
    trend: 'up'
  },
  {
    id: '3',
    category: 'horario',
    insight: '10h é seu melhor horário',
    confidence: 78,
    metric: '+45%',
    trend: 'up'
  },
  {
    id: '4',
    category: 'formato',
    insight: 'Carrosséis têm mais engajamento',
    confidence: 88,
    metric: '3x',
    trend: 'up'
  },
  {
    id: '5',
    category: 'tema',
    insight: 'Casos de sucesso atraem mais leads',
    confidence: 82,
    trend: 'up'
  }
]

const upcomingEvents = [
  { title: 'Black Friday', date: 'Em 30 dias', type: 'campaign' },
  { title: 'Natal', date: 'Em 55 dias', type: 'campaign' },
  { title: 'Ano Novo', date: 'Em 62 dias', type: 'campaign' }
]

const stats = {
  pending: 7,
  upcoming: 3,
  published: 23,
  reach: 45.2,
  leads: 67,
  timeSaved: '32h'
}

// ==================== COMPONENTS ====================

function StatCard({ 
  icon: Icon, 
  label, 
  value, 
  trend,
  color = 'teal' 
}: { 
  icon: React.ElementType
  label: string
  value: string | number
  trend?: string
  color?: string
}) {
  return (
    <Card className="border-slate-200 hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className={`w-10 h-10 rounded-xl bg-${color}-100 flex items-center justify-center`}>
            <Icon className={`w-5 h-5 text-${color}-600`} />
          </div>
          {trend && (
            <Badge className="bg-emerald-100 text-emerald-700 border-0 text-xs">
              {trend}
            </Badge>
          )}
        </div>
        <p className="text-2xl font-bold text-slate-900 mt-3">{value}</p>
        <p className="text-sm text-slate-500">{label}</p>
      </CardContent>
    </Card>
  )
}

function SmartSuggestion({ 
  title, 
  description, 
  icon: Icon,
  color,
  actions 
}: { 
  title: string
  description: string
  icon: React.ElementType
  color: string
  actions: { label: string; onClick: () => void; variant?: 'default' | 'outline' }[]
}) {
  return (
    <Card className="border-slate-200 overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-xl bg-${color}-100 flex items-center justify-center shrink-0`}>
            <Icon className={`w-5 h-5 text-${color}-600`} />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-slate-900">{title}</h4>
            <p className="text-sm text-slate-600 mt-1">{description}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              {actions.map((action, i) => (
                <Button
                  key={i}
                  size="sm"
                  variant={action.variant || 'outline'}
                  onClick={action.onClick}
                  className={action.variant === 'default' ? `bg-${color}-500 hover:bg-${color}-600 text-white` : ''}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ==================== MAIN PAGE ====================

export default function BusinessAudiencePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [content, setContent] = useState<OneClickContent[]>(mockContent)
  const [notifications, setNotifications] = useState<FriendlyNotificationProps[]>(mockNotifications)
  const [approvedContent, setApprovedContent] = useState<string[]>([])

  const handleApproveContent = (id: string) => {
    setApprovedContent([...approvedContent, id])
  }

  const handleDismissNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id))
  }

  const pendingContent = content.filter(c => !approvedContent.includes(c.id))

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-6">
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
              <div className="hidden md:flex items-center gap-1">
                <Link href="/">
                  <Button variant="ghost" size="sm" className="text-slate-600">
                    <Home className="w-4 h-4 mr-2" />
                    Início
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" className="bg-teal-50 text-teal-600">
                  <Users className="w-4 h-4 mr-2" />
                  Business Audience
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/dashboard">
                <Button variant="outline" size="sm" className="border-slate-300 text-slate-600">
                  Dashboard
                </Button>
              </Link>
              <div className="relative">
                <Button size="sm" className="bg-teal-500 hover:bg-teal-600 text-white">
                  <Bell className="w-4 h-4" />
                </Button>
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Business Audience</h1>
                <p className="text-slate-500 text-sm">Friendly Automation em ação</p>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard 
              icon={FileText}
              label="Aguardando aprovação"
              value={stats.pending}
              color="amber"
            />
            <StatCard 
              icon={Calendar}
              label="Próximos eventos"
              value={stats.upcoming}
              color="purple"
            />
            <StatCard 
              icon={CheckCircle2}
              label="Publicados este mês"
              value={stats.published}
              trend="+8"
              color="emerald"
            />
            <StatCard 
              icon={TrendingUp}
              label="Alcance total"
              value={`${stats.reach}k`}
              trend="+23%"
              color="blue"
            />
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Column - Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Notifications */}
              {notifications.length > 0 && (
                <Card className="border-slate-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Bell className="w-5 h-5 text-teal-500" />
                      Notificações Friendly
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FriendlyNotificationList 
                      notifications={notifications}
                      onDismiss={handleDismissNotification}
                      maxVisible={3}
                    />
                  </CardContent>
                </Card>
              )}

              {/* Content for Approval */}
              <Card className="border-slate-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <FileText className="w-5 h-5 text-teal-500" />
                      Conteúdo para Aprovação
                    </CardTitle>
                    <Badge className="bg-amber-100 text-amber-700 border-0">
                      {pendingContent.length} pendentes
                    </Badge>
                  </div>
                  <CardDescription>
                    A IA preparou estes conteúdos para você. Aprove com um clique.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                    <AnimatePresence mode="popLayout">
                      {pendingContent.map((item) => (
                        <motion.div
                          key={item.id}
                          layout
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                        >
                          <OneClickActionCard
                            content={item}
                            onApprove={() => handleApproveContent(item.id)}
                            onVariation={() => {}}
                            onEdit={() => {}}
                            onSkip={() => handleApproveContent(item.id)}
                            onFeedback={(fb) => console.log('Feedback:', fb)}
                          />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                  {pendingContent.length === 0 && (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">
                        Todo conteúdo aprovado!
                      </h3>
                      <p className="text-slate-500 text-sm">
                        A IA continuará preparando mais conteúdo. Volte em breve.
                      </p>
                    </div>
                  )}

                  {pendingContent.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <Button 
                        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
                        onClick={() => setContent([])}
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Aprovar todos ({pendingContent.length})
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Smart Suggestions */}
              <Card className="border-slate-200">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Lightbulb className="w-5 h-5 text-amber-500" />
                    Sugestões Inteligentes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <SmartSuggestion
                    title="Tendência detectada: IA no varejo"
                    description="Este tema está subindo no seu setor. Posso preparar conteúdo sobre isso."
                    icon={Flame}
                    color="orange"
                    actions={[
                      { label: 'Criar conteúdo', onClick: () => {}, variant: 'default' },
                      { label: 'Ver mais', onClick: () => {}, variant: 'outline' }
                    ]}
                  />
                  <SmartSuggestion
                    title="Black Friday em 30 dias"
                    description="Preparei uma campanha completa para você. Dê uma olhada."
                    icon={Calendar}
                    color="purple"
                    actions={[
                      { label: 'Ver campanha', onClick: () => {}, variant: 'default' },
                      { label: 'Editar', onClick: () => {}, variant: 'outline' }
                    ]}
                  />
                  <SmartSuggestion
                    title="Seu melhor post está performando"
                    description="O post de ontem já tem 2.4k visualizações. Publiquei um follow-up."
                    icon={TrendingUp}
                    color="emerald"
                    actions={[
                      { label: 'Ver follow-up', onClick: () => {}, variant: 'default' }
                    ]}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Growth Score */}
              <GrowthScore
                level="growing"
                progress={45}
                stats={{
                  published: 23,
                  reach: 45.2,
                  leads: 67,
                  timeSaved: '32h'
                }}
                trend={{
                  value: 23,
                  direction: 'up'
                }}
              />

              {/* Learning Panel */}
              <LearningPanel insights={mockLearningInsights} />

              {/* Upcoming Events */}
              <Card className="border-slate-200">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Calendar className="w-5 h-5 text-purple-500" />
                    Próximos Eventos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {upcomingEvents.map((event, i) => (
                    <div 
                      key={i}
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-slate-900 text-sm">{event.title}</p>
                        <p className="text-xs text-slate-500">{event.date}</p>
                      </div>
                      <Badge className="bg-purple-100 text-purple-700 border-0 text-xs">
                        Campanha
                      </Badge>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full mt-2" size="sm">
                    Ver calendário
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="border-slate-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Ações Rápidas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Solicitar conteúdo específico
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <Settings className="w-4 h-4 mr-2" />
                    Ajustar preferências
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Ver relatório completo
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

// Simple plus icon component
function PlusIcon({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  )
}
