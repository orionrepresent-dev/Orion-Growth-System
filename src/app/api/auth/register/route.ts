import { NextRequest, NextResponse } from 'next/server'
import { createUser, generateToken, toSafeUser } from '@/lib/auth'
import { RegisterRequest } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const body: RegisterRequest = await request.json()
    const { email, password, name, company } = body

    if (!email || !password || !name) {
      return NextResponse.json(
        { success: false, error: 'Email, senha e nome são obrigatórios' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Senha deve ter pelo menos 6 caracteres' },
        { status: 400 }
      )
    }

    try {
      // Create user
      const user = await createUser({
        email,
        password,
        name,
        company
      })

      // Generate token
      const token = generateToken(toSafeUser(user))
      const safeUser = toSafeUser(user)

      // Create response with cookie
      const response = NextResponse.json({
        success: true,
        user: safeUser
      })

      // Set httpOnly cookie
      response.cookies.set('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/'
      })

      return response
    } catch (error: unknown) {
      if (error instanceof Error) {
        return NextResponse.json(
          { success: false, error: error.message },
          { status: 400 }
        )
      }
      throw error
    }
  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
