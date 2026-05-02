<template>
  <div class="min-h-screen flex bg-gray-50">
    <!-- Sidebar — hidden on mobile, visible md+ -->
    <aside
      class="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 fixed inset-y-0 z-20"
    >
      <!-- Sidebar logo -->
      <div class="flex items-center gap-2 px-6 h-16 border-b border-gray-100">
        <span class="text-2xl" aria-hidden="true">🏔</span>
        <span class="font-bold text-brand-700 text-lg">{{ $t('app.name') }}</span>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-3 py-4 space-y-1" :aria-label="$t('nav.dashboard')">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors"
          :class="
            isActive(item.to)
              ? 'bg-brand-50 text-brand-700'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          "
          :aria-current="isActive(item.to) ? 'page' : undefined"
        >
          <span aria-hidden="true">{{ item.icon }}</span>
          {{ $t(item.labelKey) }}
        </NuxtLink>
      </nav>

      <!-- User section -->
      <div class="px-3 py-4 border-t border-gray-100">
        <div class="flex items-center gap-3 px-3 py-2">
          <div class="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-semibold text-sm flex-shrink-0">
            {{ userInitial }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 truncate">{{ authStore.user?.name }}</p>
            <p class="text-xs text-gray-500 capitalize">{{ authStore.user?.role }}</p>
          </div>
        </div>
        <!-- Language switcher -->
        <div class="flex items-center gap-0.5 bg-gray-100 rounded-lg p-0.5 mt-2">
          <button
            v-for="code in availableLocales"
            :key="code"
            type="button"
            class="flex-1 py-1 rounded-md text-xs font-medium transition-colors"
            :class="locale === code ? 'bg-white text-brand-700 shadow-sm' : 'text-gray-500'"
            @click="setLocale(code)"
          >{{ code.toUpperCase() }}</button>
        </div>
        <AppButton
          variant="secondary"
          size="sm"
          class="w-full mt-2"
          @click="handleLogout"
        >
          {{ $t('auth.logout') }}
        </AppButton>
      </div>
    </aside>

    <!-- Main area -->
    <div class="flex-1 md:ml-64 flex flex-col min-h-screen">
      <!-- Top bar (mobile) -->
      <header class="md:hidden sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm px-4 h-14 flex items-center justify-between gap-2">
        <span class="font-bold text-brand-700 shrink-0">{{ $t('app.name') }}</span>
        <div class="flex items-center gap-2 min-w-0">
          <!-- Language switcher -->
          <div class="flex items-center gap-0.5 bg-gray-100 rounded-lg p-0.5">
            <button
              v-for="code in availableLocales"
              :key="code"
              type="button"
              class="px-2 py-1 rounded-md text-xs font-medium transition-colors"
              :class="locale === code ? 'bg-white text-brand-700 shadow-sm' : 'text-gray-500'"
              @click="setLocale(code)"
            >{{ code.toUpperCase() }}</button>
          </div>
          <AppButton variant="secondary" size="sm" @click="handleLogout">
            {{ $t('auth.logout') }}
          </AppButton>
        </div>
      </header>

      <!-- Page content -->
      <main class="flex-1 p-4 md:p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore()
const { toast } = useToast()
const { t, locale, availableLocales, setLocale } = useI18n()
const route = useRoute()

const navItems = [
  { to: '/admin', icon: '📊', labelKey: 'nav.dashboard' },
  { to: '/admin/locations', icon: '📍', labelKey: 'nav.locations' },
  { to: '/admin/packages', icon: '🎫', labelKey: 'nav.packages' },
  { to: '/admin/tickets', icon: '🎟', labelKey: 'nav.tickets' },
  { to: '/admin/users', icon: '👥', labelKey: 'nav.users' }
]

const userInitial = computed(() =>
  authStore.user?.name?.charAt(0).toUpperCase() ?? 'A'
)

function isActive(path: string): boolean {
  if (path === '/admin') return route.path === '/admin'
  return route.path.startsWith(path)
}

async function handleLogout(): Promise<void> {
  await authStore.logout()
  toast.success(t('auth.logout_success'))
  await navigateTo('/auth/login')
}
</script>
