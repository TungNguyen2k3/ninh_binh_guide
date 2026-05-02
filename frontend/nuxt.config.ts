export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt', '@nuxtjs/i18n'],

  i18n: {
    // @nuxtjs/i18n v9 defaults: locale files live in <srcDir>/i18n/locales/
    locales: [
      { code: 'vi', name: 'Tiếng Việt', file: 'vi.json' },
      { code: 'en', name: 'English', file: 'en.json' }
    ],
    defaultLocale: 'vi',
    strategy: 'no_prefix',
    // Silence the optimizeTranslationDirective deprecation warning
    bundle: {
      optimizeTranslationDirective: false
    }
  },

  runtimeConfig: {
    public: {
      apiUrl: process.env.NUXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'
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
