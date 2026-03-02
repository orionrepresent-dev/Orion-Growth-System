import { NextRequest, NextResponse } from 'next/server'
import { writeFile, readFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

// Lead data structure
interface Lead {
  id: string
  createdAt: string
  type: 'analysis' | 'briefing' | 'contact'
  status: 'new' | 'contacted' | 'converted' | 'lost'
  data: {
    name: string
    email: string
    phone?: string
    company?: string
    url?: string
    goals?: string
    competitors?: string
    budget?: string
    timeline?: string
    analysisResult?: Record<string, unknown>
  }
  quote?: {
    minPrice: number
    maxPrice: number
    services: string[]
  }
  notes?: string
}

const LEADS_DIR = path.join(process.cwd(), 'data')
const LEADS_FILE = path.join(LEADS_DIR, 'leads.json')

// Generate unique ID
function generateId(): string {
  return `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Ensure data directory exists
async function ensureDataDir() {
  if (!existsSync(LEADS_DIR)) {
    await mkdir(LEADS_DIR, { recursive: true })
  }
}

// Read existing leads
async function readLeads(): Promise<Lead[]> {
  try {
    await ensureDataDir()
    if (!existsSync(LEADS_FILE)) {
      return []
    }
    const content = await readFile(LEADS_FILE, 'utf-8')
    return JSON.parse(content)
  } catch {
    return []
  }
}

// Save leads
async function saveLeads(leads: Lead[]): Promise<void> {
  await ensureDataDir()
  await writeFile(LEADS_FILE, JSON.stringify(leads, null, 2))
}

// POST - Create new lead
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, data, quote } = body

    // Validate required fields
    if (!data?.name || !data?.email) {
      return NextResponse.json(
        { error: 'Nome e email são obrigatórios' },
        { status: 400 }
      )
    }

    // Create lead
    const lead: Lead = {
      id: generateId(),
      createdAt: new Date().toISOString(),
      type: type || 'contact',
      status: 'new',
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        company: data.company,
        url: data.url,
        goals: data.goals,
        competitors: data.competitors,
        budget: data.budget,
        timeline: data.timeline,
        analysisResult: data.analysisResult
      },
      quote: quote
    }

    // Save lead
    const leads = await readLeads()
    leads.unshift(lead) // Add to beginning
    await saveLeads(leads)

    // Log notification (in production, send email via Resend)
    console.log('📧 NOVO LEAD CAPTURADO:')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(`👤 Nome: ${lead.data.name}`)
    console.log(`📧 Email: ${lead.data.email}`)
    console.log(`📱 Telefone: ${lead.data.phone || 'Não informado'}`)
    console.log(`🏢 Empresa: ${lead.data.company || 'Não informado'}`)
    console.log(`🌐 Site: ${lead.data.url || 'Não informado'}`)
    console.log(`💰 Orçamento: R$ ${quote?.minPrice || 0} - R$ ${quote?.maxPrice || 0}`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(`📁 Lead ID: ${lead.id}`)

    return NextResponse.json({
      success: true,
      leadId: lead.id,
      message: 'Lead salvo com sucesso!'
    })
  } catch (error) {
    console.error('Error saving lead:', error)
    return NextResponse.json(
      { error: 'Erro ao salvar lead' },
      { status: 500 }
    )
  }
}

// GET - List leads
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const type = searchParams.get('type')
    const limit = parseInt(searchParams.get('limit') || '50')

    let leads = await readLeads()

    // Filter by status
    if (status) {
      leads = leads.filter(l => l.status === status)
    }

    // Filter by type
    if (type) {
      leads = leads.filter(l => l.type === type)
    }

    // Limit results
    leads = leads.slice(0, limit)

    return NextResponse.json({
      total: leads.length,
      leads
    })
  } catch (error) {
    console.error('Error reading leads:', error)
    return NextResponse.json(
      { error: 'Erro ao ler leads' },
      { status: 500 }
    )
  }
}

// PUT - Update lead status
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, status, notes } = body

    if (!id) {
      return NextResponse.json(
        { error: 'ID do lead é obrigatório' },
        { status: 400 }
      )
    }

    const leads = await readLeads()
    const leadIndex = leads.findIndex(l => l.id === id)

    if (leadIndex === -1) {
      return NextResponse.json(
        { error: 'Lead não encontrado' },
        { status: 404 }
      )
    }

    if (status) leads[leadIndex].status = status
    if (notes) leads[leadIndex].notes = notes

    await saveLeads(leads)

    return NextResponse.json({
      success: true,
      lead: leads[leadIndex]
    })
  } catch (error) {
    console.error('Error updating lead:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar lead' },
      { status: 500 }
    )
  }
}
