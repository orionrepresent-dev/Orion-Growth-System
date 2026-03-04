'use client'

import { ReactNode } from 'react'
import { Sidebar } from '@/components/layout/sidebar'

interface DashboardLayoutProps {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-950">
      <Sidebar />
      <main className="ml-[240px] min-h-screen">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  )
}
