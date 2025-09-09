// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/ui',
    'nuxt-auth-utils',
  ],
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    authorizedEmail: '',
  },
  routeRules: {
    '/': { prerender: true },
    '/blog': { swr: true },
    '/blog/**': { swr: true },
    '/dashboard': { ssr: false },
    '/dashboard/**': { ssr: false },
    '/api/**': { cors: true },
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
})
