'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ROISuggestion {
  id: string
  text: string
  impact: string
}

interface ROISuggestionsProps {
  suggestions: ROISuggestion[]
  className?: string
}

export function ROISuggestions({ suggestions, className }: ROISuggestionsProps) {
  return (
    <Card className={cn('bg-white border-slate-200', className)}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-slate-900">
          <TrendingUp className="w-5 h-5 text-teal-600" />
          Sugestões de Melhoria de ROI
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-slate-500 mb-4">
          Baseado no seu perfil e resultados:
        </p>
        <ul className="space-y-3">
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.id}
              className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg"
            >
              <ArrowRight className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm text-slate-700">{suggestion.text}</p>
                <p className="text-xs text-teal-600 font-medium mt-1">
                  {suggestion.impact}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
