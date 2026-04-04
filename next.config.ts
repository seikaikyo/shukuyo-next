import type { NextConfig } from 'next'
import { withSentryConfig } from '@sentry/nextjs'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
}

export default withSentryConfig(nextConfig, {
  org: 'dashai-jz',
  project: 'shukuyo-next',
  silent: !process.env.CI,
})
