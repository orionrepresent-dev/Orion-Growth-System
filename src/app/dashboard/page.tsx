'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Search,
  BarChart3,
  Zap,
  Brain,
  TrendingUp,
  Globe,
  Target,
  Users,
  Calendar,
  DollarSign,
  FileText,
  Settings,
  Bell,
  CheckCircle2,
  Clock,
  AlertCircle,
  RefreshCw,
  PieChart,
  LineChart,
  Instagram,
  Linkedin,
  Megaphone,
  ClipboardList,
  Crown,
  Download,
  Plus,
  ArrowRight,
  Eye,
  Edit,
  Trash2,
  Rocket,
  LogOut,
  Loader2,
  Mail,
  Phone,
  Building2,
  ExternalLink,
  MessageCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { SafeUser, DashboardStats, Lead } from '@/types'

// Plan details
const planDetails = {
  presenca: { name: 'Presença Digital', price: 497 },
  autoridade: { name: 'Autoridade Local', price: 997 },
  dominacao: { name: 'Dominação de Mercado', price: 1497 }
}

// Roadmap items
const roadmapItems = [
  { id: 1, week: 'Semana 1', title: 'Análise SEO Completa', status: 'completed', date: '01/02/2024', description: 'Auditoria técnica completa do site' },
  { id: 2, week: 'Semana 2', title: 'Business Audience & ICP', status: 'completed', date: '08/02/2024', description: 'Mapeamento do cliente ideal' },
  { id: 3, week: 'Semana 3', title: 'Configuração Redes Sociais', status: 'completed', date: '15/02/2024', description: 'Setup inicial e calendário editorial' },
  { id: 4, week: 'Semana 4', title: 'Criação de Conteúdo', status: 'active', date: '22/02/2024', description: 'Posts para Instagram e LinkedIn' },
  { id: 5, week: 'Semana 5', title: 'Otimização Técnica', status: 'pending', date: '01/03/2024', description: 'Implementação de melhorias SEO' },
  { id: 6, week: 'Semana 6', title: 'Relatório de ROI', status: 'pending', date: '08/03/2024', description: 'Análise de resultados mensal' }
]

// ROI data
const roiData = [
  { service: 'SEO Orgânico', investment: 997, return: 3190, roi: 320, trend: 'up' },
  { service: 'Redes Sociais', investment: 0, return: 850, roi: 0, trend: 'up' },
  { service: 'Business Audience', investment: 0, return: 1200, roi: 0, trend: 'up' },
  { service: 'Conteúdo Blog', investment: 0, return: 680, roi: 0, trend: 'stable' }
]

// Social posts
const socialPosts = [
  { id: 1, platform: 'instagram', content: '5 dicas de SEO para alavancar seu negócio digital...', status: 'scheduled', date: '25/02/2024', time: '10:00' },
  { id: 2, platform: 'linkedin', content: 'Você sabe o que é Business Audience e como ele pode transformar...', status: 'published', date: '22/02/2024', time: '09:00' },
  { id: 3, platform: 'instagram', content: 'A importância do ICP na estratégia de marketing digital...', status: 'draft', date: '-', time: '-' },
  { id: 4, platform: 'linkedin', content: '3 métricas essenciais que todo empreendedor deve acompanhar...', status: 'scheduled', date: '27/02/2024', time: '14:00' }
]

// Services
const services = [
  { name: 'Análise SEO Mensal', status: 'active', description: 'Auditoria completa com recomendações', progress: 75 },
  { name: 'Business Audience', status: 'active', description: 'ICP e análise de mercado', progress: 100 },
  { name: 'Gestão Redes Sociais', status: 'active', description: '12 posts/mês otimizados', progress: 66 },
  { name: 'Dashboard de ROI', status: 'active', description: 'Métricas em tempo real', progress: 100 },
  { name: 'Roadmap de Execução', status: 'active', description: 'Cronograma mensal de ações', progress: 50 }
]

// ICP data
const icpData = {
  demographics: {
    age: '35-45 anos',
    gender: 'Misto (60% M, 40% F)',
    location: 'São Paulo, Rio de Janeiro, Minas Gerais',
    income: 'R$ 10.000 - R$ 50.000/mês'
  },
  psychographics: {
    interests: ['Tecnologia', 'Empreendedorismo', 'Marketing Digital', 'E-commerce'],
    behaviors: ['Pesquisa antes de comprar', 'Valoriza qualidade', 'Ativo em redes sociais'],
    pain_points: ['Falta de tempo', 'Dificuldade em escalar', 'Competição acirrada']
  },
  benchmarks: {
    position: 'Top 30%',
    competitors: ['Concorrente A', 'Concorrente B', 'Concorrente C'],
    opportunities: ['Conteúdo técnico', 'Vídeos curtos', 'LinkedIn orgânico']
  }
}

export default function DashboardPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')
  const [user, setUser] = useState<SafeUser | null>(null)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Fetch user and stats
  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch user
        const userRes = await fetch('/api/auth/me')
        const userData = await userRes.json()

        if (!userData.success || !userData.user) {
          router.push('/login?redirect=/dashboard')
          return
        }

        setUser(userData.user)

        // Fetch stats
        const statsRes = await fetch('/api/stats')
        const statsData = await statsRes.json()

        if (statsData.success) {
          setStats(statsData.stats)
        }
      } catch (err) {
        console.error('Error fetching data:', err)
        setError('Erro ao carregar dados')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-emerald-500">Concluído</Badge>
      case 'active':
        return <Badge className="bg-purple-500">Em Progresso</Badge>
      case 'pending':
        return <Badge variant="secondary">Pendente</Badge>
      case 'scheduled':
        return <Badge className="bg-blue-500">Agendado</Badge>
      case 'published':
        return <Badge className="bg-emerald-500">Publicado</Badge>
      case 'draft':
        return <Badge variant="outline">Rascunho</Badge>
      case 'new':
        return <Badge className="bg-blue-500">Novo</Badge>
      case 'contacted':
        return <Badge className="bg-amber-500">Contatado</Badge>
      case 'converted':
        return <Badge className="bg-emerald-500">Convertido</Badge>
      case 'qualified':
        return <Badge className="bg-teal-500">Qualificado</Badge>
      case 'lost':
        return <Badge variant="destructive">Perdido</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'instagram':
        return <Instagram className="w-4 h-4 text-pink-500" />
      case 'linkedin':
        return <Linkedin className="w-4 h-4 text-blue-600" />
      default:
        return <Globe className="w-4 h-4" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500 mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando dashboard...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Erro ao carregar</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Tentar novamente</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Not logged in
  if (!user) {
    return null
  }

  const planInfo = planDetails[user.plan || 'presenca']

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
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
              <div className="hidden sm:block h-8 w-px bg-border mx-2" />
              <Badge variant="secondary" className="hidden sm:flex">
                <Crown className="w-3 h-3 mr-1 text-purple-500" />
                {planInfo.name}
              </Badge>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon">
                <Bell className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="w-5 h-5" />
              </Button>
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-violet-500 text-white text-sm">
                  {user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome & Plan Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                Bem-vindo, <span className="text-purple-600">{user.name}</span>
              </h1>
              <p className="text-muted-foreground">
                Acompanhe seu crescimento e resultados em tempo real.
              </p>
            </div>
            <Card className="bg-gradient-to-r from-purple-600 to-violet-600 border-0 text-white">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-sm text-white/80">Plano Atual</p>
                    <p className="text-xl font-bold">{planInfo.name}</p>
                  </div>
                  <div className="h-10 w-px bg-white/20" />
                  <div>
                    <p className="text-sm text-white/80">Investimento</p>
                    <p className="font-medium">R$ {planInfo.price}/mês</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Quick Stats - REAL DATA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-muted-foreground">Total de Leads</span>
              </div>
              <div className="text-2xl font-bold">{stats?.totalLeads || 0}</div>
              <p className="text-xs text-emerald-500 mt-1">
                +{stats?.newLeads || 0} novos
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 mb-2">
                <Search className="w-4 h-4 text-purple-500" />
                <span className="text-sm text-muted-foreground">Análises</span>
              </div>
              <div className="text-2xl font-bold">{stats?.analysesPerformed || 0}</div>
              <Progress value={(stats?.analysesPerformed || 0) * 20} className="h-2 mt-2" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 mb-2">
                <Mail className="w-4 h-4 text-teal-500" />
                <span className="text-sm text-muted-foreground">Emails Enviados</span>
              </div>
              <div className="text-2xl font-bold">{stats?.emailsSent || 0}</div>
              <Progress value={(stats?.emailsSent || 0) * 5} className="h-2 mt-2" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                <span className="text-sm text-muted-foreground">Conversão</span>
              </div>
              <div className="text-2xl font-bold">{stats?.conversionRate || 0}%</div>
              <Progress value={stats?.conversionRate || 0} className="h-2 mt-2" />
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="leads">Leads</TabsTrigger>
            <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
            <TabsTrigger value="roi">ROI</TabsTrigger>
            <TabsTrigger value="social">Redes Sociais</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Services */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ClipboardList className="w-5 h-5 text-purple-500" />
                    Serviços Contratados
                  </CardTitle>
                  <CardDescription>
                    Acompanhe o progresso de cada serviço
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {services.map((service, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium">{service.name}</span>
                            <span className="text-sm text-muted-foreground">{service.progress}%</span>
                          </div>
                          <Progress value={service.progress} className="h-2" />
                          <p className="text-xs text-muted-foreground mt-1">{service.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Revenue Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-emerald-500" />
                    Receita
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg">
                    <p className="text-sm text-muted-foreground">Receita Confirmada</p>
                    <p className="text-2xl font-bold text-emerald-600">
                      R$ {(stats?.revenue.confirmed || 0).toLocaleString('pt-BR')}
                    </p>
                  </div>
                  <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                    <p className="text-sm text-muted-foreground">Potencial de Receita</p>
                    <p className="text-2xl font-bold text-purple-600">
                      R$ {(stats?.revenue.potential || 0).toLocaleString('pt-BR')}
                    </p>
                  </div>
                  <Separator />
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-violet-600">
                    <Download className="w-4 h-4 mr-2" />
                    Exportar Relatório
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Recent Leads - REAL DATA */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Leads Recentes</CardTitle>
                  <Button variant="outline" size="sm" onClick={() => setActiveTab('leads')}>
                    Ver todos
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {stats?.recentLeads && stats.recentLeads.length > 0 ? (
                  <div className="space-y-3">
                    {stats.recentLeads.slice(0, 5).map((lead) => (
                      <div key={lead.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/30">
                        <Avatar>
                          <AvatarFallback className="bg-gradient-to-br from-purple-500 to-violet-500 text-white">
                            {lead.data.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{lead.data.name}</div>
                          <div className="text-sm text-muted-foreground truncate">{lead.data.email}</div>
                        </div>
                        <div className="text-right">
                          {getStatusBadge(lead.status)}
                          <div className="text-xs text-muted-foreground mt-1">
                            {formatDate(lead.createdAt)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Nenhum lead encontrado</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Leads Tab - REAL DATA */}
          <TabsContent value="leads">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-purple-500" />
                      Todos os Leads
                    </CardTitle>
                    <CardDescription>
                      Gerencie e acompanhe seus leads
                    </CardDescription>
                  </div>
                  <Button size="sm" className="bg-gradient-to-r from-purple-600 to-violet-600">
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Lead
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {stats?.recentLeads && stats.recentLeads.length > 0 ? (
                  <ScrollArea className="h-[500px]">
                    <div className="space-y-4">
                      {stats.recentLeads.map((lead) => (
                        <Card key={lead.id} className="overflow-hidden">
                          <div className="flex flex-col md:flex-row md:items-center gap-4 p-4">
                            <Avatar className="h-12 w-12">
                              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-violet-500 text-white text-lg">
                                {lead.data.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="font-semibold text-lg">{lead.data.name}</div>
                              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                {lead.data.email && (
                                  <span className="flex items-center gap-1">
                                    <Mail className="w-3 h-3" />
                                    {lead.data.email}
                                  </span>
                                )}
                                {lead.data.phone && (
                                  <span className="flex items-center gap-1">
                                    <Phone className="w-3 h-3" />
                                    {lead.data.phone}
                                  </span>
                                )}
                                {lead.data.company && (
                                  <span className="flex items-center gap-1">
                                    <Building2 className="w-3 h-3" />
                                    {lead.data.company}
                                  </span>
                                )}
                              </div>
                              {lead.data.url && (
                                <a 
                                  href={lead.data.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-sm text-purple-600 hover:underline flex items-center gap-1 mt-1"
                                >
                                  <Globe className="w-3 h-3" />
                                  {lead.data.url}
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              )}
                            </div>
                            <div className="flex flex-col md:items-end gap-2">
                              {getStatusBadge(lead.status)}
                              <span className="text-xs text-muted-foreground">
                                {formatDate(lead.createdAt)}
                              </span>
                              {lead.quote && (
                                <div className="text-sm">
                                  <span className="text-emerald-600 font-medium">
                                    R$ {lead.quote.minPrice?.toLocaleString('pt-BR')} - R$ {lead.quote.maxPrice?.toLocaleString('pt-BR')}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="icon">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="outline" size="icon" asChild>
                                <a href={`https://wa.me/55${lead.data.phone?.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">
                                  <MessageCircle className="w-4 h-4" />
                                </a>
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">Nenhum lead encontrado</p>
                    <p className="text-sm">Os leads aparecerão aqui quando houver cadastros</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Roadmap Tab */}
          <TabsContent value="roadmap">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-purple-500" />
                  Roadmap de Execução Mensal
                </CardTitle>
                <CardDescription>
                  Cronograma completo de ações planejadas e executadas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-muted" />
                  
                  <div className="space-y-6">
                    {roadmapItems.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="relative flex items-start gap-4 pl-12"
                      >
                        <div className={`absolute left-3 w-5 h-5 rounded-full border-2 ${
                          item.status === 'completed' ? 'bg-emerald-500 border-emerald-500' :
                          item.status === 'active' ? 'bg-purple-500 border-purple-500 animate-pulse' :
                          'bg-background border-muted-foreground/30'
                        }`}>
                          {item.status === 'completed' && <CheckCircle2 className="w-4 h-4 text-white" />}
                        </div>
                        
                        <Card className="flex-1">
                          <CardContent className="pt-4">
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-sm font-medium text-purple-600">{item.week}</span>
                                  <span className="text-sm text-muted-foreground">• {item.date}</span>
                                </div>
                                <h4 className="font-semibold mb-1">{item.title}</h4>
                                <p className="text-sm text-muted-foreground">{item.description}</p>
                              </div>
                              {getStatusBadge(item.status)}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ROI Tab */}
          <TabsContent value="roi">
            <div className="grid lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-emerald-500" />
                    Dashboard de ROI
                  </CardTitle>
                  <CardDescription>
                    Retorno sobre investimento de cada serviço
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg font-medium text-sm">
                      <div>Serviço</div>
                      <div className="text-center">Investimento</div>
                      <div className="text-right">Retorno</div>
                    </div>
                    {roiData.map((item, index) => (
                      <div key={index} className="grid grid-cols-3 gap-4 p-4 border rounded-lg">
                        <div className="flex items-center gap-2">
                          {item.trend === 'up' && <TrendingUp className="w-4 h-4 text-emerald-500" />}
                          {item.trend === 'stable' && <BarChart3 className="w-4 h-4 text-amber-500" />}
                          <span className="font-medium">{item.service}</span>
                        </div>
                        <div className="text-center">
                          {item.investment > 0 ? `R$ ${item.investment.toLocaleString('pt-BR')}` : 'Incluso no plano'}
                        </div>
                        <div className="text-right">
                          <span className="text-emerald-600 font-semibold">R$ {item.return.toLocaleString('pt-BR')}</span>
                          {item.roi > 0 && (
                            <Badge className="ml-2 bg-emerald-500">+{item.roi}%</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">ROI Total do Mês</p>
                        <p className="text-3xl font-bold text-emerald-600">R$ 5.920</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Investimento Total</p>
                        <p className="text-2xl font-bold">R$ {planInfo.price}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-emerald-500" />
                      <span className="font-medium text-emerald-600">Retorno de 5.9x sobre o investimento</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Resumo Financeiro</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <p className="text-sm text-muted-foreground">Investimento Mensal</p>
                    <p className="text-2xl font-bold">R$ {planInfo.price}</p>
                  </div>
                  <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg">
                    <p className="text-sm text-muted-foreground">Receita Gerada</p>
                    <p className="text-2xl font-bold text-emerald-600">
                      R$ {(stats?.revenue.confirmed || 0).toLocaleString('pt-BR')}
                    </p>
                  </div>
                  <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                    <p className="text-sm text-muted-foreground">Taxa de Conversão</p>
                    <p className="text-2xl font-bold text-purple-600">{stats?.conversionRate || 0}%</p>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-violet-600">
                    <Download className="w-4 h-4 mr-2" />
                    Exportar Relatório
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Social Media Tab */}
          <TabsContent value="social">
            <div className="grid lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Megaphone className="w-5 h-5 text-pink-500" />
                        Gestão de Redes Sociais
                      </CardTitle>
                      <CardDescription>
                        Posts agendados e publicados
                      </CardDescription>
                    </div>
                    <Button size="sm" className="bg-gradient-to-r from-purple-600 to-violet-600">
                      <Plus className="w-4 h-4 mr-2" />
                      Novo Post
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {socialPosts.map((post) => (
                      <div key={post.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3">
                            {getPlatformIcon(post.platform)}
                            <div>
                              <p className="text-sm mb-1">{post.content}</p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Calendar className="w-3 h-3" />
                                <span>{post.date} às {post.time}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(post.status)}
                            <Button variant="ghost" size="icon">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Estatísticas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Instagram className="w-5 h-5 text-pink-500" />
                      <span>Instagram</span>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">2.4k</p>
                      <p className="text-xs text-emerald-500">+12%</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Linkedin className="w-5 h-5 text-blue-600" />
                      <span>LinkedIn</span>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">1.8k</p>
                      <p className="text-xs text-emerald-500">+8%</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                    <p className="text-sm text-muted-foreground">Posts este mês</p>
                    <p className="text-2xl font-bold">8/12</p>
                    <Progress value={66} className="h-2 mt-2" />
                  </div>
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg">
                    <p className="text-sm text-muted-foreground">Engajamento médio</p>
                    <p className="text-2xl font-bold text-emerald-600">4.7%</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
