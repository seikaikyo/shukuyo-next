import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: 'https://5776e381771a5446e5ed8bac9565e398@o4511065302433792.ingest.us.sentry.io/4511065318621184',
  tracesSampleRate: 0.2,
  environment: process.env.NODE_ENV,
})

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart
