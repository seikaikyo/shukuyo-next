import * as Sentry from '@sentry/nextjs'
import type { InstrumentationOnRequestError } from 'next/dist/server/instrumentation/types'

const SENTRY_DSN = 'https://182158e1d110f77459eaafaef93c769a@o4511162203766784.ingest.us.sentry.io/4511162218708992'

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    Sentry.init({
      dsn: SENTRY_DSN,
      tracesSampleRate: 0.2,
      environment: process.env.NODE_ENV,
    })
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    Sentry.init({
      dsn: SENTRY_DSN,
      tracesSampleRate: 0.2,
      environment: process.env.NODE_ENV,
    })
  }
}

export const onRequestError: InstrumentationOnRequestError = (
  err,
  request,
  context,
) => {
  Sentry.captureException(err, {
    tags: {
      routerKind: context.routerKind,
      routeType: context.routeType,
    },
    extra: {
      method: request.method,
      path: request.path,
      routePath: context.routePath,
    },
  })
}
