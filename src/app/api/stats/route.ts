import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { verifyToken, getUserById } from '@/lib/auth'
import { Lead, DashboardStats } from '@/types'

const LEADS_FILE = path.join(process.cwd(), 'data', 'leads.json')

async function getLeads(): Promise<Lead[]> {
  try {
    const data = await fs.readFile(LEADS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const token = request.cookies.get('auth_token')?.value

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: 'Token inválido' },
        { status: 401 }
      )
    }

    const user = await getUserById(decoded.userId)
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Usuário não encontrado' },
        { status: 401 }
      )
    }

    // Get leads data
    const leads = await getLeads()

    // Calculate stats
    const totalLeads = leads.length
    const newLeads = leads.filter(l => l.status === 'new').length
    const contactedLeads = leads.filter(l => l.status === 'contacted').length
    const convertedLeads = leads.filter(l => l.status === 'converted' || l.status === 'qualified').length
    
    // Calculate analyses (leads of type 'analysis')
    const analysesPerformed = leads.filter(l => l.type === 'analysis').length
    
    // Calculate emails sent (approximation based on contacted leads)
    const emailsSent = contactedLeads * 2 + convertedLeads * 3

    // Calculate conversion rate
    const conversionRate = totalLeads > 0 
      ? Math.round((convertedLeads / totalLeads) * 100) 
      : 0

    // Calculate revenue
    const potentialRevenue = leads.reduce((total, lead) => {
      if (lead.quote?.maxPrice) {
        return total + lead.quote.maxPrice
      }
      return total + 997 // Default potential value
    }, 0)

    const confirmedRevenue = leads
      .filter(l => l.status === 'converted' || l.status === 'qualified')
      .reduce((total, lead) => {
        if (lead.quote?.minPrice) {
          return total + lead.quote.minPrice
        }
        return total + 997
      }, 0)

    // Sort leads by date and get recent ones
    const recentLeads = [...leads]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10)

    const stats: DashboardStats = {
      totalLeads,
      newLeads,
      contactedLeads,
      convertedLeads,
      analysesPerformed,
      emailsSent,
      conversionRate,
      revenue: {
        potential: potentialRevenue,
        confirmed: confirmedRevenue
      },
      recentLeads
    }

    return NextResponse.json({
      success: true,
      stats
    })
  } catch (error) {
    console.error('Stats error:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
