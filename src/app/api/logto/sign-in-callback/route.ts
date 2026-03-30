import { handleSignIn } from '@logto/next/server-actions'
import { getLogtoConfig } from '@/lib/logto'
import { redirect } from 'next/navigation'
import { type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    await handleSignIn(getLogtoConfig(), request.nextUrl)
  } catch {
    redirect('/?auth_error=callback_failed')
  }
  redirect('/')
}
