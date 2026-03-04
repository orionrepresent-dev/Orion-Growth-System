'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Clock,
  Zap,
  Bot,
  TrendingUp,
  Target,
  Settings,
  BarChart3,
  Shield,
  Menu,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'

// Animações
const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

// Features da Friendly Automation
const features = [
  {
    icon: Clock,
    title: 'Antecipa necessidades',
    description: 'A IA monitora seu mercado e cria conteúdo antes de você precisar pedir.'
  },
  {
    icon: Bot,
    title: 'Aprende com você',
    description: 'Cada aprovação ou ajuste melhora o sistema. Quanto mais usa, melhor fica.'
  },
  {
    icon: Zap,
    title: 'One-Click Actions',
    description: 'Conteúdo pronto para aprovar com um clique. Sem configurar, sem pedir.'
  },
  {
    icon: TrendingUp,
    title: 'Otimiza automaticamente',
    description: 'Detecta o que funciona e ajusta estratégia. Você só vê os resultados.'
  },
  {
    icon: Target,
    title: 'Personalizado ao extremo',
    description: 'Conteúdo feito para SEU público, baseado no SEU ICP, no SEU tom.'
  },
  {
    icon: Shield,
    title: 'Transparência total',
    description: 'Veja o que a IA faz, por que faz, e ajuste quando quiser.'
  }
]

// Planos
const plans = [
  {
    name: 'Starter',
    price: 'R$ 497',
    period: '/mês',
    description: 'Para quem está começando',
    features: [
      'Redes sociais automatizadas',
      '8 posts/mês',
      'Dashboard de resultados',
      'Suporte por email'
    ],
    cta: 'Começar agora',
    popular: false
  },
  {
    name: 'Growth',
    price: 'R$ 997',
    period: '/mês',
    description: 'Para quem quer crescer',
    features: [
      'Tudo do Starter, mais:',
      'SEO automatizado',
      'Blog com 4 artigos/mês',
      'Análise de concorrentes',
      'Suporte por WhatsApp'
    ],
    cta: 'Mais popular',
    popular: true
  },
  {
    name: 'Domination',
    price: 'R$ 1.497',
    period: '/mês',
    description: 'Para quem quer dominar',
    features: [
      'Tudo do Growth, mais:',
      'Anúncios inclusos',
      'Consultor dedicado',
      'Relatórios em vídeo',
      'Prioridade máxima'
    ],
    cta: 'Falar com especialista',
    popular: false
  }
]

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-lg border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg">Orion Growth Studio</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-6">
              <a href="#como-funciona" className="text-sm text-slate-400 hover:text-white transition-colors">
                Como funciona
              </a>
              <a href="#planos" className="text-sm text-slate-400 hover:text-white transition-colors">
                Planos
              </a>
            </div>

            {/* CTA */}
            <div className="hidden md:flex items-center gap-3">
              <Link href="/dashboard">
                <Button variant="ghost" className="text-slate-400 hover:text-white">
                  Entrar
                </Button>
              </Link>
              <Link href="/analyze">
                <Button className="bg-teal-500 hover:bg-teal-600 text-white">
                  Começar grátis
                </Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 text-slate-400"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-slate-900 border-b border-slate-800"
          >
            <div className="px-4 py-4 space-y-4">
              <a href="#como-funciona" className="block text-slate-300">Como funciona</a>
              <a href="#planos" className="block text-slate-300">Planos</a>
              <Link href="/dashboard" className="block text-slate-300">Entrar</Link>
              <Link href="/analyze">
                <Button className="w-full bg-teal-500 hover:bg-teal-600 text-white">
                  Começar grátis
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-sm mb-8">
              <Sparkles className="w-4 h-4" />
              Friendly Automation
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Configure uma vez.
              <br />
              <span className="text-teal-400">A IA trabalha para você.</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-8">
              Enquanto outras ferramentas esperam você pedir, o Growth Studio já preparou tudo.
              Setup único, valor contínuo.
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/analyze">
                <Button size="lg" className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-6 text-lg">
                  Começar agora
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="lg" variant="outline" className="border-slate-700 text-white hover:bg-slate-800 px-8 py-6">
                  Ver demo
                </Button>
              </Link>
            </div>

            {/* Trust */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-10 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-500" />
                Setup em 5 minutos
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-500" />
                Sem fidelidade
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-500" />
                Resultados em 30 dias
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section id="como-funciona" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Como funciona
            </h2>
            <p className="text-slate-400 text-lg">
              Três passos simples. Depois, a IA faz o resto.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: '1', title: 'Setup único', desc: 'Conte sobre seu negócio em 5 minutos. A IA entende seu ICP, tom e objetivos.', icon: Settings },
              { step: '2', title: 'IA trabalha', desc: 'Monitora seu mercado 24/7, detecta oportunidades e cria conteúdo automaticamente.', icon: Bot },
              { step: '3', title: 'Você aprova', desc: 'Receba sugestões prontas. Aprovar, variar ou ajustar com um clique.', icon: CheckCircle2 }
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-6 h-6 text-teal-400" />
                </div>
                <div className="text-sm font-bold text-teal-400 mb-2">Passo {item.step}</div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-slate-400 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              O que a IA faz por você
            </h2>
            <p className="text-slate-400 text-lg">
              Friendly Automation: mais do que automação, uma parceira proativa.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors"
              >
                <feature.icon className="w-5 h-5 text-teal-400 mb-3" />
                <h3 className="font-semibold mb-1">{feature.title}</h3>
                <p className="text-sm text-slate-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Plans */}
      <section id="planos" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Escolha seu plano
            </h2>
            <p className="text-slate-400 text-lg">
              Todos os planos incluem Friendly Automation.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative rounded-2xl p-6 ${
                  plan.popular
                    ? 'bg-gradient-to-b from-teal-500/10 to-slate-900 border-2 border-teal-500'
                    : 'bg-slate-900 border border-slate-800'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-teal-500 text-white text-xs font-bold rounded-full">
                    Mais popular
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                  <p className="text-sm text-slate-400 mb-4">{plan.description}</p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-slate-400">{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-teal-400 mt-0.5 shrink-0" />
                      <span className="text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/analyze">
                  <Button
                    className={`w-full ${
                      plan.popular
                        ? 'bg-teal-500 hover:bg-teal-600 text-white'
                        : 'bg-slate-800 hover:bg-slate-700 text-white'
                    }`}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Pronto para parar de fazer manualmente?
            </h2>
            <p className="text-slate-400 text-lg mb-8">
              Configure uma vez e deixe a IA trabalhar. Você só aprova.
            </p>
            <Link href="/analyze">
              <Button size="lg" className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-6 text-lg">
                Ativar Friendly Automation
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-400">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm">Orion Growth Studio</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <span>© 2025 Orion Consultoria</span>
            <a href="https://wa.me/5551981829086" className="hover:text-white transition-colors">
              Suporte
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
