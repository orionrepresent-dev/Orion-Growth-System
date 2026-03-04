'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Target,
  CheckCircle2,
  Users,
  MapPin,
  Briefcase,
  Heart,
  TrendingUp,
  ArrowRight,
  Edit
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

// Mock data
const icpData = {
  name: 'Empreendedor Digital',
  demographics: {
    age: '35-45 anos',
    gender: '60% Masculino, 40% Feminino',
    location: 'São Paulo, Rio de Janeiro, Minas Gerais',
    income: 'R$ 10.000 - R$ 50.000/mês',
    education: 'Ensino Superior ou Pós-graduação'
  },
  psychographics: {
    interests: ['Tecnologia', 'Empreendedorismo', 'Marketing Digital', 'E-commerce'],
    behaviors: ['Pesquisa antes de comprar', 'Valoriza qualidade', 'Ativo em redes sociais'],
    painPoints: ['Falta de tempo', 'Dificuldade em escalar', 'Competição acirrada'],
    goals: ['Aumentar vendas', 'Automatizar processos', 'Escalar negócio']
  },
  benchmarks: {
    position: 'Top 30%',
    competitors: ['Concorrente A', 'Concorrente B', 'Concorrente C'],
    opportunities: ['Conteúdo técnico', 'Vídeos curtos', 'LinkedIn orgânico']
  }
}

export default function ICPPage() {
  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">ICP - Cliente Ideal</h1>
          <p className="text-slate-400 text-sm">Conheça profundamente seu público-alvo</p>
        </div>
        <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
          <Edit className="w-4 h-4 mr-2" />
          Editar ICP
        </Button>
      </div>

      {/* ICP Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-white">
              <Target className="w-5 h-5 text-teal-400" />
              Seu Cliente Ideal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-teal-500/20 flex items-center justify-center">
                <Users className="w-8 h-8 text-teal-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{icpData.name}</h3>
                <p className="text-slate-400">Baseado em suas análises e dados do mercado</p>
              </div>
              <Badge className="ml-auto bg-emerald-500/20 text-emerald-300 border-0">
                Posição: {icpData.benchmarks.position}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Demographics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-white">
              <Users className="w-5 h-5 text-blue-400" />
              Dados Demográficos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
                <Users className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-sm text-slate-500">Idade</p>
                  <p className="text-white font-medium">{icpData.demographics.age}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
                <Users className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-sm text-slate-500">Gênero</p>
                  <p className="text-white font-medium">{icpData.demographics.gender}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
                <MapPin className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-sm text-slate-500">Localização</p>
                  <p className="text-white font-medium">{icpData.demographics.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
                <Briefcase className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-sm text-slate-500">Renda</p>
                  <p className="text-white font-medium">{icpData.demographics.income}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Psychographics */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Interests & Behaviors */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-slate-900 border-slate-800 h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-white">
                <Heart className="w-5 h-5 text-pink-400" />
                Interesses & Comportamentos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <p className="text-sm text-slate-500 mb-2">Interesses</p>
                <div className="flex flex-wrap gap-2">
                  {icpData.psychographics.interests.map((interest) => (
                    <Badge key={interest} variant="outline" className="border-teal-500/30 text-teal-300">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <p className="text-sm text-slate-500 mb-2">Comportamentos</p>
                <ul className="space-y-2">
                  {icpData.psychographics.behaviors.map((behavior) => (
                    <li key={behavior} className="flex items-center gap-2 text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-teal-400" />
                      {behavior}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Pain Points & Goals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-slate-900 border-slate-800 h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-white">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                Dores & Objetivos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <p className="text-sm text-slate-500 mb-2">Principais Dores</p>
                <ul className="space-y-2">
                  {icpData.psychographics.painPoints.map((pain) => (
                    <li key={pain} className="flex items-center gap-2 text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                      {pain}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <p className="text-sm text-slate-500 mb-2">Objetivos</p>
                <ul className="space-y-2">
                  {icpData.psychographics.goals.map((goal) => (
                    <li key={goal} className="flex items-center gap-2 text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      {goal}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Opportunities */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-white">
              <Target className="w-5 h-5 text-purple-400" />
              Oportunidades Identificadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-3 gap-4">
              {icpData.benchmarks.opportunities.map((opportunity, index) => (
                <div key={opportunity} className="p-4 bg-slate-800/50 rounded-lg text-center">
                  <span className="text-3xl font-bold text-teal-400">{index + 1}</span>
                  <p className="text-white mt-2">{opportunity}</p>
                </div>
              ))}
            </div>
            <Link href="/app/conteudo">
              <Button className="w-full mt-4 bg-teal-500 hover:bg-teal-600 text-white">
                Criar conteúdo para este ICP
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
