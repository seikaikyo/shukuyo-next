import { getLogtoContext } from '@logto/next/server-actions'
import { getLogtoConfig } from '@/lib/logto'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const context = await getLogtoContext(getLogtoConfig(), { fetchUserInfo: true })

    if (!context.isAuthenticated) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    return NextResponse.json({
      sub: context.claims?.sub,
      name: context.userInfo?.name ?? context.claims?.name,
      picture: context.userInfo?.picture ?? context.claims?.picture,
    })
  } catch {
    return NextResponse.json({ error: 'Auth service unavailable' }, { status: 503 })
  }
}
