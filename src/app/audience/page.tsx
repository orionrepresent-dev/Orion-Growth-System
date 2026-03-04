'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles,
  FileText,
  Newspaper,
  BookOpen,
  BarChart3,
  Brain,
  Users,
  Target,
  TrendingUp,
  Loader2,
  CheckCircle2,
  Zap
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'

// Types
type ServiceType = 'market-analysis' | 'blog' | 'news' | 'ebook'

interface GeneratedContent {
  type: ServiceType
  data: Record<string, unknown>
}

// ICP Profiles Sample
const sampleICPProfiles = [
  { id: 'icp_1', name: 'Empreendedor Digital', businessName: 'Negócios Online', industry: 'E-commerce' },
  { id: 'icp_2', name: 'Dono de Salão', businessName: 'Salão de Beleza', industry: 'Beleza' }
]

export default function AudiencePage() {
  const [selectedICP, setSelectedICP] = useState(sampleICPProfiles[0])
  const [activeService, setActiveService] = useState<ServiceType>('market-analysis')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null)
  const [blogTopic, setBlogTopic] = useState('')
  const [newsSubject, setNewsSubject] = useState('')
  const [ebookTopic, setEbookTopic] = useState('')
  const [marketIndustry, setMarketIndustry] = useState('')

  const services = [
    { id: 'market-analysis' as ServiceType, name: 'Análise de Mercado', description: 'TAM/SAM/SOM', icon: BarChart3, color: 'from-blue-500 to-cyan-500' },
    { id: 'blog' as ServiceType, name: 'Artigo de Blog', description: 'Posts SEO', icon: FileText, color: 'from-emerald-500 to-teal-500' },
    { id: 'news' as ServiceType, name: 'Press Release', description: 'Comunicados', icon: Newspaper, color: 'from-purple-500 to-violet-500' },
    { id: 'ebook' as ServiceType, name: 'Ebook', description: 'Lead magnets', icon: BookOpen, color: 'from-orange-500 to-amber-500' }
  ]

  const handleGenerate = async () => {
    setIsGenerating(true)
    setGeneratedContent(null)

    try {
      let endpoint = ''
      let body: Record<string, unknown> = { icpProfile: selectedICP }

      switch (activeService) {
        case 'market-analysis':
          endpoint = '/api/market-analysis'
          body = { ...body, industry: marketIndustry || selectedICP.industry }
          break
        case 'blog':
          endpoint = '/api/content/blog'
          body = { ...body, topic: blogTopic }
          break
        case 'news':
          endpoint = '/api/content/news'
          body = { ...body, subject: newsSubject }
          break
        case 'ebook':
          endpoint = '/api/content/ebook'
          body = { ...body, topic: ebookTopic }
          break
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      const data = await response.json()
      setGeneratedContent({ type: activeService, data: data.analysis || data.article || data })

    } catch {
      setGeneratedContent({ type: activeService, data: generateMockContent(activeService) })
    } finally {
      setIsGenerating(false)
    }
  }

  const generateMockContent = (type: ServiceType): Record<string, unknown> => {
    switch (type) {
      case 'market-analysis':
        return {
          industryOverview: { name: selectedICP.industry, size: { brazil: 'R$ 10-20 bi', growth: '12% a.a.' }, stage: 'growth' },
          marketSizing: { tam: { value: 'R$ 50 bi' }, sam: { value: 'R$ 15 bi' }, som: { value: 'R$ 500 mi' } },
          opportunities: [{ title: 'Mercado de PMEs', marketSize: 'R$ 5 bi' }]
        }
      case 'blog':
        return {
          seo: { title: `Guia: ${blogTopic || 'Tópico'} para ${selectedICP.industry}` },
          content: { headline: `${blogTopic || 'Tópico'}: Guia Completo`, introduction: 'Introdução...' },
          meta: { wordCount: 1500, readingTime: '8 min' }
        }
      case 'news':
        return {
          headline: { main: `${selectedICP.businessName} anuncia ${newsSubject || 'novidade'}` },
          lead: 'Lead do press release...',
          body: { paragraphs: ['Parágrafo 1'] }
        }
      case 'ebook':
        return {
          title: { main: `Ebook: ${ebookTopic || 'Tópico'}` },
          chapters: [{ number: 1, title: 'Introdução' }],
          meta: { estimatedPages: 15 }
        }
      default:
        return {}
    }
  }

  const getNestedValue = (obj: Record<string, unknown>, path: string): unknown => {
    return path.split('.').reduce((acc: unknown, key: string) => {
      if (acc && typeof acc === 'object') {
        return (acc as Record<string, unknown>)[key]
      }
      return undefined
    }, obj)
  }

  const renderMarketAnalysis = (data: Record<string, unknown>) => (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Target className="w-5 h-5 text-blue-500" />Market Sizing</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <p className="text-2xl font-bold text-blue-600">{String(getNestedValue(data, 'marketSizing.tam.value') || 'N/A')}</p>
              <p className="text-sm text-gray-500">TAM</p>
            </div>
            <div className="text-center p-4 bg-violet-50 rounded-xl">
              <p className="text-2xl font-bold text-violet-600">{String(getNestedValue(data, 'marketSizing.sam.value') || 'N/A')}</p>
              <p className="text-sm text-gray-500">SAM</p>
            </div>
            <div className="text-center p-4 bg-emerald-50 rounded-xl">
              <p className="text-2xl font-bold text-emerald-600">{String(getNestedValue(data, 'marketSizing.som.value') || 'N/A')}</p>
              <p className="text-sm text-gray-500">SOM</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="w-5 h-5 text-emerald-500" />Oportunidades</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.isArray(data.opportunities) && data.opportunities.map((opp: unknown, i: number) => {
              const o = opp as Record<string, unknown>
              return (
                <div key={i} className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="flex justify-between">
                    <h4 className="font-semibold">{String(o.title)}</h4>
                    <Badge>{String(o.marketSize)}</Badge>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderBlogArticle = (data: Record<string, unknown>) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5 text-emerald-500" />Artigo Gerado</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="text-sm text-gray-500">Título SEO</Label>
          <p className="font-semibold text-lg">{String(getNestedValue(data, 'seo.title') || '')}</p>
        </div>
        <div>
          <h2 className="text-xl font-bold mb-2">{String(getNestedValue(data, 'content.headline') || '')}</h2>
          <p className="text-gray-600">{String(getNestedValue(data, 'content.introduction') || '')}</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary">{String(getNestedValue(data, 'meta.wordCount') || 0)} palavras</Badge>
          <Badge variant="secondary">{String(getNestedValue(data, 'meta.readingTime') || '')}</Badge>
        </div>
      </CardContent>
    </Card>
  )

  const renderNewsArticle = (data: Record<string, unknown>) => (
    <Card className="border-purple-200">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-violet-50">
        <CardTitle className="text-xl">{String(getNestedValue(data, 'headline.main') || '')}</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-4">
          <p className="font-medium">{String(data.lead || '')}</p>
        </div>
      </CardContent>
    </Card>
  )

  const renderEbook = (data: Record<string, unknown>) => (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-slate-800 to-slate-900 text-white">
        <CardContent className="pt-8 pb-8 text-center">
          <h2 className="text-2xl font-bold">{String(getNestedValue(data, 'title.main') || '')}</h2>
          <Badge variant="secondary" className="mt-4">{String(getNestedValue(data, 'meta.estimatedPages') || 0)} páginas</Badge>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Sumário</CardTitle></CardHeader>
        <CardContent>
          {Array.isArray(data.chapters) && data.chapters.map((ch: unknown, i: number) => {
            const chapter = ch as Record<string, unknown>
            return (
              <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mb-2">
                <span className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-sm font-medium">{String(chapter.number || i + 1)}</span>
                <span className="font-medium">{String(chapter.title)}</span>
              </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )

  const renderContent = () => {
    if (!generatedContent) return null
    switch (generatedContent.type) {
      case 'market-analysis': return renderMarketAnalysis(generatedContent.data)
      case 'blog': return renderBlogArticle(generatedContent.data)
      case 'news': return renderNewsArticle(generatedContent.data)
      case 'ebook': return renderEbook(generatedContent.data)
      default: return null
    }
  }

  const canGenerate = () => {
    switch (activeService) {
      case 'blog': return !!blogTopic
      case 'news': return !!newsSubject
      case 'ebook': return !!ebookTopic
      default: return true
    }
  }

  const activeServiceData = services.find(s => s.id === activeService)!
  const ServiceIcon = activeServiceData.icon

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/"><Image src="/logo.png" alt="Orion" width={120} height={32} className="h-8 w-auto" priority /></Link>
              <Badge className="bg-gradient-to-r from-blue-500 to-violet-500 text-white">Business Audience</Badge>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/icp"><Button variant="outline" size="sm"><Brain className="w-4 h-4 mr-2" />ICP</Button></Link>
              <Link href="/content"><Button variant="outline" size="sm"><Sparkles className="w-4 h-4 mr-2" />Content</Button></Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Business Audience Copilot</h1>
          <p className="text-slate-600">Análise de mercado, blog, notícias e ebooks integrados com ICP</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Users className="w-4 h-4 text-teal-500" />ICP</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {sampleICPProfiles.map((icp) => (
                  <button key={icp.id} onClick={() => setSelectedICP(icp)}
                    className={`w-full p-3 rounded-lg border-2 text-left transition-all ${selectedICP.id === icp.id ? 'border-teal-500 bg-teal-50' : 'border-slate-200'}`}>
                    <div className="font-medium">{icp.name}</div>
                    <div className="text-xs text-slate-500">{icp.industry}</div>
                  </button>
                ))}
                <Link href="/icp" className="block"><Button variant="outline" className="w-full" size="sm">Criar ICP</Button></Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-base">Serviços</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {services.map((service) => (
                  <button key={service.id} onClick={() => { setActiveService(service.id); setGeneratedContent(null) }}
                    className={`w-full p-3 rounded-lg border-2 text-left transition-all ${activeService === service.id ? 'border-teal-500 bg-teal-50' : 'border-slate-200'}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${service.color} flex items-center justify-center`}>
                        <service.icon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-sm">{service.name}</div>
                        <div className="text-xs text-slate-500">{service.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main */}
          <div className="lg:col-span-3 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${activeServiceData.color} flex items-center justify-center`}>
                    <ServiceIcon className="w-4 h-4 text-white" />
                  </div>
                  {activeServiceData.name}
                </CardTitle>
                <CardDescription>Configure os parâmetros</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {activeService === 'market-analysis' && (
                  <div>
                    <Label>Indústria/Segmento</Label>
                    <Input placeholder={selectedICP.industry} value={marketIndustry} onChange={(e) => setMarketIndustry(e.target.value)} />
                  </div>
                )}
                {activeService === 'blog' && (
                  <div>
                    <Label>Tópico do Artigo *</Label>
                    <Input placeholder="Ex: Como aumentar vendas" value={blogTopic} onChange={(e) => setBlogTopic(e.target.value)} />
                  </div>
                )}
                {activeService === 'news' && (
                  <div>
                    <Label>Assunto da Notícia *</Label>
                    <Input placeholder="Ex: Lançamento de produto" value={newsSubject} onChange={(e) => setNewsSubject(e.target.value)} />
                  </div>
                )}
                {activeService === 'ebook' && (
                  <div>
                    <Label>Tópico do Ebook *</Label>
                    <Input placeholder="Ex: Guia de marketing" value={ebookTopic} onChange={(e) => setEbookTopic(e.target.value)} />
                  </div>
                )}
                <Button onClick={handleGenerate} disabled={isGenerating || !canGenerate()} className="w-full bg-gradient-to-r from-teal-500 to-emerald-600 py-6 text-lg font-semibold">
                  {isGenerating ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Gerando...</> : <><Sparkles className="w-5 h-5 mr-2" />Gerar com IA</>}
                </Button>
              </CardContent>
            </Card>

            <AnimatePresence mode="wait">
              {generatedContent && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                  {renderContent()}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  )
}
