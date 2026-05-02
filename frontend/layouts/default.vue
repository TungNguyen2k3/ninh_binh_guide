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
            @click="() => switchLocale(code)"
          >
            {{ code.toUpperCase() }}
          </button>
        </div>
      </div>
    </header>

    <!-- Main content — padding bottom for bottom nav on mobile -->
    <main class="flex-1 pb-16 sm:pb-0">
      <slot />
    </main>

    <!-- Bottom navigation — mobile only -->
    <nav class="sm:hidden fixed bottom-0 inset-x-0 z-30 bg-white border-t border-gray-100 pb-safe">
      <div class="flex items-stretch h-16">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors"
          :class="route.path === item.to ? 'text-brand-600' : 'text-gray-400'"
          :aria-label="$t(item.labelKey)"
        >
          <span class="text-2xl leading-none" aria-hidden="true">{{ item.icon }}</span>
          <span class="text-[10px] font-medium leading-none">{{ $t(item.labelKey) }}</span>
        </NuxtLink>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
const { locale, availableLocales, switchLocale } = useLocale()
const route = useRoute()

const navItems = [
  { to: '/explore', icon: '🗺️', labelKey: 'nav.map' },
  { to: '/explore/list', icon: '📋', labelKey: 'nav.list' },
]
</script>
