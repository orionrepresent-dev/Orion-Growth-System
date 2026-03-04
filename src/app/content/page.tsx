'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Sparkles,
  Image as ImageIcon,
  Video,
  FileText,
  Calendar,
  Users,
  Instagram,
  Facebook,
  Linkedin,
  CheckCircle2,
  Loader2,
  Plus,
  Wand2,
  Target
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface ICPProfile {
  id: string
  name: string
  businessName: string
  industry: string
  demographics: { ageRange: string; location: string; gender: string }
  psychographics: { desires: string[]; fears: string[]; values: string[]; interests: string[] }
  painPoints: Array<{ pain: string; intensity: 'low' | 'medium' | 'high'; solution: string }>
  brandVoice: { tone: string; style: string; language: string }
  visualPreferences: { colors: string[]; style: string; mood: string }
  createdAt: string
  updatedAt: string
}

interface ContentPiece {
  id: string
  type: 'image' | 'video' | 'carousel'
  platform: 'instagram' | 'facebook' | 'linkedin' | 'tiktok'
  status: 'generating' | 'completed' | 'failed'
  icpProfileId: string
  imageUrl?: string
  copy?: { headline: string; body: string; cta: string; hashtags: string[] }
  metadata: { createdAt: string; updatedAt: string; objective?: string; targetAudience?: string }
}

type Platform = 'instagram' | 'facebook' | 'linkedin' | 'tiktok'
type ContentType = 'post' | 'story' | 'reel' | 'carousel'

const platformConfig = {
  instagram: { name: 'Instagram', icon: Instagram, color: 'from-pink-500 to-rose-500' },
  facebook: { name: 'Facebook', icon: Facebook, color: 'from-blue-600 to-blue-700' },
  linkedin: { name: 'LinkedIn', icon: Linkedin, color: 'from-blue-700 to-blue-800' },
  tiktok: { name: 'TikTok', icon: Video, color: 'from-gray-900 to-gray-800' }
}

const contentTypeConfig = {
  post: { name: 'Post', desc: 'Postagem para feed', icon: ImageIcon },
  story: { name: 'Story', desc: 'Story vertical', icon: ImageIcon },
  reel: { name: 'Reel', desc: 'Vídeo curto', icon: Video },
  carousel: { name: 'Carrossel', desc: 'Múltiplos slides', icon: FileText }
}

const sampleICPProfiles: ICPProfile[] = [
  {
    id: 'icp_1',
    name: 'Empreendedor Digital',
    businessName: 'Negócios Online',
    industry: 'E-commerce',
    demographics: { ageRange: '30-45', location: 'Brasil', gender: 'Misto' },
    psychographics: {
      desires: ['Liberdade financeira', 'Escalar negócio', 'Autonomia'],
      fears: ['Perder dinheiro', 'Não ter clientes', 'Falhar'],
      values: ['Praticidade', 'Resultados', 'Transparência'],
      interests: ['Marketing', 'Vendas', 'Tecnologia']
    },
    painPoints: [
      { pain: 'Não consegue clientes orgânicos', intensity: 'high', solution: 'SEO e conteúdo' },
      { pain: 'Depende de indicações', intensity: 'high', solution: 'Marketing digital' }
    ],
    brandVoice: { tone: 'Profissional e acessível', style: 'Direto e prático', language: 'Português' },
    visualPreferences: { colors: ['#3B82F6', '#10B981', '#1E293B'], style: 'Moderno e clean', mood: 'Inspirador' },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'icp_2',
    name: 'Dono de Salão',
    businessName: 'Salão de Beleza',
    industry: 'Beleza',
    demographics: { ageRange: '25-40', location: 'São Paulo', gender: 'Feminino' },
    psychographics: {
      desires: ['Mais clientes', 'Fidelização', 'Reconhecimento'],
      fears: ['Perder clientes', 'Concorrência', 'Baixo faturamento'],
      values: ['Beleza', 'Autoestima', 'Qualidade'],
      interests: ['Beleza', 'Moda', 'Tendências']
    },
    painPoints: [
      { pain: 'Agenda vazia', intensity: 'high', solution: 'Promoções estratégicas' },
      { pain: 'Clientes não voltam', intensity: 'medium', solution: 'Programa de fidelidade' }
    ],
    brandVoice: { tone: 'Acolhedor e elegante', style: 'Delicado e sofisticado', language: 'Português' },
    visualPreferences: { colors: ['#EC4899', '#F472B6', '#FDF2F8'], style: 'Feminino e elegante', mood: 'Romântico' },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

export default function ContentPage() {
  const [selectedICP, setSelectedICP] = useState<ICPProfile | null>(null)
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('instagram')
  const [selectedContentType, setSelectedContentType] = useState<ContentType>('post')
  const [objective, setObjective] = useState('engagement')
  const [additionalContext, setAdditionalContext] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<ContentPiece | null>(null)
  const [contentHistory, setContentHistory] = useState<ContentPiece[]>([])
  const [activeTab, setActiveTab] = useState('create')

  useEffect(() => {
    const saved = sessionStorage.getItem('generatedContent')
    if (saved) {
      try { setContentHistory(JSON.parse(saved)) } catch { /* ignore */ }
    }
  }, [])

  const handleGenerate = async () => {
    if (!selectedICP) { alert('Selecione um ICP'); return }
    
    setIsGenerating(true)
    setGeneratedContent(null)

    try {
      const response = await fetch('/api/content/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          icpProfileId: selectedICP.id,
          icpProfile: selectedICP,
          platform: selectedPlatform,
          contentType: selectedContentType,
          objective,
          additionalContext
        })
      })

      const data = await response.json()
      const newContent: ContentPiece = {
        id: `content_${Date.now()}`,
        type: selectedContentType === 'reel' ? 'video' : 'image',
        platform: selectedPlatform,
        status: 'completed',
        icpProfileId: selectedICP.id,
        imageUrl: data.imageUrl,
        copy: data.copy,
        metadata: { createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), objective }
      }
      setGeneratedContent(newContent)
      const updated = [newContent, ...contentHistory].slice(0, 20)
      setContentHistory(updated)
      sessionStorage.setItem('generatedContent', JSON.stringify(updated))
    } catch {
      // Mock content
      const mock: ContentPiece = {
        id: `content_${Date.now()}`,
        type: selectedContentType === 'reel' ? 'video' : 'image',
        platform: selectedPlatform,
        status: 'completed',
        icpProfileId: selectedICP.id,
        copy: {
          headline: `Transforme seu ${selectedICP.industry}`,
          body: `${selectedICP.businessName}: ${selectedICP.psychographics.desires[0]}`,
          cta: 'Saiba mais',
          hashtags: ['#marketing', '#negocios']
        },
        metadata: { createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), objective }
      }
      setGeneratedContent(mock)
      const updated = [mock, ...contentHistory].slice(0, 20)
      setContentHistory(updated)
      sessionStorage.setItem('generatedContent', JSON.stringify(updated))
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-3">
                <Image src="/logo.png" alt="Orion" width={120} height={32} className="h-8 w-auto" priority />
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/calendar"><Button variant="outline" size="sm"><Calendar className="w-4 h-4 mr-2" />Calendário</Button></Link>
              <Link href="/ads"><Button variant="outline" size="sm"><Target className="w-4 h-4 mr-2" />Meta Ads</Button></Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Content Studio</h1>
          <p className="text-slate-600">Crie conteúdo personalizado baseado no seu ICP</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="create">Criar</TabsTrigger>
            <TabsTrigger value="history">Histórico</TabsTrigger>
            <TabsTrigger value="icp">ICPs</TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Users className="w-5 h-5 text-teal-600" />Selecione o ICP</CardTitle>
                    <CardDescription>O ICP define tom e estilo do conteúdo</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      {sampleICPProfiles.map((p) => (
                        <motion.button key={p.id} onClick={() => setSelectedICP(p)}
                          className={`p-4 rounded-xl border-2 text-left transition-all ${selectedICP?.id === p.id ? 'border-teal-500 bg-teal-50' : 'border-slate-200 hover:border-slate-300'}`}>
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center text-white font-semibold">{p.name[0]}</div>
                            <div><h3 className="font-semibold">{p.name}</h3><p className="text-sm text-slate-500">{p.industry}</p></div>
                          </div>
                          <div className="flex flex-wrap gap-1">{p.painPoints.slice(0,2).map((pt, i) => <Badge key={i} variant="outline" className="text-xs">{pt.pain}</Badge>)}</div>
                        </motion.button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader><CardTitle className="flex items-center gap-2"><Wand2 className="w-5 h-5 text-purple-600" />Configuração</CardTitle></CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label className="mb-3 block">Plataforma</Label>
                      <div className="grid grid-cols-4 gap-3">
                        {(Object.keys(platformConfig) as Platform[]).map((plat) => {
                          const c = platformConfig[plat]
                          const Icon = c.icon
                          return <button key={plat} onClick={() => setSelectedPlatform(plat)}
                            className={`p-3 rounded-lg border-2 flex flex-col items-center gap-2 transition-all ${selectedPlatform === plat ? 'border-teal-500 bg-teal-50' : 'border-slate-200'}`}>
                            <Icon className={`w-5 h-5 ${selectedPlatform === plat ? 'text-teal-600' : 'text-slate-400'}`} />
                            <span className="text-xs">{c.name}</span>
                          </button>
                        })}
                      </div>
                    </div>
                    <div>
                      <Label className="mb-3 block">Tipo</Label>
                      <div className="grid grid-cols-4 gap-3">
                        {(Object.keys(contentTypeConfig) as ContentType[]).map((t) => {
                          const c = contentTypeConfig[t]
                          const Icon = c.icon
                          return <button key={t} onClick={() => setSelectedContentType(t)}
                            className={`p-3 rounded-lg border-2 flex flex-col items-center gap-2 transition-all ${selectedContentType === t ? 'border-purple-500 bg-purple-50' : 'border-slate-200'}`}>
                            <Icon className={`w-5 h-5 ${selectedContentType === t ? 'text-purple-600' : 'text-slate-400'}`} />
                            <span className="text-xs">{c.name}</span>
                          </button>
                        })}
                      </div>
                    </div>
                    <div>
                      <Label className="mb-2 block">Objetivo</Label>
                      <Select value={objective} onValueChange={setObjective}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="engagement">Engajamento</SelectItem>
                          <SelectItem value="awareness">Awareness</SelectItem>
                          <SelectItem value="traffic">Tráfego</SelectItem>
                          <SelectItem value="sales">Vendas</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="mb-2 block">Contexto adicional</Label>
                      <Textarea placeholder="Ex: Promover lançamento..." value={additionalContext} onChange={(e) => setAdditionalContext(e.target.value)} rows={2} />
                    </div>
                    <Button onClick={handleGenerate} disabled={isGenerating || !selectedICP}
                      className="w-full bg-gradient-to-r from-teal-500 to-emerald-600 py-6 text-lg font-semibold">
                      {isGenerating ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Gerando...</> : <><Sparkles className="w-5 h-5 mr-2" />Gerar com IA</>}
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                {selectedICP && (
                  <Card className="bg-slate-900 text-white">
                    <CardHeader><CardTitle className="text-lg">ICP Selecionado</CardTitle></CardHeader>
                    <CardContent>
                      <h3 className="font-semibold text-teal-400">{selectedICP.businessName}</h3>
                      <p className="text-sm text-slate-400">{selectedICP.industry}</p>
                      <div className="mt-4 space-y-2">
                        <p className="text-xs text-slate-500 uppercase">Público</p>
                        <p className="text-sm">{selectedICP.demographics.ageRange}, {selectedICP.demographics.location}</p>
                        <p className="text-xs text-slate-500 uppercase mt-2">Tom</p>
                        <p className="text-sm">{selectedICP.brandVoice.tone}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
                {generatedContent && (
                  <Card className="border-2 border-teal-200 bg-teal-50">
                    <CardHeader><CardTitle className="text-teal-800"><CheckCircle2 className="w-5 h-5 inline mr-2" />Gerado</CardTitle></CardHeader>
                    <CardContent>
                      {generatedContent.copy && (
                        <div className="space-y-3">
                          <div><p className="text-xs text-slate-500 uppercase mb-1">Headline</p><p className="font-semibold">{generatedContent.copy.headline}</p></div>
                          <div><p className="text-xs text-slate-500 uppercase mb-1">Body</p><p className="text-sm">{generatedContent.copy.body}</p></div>
                          <div><p className="text-xs text-slate-500 uppercase mb-1">CTA</p><Badge className="bg-teal-600">{generatedContent.copy.cta}</Badge></div>
                          <div className="flex flex-wrap gap-1">{generatedContent.copy.hashtags.map((t, i) => <Badge key={i} variant="outline" className="text-xs">{t}</Badge>)}</div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader><CardTitle>Histórico</CardTitle></CardHeader>
              <CardContent>
                {contentHistory.length > 0 ? (
                  <div className="grid md:grid-cols-3 gap-4">
                    {contentHistory.map((p) => (
                      <Card key={p.id} className="border-slate-200">
                        <CardContent className="pt-4">
                          <div className="flex gap-2 mb-2">
                            <Badge>{platformConfig[p.platform].name}</Badge>
                          </div>
                          {p.copy && <><p className="font-medium">{p.copy.headline}</p><p className="text-sm text-slate-600">{p.copy.body}</p></>}
                          <p className="text-xs text-slate-400 mt-2">{new Date(p.metadata.createdAt).toLocaleDateString('pt-BR')}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : <div className="text-center py-12"><FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" /><p className="text-slate-500">Nenhum conteúdo</p></div>}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="icp">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div><CardTitle>ICP Profiles</CardTitle><CardDescription>Perfis de Cliente Ideal</CardDescription></div>
                  <Button><Plus className="w-4 h-4 mr-2" />Novo ICP</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {sampleICPProfiles.map((p) => (
                    <Card key={p.id} className="border-slate-200">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center text-white font-bold text-lg">{p.name[0]}</div>
                          <div><CardTitle className="text-lg">{p.name}</CardTitle><p className="text-sm text-slate-500">{p.businessName}</p></div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div><p className="text-xs text-slate-500 uppercase">Público</p><p className="text-sm">{p.demographics.ageRange} • {p.demographics.location}</p></div>
                        <div><p className="text-xs text-slate-500 uppercase mb-1">Dores</p><div className="flex flex-wrap gap-1">{p.painPoints.map((pt, i) => <Badge key={i} variant="outline" className="text-xs">{pt.pain}</Badge>)}</div></div>
                        <div><p className="text-xs text-slate-500 uppercase mb-1">Desejos</p><div className="flex flex-wrap gap-1">{p.psychographics.desires.map((d, i) => <Badge key={i} variant="secondary" className="text-xs">{d}</Badge>)}</div></div>
                        <div><p className="text-xs text-slate-500 uppercase">Tom</p><p className="text-sm">{p.brandVoice.tone}</p></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
