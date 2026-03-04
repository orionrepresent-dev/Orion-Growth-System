'use client'

import { motion } from 'framer-motion'
import { 
  Brain,
  TrendingUp,
  Clock,
  FileText,
  Users,
  Target,
  Lightbulb,
  CheckCircle2,
  ArrowUpRight,
  Sparkles
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export interface LearningInsight {
  id: string
  category: 'tom' | 'tamanho' | 'horario' | 'formato' | 'tema' | 'engajamento'
  insight: string
  confidence: number
  metric?: string
  trend?: 'up' | 'down' | 'stable'
}

export interface LearningPanelProps {
  insights: LearningInsight[]
  title?: string
  className?: string
}

const categoryConfig = {
  tom: {
    icon: MessageSquare,
    label: 'Tom de voz',
    color: 'text-purple-500',
    bgColor: 'bg-purple-100'
  },
  tamanho: {
    icon: FileText,
    label: 'Tamanho',
    color: 'text-blue-500',
    bgColor: 'bg-blue-100'
  },
  horario: {
    icon: Clock,
    label: 'Horário',
    color: 'text-amber-500',
    bgColor: 'bg-amber-100'
  },
  formato: {
    icon: Image,
    label: 'Formato',
    color: 'text-pink-500',
    bgColor: 'bg-pink-100'
  },
  tema: {
    icon: Target,
    label: 'Tema',
    color: 'text-teal-500',
    bgColor: 'bg-teal-100'
  },
  engajamento: {
    icon: TrendingUp,
    label: 'Engajamento',
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-100'
  }
}

// Fix: Import missing icons
import { Image, MessageSquare } from 'lucide-react'

export function LearningPanel({ 
  insights, 
  title = 'O que aprendi com você',
  className 
}: LearningPanelProps) {
  return (
    <Card className={cn("border-slate-200", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Brain className="w-4 h-4 text-white" />
          </div>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.map((insight, index) => {
          const config = categoryConfig[insight.category]
          const Icon = config.icon

          return (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-3"
            >
              {/* Category Icon */}
              <div className={cn(
                "w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
                config.bgColor
              )}>
                <Icon className={cn("w-4 h-4", config.color)} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-slate-500">
                    {config.label}
                  </span>
                  {insight.trend && (
                    <Badge variant="outline" className={cn(
                      "text-xs px-1.5 py-0 h-4 border-0",
                      insight.trend === 'up' && "bg-emerald-50 text-emerald-600",
                      insight.trend === 'down' && "bg-red-50 text-red-600",
                      insight.trend === 'stable' && "bg-slate-50 text-slate-600"
                    )}>
                      {insight.trend === 'up' && <ArrowUpRight className="w-3 h-3 mr-0.5" />}
                      {insight.metric}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-slate-900 font-medium">{insight.insight}</p>
                
                {/* Confidence bar */}
                <div className="mt-2 flex items-center gap-2">
                  <Progress 
                    value={insight.confidence} 
                    className="h-1.5 flex-1"
                  />
                  <span className="text-xs text-slate-500 font-medium">
                    {insight.confidence}%
                  </span>
                </div>
              </div>
            </motion.div>
          )
        })}

        {/* Footer tip */}
        <div className="pt-4 border-t border-slate-100">
          <div className="flex items-start gap-2 text-xs text-slate-500">
            <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p>
              Quanto mais você interage, mais eu aprendo sobre o que funciona para seu público.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Compact version for sidebar/dashboard
export interface LearningMiniProps {
  insights: LearningInsight[]
  className?: string
}

export function LearningMini({ insights, className }: LearningMiniProps) {
  const topInsights = insights.slice(0, 3)

  return (
    <div className={cn("space-y-2", className)}>
      {topInsights.map((insight) => {
        const config = categoryConfig[insight.category]
        const Icon = config.icon

        return (
          <div 
            key={insight.id}
            className="flex items-center gap-2 text-sm"
          >
            <div className={cn(
              "w-6 h-6 rounded-md flex items-center justify-center",
              config.bgColor
            )}>
              <Icon className={cn("w-3 h-3", config.color)} />
            </div>
            <span className="text-slate-600 truncate">{insight.insight}</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500 ml-auto shrink-0" />
          </div>
        )
      })}
    </div>
  )
}
