// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/sitemap',
    '@nuxtjs/robots',
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/ui',
    'nuxt-auth-utils',
    '@sentry/nuxt/module',
    '@nuxt/test-utils/module',
  ],
  devtools: { enabled: true },
  app: {
    head: {
      link: [
        { rel: 'preconnect', href: 'https://analytics.lysen.dev' },
      ],
      script: [
        {
          'src': 'https://analytics.lysen.dev/script.js',
          'data-website-id': '34162bc8-a1b2-4140-a341-58ce504a13eb',
          'defer': 'true',
        },
      ],
    },
  },
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    authorizedEmail: '',
    dbUrl: '',
    ogApiToken: '',
    ogTemplateUrl: '',
    dumpToken: '',
    anthropicApiKey: '',
    redisUrl: 'redis://localhost:6379',
  },
  routeRules: {
    '/': { prerender: true },
    '/legal/legal-notice': { prerender: true },
    '/legal/privacy': { prerender: true },
    '/blog': { swr: process.env.NODE_ENV === 'production' },
    '/blog/**': { swr: process.env.NODE_ENV === 'production' },
    '/lab': { swr: process.env.NODE_ENV === 'production' },
    '/projects': { swr: process.env.NODE_ENV === 'production' },
    // @ts-expect-error robots is not typed in NitroRouteRules (private bundled interface)
    '/dashboard': { ssr: false, robots: false },
    // @ts-expect-error robots is not typed in NitroRouteRules (private bundled interface)
    '/dashboard/**': { ssr: false, robots: false },
    // @ts-expect-error robots is not typed in NitroRouteRules (private bundled interface)
    '/login': { ssr: false, robots: false },
  },
  sourcemap: {
    client: 'hidden',
  },
  future: {
    compatibilityVersion: 4,
  },
  compatibilityDate: '2025-01-01',
  nitro: {
    storage: {
      galleryUploads: {
        driver: 'fs',
        base: './uploads/gallery',
      },
      blogUploads: {
        driver: 'fs',
        base: './uploads/blog',
      },
      commonUploads: {
        driver: 'fs',
        base: './uploads/common',
      },
      ogImagesCache: {
        driver: 'fs',
        base: './cache/og-images',
      },
    },
  },
  eslint: {
    config: {
      stylistic: true,
    },
  },
  image: {
    dir: '../..',
  },
  sentry: {
    telemetry: false,
    sourceMapsUploadOptions: {
      org: 'lysendev',
      project: 'portfolio',
    },
  },
  sitemap: {
    defaults: {
      changefreq: 'weekly',
      priority: 0.7,
    },
    exclude: [
      '/dashboard',
      '/dashboard/**',
      '/login',
    ],
    sources: [
      '/api/__sitemaps__/blog',
    ],
  },
})
