'use client'

import { motion } from 'framer-motion'
import { 
  Sprout,
  TrendingUp,
  TreeDeciduous,
  Crown,
  Star,
  FileText,
  Users,
  Target,
  Clock,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export type GrowthLevel = 'seed' | 'growing' | 'established' | 'master'

export interface GrowthScoreProps {
  level: GrowthLevel
  progress: number
  stats: {
    published: number
    reach: number
    leads: number
    timeSaved: string
  }
  trend?: {
    value: number
    direction: 'up' | 'down'
  }
  className?: string
}

const levelConfig = {
  seed: {
    icon: Sprout,
    label: 'Semente',
    description: 'Crescendo os primeiros brotos',
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-100',
    gradient: 'from-emerald-400 to-emerald-500',
    range: [0, 25]
  },
  growing: {
    icon: TrendingUp,
    label: 'Crescendo',
    description: 'Ganhando tração',
    color: 'text-blue-500',
    bgColor: 'bg-blue-100',
    gradient: 'from-blue-400 to-blue-500',
    range: [25, 50]
  },
  established: {
    icon: TreeDeciduous,
    label: 'Estabelecido',
    description: 'Resultados consistentes',
    color: 'text-purple-500',
    bgColor: 'bg-purple-100',
    gradient: 'from-purple-400 to-purple-500',
    range: [50, 75]
  },
  master: {
    icon: Crown,
    label: 'Mestre',
    description: 'Autoridade consolidada',
    color: 'text-amber-500',
    bgColor: 'bg-amber-100',
    gradient: 'from-amber-400 to-amber-500',
    range: [75, 100]
  }
}

export function GrowthScore({ 
  level, 
  progress, 
  stats, 
  trend,
  className 
}: GrowthScoreProps) {
  const config = levelConfig[level]
  const Icon = config.icon

  return (
    <Card className={cn("overflow-hidden border-slate-200", className)}>
      {/* Gradient header */}
      <div className={cn(
        "h-24 bg-gradient-to-br relative overflow-hidden",
        config.gradient
      )}>
        {/* Decorative circles */}
        <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full" />
        <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-white/10 rounded-full" />
        
        {/* Level info */}
        <div className="absolute bottom-4 left-4 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-white/80 text-xs font-medium">Nível atual</p>
            <p className="text-white font-bold text-lg">{config.label}</p>
          </div>
        </div>

        {/* Progress percentage */}
        <div className="absolute bottom-4 right-4 text-right">
          <p className="text-white/80 text-xs">Progresso</p>
          <p className="text-white font-bold text-2xl">{progress}%</p>
        </div>
      </div>

      <CardContent className="p-4">
        {/* Description */}
        <p className="text-sm text-slate-600 mb-4">{config.description}</p>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Próximo nível</span>
            <span>{progress}% completo</span>
          </div>
          <Progress 
            value={progress} 
            className="h-2"
          />
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            icon={FileText}
            label="Publicados"
            value={stats.published}
            color="text-teal-500"
            bgColor="bg-teal-100"
          />
          <StatCard
            icon={Users}
            label="Alcance"
            value={stats.reach}
            color="text-blue-500"
            bgColor="bg-blue-100"
            format="k"
          />
          <StatCard
            icon={Target}
            label="Leads"
            value={stats.leads}
            color="text-purple-500"
            bgColor="bg-purple-100"
          />
          <StatCard
            icon={Clock}
            label="Tempo economizado"
            value={stats.timeSaved}
            color="text-amber-500"
            bgColor="bg-amber-100"
            isText
          />
        </div>

        {/* Trend indicator */}
        {trend && (
          <div className={cn(
            "mt-4 flex items-center justify-center gap-1 text-sm font-medium py-2 rounded-lg",
            trend.direction === 'up' 
              ? "bg-emerald-50 text-emerald-600" 
              : "bg-red-50 text-red-600"
          )}>
            {trend.direction === 'up' ? (
              <ArrowUpRight className="w-4 h-4" />
            ) : (
              <ArrowDownRight className="w-4 h-4" />
            )}
            <span>{trend.value}% este mês</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Mini stat card component
interface StatCardProps {
  icon: React.ElementType
  label: string
  value: number | string
  color: string
  bgColor: string
  format?: 'k' | 'm'
  isText?: boolean
}

function StatCard({ 
  icon: Icon, 
  label, 
  value, 
  color, 
  bgColor, 
  format,
  isText 
}: StatCardProps) {
  const displayValue = typeof value === 'number' && format === 'k' 
    ? `${(value / 1000).toFixed(1)}k`
    : typeof value === 'number' && format === 'm'
    ? `${(value / 1000000).toFixed(1)}m`
    : value

  return (
    <div className="bg-slate-50 rounded-lg p-3">
      <div className="flex items-center gap-2 mb-1">
        <div className={cn("w-6 h-6 rounded-md flex items-center justify-center", bgColor)}>
          <Icon className={cn("w-3 h-3", color)} />
        </div>
        <span className="text-xs text-slate-500">{label}</span>
      </div>
      <p className={cn(
        "text-lg font-bold",
        isText ? "text-slate-700" : "text-slate-900"
      )}>
        {displayValue}
      </p>
    </div>
  )
}

// Compact version for sidebar
export interface GrowthScoreMiniProps {
  level: GrowthLevel
  progress: number
  className?: string
}

export function GrowthScoreMini({ level, progress, className }: GrowthScoreMiniProps) {
  const config = levelConfig[level]
  const Icon = config.icon

  return (
    <div className={cn(
      "flex items-center gap-3 p-3 rounded-xl",
      config.bgColor,
      className
    )}>
      <div className={cn(
        "w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br",
        config.gradient
      )}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className={cn("font-semibold text-sm", config.color)}>
            {config.label}
          </span>
          <span className="text-xs text-slate-500">{progress}%</span>
        </div>
        <Progress value={progress} className="h-1.5" />
      </div>
    </div>
  )
}
