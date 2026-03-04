'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import {
  Home,
  LayoutDashboard,
  Search,
  Share2,
  PenTool,
  Megaphone,
  Target,
  Calendar,
  BarChart3,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Settings,
  User,
  LogOut,
  Bell,
  Menu
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'

interface SidebarItem {
  icon: React.ElementType
  label: string
  href: string
  badge?: string | number
}

interface SidebarSection {
  title: string
  items: SidebarItem[]
}

const navigation: (SidebarItem | SidebarSection)[] = [
  { icon: Home, label: 'Início', href: '/' },
  { icon: LayoutDashboard, label: 'Dashboard', href: '/app' },
  {
    title: 'SERVIÇOS',
    items: [
      { icon: Search, label: 'SEO', href: '/app/seo' },
      { icon: Share2, label: 'Redes Sociais', href: '/app/redes-sociais', badge: 3 },
      { icon: PenTool, label: 'Conteúdo', href: '/app/conteudo' },
      { icon: Megaphone, label: 'Anúncios', href: '/app/anuncios' },
    ]
  },
  {
    title: 'RECURSOS',
    items: [
      { icon: Target, label: 'ICP', href: '/app/icp' },
      { icon: Calendar, label: 'Calendário', href: '/app/calendario' },
      { icon: BarChart3, label: 'Análise', href: '/app/analise' },
    ]
  },
]

interface AppSidebarProps {
  className?: string
}

export function AppSidebar({ className }: AppSidebarProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [openSections, setOpenSections] = useState<string[]>(['SERVIÇOS', 'RECURSOS'])
  const pathname = usePathname()

  const toggleSection = (title: string) => {
    setOpenSections(prev => 
      prev.includes(title) 
        ? prev.filter(t => t !== title)
        : [...prev, title]
    )
  }

  const isActive = (href: string) => pathname === href

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-screen bg-slate-900 border-r border-slate-800 z-40 transition-all duration-300 ease-in-out flex flex-col',
        isExpanded ? 'w-60' : 'w-16',
        className
      )}
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
        <Link href="/" className="flex items-center gap-3 overflow-hidden">
          <Image
            src="/logo.png"
            alt="Orion"
            width={100}
            height={28}
            className={cn(
              'h-7 w-auto brightness-0 invert transition-all duration-300',
              isExpanded ? 'opacity-100' : 'opacity-0 w-0'
            )}
          />
          {!isExpanded && (
            <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">O</span>
            </div>
          )}
        </Link>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1.5 rounded-md hover:bg-slate-800 transition-colors text-slate-400 hover:text-white"
        >
          {isExpanded ? (
            <ChevronLeft className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
        <ul className="space-y-1">
          {navigation.map((item, index) => {
            // Single item
            if ('icon' in item && 'href' in item) {
              const Icon = item.icon
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group',
                      isActive(item.href)
                        ? 'bg-teal-500/10 text-teal-400'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    )}
                  >
                    <div
                      className={cn(
                        'w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors',
                        isActive(item.href)
                          ? 'bg-teal-500 text-white'
                          : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700 group-hover:text-white'
                      )}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span
                      className={cn(
                        'font-medium text-sm transition-all duration-300 overflow-hidden',
                        isExpanded ? 'opacity-100 max-w-xs' : 'opacity-0 max-w-0'
                      )}
                    >
                      {item.label}
                    </span>
                    {item.badge && isExpanded && (
                      <Badge className="ml-auto bg-teal-500/20 text-teal-300 border-0 text-xs px-1.5">
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                </li>
              )
            }

            // Section with items
            if ('title' in item && 'items' in item) {
              const isOpen = openSections.includes(item.title)
              return (
                <li key={item.title} className="mt-4">
                  <Collapsible open={isOpen} onOpenChange={() => toggleSection(item.title)}>
                    <CollapsibleTrigger asChild>
                      <button
                        className={cn(
                          'w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider hover:text-slate-300 transition-colors',
                          !isExpanded && 'justify-center'
                        )}
                      >
                        {isExpanded && (
                          <>
                            <span>{item.title}</span>
                            <ChevronDown className={cn(
                              'w-3 h-3 ml-auto transition-transform',
                              isOpen && 'rotate-180'
                            )} />
                          </>
                        )}
                        {!isExpanded && <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />}
                      </button>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <ul className="space-y-1 mt-1">
                        {item.items.map((subItem) => {
                          const Icon = subItem.icon
                          return (
                            <li key={subItem.href}>
                              <Link
                                href={subItem.href}
                                className={cn(
                                  'flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group',
                                  isActive(subItem.href)
                                    ? 'bg-teal-500/10 text-teal-400'
                                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                )}
                              >
                                <Icon className="w-4 h-4 shrink-0" />
                                <span
                                  className={cn(
                                    'text-sm transition-all duration-300 overflow-hidden',
                                    isExpanded ? 'opacity-100 max-w-xs' : 'opacity-0 max-w-0'
                                  )}
                                >
                                  {subItem.label}
                                </span>
                                {subItem.badge && isExpanded && (
                                  <Badge className="ml-auto bg-teal-500/20 text-teal-300 border-0 text-xs px-1.5">
                                    {subItem.badge}
                                  </Badge>
                                )}
                              </Link>
                            </li>
                          )
                        })}
                      </ul>
                    </CollapsibleContent>
                  </Collapsible>
                </li>
              )
            }

            return null
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-800 p-3 space-y-2">
        <Link
          href="/app/configuracoes"
          className={cn(
            'flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-all',
            !isExpanded && 'justify-center'
          )}
        >
          <Settings className="w-4 h-4" />
          {isExpanded && <span className="text-sm">Configurações</span>}
        </Link>
        <Link
          href="/app/conta"
          className={cn(
            'flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-all',
            !isExpanded && 'justify-center'
          )}
        >
          <User className="w-4 h-4" />
          {isExpanded && <span className="text-sm">Conta</span>}
        </Link>

        {isExpanded && (
          <div className="pt-2 border-t border-slate-800 mt-2">
            <p className="text-xs text-slate-600 text-center">v1.0.0</p>
          </div>
        )}
      </div>
    </aside>
  )
}

// Mobile sidebar trigger
export function MobileSidebarTrigger() {
  return (
    <Button variant="ghost" size="icon" className="md:hidden text-slate-400">
      <Menu className="w-5 h-5" />
    </Button>
  )
}
