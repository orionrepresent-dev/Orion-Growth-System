'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Lightbulb, ChevronRight, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

interface Decision {
  id: string
  icon: 'smartphone' | 'pen' | 'trending' | 'target'
  title: string
  description: string
  impact: string
  detailsHref: string
}

interface DecisionPanelProps {
  decisions: Decision[]
  className?: string
}

const iconMap = {
  smartphone: '📱',
  pen: '📝',
  trending: '📈',
  target: '🎯',
}

export function DecisionPanel({ decisions: initialDecisions, className }: DecisionPanelProps) {
  const [decisions, setDecisions] = useState(initialDecisions)

  const handleIgnore = (id: string) => {
    setDecisions(decisions.filter((d) => d.id !== id))
  }

  if (decisions.length === 0) {
    return null
  }

  return (
    <Card className={cn('bg-white border-slate-200', className)}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-slate-900">
          <Lightbulb className="w-5 h-5 text-amber-500" />
          Decisões Pendentes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {decisions.map((decision) => (
            <div
              key={decision.id}
              className="p-4 border border-slate-200 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-lg shrink-0">
                  {iconMap[decision.icon]}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-slate-900 mb-1">{decision.title}</h4>
                  <p className="text-sm text-slate-600 mb-2">{decision.description}</p>
                  <Badge variant="outline" className="border-emerald-300 text-emerald-700 bg-emerald-50">
                    Impacto estimado: {decision.impact}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4 pl-13">
                <Button
                  size="sm"
                  className="bg-slate-900 hover:bg-slate-800 text-white"
                  asChild
                >
                  <a href={decision.detailsHref}>
                    Ver detalhes
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </a>
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-slate-500 hover:text-slate-700"
                  onClick={() => handleIgnore(decision.id)}
                >
                  <X className="w-4 h-4 mr-1" />
                  Ignorar
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
