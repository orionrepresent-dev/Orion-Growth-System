'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  ArrowLeft,
  ArrowRight,
  Globe,
  Users,
  Target,
  ShoppingBag,
  Palette,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Rocket,
  Building2,
  Briefcase,
  Heart,
  Zap
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'

const steps = [
  { id: 1, title: 'Negócio', icon: Building2 },
  { id: 2, title: 'Público', icon: Users },
  { id: 3, title: 'Produtos', icon: ShoppingBag },
  { id: 4, title: 'Concorrência', icon: Target },
  { id: 5, title: 'Design', icon: Palette },
]

const designPreferences = [
  { id: 'modern', label: 'Moderno e Minimalista', description: 'Linhas limpas, espaços em branco' },
  { id: 'corporate', label: 'Corporativo', description: 'Profissional e confiável' },
  { id: 'creative', label: 'Criativo e ousado', description: 'Cores vibrantes, formas únicas' },
  { id: 'luxury', label: 'Luxuoso', description: 'Elegante e sofisticado' },
  { id: 'friendly', label: 'Amigável e Acolhedor', description: 'Caloroso e acessível' },
  { id: 'tech', label: 'Tecnológico', description: 'Futurista e inovador' },
]

const colorPalettes = [
  { id: 'emerald', name: 'Esmeralda', colors: ['#10b981', '#14b8a6', '#0d9488'] },
  { id: 'blue', name: 'Azul Oceano', colors: ['#3b82f6', '#2563eb', '#1d4ed8'] },
  { id: 'purple', name: 'Roxo Místico', colors: ['#8b5cf6', '#7c3aed', '#6d28d9'] },
  { id: 'orange', name: 'Laranja Vibrante', colors: ['#f97316', '#ea580c', '#c2410c'] },
  { id: 'rose', name: 'Rosa Elegante', colors: ['#f43f5e', '#e11d48', '#be123c'] },
  { id: 'slate', name: 'Cinza Profissional', colors: ['#475569', '#334155', '#1e293b'] },
]

const industries = [
  'Tecnologia',
  'E-commerce',
  'Saúde e Bem-estar',
  'Educação',
  'Finanças',
  'Imobiliário',
  'Marketing e Publicidade',
  'Alimentação',
  'Moda',
  'Serviços Profissionais',
  'Outro'
]

export default function BuilderPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    businessName: '',
    industry: '',
    description: '',
    website: '',
    icp: '',
    targetAudience: '',
    painPoints: '',
    mainProducts: '',
    uniqueValue: '',
    competitors: '',
    keywords: '',
    designStyle: '',
    colorPalette: '',
    referenceSites: '',
    additionalNotes: '',
    budget: '',
    timeline: '',
    name: '',
    email: '',
    phone: '',
    agreeToContact: false
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }))
  }

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        return !!(formData.businessName && formData.industry && formData.description)
      case 2:
        return !!(formData.icp && formData.targetAudience)
      case 3:
        return !!(formData.mainProducts && formData.uniqueValue)
      case 4:
        return !!(formData.competitors && formData.keywords)
      case 5:
        return !!(formData.designStyle && formData.colorPalette && formData.name && formData.email && formData.agreeToContact)
      default:
        return true
    }
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 5))
    }
  }

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handleSubmit = async () => {
    if (!validateStep(5)) return

    setLoading(true)
    try {
      // Save lead to database
      const leadResponse = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'briefing',
          data: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            company: formData.businessName,
            url: formData.website,
            goals: formData.description,
            competitors: formData.competitors,
            budget: formData.budget,
            timeline: formData.timeline,
            industry: formData.industry,
            icp: formData.icp,
            targetAudience: formData.targetAudience,
            painPoints: formData.painPoints,
            mainProducts: formData.mainProducts,
            uniqueValue: formData.uniqueValue,
            keywords: formData.keywords,
            designStyle: formData.designStyle,
            colorPalette: formData.colorPalette,
            referenceSites: formData.referenceSites
          },
          quote: {
            minPrice: 1997,
            maxPrice: 4997,
            services: ['Análise completa SEO/AEO/GEO', 'Business Audience', 'Gestão de Redes Sociais', 'Dashboard de ROI']
          }
        })
      })

      if (leadResponse.ok) {
        // Send notification email
        await fetch('/api/email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: formData.email,
            subject: 'Briefing Recebido - Growth Business Copilot',
            leadData: {
              name: formData.name,
              email: formData.email,
              phone: formData.phone,
              company: formData.businessName,
              url: formData.website,
              budget: formData.budget,
              timeline: formData.timeline
            }
          })
        })
      }

      setLoading(false)
      setSubmitted(true)
    } catch (error) {
      console.error('Error submitting briefing:', error)
      setLoading(false)
      setSubmitted(true) // Still show success to user
    }
  }

  const progress = (currentStep / 5) * 100

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950/20 dark:via-teal-950/20 dark:to-cyan-950/20 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg w-full"
        >
          <Card className="text-center overflow-hidden">
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
                className="w-20 h-20 mx-auto bg-white rounded-full flex items-center justify-center"
              >
                <CheckCircle2 className="w-10 h-10 text-emerald-500" />
              </motion.div>
            </div>
            <CardContent className="pt-8 pb-8">
              <h2 className="text-2xl font-bold mb-4">Briefing Enviado!</h2>
              <p className="text-muted-foreground mb-6">
                Recebemos todas as informações do seu projeto. Nossa equipe vai analisar e 
                entrar em contato em até 24 horas úteis com uma proposta personalizada.
              </p>
              <div className="bg-muted/50 rounded-lg p-4 mb-6 text-left">
                <h3 className="font-semibold mb-2">Próximos passos:</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    Análise do briefing pela nossa equipe
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    Pesquisa de concorrentes e mercado
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    Contato com proposta detalhada
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    Kickoff do projeto
                  </li>
                </ul>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/" className="flex-1">
                  <Button variant="outline" className="w-full">
                    Voltar ao Início
                  </Button>
                </Link>
                <Link href="/analyze" className="flex-1">
                  <Button className="w-full bg-gradient-to-r from-emerald-500 to-teal-500">
                    Fazer Análise SEO
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950/20 dark:via-teal-950/20 dark:to-cyan-950/20">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <Image 
                src="/logo.png" 
                alt="Orion Growth Studio" 
                width={140} 
                height={32}
                className="h-8 w-auto"
              />
            </Link>
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-2">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                    currentStep >= step.id
                      ? 'bg-gradient-to-br from-emerald-500 to-teal-500 border-emerald-500 text-white'
                      : 'border-muted-foreground/30 text-muted-foreground'
                  }`}
                >
                  {currentStep > step.id ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </div>
                <span className={`ml-2 text-sm hidden sm:block ${
                  currentStep >= step.id ? 'text-foreground font-medium' : 'text-muted-foreground'
                }`}>
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div className={`hidden sm:block w-12 lg:w-24 h-0.5 mx-2 ${
                    currentStep > step.id ? 'bg-emerald-500' : 'bg-muted-foreground/30'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <Progress value={progress} className="h-2" />
        </motion.div>

        {/* Form Cards */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {currentStep === 1 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle>Sobre seu Negócio</CardTitle>
                      <CardDescription>Conte-nos sobre sua empresa</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="businessName">Nome da Empresa *</Label>
                      <Input
                        id="businessName"
                        name="businessName"
                        placeholder="Sua Empresa Ltda"
                        value={formData.businessName}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="industry">Segmento *</Label>
                      <Select onValueChange={(value) => handleSelectChange('industry', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                        <SelectContent>
                          {industries.map((industry) => (
                            <SelectItem key={industry} value={industry.toLowerCase()}>
                              {industry}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Descrição do Negócio *</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Descreva o que sua empresa faz, seus principais produtos/serviços e o que te diferencia..."
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Site Atual (se houver)</Label>
                    <Input
                      id="website"
                      name="website"
                      type="url"
                      placeholder="https://seusite.com.br"
                      value={formData.website}
                      onChange={handleInputChange}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {currentStep === 2 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle>Público-Alvo</CardTitle>
                      <CardDescription>Quem é seu cliente ideal?</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="icp">ICP (Ideal Customer Profile) *</Label>
                    <Textarea
                      id="icp"
                      name="icp"
                      placeholder="Ex: Empresários de pequenas e médias empresas (5-50 funcionários) do setor de tecnologia, com faturamento de R$ 500k-5M anuais, que buscam escalar suas operações..."
                      value={formData.icp}
                      onChange={handleInputChange}
                      rows={3}
                    />
                    <p className="text-xs text-muted-foreground">
                      Descreva o perfil demográfico, comportamental e psicográfico do seu cliente ideal.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="targetAudience">Público-Alvo Geral *</Label>
                    <Textarea
                      id="targetAudience"
                      name="targetAudience"
                      placeholder="Ex: Homens e mulheres, 25-45 anos, com ensino superior completo, que trabalham com gestão de empresas..."
                      value={formData.targetAudience}
                      onChange={handleInputChange}
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="painPoints">Dores e Necessidades</Label>
                    <Textarea
                      id="painPoints"
                      name="painPoints"
                      placeholder="Quais são os principais problemas que seu público enfrenta? O que os mantém acordados à noite?"
                      value={formData.painPoints}
                      onChange={handleInputChange}
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {currentStep === 3 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <ShoppingBag className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle>Produtos e Serviços</CardTitle>
                      <CardDescription>O que você oferece?</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="mainProducts">Principais Produtos/Serviços *</Label>
                    <Textarea
                      id="mainProducts"
                      name="mainProducts"
                      placeholder="Liste seus 3-5 principais produtos ou serviços e seus preços aproximados..."
                      value={formData.mainProducts}
                      onChange={handleInputChange}
                      rows={4}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="uniqueValue">Proposta de Valor Única *</Label>
                    <Textarea
                      id="uniqueValue"
                      name="uniqueValue"
                      placeholder="O que diferencia sua empresa dos concorrentes? Por que o cliente deve escolher você?"
                      value={formData.uniqueValue}
                      onChange={handleInputChange}
                      rows={3}
                    />
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Heart className="w-4 h-4 text-rose-500" />
                      Dica
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Pense em termos de benefícios, não apenas características. 
                      Ex: &quot;Economize 10h por semana&quot; ao invés de &quot;Software de automação&quot;.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {currentStep === 4 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle>Concorrência e Palavras-chave</CardTitle>
                      <CardDescription>Análise competitiva</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="competitors">Principais Concorrentes *</Label>
                    <Textarea
                      id="competitors"
                      name="competitors"
                      placeholder="Liste 3-5 concorrentes principais com suas URLs (um por linha). O que eles fazem bem? O que você pode fazer melhor?"
                      value={formData.competitors}
                      onChange={handleInputChange}
                      rows={4}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="keywords">Palavras-chave Alvo *</Label>
                    <Textarea
                      id="keywords"
                      name="keywords"
                      placeholder="Liste 10-20 palavras-chave que você gostaria de rankear (uma por linha)..."
                      value={formData.keywords}
                      onChange={handleInputChange}
                      rows={4}
                    />
                    <p className="text-xs text-muted-foreground">
                      Inclua termos de busca que seus clientes usariam para encontrar seus serviços.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {currentStep === 5 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center">
                      <Palette className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle>Design e Contato</CardTitle>
                      <CardDescription>Preferências visuais e finalização</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Design Style */}
                  <div className="space-y-3">
                    <Label>Estilo de Design *</Label>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {designPreferences.map((style) => (
                        <div
                          key={style.id}
                          onClick={() => handleSelectChange('designStyle', style.id)}
                          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            formData.designStyle === style.id
                              ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20'
                              : 'border-border hover:border-emerald-300'
                          }`}
                        >
                          <div className="font-medium text-sm">{style.label}</div>
                          <div className="text-xs text-muted-foreground">{style.description}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Color Palette */}
                  <div className="space-y-3">
                    <Label>Paleta de Cores *</Label>
                    <div className="grid sm:grid-cols-3 gap-3">
                      {colorPalettes.map((palette) => (
                        <div
                          key={palette.id}
                          onClick={() => handleSelectChange('colorPalette', palette.id)}
                          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            formData.colorPalette === palette.id
                              ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20'
                              : 'border-border hover:border-emerald-300'
                          }`}
                        >
                          <div className="flex gap-1 mb-2">
                            {palette.colors.map((color, i) => (
                              <div
                                key={i}
                                className="w-6 h-6 rounded-full"
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                          <div className="font-medium text-sm">{palette.name}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Reference Sites */}
                  <div className="space-y-2">
                    <Label htmlFor="referenceSites">Sites de Referência</Label>
                    <Textarea
                      id="referenceSites"
                      name="referenceSites"
                      placeholder="Liste sites que você admira e gostaria de se inspirar..."
                      value={formData.referenceSites}
                      onChange={handleInputChange}
                      rows={2}
                    />
                  </div>

                  {/* Budget & Timeline */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="budget">Orçamento Estimado</Label>
                      <Select onValueChange={(value) => handleSelectChange('budget', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="under-3k">Até R$ 3.000</SelectItem>
                          <SelectItem value="3k-5k">R$ 3.000 - R$ 5.000</SelectItem>
                          <SelectItem value="5k-10k">R$ 5.000 - R$ 10.000</SelectItem>
                          <SelectItem value="10k-25k">R$ 10.000 - R$ 25.000</SelectItem>
                          <SelectItem value="above-25k">Acima de R$ 25.000</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timeline">Prazo Desejado</Label>
                      <Select onValueChange={(value) => handleSelectChange('timeline', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="urgent">Urgente (2-4 semanas)</SelectItem>
                          <SelectItem value="normal">Normal (1-2 meses)</SelectItem>
                          <SelectItem value="flexible">Flexível (3+ meses)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="border-t pt-6 space-y-4">
                    <h4 className="font-semibold">Informações de Contato</h4>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nome *</Label>
                        <Input
                          id="name"
                          name="name"
                          placeholder="Seu nome"
                          value={formData.name}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="seu@email.com"
                          value={formData.email}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="(11) 99999-9999"
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="agreeToContact" 
                        checked={formData.agreeToContact}
                        onCheckedChange={(checked) => handleCheckboxChange('agreeToContact', checked as boolean)}
                      />
                      <label
                        htmlFor="agreeToContact"
                        className="text-sm text-muted-foreground cursor-pointer"
                      >
                        Concordo em ser contatado pela equipe Growth Business Copilot para discussão do projeto *
                      </label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Anterior
          </Button>
          
          {currentStep < 5 ? (
            <Button
              onClick={handleNext}
              disabled={!validateStep(currentStep)}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
            >
              Próximo
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!validateStep(5) || loading}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Rocket className="w-4 h-4 mr-2" />
                  Enviar Briefing
                </>
              )}
            </Button>
          )}
        </div>

        {/* Validation Message */}
        {!validateStep(currentStep) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 flex items-center gap-2 text-sm text-muted-foreground justify-center"
          >
            <AlertCircle className="w-4 h-4" />
            Preencha todos os campos obrigatórios (*) para continuar
          </motion.div>
        )}
      </main>
    </div>
  )
}
