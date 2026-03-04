'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { 
  Bell, 
  TrendingUp, 
  Lightbulb, 
  Target,
  CheckCircle2,
  Sparkles,
  Calendar,
  X,
  ChevronRight
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export type NotificationType = 'ready' | 'trend' | 'opportunity' | 'learning' | 'reminder'

export interface FriendlyNotificationProps {
  id: string
  type: NotificationType
  title: string
  message: string
  timestamp?: string
  actions?: { label: string; onClick: () => void; variant?: 'default' | 'outline' | 'ghost' }[]
  onDismiss?: () => void
  className?: string
}

const notificationConfig = {
  ready: {
    icon: CheckCircle2,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    iconBg: 'bg-emerald-100'
  },
  trend: {
    icon: TrendingUp,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    iconBg: 'bg-blue-100'
  },
  opportunity: {
    icon: Lightbulb,
    color: 'text-amber-500',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    iconBg: 'bg-amber-100'
  },
  learning: {
    icon: Target,
    color: 'text-purple-500',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    iconBg: 'bg-purple-100'
  },
  reminder: {
    icon: Calendar,
    color: 'text-teal-500',
    bgColor: 'bg-teal-50',
    borderColor: 'border-teal-200',
    iconBg: 'bg-teal-100'
  }
}

export function FriendlyNotification({
  id,
  type,
  title,
  message,
  timestamp,
  actions = [],
  onDismiss,
  className
}: FriendlyNotificationProps) {
  const config = notificationConfig[type]
  const Icon = config.icon

  return (
    <motion.div
      initial={{ opacity: 0, x: 20, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={className}
    >
      <Card className={cn(
        "border overflow-hidden transition-all hover:shadow-md",
        config.borderColor,
        config.bgColor
      )}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            {/* Icon */}
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
              config.iconBg
            )}>
              <Icon className={cn("w-5 h-5", config.color)} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-semibold text-slate-900 text-sm">{title}</h4>
                  <p className="text-sm text-slate-600 mt-0.5">{message}</p>
                </div>
                {onDismiss && (
                  <button
                    onClick={onDismiss}
                    className="text-slate-400 hover:text-slate-600 transition-colors shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Timestamp */}
              {timestamp && (
                <p className="text-xs text-slate-400 mt-1">{timestamp}</p>
              )}

              {/* Actions */}
              {actions.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {actions.map((action, i) => (
                    <Button
                      key={i}
                      size="sm"
                      variant={action.variant || 'outline'}
                      onClick={action.onClick}
                      className={cn(
                        "text-xs h-7",
                        action.variant === 'default' 
                          ? "bg-teal-500 hover:bg-teal-600 text-white" 
                          : "border-slate-300 text-slate-600"
                      )}
                    >
                      {action.label}
                      {i === 0 && <ChevronRight className="w-3 h-3 ml-1" />}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Notification List Component
export interface FriendlyNotificationListProps {
  notifications: FriendlyNotificationProps[]
  onDismiss?: (id: string) => void
  maxVisible?: number
  className?: string
}

export function FriendlyNotificationList({
  notifications,
  onDismiss,
  maxVisible = 5,
  className
}: FriendlyNotificationListProps) {
  const visibleNotifications = notifications.slice(0, maxVisible)

  return (
    <div className={cn("space-y-3", className)}>
      <AnimatePresence mode="popLayout">
        {visibleNotifications.map((notification) => (
          <FriendlyNotification
            key={notification.id}
            {...notification}
            onDismiss={() => onDismiss?.(notification.id)}
          />
        ))}
      </AnimatePresence>
      
      {notifications.length > maxVisible && (
        <p className="text-xs text-slate-500 text-center py-2">
          +{notifications.length - maxVisible} notificações
        </p>
      )}
    </div>
  )
}

// Notification Badge Component
export function NotificationBadge({ count }: { count: number }) {
  if (count === 0) return null

  return (
    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
      {count > 9 ? '9+' : count}
    </span>
  )
}
