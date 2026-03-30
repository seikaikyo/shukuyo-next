import type { LogtoNextConfig } from '@logto/next'

export function getLogtoConfig(): LogtoNextConfig {
  const appSecret = process.env.LOGTO_APP_SECRET
  const cookieSecret = process.env.LOGTO_COOKIE_SECRET

  if (process.env.NODE_ENV === 'production' && (!appSecret || !cookieSecret)) {
    throw new Error('Missing LOGTO_APP_SECRET or LOGTO_COOKIE_SECRET env vars')
  }

  return {
    endpoint: 'https://crzbx3.logto.app',
    appId: 'u9u91v79btj9uhxkbodig',
    appSecret: appSecret ?? '',
    baseUrl: process.env.LOGTO_BASE_URL ?? 'http://localhost:5171',
    cookieSecret: cookieSecret ?? '',
    cookieSecure: process.env.NODE_ENV === 'production',
    resources: ['https://shukuyo.dashai.dev/api'],
  }
}
