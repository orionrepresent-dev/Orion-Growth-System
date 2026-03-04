'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle2,
  Instagram,
  Linkedin,
  FileText,
  Plus,
  Edit,
  Trash2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

// Mock data - calendar events
const events = [
  { id: 1, title: 'Post: Dicas de SEO', platform: 'linkedin', time: '09:00', status: 'scheduled', day: 25 },
  { id: 2, title: 'Artigo: IA para Negócios', platform: 'blog', time: '10:00', status: 'scheduled', day: 25 },
  { id: 3, title: 'Stories: Bastidores', platform: 'instagram', time: '14:00', status: 'scheduled', day: 26 },
  { id: 4, title: 'Carrossel: Case Sucesso', platform: 'instagram', time: '11:00', status: 'pending', day: 27 },
  { id: 5, title: 'Post: Black Friday', platform: 'linkedin', time: '09:00', status: 'pending', day: 28 },
  { id: 6, title: 'Newsletter Semanal', platform: 'email', time: '15:00', status: 'scheduled', day: 29 },
]

const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

export default function CalendarioPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState<number | null>(null)

  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay()
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const today = new Date().getDate()
  const isCurrentMonth = currentMonth === new Date().getMonth() && currentYear === new Date().getFullYear()

  const prevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1))
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'instagram':
        return <Instagram className="w-3 h-3 text-pink-400" />
      case 'linkedin':
        return <Linkedin className="w-3 h-3 text-blue-400" />
      case 'blog':
        return <FileText className="w-3 h-3 text-purple-400" />
      default:
        return <FileText className="w-3 h-3 text-slate-400" />
    }
  }

  const getEventsForDay = (day: number) => {
    return events.filter(e => e.day === day)
  }

  // Generate calendar days
  const calendarDays = []
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null)
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day)
  }

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Calendário</h1>
          <p className="text-slate-400 text-sm">Visualize e gerencie suas publicações</p>
        </div>
        <Button className="bg-teal-500 hover:bg-teal-600 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Nova publicação
        </Button>
      </div>

      {/* Calendar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-teal-400" />
                {months[currentMonth]} {currentYear}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={prevMonth} className="text-slate-400 hover:text-white">
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={nextMonth} className="text-slate-400 hover:text-white">
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Week days header */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {weekDays.map((day) => (
                <div key={day} className="text-center text-xs font-medium text-slate-500 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, index) => {
                const dayEvents = day ? getEventsForDay(day) : []
                const isToday = isCurrentMonth && day === today
                const isSelected = day === selectedDay

                return (
                  <div
                    key={index}
                    className={`
                      min-h-[80px] p-1 rounded-lg border transition-all cursor-pointer
                      ${day === null ? 'border-transparent' : 'border-slate-800 hover:border-slate-700'}
                      ${isToday ? 'bg-teal-500/10 border-teal-500/30' : ''}
                      ${isSelected ? 'bg-slate-800 border-slate-600' : ''}
                    `}
                    onClick={() => day && setSelectedDay(day)}
                  >
                    {day && (
                      <>
                        <span className={`
                          text-sm font-medium block text-center mb-1
                          ${isToday ? 'text-teal-400' : 'text-slate-400'}
                        `}>
                          {day}
                        </span>
                        <div className="space-y-0.5">
                          {dayEvents.slice(0, 2).map((event) => (
                            <div
                              key={event.id}
                              className="text-xs truncate px-1 py-0.5 rounded bg-slate-800 text-slate-300 flex items-center gap-1"
                            >
                              {getPlatformIcon(event.platform)}
                              <span className="truncate">{event.title}</span>
                            </div>
                          ))}
                          {dayEvents.length > 2 && (
                            <span className="text-xs text-slate-500 px-1">+{dayEvents.length - 2} mais</span>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Selected Day Events */}
      {selectedDay && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-400" />
                Eventos de {selectedDay} de {months[currentMonth]}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {getEventsForDay(selectedDay).length > 0 ? (
                <div className="space-y-3">
                  {getEventsForDay(selectedDay).map((event) => (
                    <div
                      key={event.id}
                      className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700"
                    >
                      <div className="flex items-center gap-3">
                        {getPlatformIcon(event.platform)}
                        <div>
                          <p className="text-white font-medium">{event.title}</p>
                          <p className="text-xs text-slate-500">{event.time}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={event.status === 'scheduled' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'} variant="outline" style={{ border: 'none' }}>
                          {event.status === 'scheduled' ? 'Agendado' : 'Pendente'}
                        </Badge>
                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-red-400">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Nenhum evento para este dia</p>
                  <Button variant="outline" className="mt-4 border-slate-700 text-slate-300">
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar evento
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
