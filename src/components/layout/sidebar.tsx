'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Home,
  LayoutDashboard,
  ChevronDown,
  ChevronRight,
  Search,
  Share2,
  FileText,
  Megaphone,
  Users,
  Calendar,
  BarChart3,
  Settings,
  User,
  Menu,
  X,
  Sparkles,
  Zap
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavItem {
  icon: React.ElementType
  label: string
  href: string
  badge?: number
}

interface NavSection {
  title: string
  items: NavItem[]
}

const navigation: NavSection[] = [
  {
    title: 'Geral',
    items: [
      { icon: Home, label: 'Início', href: '/dashboard' },
      { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard/overview' },
    ]
  },
  {
    title: 'Serviços',
    items: [
      { icon: Search, label: 'SEO', href: '/dashboard/seo' },
      { icon: Share2, label: 'Redes Sociais', href: '/dashboard/redes-sociais' },
      { icon: FileText, label: 'Conteúdo', href: '/dashboard/conteudo', badge: 5 },
      { icon: Megaphone, label: 'Anúncios', href: '/dashboard/anuncios' },
    ]
  },
  {
    title: 'Recursos',
    items: [
      { icon: Users, label: 'ICP', href: '/dashboard/icp' },
      { icon: Calendar, label: 'Calendário', href: '/dashboard/calendario' },
      { icon: BarChart3, label: 'Análise de Mercado', href: '/dashboard/analise' },
    ]
  },
]

const bottomNav: NavItem[] = [
  { icon: Settings, label: 'Configurações', href: '/dashboard/configuracoes' },
  { icon: User, label: 'Minha Conta', href: '/dashboard/conta' },
]

export function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [expandedSections, setExpandedSections] = useState<string[]>(['Geral', 'Serviços', 'Recursos'])

  const toggleSection = (title: string) => {
    setExpandedSections(prev =>
      prev.includes(title)
        ? prev.filter(t => t !== title)
        : [...prev, title]
    )
  }

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 240 }}
      className="fixed left-0 top-0 bottom-0 bg-slate-900 border-r border-slate-800 flex flex-col z-50"
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white">Orion</span>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          {collapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        {navigation.map((section) => (
          <div key={section.title} className="mb-4">
            {!collapsed && (
              <button
                onClick={() => toggleSection(section.title)}
                className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider hover:text-slate-300 transition-colors"
              >
                {section.title}
                {expandedSections.includes(section.title) ? (
                  <ChevronDown className="w-3 h-3" />
                ) : (
                  <ChevronRight className="w-3 h-3" />
                )}
              </button>
            )}

            <AnimatePresence>
              {(collapsed || expandedSections.includes(section.title)) && (
                <motion.div
                  initial={collapsed ? { opacity: 1 } : { height: 0, opacity: 0 }}
                  animate={collapsed ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
                  exit={collapsed ? { opacity: 1 } : { height: 0, opacity: 0 }}
                  className="space-y-1"
                >
                  {section.items.map((item) => {
                    const isActive = pathname === item.href
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all",
                          isActive
                            ? "bg-teal-500/10 text-teal-400 border border-teal-500/20"
                            : "text-slate-400 hover:text-white hover:bg-slate-800"
                        )}
                      >
                        <item.icon className="w-5 h-5 shrink-0" />
                        <AnimatePresence mode="wait">
                          {!collapsed && (
                            <motion.span
                              initial={{ opacity: 0, width: 0 }}
                              animate={{ opacity: 1, width: 'auto' }}
                              exit={{ opacity: 0, width: 0 }}
                              className="text-sm font-medium whitespace-nowrap"
                            >
                              {item.label}
                            </motion.span>
                          )}
                        </AnimatePresence>
                        {!collapsed && item.badge && (
                          <span className="ml-auto bg-teal-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    )
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </nav>

      {/* Bottom Navigation */}
      <div className="border-t border-slate-800 p-3 space-y-1">
        {bottomNav.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all",
                isActive
                  ? "bg-slate-800 text-white"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              )}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              <AnimatePresence mode="wait">
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="text-sm font-medium whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          )
        })}
      </div>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Zap className="w-3 h-3" />
            <span>Friendly Automation v1.0</span>
          </div>
        </div>
      )}
    </motion.aside>
  )
}
