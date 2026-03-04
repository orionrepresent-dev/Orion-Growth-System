import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, getUserById, toSafeUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value

    if (!token) {
      return NextResponse.json(
        { success: false, user: null },
        { status: 401 }
      )
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json(
        { success: false, user: null },
        { status: 401 }
      )
    }

    const user = await getUserById(decoded.userId)
    if (!user) {
      return NextResponse.json(
        { success: false, user: null },
        { status: 401 }
      )
    }

    return NextResponse.json({
      success: true,
      user: toSafeUser(user)
    })
  } catch (error) {
    console.error('Get user error:', error)
    return NextResponse.json(
      { success: false, user: null },
      { status: 500 }
    )
  }
}
