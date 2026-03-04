'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Bell, Settings, LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { AppSidebar, MobileSidebarTrigger } from './app-sidebar'
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
import { Badge } from '@/components/ui/badge'

interface DashboardLayoutProps {
  children: ReactNode
  title?: string
  description?: string
  actions?: ReactNode
}

export function DashboardLayout({ children, title, description, actions }: DashboardLayoutProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Sidebar - Desktop */}
      <div className="hidden md:block">
        <AppSidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 md:hidden transform transition-transform duration-300',
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <AppSidebar />
      </div>

      {/* Main Content */}
      <div className="md:ml-60 transition-all duration-300">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-slate-950/95 backdrop-blur-sm border-b border-slate-800">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-slate-400"
                onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              >
                {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>

              <div className="hidden sm:block">
                {title && (
                  <div>
                    <h1 className="text-lg font-semibold text-white">{title}</h1>
                    {description && (
                      <p className="text-sm text-slate-400">{description}</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              {actions}

              <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-teal-500 rounded-full" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-teal-600 text-white text-sm">
                        U
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-slate-900 border-slate-800">
                  <DropdownMenuItem asChild>
                    <Link href="/app/conta" className="flex items-center gap-2 text-slate-300 hover:text-white">
                      <Settings className="w-4 h-4" />
                      Configurações
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-slate-800" />
                  <DropdownMenuItem asChild>
                    <Link href="/login" className="flex items-center gap-2 text-red-400 hover:text-red-300">
                      <LogOut className="w-4 h-4" />
                      Sair
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
