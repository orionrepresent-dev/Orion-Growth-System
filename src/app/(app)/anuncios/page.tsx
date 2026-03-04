'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Megaphone,
  CheckCircle2,
  Clock,
  TrendingUp,
  ArrowRight,
  RefreshCw,
  Zap,
  DollarSign,
  Target,
  Eye
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

// Mock data
const adsStats = [
  { label: 'Investimento', value: 'R$ 1.500', trend: 'este mês' },
  { label: 'Impressões', value: '45.2k', trend: '+23%' },
  { label: 'CTR', value: '2.8%', trend: '+0.4%' },
  { label: 'Conversões', value: '127', trend: '+18%' },
]

const activeCampaigns = [
  { id: 1, name: 'Campanha Black Friday', status: 'active', budget: 'R$ 500', spent: 'R$ 320', results: '43 conversões' },
  { id: 2, name: ' remarketing Site', status: 'active', budget: 'R$ 300', spent: 'R$ 180', results: '28 conversões' },
  { id: 3, name: 'Tráfego Blog', status: 'paused', budget: 'R$ 200', spent: 'R$ 150', results: '12 conversões' },
]

const roiSuggestions = [
  { id: 1, suggestion: 'Aumentar orçamento da campanha BF', potential: '+80% conversões' },
  { id: 2, suggestion: 'Testar novo público similar', potential: '-15% CAC' },
  { id: 3, suggestion: 'Criar anúncio de vídeo', potential: '+35% engajamento' },
]

const roadmap = [
  { week: 'Semana 1', task: 'Análise de desempenho', status: 'completed' },
  { week: 'Semana 2', task: 'Otimização de campanhas', status: 'in_progress' },
  { week: 'Semana 3', task: 'Testes A/B', status: 'pending' },
  { week: 'Semana 4', task: 'Relatório de ROI', status: 'pending' },
]

export default function AnunciosPage() {
  const getCampaignStatus = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-emerald-500/20 text-emerald-300 border-0 text-xs">Ativa</Badge>
      case 'paused':
        return <Badge className="bg-amber-500/20 text-amber-300 border-0 text-xs">Pausada</Badge>
      case 'completed':
        return <Badge className="bg-slate-500/20 text-slate-300 border-0 text-xs">Finalizada</Badge>
      default:
        return <Badge variant="secondary" className="text-xs">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Anúncios</h1>
          <p className="text-slate-400 text-sm">Gerencie suas campanhas pagas</p>
        </div>
        <Button className="bg-teal-500 hover:bg-teal-600 text-white">
          <Megaphone className="w-4 h-4 mr-2" />
          Nova campanha
        </Button>
      </div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {adsStats.map((stat) => (
          <Card key={stat.label} className="bg-slate-900 border-slate-800">
            <CardContent className="pt-4">
              <p className="text-sm text-slate-400 mb-1">{stat.label}</p>
              <div className="flex items-end justify-between">
                <span className="text-2xl font-bold text-white">{stat.value}</span>
                {stat.trend && (
                  <span className={`text-sm ${stat.trend.startsWith('+') ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {stat.trend}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Active Campaigns */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-white">
              <Target className="w-5 h-5 text-purple-400" />
              Campanhas ativas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeCampaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  className="p-4 bg-slate-800/50 rounded-lg border border-slate-700"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Megaphone className="w-5 h-5 text-teal-400" />
                      <div>
                        <p className="text-white font-medium">{campaign.name}</p>
                        <p className="text-xs text-slate-500">Orçamento: {campaign.budget}</p>
                      </div>
                    </div>
                    {getCampaignStatus(campaign.status)}
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-slate-500">Gasto</p>
                      <p className="text-white font-medium">{campaign.spent}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Resultados</p>
                      <p className="text-white font-medium">{campaign.results}</p>
                    </div>
                    <div className="text-right">
                      <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                        <Eye className="w-4 h-4 mr-1" />
                        Detalhes
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ROI Suggestions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-white">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              Sugestões de melhoria de ROI
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {roiSuggestions.map((item, index) => (
                <li key={item.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-sm text-slate-300">
                      {index + 1}
                    </span>
                    <span className="text-slate-300">{item.suggestion}</span>
                  </div>
                  <span className="text-teal-400 text-sm font-medium">Potencial: {item.potential}</span>
                </li>
              ))}
            </ul>
            <Link href="/app/analise">
              <Button variant="outline" className="w-full mt-4 border-slate-700 text-slate-300 hover:bg-slate-800">
                Ver plano completo
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </motion.div>

      {/* Roadmap */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-white">
              <Clock className="w-5 h-5 text-purple-400" />
              Roadmap
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-slate-700" />
              
              <ul className="space-y-4">
                {roadmap.map((item) => (
                  <li key={item.week} className="relative flex items-center gap-4 pl-8">
                    <div className={`absolute left-1 w-5 h-5 rounded-full border-2 ${
                      item.status === 'completed' 
                        ? 'bg-emerald-500 border-emerald-500' 
                        : item.status === 'in_progress'
                        ? 'bg-teal-500 border-teal-500'
                        : 'bg-slate-800 border-slate-600'
                    }`}>
                      {item.status === 'completed' && (
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      )}
                    </div>
                    
                    <div className="flex-1 flex items-center justify-between">
                      <div>
                        <span className="text-sm text-slate-400">{item.week}:</span>
                        <span className="text-slate-300 ml-2">{item.task}</span>
                      </div>
                      {item.status === 'in_progress' && (
                        <Badge className="bg-teal-500/20 text-teal-300 border-0 text-xs">
                          Atual
                        </Badge>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
