export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt', '@nuxtjs/i18n'],


  app: {
    head: {
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ]
    }
  },

  i18n: {
    locales: [
      { code: 'vi', name: 'Tiếng Việt', file: 'vi.json' },
      { code: 'en', name: 'English', file: 'en.json' }
    ],
    defaultLocale: 'vi',
    strategy: 'no_prefix',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_locale',
      redirectOn: 'root',
      alwaysRedirect: false
    },
    bundle: {
      optimizeTranslationDirective: false
    }
  },

  // Dev proxy: /api → localhost:4000/api (same-origin → cookie works without SameSite=None)
  nitro: {
    devProxy: {
      '/api': {
        target: 'http://localhost:4000/api',
        changeOrigin: true,
      }
    }
  },

  runtimeConfig: {
    public: {
      // Dev: relative /api/v1 → goes through Nuxt proxy (same-origin, cookie OK)
      // Prod: set NUXT_PUBLIC_API_URL=https://your-backend.railway.app/api/v1
      apiUrl: process.env.NUXT_PUBLIC_API_URL || '/api/v1'
    }
  },

  typescript: { strict: true },

  css: ['~/assets/css/main.css'],

  // Auto-import stores so useAuthStore() is available without explicit imports
  // in components, composables, middleware, and pages
  imports: {
    dirs: ['stores']
  }
})
