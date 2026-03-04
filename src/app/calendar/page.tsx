'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
  Video,
  FileText,
  Instagram,
  Facebook,
  Linkedin,
  Plus,
  MoreHorizontal
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const MONTHS = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

interface ScheduledPost {
  id: string
  title: string
  platform: 'instagram' | 'facebook' | 'linkedin' | 'tiktok'
  type: 'post' | 'story' | 'reel' | 'carousel'
  status: 'scheduled' | 'published' | 'draft'
  date: Date
  time: string
}

const samplePosts: ScheduledPost[] = [
  { id: '1', title: 'Dicas de marketing digital', platform: 'instagram', type: 'carousel', status: 'scheduled', date: new Date(2024, 0, 15), time: '10:00' },
  { id: '2', title: 'Novo produto lançamento', platform: 'facebook', type: 'post', status: 'published', date: new Date(2024, 0, 15), time: '14:00' },
  { id: '3', title: 'Behind the scenes', platform: 'instagram', type: 'story', status: 'draft', date: new Date(2024, 0, 16), time: '09:00' },
  { id: '4', title: 'Tutorial rápido', platform: 'tiktok', type: 'reel', status: 'scheduled', date: new Date(2024, 0, 17), time: '18:00' }
]

const platformConfig = {
  instagram: { name: 'Instagram', icon: Instagram, color: 'bg-pink-500' },
  facebook: { name: 'Facebook', icon: Facebook, color: 'bg-blue-600' },
  linkedin: { name: 'LinkedIn', icon: Linkedin, color: 'bg-blue-700' },
  tiktok: { name: 'TikTok', icon: Video, color: 'bg-gray-900' }
}

const statusConfig = {
  scheduled: { label: 'Agendado', color: 'bg-blue-100 text-blue-700' },
  published: { label: 'Publicado', color: 'bg-green-100 text-green-700' },
  draft: { label: 'Rascunho', color: 'bg-gray-100 text-gray-700' }
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [posts] = useState<ScheduledPost[]>(samplePosts)

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDay = firstDay.getDay()
    return { daysInMonth, startingDay }
  }

  const { daysInMonth, startingDay } = getDaysInMonth(currentDate)

  const getPostsForDay = (day: number) => {
    return posts.filter(post => {
      const postDate = new Date(post.date)
      return postDate.getDate() === day && 
             postDate.getMonth() === currentDate.getMonth() &&
             postDate.getFullYear() === currentDate.getFullYear()
    })
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-3">
                <Image src="/logo.png" alt="Orion" width={120} height={32} className="h-8 w-auto" priority />
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/content"><Button variant="outline" size="sm"><ImageIcon className="w-4 h-4 mr-2" />Conteúdo</Button></Link>
              <Link href="/ads"><Button variant="outline" size="sm">Meta Ads</Button></Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Calendário Editorial</h1>
            <p className="text-slate-600">Gerencie seus posts agendados</p>
          </div>
          <Link href="/content">
            <Button className="bg-gradient-to-r from-teal-500 to-emerald-600">
              <Plus className="w-4 h-4 mr-2" />Novo Post
            </Button>
          </Link>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-3">
            <Card className="border-slate-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5 text-teal-600" />
                    {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={() => navigateMonth('prev')}>
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => navigateMonth('next')}>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Days header */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {DAYS.map(day => (
                    <div key={day} className="text-center text-xs font-medium text-slate-500 py-2">{day}</div>
                  ))}
                </div>

                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-1">
                  {/* Empty cells for days before start of month */}
                  {Array.from({ length: startingDay }).map((_, i) => (
                    <div key={`empty-${i}`} className="h-24 bg-slate-50 rounded-lg" />
                  ))}

                  {/* Days of month */}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1
                    const dayPosts = getPostsForDay(day)
                    const isSelected = selectedDate?.getDate() === day && 
                                      selectedDate?.getMonth() === currentDate.getMonth()

                    return (
                      <motion.button
                        key={day}
                        onClick={() => setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
                        className={`h-24 p-2 rounded-lg border-2 text-left transition-all ${
                          isSelected ? 'border-teal-500 bg-teal-50' : 'border-slate-100 hover:border-slate-200'
                        }`}
                        whileHover={{ scale: 1.02 }}
                      >
                        <span className="text-sm font-medium text-slate-700">{day}</span>
                        <div className="mt-1 space-y-1">
                          {dayPosts.slice(0, 2).map(post => {
                            const config = platformConfig[post.platform]
                            const Icon = config.icon
                            return (
                              <div key={post.id} className={`flex items-center gap-1 p-1 rounded text-xs ${config.color} text-white`}>
                                <Icon className="w-3 h-3" />
                                <span className="truncate">{post.title.substring(0, 10)}...</span>
                              </div>
                            )
                          })}
                          {dayPosts.length > 2 && (
                            <span className="text-xs text-slate-500">+{dayPosts.length - 2} mais</span>
                          )}
                        </div>
                      </motion.button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats */}
            <Card className="border-slate-200">
              <CardHeader><CardTitle className="text-lg">Resumo</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Agendados</span>
                  <Badge className="bg-blue-100 text-blue-700">{posts.filter(p => p.status === 'scheduled').length}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Publicados</span>
                  <Badge className="bg-green-100 text-green-700">{posts.filter(p => p.status === 'published').length}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Rascunhos</span>
                  <Badge className="bg-gray-100 text-gray-700">{posts.filter(p => p.status === 'draft').length}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Selected Day Posts */}
            {selectedDate && (
              <Card className="border-slate-200">
                <CardHeader>
                  <CardTitle className="text-lg">
                    {selectedDate.getDate()} de {MONTHS[selectedDate.getMonth()]}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {getPostsForDay(selectedDate.getDate()).length > 0 ? (
                    <div className="space-y-3">
                      {getPostsForDay(selectedDate.getDate()).map(post => {
                        const config = platformConfig[post.platform]
                        const statusConf = statusConfig[post.status]
                        const Icon = config.icon
                        return (
                          <div key={post.id} className="p-3 bg-slate-50 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <Icon className={`w-4 h-4 text-white ${config.color} rounded p-0.5`} />
                              <span className="text-xs text-slate-500">{post.time}</span>
                              <Badge className={statusConf.color}>{statusConf.label}</Badge>
                            </div>
                            <p className="text-sm font-medium">{post.title}</p>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500">Nenhum post agendado</p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card className="border-slate-200 bg-gradient-to-r from-teal-50 to-emerald-50">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-slate-900 mb-4">Ações Rápidas</h3>
                <div className="space-y-2">
                  <Link href="/content" className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <Plus className="w-4 h-4 mr-2" />Agendar Post
                    </Button>
                  </Link>
                  <Link href="/ads" className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <ImageIcon className="w-4 h-4 mr-2" />Criar Anúncio
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
