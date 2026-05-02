<template>
  <div class="min-h-screen flex flex-col bg-gradient-to-br from-brand-50 via-white to-green-50">
    <!-- Language switcher -->
    <div class="flex justify-end px-4 pt-4">
      <div class="flex items-center gap-1 bg-white rounded-xl border border-gray-100 p-1 shadow-sm">
        <button
          v-for="code in availableLocales"
          :key="code"
          type="button"
          class="touch-target flex items-center justify-center px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
          :class="
            locale === code
              ? 'bg-brand-600 text-white shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          "
          :aria-pressed="locale === code"
          @click="switchLocale(code)"
        >
          {{ code.toUpperCase() }}
        </button>
      </div>
    </div>

    <!-- Centered content -->
    <div class="flex-1 flex items-center justify-center px-4 py-8">
      <div class="w-full max-w-[400px]">
        <!-- App brand -->
        <div class="text-center mb-8">
          <span class="text-5xl" aria-hidden="true">🏔</span>
          <h1 class="mt-3 text-2xl font-bold text-brand-700">{{ $t('app.name') }}</h1>
          <p class="mt-1 text-sm text-gray-500">{{ $t('app.tagline') }}</p>
        </div>

        <!-- Page card -->
        <div class="card p-6">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { locale, availableLocales, setLocale } = useI18n()

// setLocale only accepts known locale codes — type is inferred from nuxt.config i18n.locales
type LocaleCode = (typeof availableLocales)[number]
function switchLocale(code: LocaleCode): void {
  setLocale(code)
}
</script>
