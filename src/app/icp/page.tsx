'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  Download,
  Share2,
  Loader2,
  Users,
  Target,
  TrendingUp,
  MapPin,
  Brain,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Lightbulb,
  BarChart3,
  Globe,
  Building2,
  Heart,
  Shield,
  Zap,
  Eye,
  UserX,
  Trophy,
  PieChart,
  LineChart,
  Compass,
  Sparkles,
  Rocket
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

interface ICPAnalysis {
  metaInfo: {
    analyzedAt: string
    dataSource: string[]
    confidenceLevel: 'high' | 'medium' | 'low'
    marketMaturity: 'emerging' | 'growing' | 'mature' | 'saturated'
  }
  primaryICP: {
    name: string
    description: string
    demographics: {
      ageRange: string
      gender: string
      income: string
      education: string
      location: string[]
      companySize: string
      jobTitles: string[]
      industry: string[]
    }
    firmographics: {
      revenue: string
      employees: string
      yearsInBusiness: string
      techStack: string[]
      fundingStage: string
    }
    psychographics: {
      values: string[]
      fears: string[]
      desires: string[]
      triggers: string[]
      objections: string[]
      decisionCriteria: string[]
    }
    behaviors: {
      channels: string[]
      contentConsumption: string[]
      buyingPatterns: string[]
      socialProofNeeds: string[]
    }
    painPoints: {
      primary: string[]
      secondary: string[]
      latent: string[]
    }
    goals: {
      shortTerm: string[]
      mediumTerm: string[]
      longTerm: string[]
    }
  }
  secondaryICPs: Array<{
    name: string
    description: string
    percentage: number
    keyDifferences: string[]
  }>
  negativeICPs: Array<{
    profile: string
    reasons: string[]
    warningSigns: string[]
    opportunityCost: string
  }>
  marketAnalysis: {
    tam: string
    sam: string
    som: string
    growthRate: string
    trends: Array<{
      name: string
      impact: 'positive' | 'negative' | 'neutral'
      timeHorizon: string
      description: string
    }>
    marketGaps: string[]
    opportunities: string[]
  }
  competitiveLandscape: {
    directCompetitors: Array<{
      name: string
      positioning: string
      targetAudience: string
      strengths: string[]
      weaknesses: string[]
    }>
    indirectCompetitors: Array<{
      name: string
      threat: string
    }>
    blueOcean: string[]
  }
  regionalInsights: Array<{
    region: string
    characteristics: string[]
    opportunities: string[]
    culturalNuances: string[]
    buyingBehavior: string
  }>
  trends: {
    confirmed: Array<{
      trend: string
      impact: string
      actionRequired: string
    }>
    projected: Array<{
      trend: string
      probability: string
      preparation: string
    }>
    toTest: Array<{
      hypothesis: string
      testMethod: string
      successMetric: string
    }>
  }
  strategicRecommendations: {
    positioning: string
    messaging: string[]
    channels: string[]
    contentStrategy: string[]
    pricingStrategy: string
    differentiationPoints: string[]
  }
  successMetrics: {
    acquisition: Array<{ metric: string; target: string }>
    engagement: Array<{ metric: string; target: string }>
    conversion: Array<{ metric: string; target: string }>
    retention: Array<{ metric: string; target: string }>
  }
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}

const getConfidenceColor = (level: string) => {
  switch (level) {
    case 'high': return 'text-emerald-500'
    case 'medium': return 'text-yellow-500'
    case 'low': return 'text-red-500'
    default: return 'text-muted-foreground'
  }
}

const getImpactBadge = (impact: string) => {
  switch (impact) {
    case 'positive': return <Badge className="bg-emerald-500">Positivo</Badge>
    case 'negative': return <Badge variant="destructive">Negativo</Badge>
    default: return <Badge variant="secondary">Neutro</Badge>
  }
}

function ICPPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [icp, setIcp] = useState<ICPAnalysis | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('primary')

  useEffect(() => {
    // Check for stored analysis data
    const storedICP = sessionStorage.getItem('icpAnalysis')
    const storedFormData = sessionStorage.getItem('icpFormData')

    if (storedICP) {
      try {
        setIcp(JSON.parse(storedICP))
        setLoading(false)
        return
      } catch {
        // Invalid stored data, fetch new
      }
    }

    if (storedFormData) {
      analyzeICP(JSON.parse(storedFormData))
    } else {
      // No data, redirect to form
      router.push('/analyze')
    }
  }, [router])

  const analyzeICP = async (formData: Record<string, string>) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/icp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        throw new Error('Erro ao processar análise ICP')
      }

      const data = await response.json()
      setIcp(data.icp)
      sessionStorage.setItem('icpAnalysis', JSON.stringify(data.icp))
    } catch (err) {
      setError('Ocorreu um erro ao processar sua análise ICP. Por favor, tente novamente.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-50 dark:from-purple-950/20 dark:via-violet-950/20 dark:to-indigo-950/20 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-600 to-violet-600 flex items-center justify-center"
          >
            <Brain className="w-10 h-10 text-white" />
          </motion.div>
          <h2 className="text-2xl font-bold mb-4 gradient-text">Análise ICP Avançada</h2>
          <p className="text-muted-foreground mb-6">
            Nosso sistema está coletando dados de mercado, analisando concorrentes,
            identificando tendências e mapeando regionalismos...
          </p>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2 justify-center">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Buscando dados do mercado...</span>
            </div>
            <div className="flex items-center gap-2 justify-center">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Analisando fatores psicográficos...</span>
            </div>
            <div className="flex items-center gap-2 justify-center">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Identificando ICPs negativos...</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !icp) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-50 dark:from-purple-950/20 dark:via-violet-950/20 dark:to-indigo-950/20 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-yellow-500" />
            <h2 className="text-xl font-bold mb-2">Ops! Algo deu errado</h2>
            <p className="text-muted-foreground mb-6">{error || 'Não foi possível carregar a análise ICP'}</p>
            <Link href="/analyze">
              <Button className="bg-gradient-to-r from-purple-600 to-violet-600">
                Tentar Novamente
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-50 dark:from-purple-950/20 dark:via-violet-950/20 dark:to-indigo-950/20">
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
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Exportar PDF
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Compartilhar
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title Section */}
        <motion.div initial="initial" animate="animate" variants={fadeInUp} className="mb-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Brain className="w-4 h-4" />
            <span>Análise ICP Avançada • {new Date(icp.metaInfo.analyzedAt).toLocaleString('pt-BR')}</span>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <h1 className="text-3xl sm:text-4xl font-bold">
              <span className="gradient-text">Ideal Customer Profile</span>
            </h1>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-purple-500 text-purple-600">
                Confiança: <span className={getConfidenceColor(icp.metaInfo.confidenceLevel)}>{icp.metaInfo.confidenceLevel}</span>
              </Badge>
              <Badge variant="secondary">
                Mercado: {icp.metaInfo.marketMaturity}
              </Badge>
            </div>
          </div>
        </motion.div>

        {/* Main ICP Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-8">
          <Card className="bg-gradient-to-br from-purple-600 to-violet-700 text-white border-0 overflow-hidden relative">
            <div className="absolute inset-0 bg-[url('/hero-bg.png')] bg-cover bg-center opacity-10" />
            <CardContent className="relative pt-8 pb-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                  <Users className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-2">{icp.primaryICP.name}</h2>
                  <p className="text-white/90">{icp.primaryICP.description}</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="text-white/70 text-sm mb-1">Faixa Etária</div>
                  <div className="font-semibold">{icp.primaryICP.demographics.ageRange}</div>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="text-white/70 text-sm mb-1">Renda</div>
                  <div className="font-semibold">{icp.primaryICP.demographics.income}</div>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="text-white/70 text-sm mb-1">Porte Empresa</div>
                  <div className="font-semibold">{icp.primaryICP.firmographics.employees}</div>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="text-white/70 text-sm mb-1">Faturamento</div>
                  <div className="font-semibold">{icp.primaryICP.firmographics.revenue}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 gap-2 h-auto">
            <TabsTrigger value="primary" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <Target className="w-4 h-4 mr-2" />
              ICP Principal
            </TabsTrigger>
            <TabsTrigger value="psychographics" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <Brain className="w-4 h-4 mr-2" />
              Psicografia
            </TabsTrigger>
            <TabsTrigger value="negative" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
              <UserX className="w-4 h-4 mr-2" />
              ICPs Negativos
            </TabsTrigger>
            <TabsTrigger value="market" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <BarChart3 className="w-4 h-4 mr-2" />
              Mercado
            </TabsTrigger>
            <TabsTrigger value="regional" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <MapPin className="w-4 h-4 mr-2" />
              Regionalismo
            </TabsTrigger>
            <TabsTrigger value="strategy" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <Compass className="w-4 h-4 mr-2" />
              Estratégia
            </TabsTrigger>
          </TabsList>

          {/* Primary ICP Tab */}
          <TabsContent value="primary" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Demographics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-purple-500" />
                    Dados Demográficos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Gênero</div>
                      <div className="font-medium">{icp.primaryICP.demographics.gender}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Escolaridade</div>
                      <div className="font-medium">{icp.primaryICP.demographics.education}</div>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-2">Localização</div>
                    <div className="flex flex-wrap gap-2">
                      {icp.primaryICP.demographics.location.map((loc, i) => (
                        <Badge key={i} variant="secondary">{loc}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-2">Cargos</div>
                    <div className="flex flex-wrap gap-2">
                      {icp.primaryICP.demographics.jobTitles.map((title, i) => (
                        <Badge key={i} variant="outline">{title}</Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Firmographics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-blue-500" />
                    Dados Firmográficos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Anos de Mercado</div>
                      <div className="font-medium">{icp.primaryICP.firmographics.yearsInBusiness}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Estágio Funding</div>
                      <div className="font-medium">{icp.primaryICP.firmographics.fundingStage}</div>
                    </div>
                  </div>
                  {icp.primaryICP.firmographics.techStack.length > 0 && (
                    <div>
                      <div className="text-sm text-muted-foreground mb-2">Tech Stack</div>
                      <div className="flex flex-wrap gap-2">
                        {icp.primaryICP.firmographics.techStack.map((tech, i) => (
                          <Badge key={i} variant="outline">{tech}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Pain Points */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-500" />
                    Dores e Problemas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-sm font-medium text-red-600 mb-2">Dores Primárias</div>
                    <ul className="space-y-1">
                      {icp.primaryICP.painPoints.primary.map((pain, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <XCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                          {pain}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-yellow-600 mb-2">Dores Secundárias</div>
                    <ul className="space-y-1">
                      {icp.primaryICP.painPoints.secondary.map((pain, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5 shrink-0" />
                          {pain}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-2">Dores Latentes</div>
                    <ul className="space-y-1">
                      {icp.primaryICP.painPoints.latent.map((pain, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <Eye className="w-4 h-4 mt-0.5 shrink-0" />
                          {pain}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Goals */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-emerald-500" />
                    Objetivos e Metas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-sm font-medium mb-2">Curto Prazo</div>
                    <ul className="space-y-1">
                      {icp.primaryICP.goals.shortTerm.map((goal, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                          {goal}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="text-sm font-medium mb-2">Médio Prazo</div>
                    <ul className="space-y-1">
                      {icp.primaryICP.goals.mediumTerm.map((goal, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                          {goal}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="text-sm font-medium mb-2">Longo Prazo</div>
                    <ul className="space-y-1">
                      {icp.primaryICP.goals.longTerm.map((goal, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-purple-500 mt-0.5 shrink-0" />
                          {goal}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Secondary ICPs */}
            {icp.secondaryICPs.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-violet-500" />
                    ICPs Secundários
                  </CardTitle>
                  <CardDescription>Perfis adicionais com potencial de conversão</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {icp.secondaryICPs.map((secondary, i) => (
                      <div key={i} className="p-4 rounded-lg border bg-muted/30">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{secondary.name}</span>
                          <Badge variant="secondary">{secondary.percentage}%</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{secondary.description}</p>
                        <div className="text-xs text-muted-foreground">
                          {secondary.keyDifferences.map((diff, j) => (
                            <div key={j}>• {diff}</div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Psychographics Tab */}
          <TabsContent value="psychographics" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Values & Desires */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-pink-500" />
                    Valores e Desejos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-sm font-medium mb-2">Valores</div>
                    <div className="flex flex-wrap gap-2">
                      {icp.primaryICP.psychographics.values.map((value, i) => (
                        <Badge key={i} className="bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300">
                          {value}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium mb-2">Desejos</div>
                    <div className="flex flex-wrap gap-2">
                      {icp.primaryICP.psychographics.desires.map((desire, i) => (
                        <Badge key={i} variant="outline" className="border-pink-500 text-pink-600">
                          {desire}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Fears & Triggers */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-red-500" />
                    Medos e Gatilhos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-sm font-medium text-red-600 mb-2">Medos</div>
                    <ul className="space-y-1">
                      {icp.primaryICP.psychographics.fears.map((fear, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                          {fear}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-amber-600 mb-2">Gatilhos de Compra</div>
                    <ul className="space-y-1">
                      {icp.primaryICP.psychographics.triggers.map((trigger, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <Zap className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                          {trigger}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Objections & Decision Criteria */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-500" />
                    Objeções Comuns
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {icp.primaryICP.psychographics.objections.map((objection, i) => (
                      <li key={i} className="flex items-start gap-3 p-3 rounded-lg bg-orange-50 dark:bg-orange-950/20">
                        <XCircle className="w-5 h-5 text-orange-500 mt-0.5 shrink-0" />
                        <div>
                          <span className="font-medium">{objection}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Behaviors */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="w-5 h-5 text-blue-500" />
                    Comportamentos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-sm font-medium mb-2">Canais de Preferência</div>
                    <div className="flex flex-wrap gap-2">
                      {icp.primaryICP.behaviors.channels.map((channel, i) => (
                        <Badge key={i} variant="secondary">{channel}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium mb-2">Consumo de Conteúdo</div>
                    <div className="flex flex-wrap gap-2">
                      {icp.primaryICP.behaviors.contentConsumption.map((content, i) => (
                        <Badge key={i} variant="outline">{content}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium mb-2">Padrão de Compra</div>
                    <ul className="space-y-1">
                      {icp.primaryICP.behaviors.buyingPatterns.map((pattern, i) => (
                        <li key={i} className="text-sm text-muted-foreground">• {pattern}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="text-sm font-medium mb-2">Necessidades de Prova Social</div>
                    <ul className="space-y-1">
                      {icp.primaryICP.behaviors.socialProofNeeds.map((proof, i) => (
                        <li key={i} className="text-sm text-muted-foreground">• {proof}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Negative ICPs Tab */}
          <TabsContent value="negative" className="space-y-6">
            <Alert className="border-red-500 bg-red-50 dark:bg-red-950/20">
              <UserX className="w-5 h-5 text-red-500" />
              <AlertTitle className="text-red-700 dark:text-red-300">ICPs Negativos - Tão Importante Quanto o ICP Positivo!</AlertTitle>
              <AlertDescription className="text-red-600 dark:text-red-400">
                Identificar quem NÃO é seu cliente ideal é crucial. Esses perfis representam desperdício de recursos,
                tempo de vendas mal investido e potencial para insatisfação.
              </AlertDescription>
            </Alert>

            <div className="grid md:grid-cols-2 gap-6">
              {icp.negativeICPs.map((negative, i) => (
                <Card key={i} className="border-red-200 dark:border-red-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-600">
                      <UserX className="w-5 h-5" />
                      {negative.profile}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="text-sm font-medium text-red-600 mb-2">Por que NÃO é cliente ideal</div>
                      <ul className="space-y-1">
                        {negative.reasons.map((reason, j) => (
                          <li key={j} className="flex items-start gap-2 text-sm">
                            <XCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                            {reason}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-amber-600 mb-2">Sinais de Alerta</div>
                      <div className="flex flex-wrap gap-2">
                        {negative.warningSigns.map((sign, j) => (
                          <Badge key={j} variant="outline" className="border-amber-500 text-amber-600">
                            {sign}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
                      <div className="text-sm font-medium text-red-600">Custo de Oportunidade</div>
                      <div className="text-sm text-muted-foreground">{negative.opportunityCost}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Market Analysis Tab */}
          <TabsContent value="market" className="space-y-6">
            {/* TAM/SAM/SOM */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-purple-500" />
                  TAM / SAM / SOM
                </CardTitle>
                <CardDescription>Análise do tamanho do mercado endereçável</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-3 gap-6">
                  <div className="text-center p-6 rounded-xl bg-purple-100 dark:bg-purple-950/30">
                    <div className="text-3xl font-bold text-purple-600 mb-1">{icp.marketAnalysis.tam}</div>
                    <div className="text-sm text-muted-foreground">TAM</div>
                    <div className="text-xs text-muted-foreground mt-1">Total Addressable Market</div>
                  </div>
                  <div className="text-center p-6 rounded-xl bg-violet-100 dark:bg-violet-950/30">
                    <div className="text-3xl font-bold text-violet-600 mb-1">{icp.marketAnalysis.sam}</div>
                    <div className="text-sm text-muted-foreground">SAM</div>
                    <div className="text-xs text-muted-foreground mt-1">Serviceable Addressable Market</div>
                  </div>
                  <div className="text-center p-6 rounded-xl bg-indigo-100 dark:bg-indigo-950/30">
                    <div className="text-3xl font-bold text-indigo-600 mb-1">{icp.marketAnalysis.som}</div>
                    <div className="text-sm text-muted-foreground">SOM</div>
                    <div className="text-xs text-muted-foreground mt-1">Serviceable Obtainable Market</div>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <span className="text-sm text-muted-foreground">Taxa de Crescimento Anual: </span>
                  <span className="font-bold text-emerald-500">{icp.marketAnalysis.growthRate}</span>
                </div>
              </CardContent>
            </Card>

            {/* Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="w-5 h-5 text-blue-500" />
                  Tendências de Mercado
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {icp.marketAnalysis.trends.map((trend, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-lg border">
                      <div>
                        <div className="font-medium">{trend.name}</div>
                        <div className="text-sm text-muted-foreground">{trend.description}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getImpactBadge(trend.impact)}
                        <Badge variant="outline">{trend.timeHorizon}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Market Gaps & Opportunities */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-yellow-500" />
                    Gaps de Mercado
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {icp.marketAnalysis.marketGaps.map((gap, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <Sparkles className="w-4 h-4 text-yellow-500 mt-0.5 shrink-0" />
                        {gap}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-500" />
                    Oportunidades
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {icp.marketAnalysis.opportunities.map((opp, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                        {opp}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Competitive Landscape */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-red-500" />
                  Cenário Competitivo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Concorrentes Diretos</h4>
                    <div className="space-y-3">
                      {icp.competitiveLandscape.directCompetitors.map((comp, i) => (
                        <div key={i} className="p-3 rounded-lg border bg-muted/30">
                          <div className="font-medium">{comp.name}</div>
                          <div className="text-sm text-muted-foreground">{comp.positioning}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3 text-emerald-600">Blue Ocean Opportunities</h4>
                    <ul className="space-y-2">
                      {icp.competitiveLandscape.blueOcean.map((ocean, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/20">
                          <Sparkles className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                          {ocean}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Regional Tab */}
          <TabsContent value="regional" className="space-y-6">
            <Alert>
              <MapPin className="w-5 h-5" />
              <AlertTitle>Regionalismos Brasileiros</AlertTitle>
              <AlertDescription>
                O Brasil possui diferenças culturais, econômicas e comportamentais significativas entre regiões.
                Adaptar sua comunicação para cada contexto pode aumentar drasticamente as conversões.
              </AlertDescription>
            </Alert>

            <div className="grid md:grid-cols-2 gap-6">
              {icp.regionalInsights.map((region, i) => (
                <Card key={i}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-blue-500" />
                      {region.region}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="text-sm font-medium mb-2">Características</div>
                      <ul className="space-y-1">
                        {region.characteristics.map((char, j) => (
                          <li key={j} className="text-sm text-muted-foreground">• {char}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="text-sm font-medium mb-2">Nuances Culturais</div>
                      <div className="text-sm text-muted-foreground">{region.culturalNuances}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium mb-2">Comportamento de Compra</div>
                      <Badge variant="secondary">{region.buyingBehavior}</Badge>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-emerald-600 mb-2">Oportunidades</div>
                      <ul className="space-y-1">
                        {region.opportunities.map((opp, j) => (
                          <li key={j} className="text-sm text-emerald-600">• {opp}</li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Strategy Tab */}
          <TabsContent value="strategy" className="space-y-6">
            {/* Strategic Recommendations */}
            <Card className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20 border-purple-200 dark:border-purple-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Compass className="w-5 h-5 text-purple-500" />
                  Recomendações Estratégicas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="text-sm font-medium text-purple-600 mb-2">Posicionamento Recomendado</div>
                  <p className="text-lg font-semibold">{icp.strategicRecommendations.positioning}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <div className="text-sm font-medium mb-2">Mensagens-Chave</div>
                    <ul className="space-y-2">
                      {icp.strategicRecommendations.messaging.map((msg, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-purple-500 mt-0.5 shrink-0" />
                          {msg}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="text-sm font-medium mb-2">Canais Prioritários</div>
                    <div className="flex flex-wrap gap-2">
                      {icp.strategicRecommendations.channels.map((channel, i) => (
                        <Badge key={i} className="bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                          {channel}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium mb-2">Pontos de Diferenciação</div>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {icp.strategicRecommendations.differentiationPoints.map((point, i) => (
                      <div key={i} className="flex items-center gap-2 p-3 rounded-lg bg-white dark:bg-slate-800 border">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        <span className="text-sm">{point}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Trends to Test */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-500" />
                  Tendências para Testar
                </CardTitle>
                <CardDescription>Hipóteses que devem ser validadas antes de implementar em larga escala</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {icp.trends.toTest.map((test, i) => (
                    <div key={i} className="p-4 rounded-lg border bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
                      <div className="font-medium mb-2">{test.hypothesis}</div>
                      <div className="grid sm:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Método de Teste: </span>
                          <span className="font-medium">{test.testMethod}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Métrica de Sucesso: </span>
                          <span className="font-medium text-emerald-600">{test.successMetric}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Success Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-emerald-500" />
                  Métricas de Sucesso
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20">
                    <div className="text-sm font-medium text-blue-600 mb-3">Aquisição</div>
                    <ul className="space-y-2">
                      {icp.successMetrics.acquisition.map((metric, i) => (
                        <li key={i} className="text-sm">
                          <span className="text-muted-foreground">{metric.metric}:</span>{' '}
                          <span className="font-medium">{metric.target}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-950/20">
                    <div className="text-sm font-medium text-purple-600 mb-3">Engajamento</div>
                    <ul className="space-y-2">
                      {icp.successMetrics.engagement.map((metric, i) => (
                        <li key={i} className="text-sm">
                          <span className="text-muted-foreground">{metric.metric}:</span>{' '}
                          <span className="font-medium">{metric.target}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/20">
                    <div className="text-sm font-medium text-emerald-600 mb-3">Conversão</div>
                    <ul className="space-y-2">
                      {icp.successMetrics.conversion.map((metric, i) => (
                        <li key={i} className="text-sm">
                          <span className="text-muted-foreground">{metric.metric}:</span>{' '}
                          <span className="font-medium">{metric.target}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950/20">
                    <div className="text-sm font-medium text-amber-600 mb-3">Retenção</div>
                    <ul className="space-y-2">
                      {icp.successMetrics.retention.map((metric, i) => (
                        <li key={i} className="text-sm">
                          <span className="text-muted-foreground">{metric.metric}:</span>{' '}
                          <span className="font-medium">{metric.target}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* CTA */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mt-8">
          <Card className="bg-slate-900 text-white">
            <CardContent className="pt-8 pb-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Pronto para Implementar seu ICP?</h2>
              <p className="text-slate-400 mb-6 max-w-xl mx-auto">
                Nossa equipe pode ajudar a transformar essa análise em estratégias acionáveis de marketing e vendas.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/analyze">
                  <Button size="lg" className="bg-gradient-to-r from-purple-600 to-violet-600">
                    Fazer Análise SEO
                  </Button>
                </Link>
                <Link href="/builder">
                  <Button size="lg" variant="outline" className="border-slate-700 text-white hover:bg-slate-800">
                    Briefing Completo
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  )
}

function ICPPageLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-50 dark:from-purple-950/20 dark:via-violet-950/20 dark:to-indigo-950/20 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-600 to-violet-600 flex items-center justify-center"
        >
          <Brain className="w-10 h-10 text-white" />
        </motion.div>
        <h2 className="text-2xl font-bold mb-4 gradient-text">Carregando ICP...</h2>
      </div>
    </div>
  )
}

export default function ICPPage() {
  return (
    <Suspense fallback={<ICPPageLoading />}>
      <ICPPageContent />
    </Suspense>
  )
}
