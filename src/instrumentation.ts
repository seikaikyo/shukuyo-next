import * as Sentry from '@sentry/nextjs'
import type { InstrumentationOnRequestError } from 'next/dist/server/instrumentation/types'

const SENTRY_DSN = 'https://5776e381771a5446e5ed8bac9565e398@o4511065302433792.ingest.us.sentry.io/4511065318621184'

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
