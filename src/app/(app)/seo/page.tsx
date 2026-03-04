'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Search,
  CheckCircle2,
  Clock,
  TrendingUp,
  ArrowRight,
  RefreshCw,
  Zap,
  Globe
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

// Mock data
const seoScore = 72
const currentTasks = [
  { id: 1, task: 'Otimização de meta tags', status: 'completed' },
  { id: 2, task: 'Melhoria de velocidade', status: 'completed' },
  { id: 3, task: 'Link building', status: 'in_progress' },
  { id: 4, task: 'Schema markup', status: 'pending' },
]

const roiSuggestions = [
  { id: 1, suggestion: 'Adicionar blog', potential: '+150% tráfego' },
  { id: 2, suggestion: 'Otimizar imagens', potential: '-2s tempo de carga' },
  { id: 3, suggestion: 'Criar páginas de local', potential: '+80% buscas locais' },
]

const roadmap = [
  { week: 'Semana 1', task: 'Auditoria completa', status: 'completed' },
  { week: 'Semana 2', task: 'Otimizações on-page', status: 'in_progress' },
  { week: 'Semana 3', task: 'Link building', status: 'pending' },
  { week: 'Semana 4', task: 'Análise de resultados', status: 'pending' },
]

export default function SEOPage() {
  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">SEO - Otimização para Buscas</h1>
          <p className="text-slate-400 text-sm">Melhore sua visibilidade no Google e IA</p>
        </div>
        <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
          <RefreshCw className="w-4 h-4 mr-2" />
          Analisar novamente
        </Button>
      </div>

      {/* SEO Score */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-white">
              <Globe className="w-5 h-5 text-teal-400" />
              Status atual do seu site
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              <div className="text-4xl font-bold text-white">{seoScore}<span className="text-xl text-slate-400">/100</span></div>
              <Badge className="bg-amber-500/20 text-amber-300 border-0">Score SEO</Badge>
            </div>
            <Progress value={seoScore} className="h-3 bg-slate-800" />
            <p className="text-sm text-slate-400 mt-2">Baseado em 47 fatores de otimização</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* What we're doing */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-white">
              <Zap className="w-5 h-5 text-amber-400" />
              O que estamos fazendo por você
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {currentTasks.map((task) => (
                <li key={task.id} className="flex items-center gap-3">
                  {task.status === 'completed' && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  )}
                  {task.status === 'in_progress' && (
                    <RefreshCw className="w-5 h-5 text-teal-400 animate-spin" />
                  )}
                  {task.status === 'pending' && (
                    <Clock className="w-5 h-5 text-slate-500" />
                  )}
                  <span className={task.status === 'pending' ? 'text-slate-500' : 'text-slate-300'}>
                    {task.task}
                  </span>
                  {task.status === 'in_progress' && (
                    <Badge className="bg-teal-500/20 text-teal-300 border-0 text-xs">Em andamento</Badge>
                  )}
                </li>
              ))}
            </ul>
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
              {/* Timeline line */}
              <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-slate-700" />
              
              <ul className="space-y-4">
                {roadmap.map((item, index) => (
                  <li key={item.week} className="relative flex items-center gap-4 pl-8">
                    {/* Status indicator */}
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
