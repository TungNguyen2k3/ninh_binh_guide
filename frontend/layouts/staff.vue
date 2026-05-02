<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <!-- Header -->
    <header class="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm pt-safe">
      <div class="flex items-center justify-between px-4 h-14">
        <!-- Logo -->
        <div class="flex items-center gap-2">
          <span class="text-2xl" aria-hidden="true">🏔</span>
          <span class="font-bold text-brand-700 text-lg">{{ $t('app.name') }}</span>
        </div>

        <!-- Lang + user + logout -->
        <div class="flex items-center gap-2">
          <div class="flex items-center gap-0.5 bg-gray-100 rounded-lg p-0.5">
            <button
              v-for="code in availableLocales"
              :key="code"
              type="button"
              class="px-2 py-1 rounded-md text-xs font-medium transition-colors"
              :class="locale === code ? 'bg-white text-brand-700 shadow-sm' : 'text-gray-500'"
              @click="() => switchLocale(code)"
            >{{ code.toUpperCase() }}</button>
          </div>
          <span class="text-sm text-gray-600 hidden sm:inline">{{ authStore.user?.name }}</span>
          <AppButton variant="secondary" size="sm" @click="handleLogout">
            {{ $t('auth.logout') }}
          </AppButton>
        </div>
      </div>
    </header>

    <!-- Main content -->
    <main class="flex-1 p-4">
      <slot />
    </main>

    <!-- Bottom safe area -->
    <div class="pb-safe" aria-hidden="true" />
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore()
const { toast } = useToast()
const { t } = useI18n()
const { locale, availableLocales, switchLocale } = useLocale()

async function handleLogout(): Promise<void> {
  await authStore.logout()
  toast.success(t('auth.logout_success'))
  await navigateTo('/auth/login')
}
</script>
