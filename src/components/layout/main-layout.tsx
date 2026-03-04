'use client'

import { ReactNode } from 'react'
import { Sidebar } from './sidebar'
import { cn } from '@/lib/utils'

interface MainLayoutProps {
  children: ReactNode
  className?: string
  hideSidebar?: boolean
}

export function MainLayout({ children, className, hideSidebar = false }: MainLayoutProps) {
  return (
    <div className={cn('min-h-screen bg-slate-50', className)}>
      {!hideSidebar && <Sidebar />}
      <main
        className={cn(
          'transition-all duration-300',
          hideSidebar ? 'ml-0' : 'ml-16'
        )}
      >
        {children}
      </main>
    </div>
  )
}
