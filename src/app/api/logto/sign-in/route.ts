import { signIn } from '@logto/next/server-actions'
import { getLogtoConfig } from '@/lib/logto'
import { redirect } from 'next/navigation'

export async function GET() {
  try {
    const config = getLogtoConfig()
    await signIn(config, {
      redirectUri: `${config.baseUrl}/api/logto/sign-in-callback`,
    })
  } catch {
    redirect('/?auth_error=sign_in_failed')
  }
  redirect('/')
}
