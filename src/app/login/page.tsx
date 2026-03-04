'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Building2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/dashboard'

  // Login state
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [showLoginPassword, setShowLoginPassword] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)

  // Register state
  const [registerName, setRegisterName] = useState('')
  const [registerEmail, setRegisterEmail] = useState('')
  const [registerPassword, setRegisterPassword] = useState('')
  const [registerCompany, setRegisterCompany] = useState('')
  const [showRegisterPassword, setShowRegisterPassword] = useState(false)
  const [registerError, setRegisterError] = useState('')
  const [registerSuccess, setRegisterSuccess] = useState(false)
  const [registerLoading, setRegisterLoading] = useState(false)

  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotLoading, setForgotLoading] = useState(false)
  const [forgotSuccess, setForgotSuccess] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')
    setLoginLoading(true)

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      })

      const data = await response.json()

      if (data.success) {
        router.push(redirect)
        router.refresh()
      } else {
        setLoginError(data.error || 'Erro ao fazer login')
      }
    } catch {
      setLoginError('Erro de conexão. Tente novamente.')
    } finally {
      setLoginLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setRegisterError('')
    setRegisterSuccess(false)
    setRegisterLoading(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: registerEmail,
          password: registerPassword,
          name: registerName,
          company: registerCompany
        })
      })

      const data = await response.json()

      if (data.success) {
        setRegisterSuccess(true)
        setTimeout(() => {
          router.push(redirect)
          router.refresh()
        }, 1500)
      } else {
        setRegisterError(data.error || 'Erro ao criar conta')
      }
    } catch {
      setRegisterError('Erro de conexão. Tente novamente.')
    } finally {
      setRegisterLoading(false)
    }
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setForgotLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setForgotSuccess(true)
    setForgotLoading(false)
  }

  return (
    <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
      <Tabs defaultValue="login" className="w-full">
        <CardHeader className="pb-0">
          <TabsList className="grid w-full grid-cols-2 bg-white/5">
            <TabsTrigger value="login" className="data-[state=active]:bg-white/10">
              Entrar
            </TabsTrigger>
            <TabsTrigger value="register" className="data-[state=active]:bg-white/10">
              Criar conta
            </TabsTrigger>
          </TabsList>
        </CardHeader>

        <CardContent className="pt-6">
          {/* Login Tab */}
          <TabsContent value="login" className="space-y-4 mt-0">
            <form onSubmit={handleLogin} className="space-y-4">
              {loginError && (
                <Alert variant="destructive" className="bg-red-500/10 border-red-500/20">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{loginError}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="login-email" className="text-white">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="seu@email.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-password" className="text-white">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="login-password"
                    type={showLoginPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="pl-10 pr-10 bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showLoginPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white"
                disabled={loginLoading}
              >
                {loginLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Entrar
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </form>

            <div className="mt-4 p-3 bg-teal-500/10 rounded-lg border border-teal-500/20">
              <p className="text-xs text-teal-300 text-center">
                <strong>Demo:</strong> demo@orion.com / senha: demo123
              </p>
            </div>
          </TabsContent>

          {/* Register Tab */}
          <TabsContent value="register" className="space-y-4 mt-0">
            <form onSubmit={handleRegister} className="space-y-4">
              {registerError && (
                <Alert variant="destructive" className="bg-red-500/10 border-red-500/20">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{registerError}</AlertDescription>
                </Alert>
              )}

              {registerSuccess && (
                <Alert className="bg-emerald-500/10 border-emerald-500/20">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <AlertDescription className="text-emerald-400">
                    Conta criada! Redirecionando...
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="register-name" className="text-white">Nome *</Label>
                <Input
                  id="register-name"
                  type="text"
                  placeholder="Seu nome"
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-email" className="text-white">Email *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="seu@email.com"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-company" className="text-white">Empresa</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="register-company"
                    type="text"
                    placeholder="Nome da empresa"
                    value={registerCompany}
                    onChange={(e) => setRegisterCompany(e.target.value)}
                    className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-password" className="text-white">Senha *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="register-password"
                    type={showRegisterPassword ? 'text' : 'password'}
                    placeholder="Mínimo 6 caracteres"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    className="pl-10 pr-10 bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showRegisterPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white"
                disabled={registerLoading}
              >
                {registerLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Criar conta
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </form>
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  )
}

function LoadingFallback() {
  return (
    <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
      <CardContent className="py-12 text-center">
        <Loader2 className="w-8 h-8 text-teal-500 animate-spin mx-auto" />
        <p className="text-slate-400 mt-4">Carregando...</p>
      </CardContent>
    </Card>
  )
}

export default function LoginPage() {
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotLoading, setForgotLoading] = useState(false)
  const [forgotSuccess, setForgotSuccess] = useState(false)

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setForgotLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setForgotSuccess(true)
    setForgotLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link href="/">
            <Image 
              src="/logo.png" 
              alt="Orion Growth Studio" 
              width={160} 
              height={40}
              className="h-10 w-auto mx-auto brightness-0 invert"
            />
          </Link>
          <p className="text-slate-400 mt-2">Acesse sua área do cliente</p>
        </div>

        <Suspense fallback={<LoadingFallback />}>
          <LoginContent />
        </Suspense>

        {/* Forgot Password */}
        <div className="mt-6 text-center">
          <details className="group">
            <summary className="text-sm text-slate-400 cursor-pointer hover:text-white">
              Esqueceu sua senha?
            </summary>
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4"
            >
              <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
                <CardContent className="pt-4">
                  {forgotSuccess ? (
                    <div className="text-center py-2">
                      <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
                      <p className="text-sm text-emerald-400">
                        Se o email existir em nossa base, você receberá instruções para redefinir sua senha.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleForgotPassword} className="space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor="forgot-email" className="text-white text-sm">
                          Digite seu email
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <Input
                            id="forgot-email"
                            type="email"
                            placeholder="seu@email.com"
                            value={forgotEmail}
                            onChange={(e) => setForgotEmail(e.target.value)}
                            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                            required
                          />
                        </div>
                      </div>
                      <Button
                        type="submit"
                        variant="outline"
                        className="w-full border-white/20 text-white hover:bg-white/10"
                        disabled={forgotLoading}
                      >
                        {forgotLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : null}
                        Enviar link de recuperação
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </details>
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-slate-400 hover:text-white transition-colors">
            ← Voltar para o site
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
