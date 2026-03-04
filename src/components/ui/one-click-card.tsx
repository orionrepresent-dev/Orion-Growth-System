'use client'

import { motion } from 'framer-motion'
import { 
  Check, 
  RefreshCw, 
  Edit3, 
  X, 
  Calendar,
  Image as ImageIcon,
  FileText,
  Newspaper,
  BookOpen,
  ThumbsUp,
  MessageSquare,
  Sparkles,
  Clock
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export interface OneClickContent {
  id: string
  type: 'post' | 'article' | 'news' | 'ebook'
  title: string
  preview: string
  image?: string
  scheduledFor?: string
  platform?: 'instagram' | 'linkedin' | 'twitter' | 'facebook' | 'blog'
  hashtags?: string[]
}

export interface OneClickActionCardProps {
  content: OneClickContent
  onApprove: () => void
  onVariation: () => void
  onEdit: () => void
  onSkip: () => void
  feedbackOptions?: string[]
  onFeedback?: (feedback: string) => void
  className?: string
}

const typeIcons = {
  post: FileText,
  article: Newspaper,
  news: Sparkles,
  ebook: BookOpen
}

const typeLabels = {
  post: 'Post',
  article: 'Artigo',
  news: 'Notícia',
  ebook: 'E-book'
}

const platformColors = {
  instagram: 'from-pink-500 to-purple-500',
  linkedin: 'from-blue-600 to-blue-700',
  twitter: 'from-sky-400 to-sky-500',
  facebook: 'from-blue-500 to-blue-600',
  blog: 'from-emerald-500 to-teal-500'
}

const platformLabels = {
  instagram: 'Instagram',
  linkedin: 'LinkedIn',
  twitter: 'X',
  facebook: 'Facebook',
  blog: 'Blog'
}

const defaultFeedbackOptions = [
  'Perfeito!',
  'Mais curto',
  'Mais formal',
  'Mais técnico',
  'Mais relaxado',
  'Adicionar CTA'
]

export function OneClickActionCard({
  content,
  onApprove,
  onVariation,
  onEdit,
  onSkip,
  feedbackOptions = defaultFeedbackOptions,
  onFeedback,
  className
}: OneClickActionCardProps) {
  const TypeIcon = typeIcons[content.type]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      <Card className="overflow-hidden border-slate-200 hover:border-teal-300 transition-colors">
        {/* Header with type and platform */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center">
              <TypeIcon className="w-4 h-4 text-teal-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900">{typeLabels[content.type]}</p>
              {content.scheduledFor && (
                <p className="text-xs text-slate-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {content.scheduledFor}
                </p>
              )}
            </div>
          </div>
          
          {content.platform && (
            <Badge className={cn(
              "bg-gradient-to-r text-white border-0 text-xs",
              platformColors[content.platform]
            )}>
              {platformLabels[content.platform]}
            </Badge>
          )}
        </div>

        <CardContent className="p-4">
          {/* Title */}
          <h4 className="font-semibold text-slate-900 mb-2">{content.title}</h4>
          
          {/* Preview text */}
          <p className="text-sm text-slate-600 mb-3 line-clamp-3">{content.preview}</p>

          {/* Image placeholder or actual image */}
          {content.image ? (
            <div className="relative rounded-lg overflow-hidden mb-3 aspect-video bg-slate-100">
              <img 
                src={content.image} 
                alt={content.title}
                className="w-full h-full object-cover"
              />
            </div>
          ) : content.type === 'post' && (
            <div className="rounded-lg border-2 border-dashed border-slate-200 p-6 mb-3 flex flex-col items-center justify-center bg-slate-50">
              <ImageIcon className="w-8 h-8 text-slate-300 mb-2" />
              <p className="text-xs text-slate-400">Imagem sugerida</p>
            </div>
          )}

          {/* Hashtags */}
          {content.hashtags && content.hashtags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {content.hashtags.map((tag, i) => (
                <span key={i} className="text-xs text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2 mb-3">
            <Button
              onClick={onApprove}
              size="sm"
              className="bg-emerald-500 hover:bg-emerald-600 text-white"
            >
              <Check className="w-4 h-4 mr-1" />
              Aprovar
            </Button>
            <Button
              onClick={onVariation}
              size="sm"
              variant="outline"
              className="border-slate-300 text-slate-600 hover:bg-slate-50"
            >
              <RefreshCw className="w-4 h-4 mr-1" />
              Variar
            </Button>
            <Button
              onClick={onEdit}
              size="sm"
              variant="outline"
              className="border-slate-300 text-slate-600 hover:bg-slate-50"
            >
              <Edit3 className="w-4 h-4 mr-1" />
              Editar
            </Button>
            <Button
              onClick={onSkip}
              size="sm"
              variant="ghost"
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4 mr-1" />
              Pular
            </Button>
          </div>

          {/* Quick feedback */}
          {onFeedback && (
            <div className="pt-3 border-t border-slate-100">
              <p className="text-xs text-slate-500 mb-2 flex items-center gap-1">
                <MessageSquare className="w-3 h-3" />
                Feedback rápido:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {feedbackOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => onFeedback(option)}
                    className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 hover:bg-teal-50 hover:text-teal-600 transition-colors"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
