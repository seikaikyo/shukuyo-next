import { signOut } from '@logto/next/server-actions'
import { getLogtoConfig } from '@/lib/logto'
import { redirect } from 'next/navigation'

export async function GET() {
  try {
    const config = getLogtoConfig()
    await signOut(config, `${config.baseUrl}`)
  } catch {
    redirect('/')
  }
}
