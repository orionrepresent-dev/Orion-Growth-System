'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  Target,
  TrendingUp,
  DollarSign,
  Users,
  Eye,
  MousePointer,
  BarChart3,
  Settings,
  RefreshCw,
  Plus,
  ExternalLink,
  AlertCircle,
  CheckCircle2,
  Play,
  Pause
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface Campaign {
  id: string
  name: string
  status: 'active' | 'paused' | 'completed'
  objective: string
  budget: number
  spent: number
  results: {
    reach: number
    impressions: number
    clicks: number
    conversions: number
  }
  icpProfile?: string
}

const sampleCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'Campanha Verão 2024',
    status: 'active',
    objective: 'Tráfego',
    budget: 1500,
    spent: 823.50,
    results: { reach: 45000, impressions: 120000, clicks: 3400, conversions: 87 },
    icpProfile: 'Empreendedor Digital'
  },
  {
    id: '2',
    name: 'Lançamento Produto X',
    status: 'active',
    objective: 'Conversões',
    budget: 2000,
    spent: 1567.20,
    results: { reach: 78000, impressions: 210000, clicks: 5600, conversions: 145 },
    icpProfile: 'Dono de Salão'
  },
  {
    id: '3',
    name: 'Brand Awareness Q4',
    status: 'paused',
    objective: 'Reconhecimento',
    budget: 3000,
    spent: 2100.00,
    results: { reach: 120000, impressions: 380000, clicks: 4200, conversions: 0 },
    icpProfile: 'Empreendedor Digital'
  }
]

export default function AdsPage() {
  const [campaigns] = useState<Campaign[]>(sampleCampaigns)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isConnected] = useState(false)

  const totalSpent = campaigns.reduce((sum, c) => sum + c.spent, 0)
  const totalBudget = campaigns.reduce((sum, c) => sum + c.budget, 0)
  const totalConversions = campaigns.reduce((sum, c) => sum + c.results.conversions, 0)
  const activeCampaigns = campaigns.filter(c => c.status === 'active').length

  const handleConnectMeta = async () => {
    setIsConnecting(true)
    // Simulate OAuth flow
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsConnecting(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-3">
                <Image src="/logo.png" alt="Orion" width={120} height={32} className="h-8 w-auto" priority />
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/content"><Button variant="outline" size="sm">Conteúdo</Button></Link>
              <Link href="/calendar"><Button variant="outline" size="sm">Calendário</Button></Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Meta Ads</h1>
            <p className="text-slate-600">Gerencie suas campanhas do Facebook e Instagram</p>
          </div>
          <div className="flex gap-3">
            {!isConnected ? (
              <Button onClick={handleConnectMeta} disabled={isConnecting}
                className="bg-gradient-to-r from-blue-600 to-blue-700">
                {isConnecting ? 'Conectando...' : 'Conectar Meta'}
              </Button>
            ) : (
              <Button className="bg-gradient-to-r from-blue-600 to-blue-700">
                <Plus className="w-4 h-4 mr-2" />Nova Campanha
              </Button>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-slate-200">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-slate-500">Campanhas Ativas</span>
              </div>
              <p className="text-2xl font-bold">{activeCampaigns}</p>
            </CardContent>
          </Card>
          <Card className="border-slate-200">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-green-500" />
                <span className="text-sm text-slate-500">Investimento</span>
              </div>
              <p className="text-2xl font-bold">R$ {totalSpent.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              <Progress value={(totalSpent / totalBudget) * 100} className="h-2 mt-2" />
            </CardContent>
          </Card>
          <Card className="border-slate-200">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-purple-500" />
                <span className="text-sm text-slate-500">Alcance</span>
              </div>
              <p className="text-2xl font-bold">
                {(campaigns.reduce((sum, c) => sum + c.results.reach, 0) / 1000).toFixed(0)}K
              </p>
            </CardContent>
          </Card>
          <Card className="border-slate-200">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-teal-500" />
                <span className="text-sm text-slate-500">Conversões</span>
              </div>
              <p className="text-2xl font-bold">{totalConversions}</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="campaigns" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="campaigns">Campanhas</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="icp">Segmentação ICP</TabsTrigger>
          </TabsList>

          <TabsContent value="campaigns" className="space-y-4">
            {campaigns.map((campaign) => (
              <motion.div
                key={campaign.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="border-slate-200 hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          campaign.status === 'active' ? 'bg-green-100' : 
                          campaign.status === 'paused' ? 'bg-amber-100' : 'bg-slate-100'
                        }`}>
                          {campaign.status === 'active' ? (
                            <Play className="w-5 h-5 text-green-600" />
                          ) : campaign.status === 'paused' ? (
                            <Pause className="w-5 h-5 text-amber-600" />
                          ) : (
                            <CheckCircle2 className="w-5 h-5 text-slate-600" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900">{campaign.name}</h3>
                          <div className="flex items-center gap-3 mt-1">
                            <Badge variant="outline">{campaign.objective}</Badge>
                            <Badge className={
                              campaign.status === 'active' ? 'bg-green-100 text-green-700' :
                              campaign.status === 'paused' ? 'bg-amber-100 text-amber-700' :
                              'bg-slate-100 text-slate-700'
                            }>
                              {campaign.status === 'active' ? 'Ativa' : 
                             campaign.status === 'paused' ? 'Pausada' : 'Concluída'}
                            </Badge>
                            {campaign.icpProfile && (
                              <Badge variant="secondary">ICP: {campaign.icpProfile}</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-4 text-sm">
                        <div className="text-center">
                          <p className="text-slate-500">Orçamento</p>
                          <p className="font-semibold">R$ {campaign.budget.toLocaleString('pt-BR')}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-slate-500">Gasto</p>
                          <p className="font-semibold text-green-600">R$ {campaign.spent.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-slate-500">Conversões</p>
                          <p className="font-semibold text-teal-600">{campaign.results.conversions}</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100">
                      <div>
                        <p className="text-xs text-slate-500 uppercase">Alcance</p>
                        <p className="font-medium">{(campaign.results.reach / 1000).toFixed(0)}K pessoas</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 uppercase">Impressões</p>
                        <p className="font-medium">{(campaign.results.impressions / 1000).toFixed(0)}K</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 uppercase">Cliques</p>
                        <p className="font-medium">{campaign.results.clicks.toLocaleString('pt-BR')}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 uppercase">CTR</p>
                        <p className="font-medium">{((campaign.results.clicks / campaign.results.impressions) * 100).toFixed(2)}%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </TabsContent>

          <TabsContent value="performance">
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  Performance Geral
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <TrendingUp className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500">Dados de performance serão exibidos aqui</p>
                  <p className="text-sm text-slate-400 mt-2">Conecte sua conta Meta para visualizar métricas detalhadas</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="icp">
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-teal-600" />
                  Segmentação Baseada em ICP
                </CardTitle>
                <CardDescription>
                  Campanhas configuradas automaticamente com base no seu ICP
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="p-4 bg-teal-50 rounded-lg border border-teal-200">
                    <h3 className="font-semibold text-teal-800 mb-2">Como funciona</h3>
                    <p className="text-sm text-teal-700">
                      O ICP define automaticamente a segmentação das suas campanhas: idade, localização, 
                      interesses e comportamentos são extraídos do perfil do cliente ideal.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <h4 className="font-medium mb-2">ICP: Empreendedor Digital</h4>
                      <p className="text-sm text-slate-600 mb-3">Segmentação aplicada:</p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-500">Idade</span>
                          <span>30-45 anos</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-500">Localização</span>
                          <span>Brasil</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-500">Interesses</span>
                          <span>Marketing, Vendas, Tecnologia</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-lg">
                      <h4 className="font-medium mb-2">ICP: Dono de Salão</h4>
                      <p className="text-sm text-slate-600 mb-3">Segmentação aplicada:</p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-500">Idade</span>
                          <span>25-40 anos</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-500">Localização</span>
                          <span>São Paulo</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-500">Interesses</span>
                          <span>Beleza, Moda, Tendências</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
