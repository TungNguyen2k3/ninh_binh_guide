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

        <!-- User info + logout -->
        <div class="flex items-center gap-3">
          <span class="text-sm text-gray-600 hidden sm:inline">{{ authStore.user?.name }}</span>
          <AppButton
            variant="secondary"
            size="sm"
            @click="handleLogout"
          >
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

async function handleLogout(): Promise<void> {
  await authStore.logout()
  toast.success(t('auth.logout_success'))
  await navigateTo('/auth/login')
}
</script>
