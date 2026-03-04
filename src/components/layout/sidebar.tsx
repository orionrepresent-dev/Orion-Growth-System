'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import {
  Home,
  LayoutDashboard,
  Search,
  PenTool,
  Smartphone,
  TrendingUp,
  Target,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User,
  Settings
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface SidebarItem {
  icon: React.ElementType
  label: string
  description: string
  href: string
  isSeparator?: boolean
  isSectionTitle?: boolean
}

const sidebarItems: SidebarItem[] = [
  { icon: Home, label: 'Início', description: 'Página principal', href: '/' },
  { icon: LayoutDashboard, label: 'Dashboard', description: 'Suas métricas e ROI', href: '/dashboard' },
  { icon: ChevronLeft, label: '', description: '', href: '', isSeparator: true },
  { icon: ChevronLeft, label: 'SERVIÇOS', description: '', href: '', isSectionTitle: true },
  { icon: Search, label: 'SEO/AEO', description: 'Apareça no Google, buscas por voz e IA', href: '/seo' },
  { icon: PenTool, label: 'Business Audience', description: 'Conteúdo que atrai seu cliente ideal', href: '/business-audience' },
  { icon: Smartphone, label: 'Meta Ads', description: 'Campanhas que trazem resultados', href: '/meta-ads' },
  { icon: TrendingUp, label: 'Análise de Mercado', description: 'Entenda seu setor e concorrentes', href: '/market-analysis' },
  { icon: Target, label: 'ICP', description: 'Seu cliente ideal mapeado', href: '/icp' },
  { icon: ChevronLeft, label: '', description: '', href: '', isSeparator: true },
  { icon: CreditCard, label: 'Planos', description: 'Escolha o ideal para você', href: '/plans' },
]

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-screen bg-white border-r border-slate-200 z-40 transition-all duration-300 ease-in-out flex flex-col',
        isExpanded ? 'w-72' : 'w-16',
        className
      )}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 bg-white">
        <div className="flex items-center gap-3 overflow-hidden">
          <Image
            src="/logo.png"
            alt="Orion Growth Studio"
            width={120}
            height={32}
            className={cn(
              'h-8 w-auto transition-all duration-300',
              isExpanded ? 'opacity-100' : 'opacity-0 w-0'
            )}
          />
          {!isExpanded && (
            <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">O</span>
            </div>
          )}
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1.5 rounded-md hover:bg-slate-100 transition-colors text-slate-500"
        >
          {isExpanded ? (
            <ChevronLeft className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        <ul className="space-y-1">
          {sidebarItems.map((item, index) => {
            if (item.isSeparator) {
              return (
                <li key={`sep-${index}`} className="py-2">
                  <div className="h-px bg-slate-200 mx-2" />
                </li>
              )
            }

            if (item.isSectionTitle) {
              return (
                <li key={`title-${index}`} className="px-3 py-2">
                  <span
                    className={cn(
                      'text-xs font-semibold text-slate-400 uppercase tracking-wider transition-opacity duration-300',
                      isExpanded ? 'opacity-100' : 'opacity-0'
                    )}
                  >
                    {item.label}
                  </span>
                </li>
              )
            }

            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative',
                    isActive
                      ? 'bg-teal-50 text-teal-700'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  )}
                >
                  <div
                    className={cn(
                      'w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors',
                      isActive
                        ? 'bg-teal-600 text-white'
                        : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-700'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div
                    className={cn(
                      'flex-1 overflow-hidden transition-all duration-300',
                      isExpanded ? 'opacity-100 max-w-xs' : 'opacity-0 max-w-0'
                    )}
                  >
                    <p className="font-medium text-sm truncate">{item.label}</p>
                    <p className="text-xs text-slate-400 truncate">{item.description}</p>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-200 p-3 bg-white">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={cn(
                'w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-slate-100 transition-colors',
                isExpanded ? 'justify-start' : 'justify-center'
              )}
            >
              <Avatar className="w-8 h-8 bg-teal-600">
                <AvatarFallback className="bg-teal-600 text-white text-sm font-medium">
                  U
                </AvatarFallback>
              </Avatar>
              <div
                className={cn(
                  'flex-1 text-left overflow-hidden transition-all duration-300',
                  isExpanded ? 'opacity-100 max-w-xs' : 'opacity-0 max-w-0'
                )}
              >
                <p className="text-sm font-medium text-slate-900 truncate">Usuário</p>
                <p className="text-xs text-slate-400 truncate">user@email.com</p>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem asChild>
              <Link href="/dashboard" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Meu Perfil
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Configurações
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/login" className="flex items-center gap-2 text-red-600 focus:text-red-600">
                <LogOut className="w-4 h-4" />
                Sair
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  )
}
