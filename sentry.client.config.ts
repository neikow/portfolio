import * as Sentry from '@sentry/nuxt'

Sentry.init({
  // If set up, you can use your runtime config here
  // dsn: useRuntimeConfig().public.sentry.dsn,
  dsn: 'https://ea2c0f962a23f628bb57b3d672eb99f3@o4508377615761408.ingest.de.sentry.io/4510002814845008',

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,

  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
})
