import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: 'https://182158e1d110f77459eaafaef93c769a@o4511162203766784.ingest.us.sentry.io/4511162218708992',
  tracesSampleRate: 0.2,
  environment: process.env.NODE_ENV,
})

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart
