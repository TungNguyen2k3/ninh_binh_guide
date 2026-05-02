<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <!-- Header -->
    <header class="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm pt-safe">
      <div class="flex items-center justify-between px-4 h-14">
        <!-- Logo -->
        <NuxtLink
          to="/explore"
          class="flex items-center gap-2 font-bold text-brand-700 text-lg leading-none"
          :aria-label="$t('app.name')"
        >
          <span class="text-2xl" aria-hidden="true">🏔</span>
          <span class="hidden sm:inline">{{ $t('app.name') }}</span>
        </NuxtLink>

        <!-- Language switcher -->
        <div class="flex items-center gap-1">
          <button
            v-for="code in availableLocales"
            :key="code"
            type="button"
            class="touch-target flex items-center justify-center px-2 py-1 rounded-lg text-sm font-medium transition-colors"
            :class="
              locale === code
                ? 'bg-brand-100 text-brand-700'
                : 'text-gray-500 hover:bg-gray-100'
            "
            :aria-pressed="locale === code"
            @click="switchLocale(code)"
          >
            {{ code.toUpperCase() }}
          </button>
        </div>
      </div>
    </header>

    <!-- Main content -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Bottom safe area spacer for mobile -->
    <div class="pb-safe" aria-hidden="true" />
  </div>
</template>

<script setup lang="ts">
const { locale, availableLocales, setLocale } = useI18n()

type LocaleCode = (typeof availableLocales)[number]
function switchLocale(code: LocaleCode): void {
  setLocale(code)
}
</script>
