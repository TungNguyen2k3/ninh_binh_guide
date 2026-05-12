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

        <div class="flex items-center gap-2">
          <!-- Language switcher (always rendered — safe for SSR) -->
          <button
            v-for="code in availableLocales"
            :key="code"
            type="button"
            class="touch-target flex items-center justify-center px-2 py-1 rounded-lg text-sm font-medium transition-colors"
            :class="locale === code ? 'bg-brand-100 text-brand-700' : 'text-gray-500 hover:bg-gray-100'"
            :aria-pressed="locale === code"
            @click="() => switchLocale(code)"
          >
            {{ code.toUpperCase() }}
          </button>

          <!-- Auth-dependent UI: client-only to avoid SSR hydration mismatch -->
          <ClientOnly>
            <!-- Login button for unauthenticated guests -->
            <NuxtLink
              v-if="!authStore.isAuthenticated"
              to="/auth/login"
              class="text-sm font-semibold text-brand-600 hover:text-brand-700 px-3 py-1.5 rounded-lg hover:bg-brand-50 transition-colors"
            >
              {{ $t('auth.login') }}
            </NuxtLink>

            <!-- Ticket expiry badge — tourist only -->
            <span
              v-if="authStore.isTourist && timeLeft"
              class="text-xs font-medium px-2 py-0.5 rounded-full"
              :class="expirySoon ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500'"
            >
              ⏱ {{ timeLeft }}
            </span>

            <!-- Logout button -->
            <button
              v-if="authStore.isAuthenticated"
              type="button"
              class="touch-target flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              :aria-label="$t('auth.logout')"
              @click="handleLogout"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </ClientOnly>
        </div>
      </div>
    </header>

    <!-- Main content — padding bottom for bottom nav on mobile -->
    <main class="flex-1 pb-16 sm:pb-0">
      <slot />
    </main>

    <!-- Bottom navigation — mobile only, explore pages only -->
    <nav v-if="showBottomNav" class="sm:hidden fixed bottom-0 inset-x-0 z-30 bg-white border-t border-gray-100 pb-safe">
      <div class="flex items-stretch h-16">
        <!-- Map tab -->
        <NuxtLink
          to="/explore"
          class="flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors"
          :class="route.path === '/explore' ? 'text-brand-600' : 'text-gray-400'"
          :aria-label="$t('nav.map')"
        >
          <span class="text-2xl leading-none" aria-hidden="true">🗺️</span>
          <span class="text-[10px] font-medium leading-none">{{ $t('nav.map') }}</span>
        </NuxtLink>
        <!-- List tab -->
        <NuxtLink
          to="/explore/list"
          class="flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors"
          :class="route.path === '/explore/list' ? 'text-brand-600' : 'text-gray-400'"
          :aria-label="$t('nav.list')"
        >
          <span class="text-2xl leading-none" aria-hidden="true">📋</span>
          <span class="text-[10px] font-medium leading-none">{{ $t('nav.list') }}</span>
        </NuxtLink>
        <!-- Tours tab -->
        <NuxtLink
          to="/explore/tours"
          class="flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors"
          :class="route.path === '/explore/tours' ? 'text-brand-600' : 'text-gray-400'"
          :aria-label="$t('explore.tours')"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"
              d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          <span class="text-[10px] font-medium leading-none">{{ $t('explore.tours') }}</span>
        </NuxtLink>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
const { locale, availableLocales, switchLocale } = useLocale()
const route = useRoute()
const authStore = useAuthStore()
const { toast } = useToast()
const { t } = useI18n()

const exploreRoutes = ['/explore', '/explore/list', '/explore/tours']
const showBottomNav = computed(() => exploreRoutes.includes(route.path))

const timeLeft = ref('')
const expirySoon = ref(false)
let expiryTimer: ReturnType<typeof setInterval> | null = null

function updateExpiry() {
  if (!authStore.isTourist || !authStore.ticketExpiresAt) {
    timeLeft.value = ''
    expirySoon.value = false
    return
  }
  const diff = new Date(authStore.ticketExpiresAt).getTime() - Date.now()
  if (diff <= 0) {
    timeLeft.value = ''
    authStore.clearState()
    navigateTo('/auth/activate')
    return
  }
  expirySoon.value = diff < 60 * 60 * 1000
  const h = Math.floor(diff / 3600000)
  const m = Math.floor((diff % 3600000) / 60000)
  timeLeft.value = h > 0 ? `${h}g ${m}p` : `${m}p`
}

onMounted(() => {
  updateExpiry()
  expiryTimer = setInterval(updateExpiry, 60000)
})
onUnmounted(() => { if (expiryTimer) clearInterval(expiryTimer) })

async function handleLogout() {
  await authStore.logout()
  toast.success(t('auth.logout_success'))
  navigateTo('/auth/login')
}
</script>
