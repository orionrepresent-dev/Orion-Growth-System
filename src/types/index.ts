// User types
export type Plan = 'presenca' | 'autoridade' | 'dominacao'

export interface User {
  id: string
  email: string
  password: string
  name: string
  company?: string
  plan?: Plan
  createdAt: string
}

export interface SafeUser {
  id: string
  email: string
  name: string
  company?: string
  plan?: Plan
  createdAt: string
}

// Lead types
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'converted' | 'lost'
export type LeadType = 'analysis' | 'contact' | 'newsletter'

export interface LeadQuote {
  minPrice?: number
  maxPrice?: number
  services?: string[]
}

export interface Lead {
  id: string
  createdAt: string
  type: LeadType
  status: LeadStatus
  data: {
    name: string
    email: string
    phone?: string
    company?: string
    url?: string
    goals?: string
  }
  quote?: LeadQuote
  notes?: string
}

// Stats types
export interface DashboardStats {
  totalLeads: number
  newLeads: number
  contactedLeads: number
  convertedLeads: number
  analysesPerformed: number
  emailsSent: number
  conversionRate: number
  revenue: {
    potential: number
    confirmed: number
  }
  recentLeads: Lead[]
}

// Auth types
export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  name: string
  company?: string
}

export interface AuthResponse {
  success: boolean
  user?: SafeUser
  error?: string
}
