'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  PenTool,
  CheckCircle2,
  Clock,
  TrendingUp,
  ArrowRight,
  RefreshCw,
  Zap,
  FileText,
  BookOpen,
  Video,
  Image
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

// Mock data
const contentStats = [
  { label: 'Artigos este mês', value: '4/5', percentage: 80 },
  { label: 'Posts criados', value: '18', trend: '+6' },
  { label: 'Ebooks', value: '2', trend: '+1' },
]

const recentContent = [
  { id: 1, title: 'Guia completo de SEO para 2024', type: 'article', status: 'published', date: '22/02/2024' },
  { id: 2, title: '5 estratégias de IA para negócios', type: 'article', status: 'review', date: '25/02/2024' },
  { id: 3, title: 'Ebook: Transformação Digital', type: 'ebook', status: 'draft', date: '-' },
  { id: 4, title: 'Case de sucesso: E-commerce', type: 'article', status: 'scheduled', date: '28/02/2024' },
]

const roiSuggestions = [
  { id: 1, suggestion: 'Criar série de vídeos curtos', potential: '+200% engajamento' },
  { id: 2, suggestion: 'Lançar newsletter semanal', potential: '+80 leads/mês' },
  { id: 3, suggestion: 'Criar templates para download', potential: '+150% capturas' },
]

const roadmap = [
  { week: 'Semana 1', task: 'Planejamento editorial', status: 'completed' },
  { week: 'Semana 2', task: 'Criação de artigos', status: 'in_progress' },
  { week: 'Semana 3', task: 'Produção de ebook', status: 'pending' },
  { week: 'Semana 4', task: 'Distribuição e promoção', status: 'pending' },
]

export default function ConteudoPage() {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'article':
        return <FileText className="w-4 h-4 text-blue-400" />
      case 'ebook':
        return <BookOpen className="w-4 h-4 text-purple-400" />
      case 'video':
        return <Video className="w-4 h-4 text-pink-400" />
      case 'image':
        return <Image className="w-4 h-4 text-teal-400" />
      default:
        return <FileText className="w-4 h-4 text-slate-400" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-emerald-500/20 text-emerald-300 border-0 text-xs">Publicado</Badge>
      case 'review':
        return <Badge className="bg-amber-500/20 text-amber-300 border-0 text-xs">Revisão</Badge>
      case 'draft':
        return <Badge className="bg-slate-500/20 text-slate-300 border-0 text-xs">Rascunho</Badge>
      case 'scheduled':
        return <Badge className="bg-blue-500/20 text-blue-300 border-0 text-xs">Agendado</Badge>
      default:
        return <Badge variant="secondary" className="text-xs">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Conteúdo</h1>
          <p className="text-slate-400 text-sm">Artigos, ebooks e materiais para seu negócio</p>
        </div>
        <Button className="bg-teal-500 hover:bg-teal-600 text-white">
          <PenTool className="w-4 h-4 mr-2" />
          Novo conteúdo
        </Button>
      </div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        {contentStats.map((stat) => (
          <Card key={stat.label} className="bg-slate-900 border-slate-800">
            <CardContent className="pt-4">
              <p className="text-sm text-slate-400 mb-1">{stat.label}</p>
              <div className="flex items-end justify-between">
                <span className="text-2xl font-bold text-white">{stat.value}</span>
                {stat.trend && (
                  <span className="text-emerald-400 text-sm">+{stat.trend}</span>
                )}
                {stat.percentage !== undefined && (
                  <span className="text-slate-400 text-sm">{stat.percentage}%</span>
                )}
              </div>
              {stat.percentage !== undefined && (
                <Progress value={stat.percentage} className="h-2 bg-slate-800 mt-2" />
              )}
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Recent Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-white">
              <FileText className="w-5 h-5 text-blue-400" />
              Conteúdos recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentContent.map((content) => (
                <div
                  key={content.id}
                  className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {getTypeIcon(content.type)}
                    <div>
                      <p className="text-white font-medium">{content.title}</p>
                      <p className="text-xs text-slate-500">{content.date}</p>
                    </div>
                  </div>
                  {getStatusBadge(content.status)}
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
