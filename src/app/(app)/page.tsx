'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Bell,
  CheckCircle2,
  TrendingUp,
  Target,
  BarChart3,
  Users,
  Zap,
  ArrowRight,
  Check,
  Calendar,
  Brain,
  Sparkles
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

// Mock data - in production this would come from API
const todayItems = [
  { id: 1, text: '5 posts aguardando aprovação', type: 'approval', count: 5 },
  { id: 2, text: '1 artigo de blog sugerido', type: 'content', count: 1 },
  { id: 3, text: 'Tendência detectada no seu setor', type: 'trend', count: 1 },
]

const metrics = [
  { label: 'Conteúdos', value: '23', change: '+15%', icon: Sparkles, color: 'text-purple-400', bgColor: 'bg-purple-500/20' },
  { label: 'Alcance', value: '12.4k', change: '+22%', icon: TrendingUp, color: 'text-teal-400', bgColor: 'bg-teal-500/20' },
  { label: 'Leads', value: '47', change: '+8%', icon: Users, color: 'text-blue-400', bgColor: 'bg-blue-500/20' },
  { label: 'ROI', value: '3.8x', change: '+0.5', icon: BarChart3, color: 'text-emerald-400', bgColor: 'bg-emerald-500/20' },
]

const suggestedActions = [
  { id: 1, label: 'Aprovar 5 posts', href: '/app/redes-sociais' },
  { id: 2, label: 'Ver tendência', href: '/app/analise' },
  { id: 3, label: 'Configurar Black Friday', href: '/app/conteudo' },
]

const learnings = [
  { id: 1, insight: 'Horário ideal: 10h tem 40% mais engajamento' },
  { id: 2, insight: 'Formato: Carrosséis performam 3x mais' },
  { id: 3, insight: 'Tom: Posts diretos têm 90% aprovação' },
]

export default function AppDashboard() {
  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="sm:hidden mb-4">
        <h1 className="text-xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-400 text-sm">Sua visão geral</p>
      </div>

      {/* What we prepared for you */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg text-white">
              <Bell className="w-5 h-5 text-teal-400" />
              O que preparamos para você hoje
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {todayItems.map((item) => (
                <li key={item.id} className="flex items-center gap-3 text-slate-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                  {item.text}
                  {item.count > 0 && (
                    <Badge className="bg-teal-500/20 text-teal-300 border-0 text-xs">
                      {item.count}
                    </Badge>
                  )}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </motion.div>

      {/* Metrics Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {metrics.map((metric, index) => (
          <Card key={metric.label} className="bg-slate-900 border-slate-800">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-8 h-8 rounded-lg ${metric.bgColor} flex items-center justify-center`}>
                  <metric.icon className={`w-4 h-4 ${metric.color}`} />
                </div>
                <span className="text-sm text-slate-400">{metric.label}</span>
              </div>
              <div className="flex items-end justify-between">
                <span className="text-2xl font-bold text-white">{metric.value}</span>
                <span className={`text-sm ${metric.color}`}>{metric.change} ↑</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Actions and Progress */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Suggested Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-slate-900 border-slate-800 h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-white">
                <Zap className="w-5 h-5 text-amber-400" />
                Ações sugeridas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {suggestedActions.map((action) => (
                <Link key={action.id} href={action.href}>
                  <Button
                    variant="outline"
                    className="w-full justify-between border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
                  >
                    {action.label}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-slate-900 border-slate-800 h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-white">
                <TrendingUp className="w-5 h-5 text-teal-400" />
                Seu progresso
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-400 text-sm">Meta mensal</span>
                  <span className="text-teal-400 font-semibold">68%</span>
                </div>
                <Progress value={68} className="h-3 bg-slate-800" />
              </div>

              <div className="bg-slate-800/50 rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">Nível atual</span>
                  <Badge className="bg-teal-500/20 text-teal-300 border-0">Crescimento</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">Próximo nível</span>
                  <span className="text-white text-sm">Publicar +5 posts</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* AI Learnings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-white">
              <Brain className="w-5 h-5 text-purple-400" />
              O que aprendi com você
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {learnings.map((learning) => (
                <li key={learning.id} className="flex items-start gap-3 text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  {learning.insight}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
