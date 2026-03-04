'use client'

import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

interface MetricsCardProps {
  title: string
  value: string | number
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
  icon: LucideIcon
  className?: string
}

export function MetricsCard({
  title,
  value,
  change,
  changeType = 'positive',
  icon: Icon,
  className,
}: MetricsCardProps) {
  return (
    <Card className={cn('bg-white border-slate-200', className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
            <Icon className="w-5 h-5 text-slate-600" />
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
          <p className="text-3xl font-bold text-slate-900">{value}</p>
          {change && (
            <p
              className={cn(
                'text-sm font-medium mt-2',
                changeType === 'positive' && 'text-emerald-600',
                changeType === 'negative' && 'text-red-600',
                changeType === 'neutral' && 'text-slate-500'
              )}
            >
              {change}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
