<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-bold text-gray-900">{{ $t('nav.dashboard') }}</h1>

    <!-- Stats grid -->
    <div v-if="loading" class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div v-for="i in 4" :key="i" class="h-28 bg-gray-100 rounded-2xl animate-pulse" />
    </div>
    <div v-else class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <!-- Locations -->
      <div
        class="bg-white rounded-2xl border border-gray-200 p-4 cursor-pointer hover:shadow-sm transition-shadow"
        @click="navigateTo('/admin/locations')"
      >
        <div class="text-3xl mb-2">📍</div>
        <p class="text-2xl font-bold text-gray-900">{{ stats?.locations?.total ?? 0 }}</p>
        <p class="text-sm text-gray-500">{{ $t('nav.locations') }}</p>
        <p class="text-xs text-green-600 mt-1">{{ stats?.locations?.active ?? 0 }} {{ $t('common.active') }}</p>
      </div>
      <!-- Packages -->
      <div
        class="bg-white rounded-2xl border border-gray-200 p-4 cursor-pointer hover:shadow-sm transition-shadow"
        @click="navigateTo('/admin/packages')"
      >
        <div class="text-3xl mb-2">🎫</div>
        <p class="text-2xl font-bold text-gray-900">{{ stats?.packages?.total ?? 0 }}</p>
        <p class="text-sm text-gray-500">{{ $t('nav.packages') }}</p>
      </div>
      <!-- Tickets -->
      <div
        class="bg-white rounded-2xl border border-gray-200 p-4 cursor-pointer hover:shadow-sm transition-shadow"
        @click="navigateTo('/admin/tickets')"
      >
        <div class="text-3xl mb-2">🎟</div>
        <p class="text-2xl font-bold text-gray-900">{{ stats?.tickets?.total ?? 0 }}</p>
        <p class="text-sm text-gray-500">{{ $t('nav.tickets') }}</p>
        <p class="text-xs text-blue-600 mt-1">{{ stats?.tickets?.activatedCount ?? 0 }} {{ $t('ticket.activated') }}</p>
      </div>
      <!-- Users -->
      <div
        class="bg-white rounded-2xl border border-gray-200 p-4 cursor-pointer hover:shadow-sm transition-shadow"
        @click="navigateTo('/admin/users')"
      >
        <div class="text-3xl mb-2">👥</div>
        <p class="text-2xl font-bold text-gray-900">{{ stats?.users?.total ?? 0 }}</p>
        <p class="text-sm text-gray-500">{{ $t('nav.users') }}</p>
        <p class="text-xs text-gray-500 mt-1">
          {{ stats?.users?.staff ?? 0 }} staff · {{ stats?.users?.tourist ?? 0 }} tourist
        </p>
      </div>
    </div>

    <!-- Quick actions -->
    <div class="bg-white rounded-2xl border border-gray-200 p-5">
      <h2 class="text-sm font-semibold text-gray-700 mb-4">⚡ {{ $t('dashboard.quick_actions') }}</h2>
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <AppButton variant="secondary" @click="navigateTo('/admin/locations/new')">
          ➕ {{ $t('admin.add_location') }}
        </AppButton>
        <AppButton variant="secondary" @click="navigateTo('/staff/tickets/new')">
          🎫 {{ $t('ticket.create_new') }}
        </AppButton>
        <AppButton variant="secondary" @click="navigateTo('/admin/users')">
          👤 {{ $t('dashboard.manage_users') }}
        </AppButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })
const { t } = useI18n()
useHead({ title: () => t('nav.dashboard') })

const config = useRuntimeConfig()
const authStore = useAuthStore()

interface Stats {
  locations: { total: number; active: number }
  packages: { total: number }
  tickets: { total: number; active: number; expired: number; activatedCount: number }
  users: { admin: number; staff: number; tourist: number; total: number }
}

const loading = ref(true)
const stats = ref<Stats | null>(null)

async function load(): Promise<void> {
  try {
    const res = await $fetch<{ success: true; data: Stats }>(
      `${config.public.apiUrl}/admin/stats`,
      {
        headers: authStore.accessToken
          ? { Authorization: `Bearer ${authStore.accessToken}` }
          : {}
      }
    )
    stats.value = res.data
  } catch {
    // Fallback: show zeros
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>
