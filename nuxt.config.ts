// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/ui',
  ],
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  content: {
    build: {
      markdown: {
        highlight: {
          langs: [
            'python',
            'js',
            'ts',
            'docker',
            'yml',
            'json',
          ],
          theme: {
            // Default theme (same as single string)
            default: 'github-light',
            // Theme used if `html.dark`
            dark: 'github-dark',
            // Theme used if `html.sepia`
            sepia: 'monokai',
          },
        },
      },
    },
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
    },
  },
  eslint: {
    config: {
      stylistic: true,
    },
  },
})
