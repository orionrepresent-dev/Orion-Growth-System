'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MapPin, CheckCircle2, Clock, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RoadmapItem {
  id: string
  title: string
  description: string
  status: 'completed' | 'in_progress' | 'pending'
  date: string
  cta?: {
    label: string
    href: string
  }
}

interface RoadmapProps {
  items: RoadmapItem[]
  className?: string
}

export function Roadmap({ items, className }: RoadmapProps) {
  return (
    <Card className={cn('bg-white border-slate-200', className)}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-slate-900">
          <MapPin className="w-5 h-5 text-teal-600" />
          Seu Roadmap
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-200" />

          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={item.id} className="relative flex items-start gap-4 pl-10">
                {/* Status indicator */}
                <div
                  className={cn(
                    'absolute left-2 w-5 h-5 rounded-full border-2 flex items-center justify-center',
                    item.status === 'completed' && 'bg-emerald-500 border-emerald-500',
                    item.status === 'in_progress' && 'bg-teal-500 border-teal-500',
                    item.status === 'pending' && 'bg-white border-slate-300'
                  )}
                >
                  {item.status === 'completed' && (
                    <CheckCircle2 className="w-3 h-3 text-white" />
                  )}
                  {item.status === 'in_progress' && (
                    <Loader2 className="w-3 h-3 text-white animate-spin" />
                  )}
                  {item.status === 'pending' && (
                    <Clock className="w-2.5 h-2.5 text-slate-400" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pb-4">
                  <div className="flex items-start justify-between gap-4 mb-1">
                    <h4 className="font-semibold text-slate-900">{item.title}</h4>
                    <Badge
                      variant="outline"
                      className={cn(
                        'shrink-0',
                        item.status === 'completed' && 'border-emerald-300 text-emerald-700 bg-emerald-50',
                        item.status === 'in_progress' && 'border-teal-300 text-teal-700 bg-teal-50',
                        item.status === 'pending' && 'border-slate-300 text-slate-500 bg-slate-50'
                      )}
                    >
                      {item.status === 'completed' && 'Concluído'}
                      {item.status === 'in_progress' && 'Em andamento'}
                      {item.status === 'pending' && 'Pendente'}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-500 mb-2">{item.description}</p>
                  <p className="text-xs text-slate-400 mb-3">
                    {item.status === 'completed' && `Concluído em ${item.date}`}
                    {item.status === 'in_progress' && 'Em andamento'}
                    {item.status === 'pending' && `Previsão: ${item.date}`}
                  </p>

                  {item.status === 'in_progress' && item.cta && (
                    <Button
                      size="sm"
                      className="bg-teal-600 hover:bg-teal-700 text-white"
                      asChild
                    >
                      <a href={item.cta.href}>{item.cta.label}</a>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
