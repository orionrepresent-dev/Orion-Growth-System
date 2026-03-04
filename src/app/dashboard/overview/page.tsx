'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Bell,
  FileText,
  Eye,
  Users,
  TrendingUp,
  CheckCircle2,
  Sparkles,
  Clock,
  Target,
  Lightbulb,
  ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'

// Notificações proativas
const notifications = [
  { type: 'ready', message: '5 posts aguardando aprovação', action: 'Ver posts', href: '/dashboard/conteudo' },
  { type: 'trend', message: 'Tendência detectada: IA no varejo está em alta', action: 'Criar conteúdo', href: '/dashboard/conteudo' },
  { type: 'learning', message: 'Seu post de ontem teve 200% mais engajamento', action: 'Ver análise', href: '/dashboard/redes-sociais' },
]

// Métricas
const metrics = [
  { label: 'Conteúdos publicados', value: '23', change: '+15%', icon: FileText },
  { label: 'Alcance total', value: '12.4k', change: '+22%', icon: Eye },
  { label: 'Leads gerados', value: '47', change: '+8%', icon: Users },
  { label: 'ROI médio', value: '3.8x', change: '+0.5', icon: TrendingUp },
]

// Ações sugeridas
const suggestedActions = [
  { label: 'Aprovar 5 posts pendentes', impact: 'Alto', href: '/dashboard/conteudo' },
  { label: 'Configurar campanha de Black Friday', impact: 'Alto', href: '/dashboard/anuncios' },
  { label: 'Atualizar ICP com novos dados', impact: 'Médio', href: '/dashboard/icp' },
]

// Aprendizados
const learnings = [
  { insight: 'Horário ideal: 10h tem 40% mais engajamento', confidence: 92 },
  { insight: 'Carrosséis performam 3x mais que imagens únicas', confidence: 87 },
  { insight: 'Posts diretos têm 90% de taxa de aprovação', confidence: 95 },
]

export default function DashboardOverview() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-slate-400">Visão geral do seu growth</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="relative text-slate-400 hover:text-white">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-teal-500 rounded-full" />
          </Button>
        </div>
      </div>

      {/* Notificações proativas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-teal-500/10 to-emerald-500/10 border border-teal-500/20 rounded-2xl p-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-teal-400" />
          <h2 className="font-semibold text-white">O que preparamos para você</h2>
        </div>
        <div className="space-y-3">
          {notifications.map((notification, i) => (
            <div key={i} className="flex items-center justify-between bg-slate-900/50 rounded-xl p-3">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${
                  notification.type === 'ready' ? 'bg-emerald-500' :
                  notification.type === 'trend' ? 'bg-amber-500' : 'bg-blue-500'
                }`} />
                <span className="text-slate-300 text-sm">{notification.message}</span>
              </div>
              <Link href={notification.href}>
                <Button variant="ghost" size="sm" className="text-teal-400 hover:text-teal-300">
                  {notification.action}
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Métricas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, i) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <metric.icon className="w-5 h-5 text-slate-500" />
                  <span className="text-xs text-emerald-400 font-medium">{metric.change}</span>
                </div>
                <div className="text-2xl font-bold text-white mb-1">{metric.value}</div>
                <div className="text-sm text-slate-400">{metric.label}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Grid 2 colunas */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Ações sugeridas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-slate-900 border-slate-800 h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Target className="w-5 h-5 text-teal-400" />
                Ações sugeridas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {suggestedActions.map((action, i) => (
                <Link key={i} href={action.href}>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-4 h-4 text-slate-500" />
                      <span className="text-slate-300 text-sm">{action.label}</span>
                    </div>
                    <Badge variant="outline" className={`text-xs ${
                      action.impact === 'Alto' ? 'border-emerald-500 text-emerald-400' : 'border-amber-500 text-amber-400'
                    }`}>
                      {action.impact}
                    </Badge>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Progresso */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Card className="bg-slate-900 border-slate-800 h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <TrendingUp className="w-5 h-5 text-teal-400" />
                Seu progresso
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/20 mb-3">
                  <Sparkles className="w-4 h-4 text-teal-400" />
                  <span className="text-teal-400 font-medium">Nível: Crescimento</span>
                </div>
                <div className="text-4xl font-bold text-white mb-2">68%</div>
                <Progress value={68} className="h-2" />
                <p className="text-sm text-slate-400 mt-2">
                  Faltam 5 publicações para o próximo nível
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800">
                <div className="text-center">
                  <div className="text-xl font-bold text-white">8h</div>
                  <div className="text-xs text-slate-400">Tempo economizado</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-white">23</div>
                  <div className="text-xs text-slate-400">Conteúdos este mês</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* O que aprendi */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Lightbulb className="w-5 h-5 text-amber-400" />
              O que aprendi com você
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {learnings.map((learning, i) => (
                <div key={i} className="p-4 rounded-xl bg-slate-800/50">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-400" />
                    <span className="text-xs text-teal-400 font-medium">{learning.confidence}% confiança</span>
                  </div>
                  <p className="text-sm text-slate-300">{learning.insight}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Roadmap */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Clock className="w-5 h-5 text-teal-400" />
              Roadmap da semana
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              {[
                { day: 'Segunda', task: 'Publicar 3 posts', status: 'done' },
                { day: 'Terça', task: 'Artigo de blog', status: 'done' },
                { day: 'Quarta', task: 'Análise de concorrentes', status: 'current' },
                { day: 'Quinta', task: '5 posts para aprovar', status: 'pending' },
                { day: 'Sexta', task: 'Relatório semanal', status: 'pending' },
              ].map((item, i) => (
                <div key={i} className="flex-1 p-3 rounded-xl bg-slate-800/50 border border-slate-700">
                  <div className="text-xs text-slate-500 mb-1">{item.day}</div>
                  <div className="text-sm text-white mb-2">{item.task}</div>
                  <div className={`text-xs font-medium ${
                    item.status === 'done' ? 'text-emerald-400' :
                    item.status === 'current' ? 'text-amber-400' : 'text-slate-500'
                  }`}>
                    {item.status === 'done' ? '✓ Concluído' :
                     item.status === 'current' ? '● Em andamento' : '○ Pendente'}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
