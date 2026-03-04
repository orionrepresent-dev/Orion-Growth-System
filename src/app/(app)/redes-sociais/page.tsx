'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Share2,
  CheckCircle2,
  Clock,
  TrendingUp,
  ArrowRight,
  RefreshCw,
  Zap,
  Instagram,
  Linkedin,
  Calendar,
  Edit,
  Eye,
  ThumbsUp
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

// Mock data
const pendingPosts = [
  { id: 1, title: '5 estratégias de IA para seu negócio', platform: 'linkedin', scheduledFor: 'Amanhã, 10:00', type: 'post' },
  { id: 2, title: 'Cliente satisfeito: +340% em agendamentos', platform: 'instagram', scheduledFor: 'Quarta, 14:00', type: 'carousel' },
  { id: 3, title: 'Dicas rápidas de produtividade', platform: 'instagram', scheduledFor: 'Sexta, 09:00', type: 'stories' },
  { id: 4, title: 'Como escalar seu negócio digital', platform: 'linkedin', scheduledFor: 'Segunda, 11:00', type: 'article' },
  { id: 5, title: 'Case de sucesso: E-commerce local', platform: 'instagram', scheduledFor: 'Terça, 16:00', type: 'reel' },
]

const stats = [
  { label: 'Posts este mês', value: '12/15', percentage: 80 },
  { label: 'Engajamento médio', value: '4.7%', trend: '+0.8%' },
  { label: 'Seguidores', value: '2.4k', trend: '+12%' },
]

const roadmap = [
  { week: 'Semana 1', task: 'Análise de concorrentes', status: 'completed' },
  { week: 'Semana 2', task: 'Criação de conteúdo', status: 'in_progress' },
  { week: 'Semana 3', task: 'Otimização de horários', status: 'pending' },
  { week: 'Semana 4', task: 'Relatório de engajamento', status: 'pending' },
]

export default function RedesSociaisPage() {
  const [approvedPosts, setApprovedPosts] = useState<string[]>([])

  const handleApprove = (id: string) => {
    setApprovedPosts([...approvedPosts, id])
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'instagram':
        return <Instagram className="w-4 h-4 text-pink-400" />
      case 'linkedin':
        return <Linkedin className="w-4 h-4 text-blue-400" />
      default:
        return <Share2 className="w-4 h-4 text-slate-400" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Redes Sociais</h1>
          <p className="text-slate-400 text-sm">Gerencie seus posts e engajamento</p>
        </div>
        <Button className="bg-teal-500 hover:bg-teal-600 text-white">
          <Calendar className="w-4 h-4 mr-2" />
          Ver calendário
        </Button>
      </div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        {stats.map((stat, index) => (
          <Card key={stat.label} className="bg-slate-900 border-slate-800">
            <CardContent className="pt-4">
              <p className="text-sm text-slate-400 mb-1">{stat.label}</p>
              <div className="flex items-end justify-between">
                <span className="text-2xl font-bold text-white">{stat.value}</span>
                {stat.trend && (
                  <span className="text-emerald-400 text-sm">{stat.trend} ↑</span>
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

      {/* Pending Posts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-white">
              <Zap className="w-5 h-5 text-amber-400" />
              Posts aguardando aprovação
              <Badge className="bg-teal-500/20 text-teal-300 border-0">
                {pendingPosts.length - approvedPosts.length} pendentes
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {pendingPosts.map((post) => (
                <div
                  key={post.id}
                  className={`p-4 rounded-lg border transition-all ${
                    approvedPosts.includes(post.id)
                      ? 'bg-emerald-500/10 border-emerald-500/30'
                      : 'bg-slate-800/50 border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      {getPlatformIcon(post.platform)}
                      <div>
                        <p className={`font-medium ${approvedPosts.includes(post.id) ? 'text-emerald-300' : 'text-white'}`}>
                          {post.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="border-slate-600 text-slate-400 text-xs">
                            {post.type}
                          </Badge>
                          <span className="text-xs text-slate-500">{post.scheduledFor}</span>
                        </div>
                      </div>
                    </div>
                    
                    {approvedPosts.includes(post.id) ? (
                      <div className="flex items-center gap-2 text-emerald-400">
                        <CheckCircle2 className="w-5 h-5" />
                        <span className="text-sm">Aprovado</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-slate-400 hover:text-white hover:bg-slate-700"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-slate-400 hover:text-white hover:bg-slate-700"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          className="bg-teal-500 hover:bg-teal-600 text-white"
                          onClick={() => handleApprove(post.id)}
                        >
                          <ThumbsUp className="w-4 h-4 mr-1" />
                          Aprovar
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {approvedPosts.length > 0 && approvedPosts.length < pendingPosts.length && (
              <Button
                className="w-full mt-4 bg-emerald-500 hover:bg-emerald-600 text-white"
                onClick={() => setApprovedPosts(pendingPosts.map(p => p.id))}
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Aprovar todos os {pendingPosts.length - approvedPosts.length} restantes
              </Button>
            )}
            
            {approvedPosts.length === pendingPosts.length && (
              <div className="mt-4 p-4 bg-emerald-500/10 rounded-lg text-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                <p className="text-emerald-300 font-medium">Todos os posts foram aprovados!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Roadmap */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
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
