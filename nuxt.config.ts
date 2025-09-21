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
  ],
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    authorizedEmail: '',
    dbUrl: '',
  },
  routeRules: {
    '/': { prerender: true },
    '/blog': { swr: process.env.NODE_ENV === 'production' },
    '/blog/**': { swr: process.env.NODE_ENV === 'production' },
    // @ts-expect-error robots is not recognized by nuxt for some reason
    '/dashboard': { ssr: false, robots: false },
    // @ts-expect-error robots is not recognized by nuxt for some reason
    '/dashboard/**': { ssr: false, robots: false },
    // @ts-expect-error robots is not recognized by nuxt for some reason
    '/login': { ssr: false, robots: false },
    '/api/**': { cors: true },
  },
  sourcemap: {
    client: 'hidden',
  },
  future: {
    compatibilityVersion: 4,
  },
  compatibilityDate: '2024-04-03',
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
    },
  },
  eslint: {
    config: {
      stylistic: true,
    },
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
      changefreq: 'daily',
      priority: 0.7,
      lastmod: new Date().toISOString(),
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
