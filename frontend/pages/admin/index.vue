<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-bold text-gray-900">{{ $t('nav.dashboard') }}</h1>

    <!-- Stats grid -->
    <div v-if="loading" class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div v-for="i in 4" :key="i" class="h-28 bg-gray-100 rounded-2xl animate-pulse" />
    </div>
    <div v-else class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="bg-white rounded-2xl border border-gray-200 p-4 cursor-pointer hover:shadow-sm transition-shadow"
        @click="navigateTo('/admin/locations')">
        <div class="text-3xl mb-2">📍</div>
        <p class="text-2xl font-bold text-gray-900">{{ stats?.locations?.total ?? 0 }}</p>
        <p class="text-sm text-gray-500">{{ $t('nav.locations') }}</p>
        <p class="text-xs text-green-600 mt-1">{{ stats?.locations?.active ?? 0 }} {{ $t('common.active') }}</p>
      </div>
      <div class="bg-white rounded-2xl border border-gray-200 p-4 cursor-pointer hover:shadow-sm transition-shadow"
        @click="navigateTo('/admin/packages')">
        <div class="text-3xl mb-2">🎫</div>
        <p class="text-2xl font-bold text-gray-900">{{ stats?.packages?.total ?? 0 }}</p>
        <p class="text-sm text-gray-500">{{ $t('nav.packages') }}</p>
      </div>
      <div class="bg-white rounded-2xl border border-gray-200 p-4 cursor-pointer hover:shadow-sm transition-shadow"
        @click="navigateTo('/admin/tickets')">
        <div class="text-3xl mb-2">🎟</div>
        <p class="text-2xl font-bold text-gray-900">{{ stats?.tickets?.total ?? 0 }}</p>
        <p class="text-sm text-gray-500">{{ $t('nav.tickets') }}</p>
        <p class="text-xs text-blue-600 mt-1">{{ stats?.tickets?.activatedCount ?? 0 }} {{ $t('ticket.activated') }}</p>
      </div>
      <div class="bg-white rounded-2xl border border-gray-200 p-4 cursor-pointer hover:shadow-sm transition-shadow"
        @click="navigateTo('/admin/users')">
        <div class="text-3xl mb-2">👥</div>
        <p class="text-2xl font-bold text-gray-900">{{ stats?.users?.total ?? 0 }}</p>
        <p class="text-sm text-gray-500">{{ $t('nav.users') }}</p>
        <p class="text-xs text-gray-500 mt-1">
          {{ stats?.users?.staff ?? 0 }} staff · {{ stats?.users?.tourist ?? 0 }} tourist
        </p>
      </div>
    </div>

    <!-- Activity chart -->
    <div class="bg-white rounded-2xl border border-gray-200 p-5">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-sm font-semibold text-gray-700">{{ $t('dashboard.activity_chart') }}</h2>
        <div class="flex gap-1 bg-gray-100 rounded-lg p-0.5">
          <button v-for="p in periods" :key="p.value" type="button"
            class="px-3 py-1 text-xs font-medium rounded-md transition-colors"
            :class="chartPeriod === p.value ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'"
            @click="chartPeriod = p.value">
            {{ p.label }}
          </button>
        </div>
      </div>

      <!-- Bar chart -->
      <div v-if="chartData.length" class="overflow-x-auto">
        <div class="min-w-0" :style="{ minWidth: chartPeriod === '30d' ? '600px' : '0' }">
          <!-- Bars -->
          <div class="flex items-end gap-0.5 h-32">
            <div
              v-for="day in chartData"
              :key="day.date"
              class="flex-1 flex items-end gap-px"
              :title="day.date + ': ' + day.tickets + ' tickets, ' + day.users + ' users'"
            >
              <div
                class="flex-1 bg-brand-500 rounded-t min-h-[2px] transition-all"
                :style="{ height: maxVal > 0 ? Math.max(4, (day.tickets / maxVal) * 128) + 'px' : '2px' }"
                :title="day.tickets + ' tickets'"
              />
              <div
                class="flex-1 bg-green-400 rounded-t min-h-[2px] transition-all"
                :style="{ height: maxVal > 0 ? Math.max(4, (day.users / maxVal) * 128) + 'px' : '2px' }"
                :title="day.users + ' users'"
              />
            </div>
          </div>
          <!-- X-axis labels -->
          <div class="flex gap-0.5 mt-1">
            <div
              v-for="(day, idx) in chartData"
              :key="day.date"
              class="flex-1 text-center"
            >
              <span
                v-if="chartPeriod === '7d' || idx % 5 === 0"
                class="text-[9px] text-gray-400"
              >
                {{ formatDayLabel(day.date) }}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="h-32 flex items-center justify-center text-sm text-gray-400">
        {{ $t('common.loading') }}
      </div>

      <!-- Legend -->
      <div class="flex gap-4 mt-3">
        <div class="flex items-center gap-1.5">
          <div class="w-3 h-3 rounded-sm bg-brand-500" />
          <span class="text-xs text-gray-600">{{ $t('nav.tickets') }}</span>
        </div>
        <div class="flex items-center gap-1.5">
          <div class="w-3 h-3 rounded-sm bg-green-400" />
          <span class="text-xs text-gray-600">{{ $t('nav.users') }}</span>
        </div>
      </div>
    </div>

    <!-- Recent tickets -->
    <div class="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h2 class="text-sm font-semibold text-gray-700">{{ $t('dashboard.recent_tickets') }}</h2>
        <button type="button" class="text-xs text-brand-600 hover:underline" @click="navigateTo('/admin/tickets')">
          {{ $t('ticket.all_tickets') }} →
        </button>
      </div>
      <div v-if="loading" class="divide-y divide-gray-50">
        <div v-for="i in 5" :key="i" class="px-5 py-3">
          <div class="h-4 bg-gray-100 rounded w-2/3 animate-pulse" />
        </div>
      </div>
      <div v-else-if="!recentTickets.length" class="px-5 py-8 text-center text-sm text-gray-400">
        {{ $t('ticket.no_tickets') }}
      </div>
      <div v-else class="divide-y divide-gray-50">
        <div
          v-for="t in recentTickets"
          :key="t.id"
          class="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
          @click="navigateTo('/admin/tickets')"
        >
          <div
            class="w-2 h-2 rounded-full flex-shrink-0"
            :class="t.ticketUsers.length > 0 ? 'bg-green-400' : 'bg-gray-300'"
          />
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <span class="font-mono text-xs font-semibold text-brand-700">{{ t.code }}</span>
              <span class="text-xs text-gray-500 truncate">{{ t.guestName }}</span>
            </div>
            <p class="text-xs text-gray-400 mt-0.5">{{ t.package?.name }}</p>
          </div>
          <span class="text-xs text-gray-400 flex-shrink-0">{{ formatDate(t.createdAt) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })
const { t } = useI18n()
useHead({ title: () => t('nav.dashboard') })

const { apiFetch } = useApiFetch()

interface RecentTicket {
  id: string
  code: string
  guestName: string
  package: { name: string } | null
  ticketUsers: { userId: string }[]
  createdAt: string
}

interface ChartDay { date: string; tickets: number; users: number }

interface Stats {
  locations: { total: number; active: number }
  packages: { total: number }
  tickets: {
    total: number
    activatedCount: number
    recentTickets: RecentTicket[]
    chart: { '7d': ChartDay[]; '30d': ChartDay[] }
  }
  users: { admin: number; staff: number; tourist: number; total: number }
}

const loading = ref(true)
const stats = ref<Stats | null>(null)
const chartPeriod = ref<'7d' | '30d'>('7d')

const periods = [
  { value: '7d' as const, label: t('dashboard.period_7d') },
  { value: '30d' as const, label: t('dashboard.period_30d') },
]

const recentTickets = computed<RecentTicket[]>(() => stats.value?.tickets?.recentTickets ?? [])
const chartData = computed<ChartDay[]>(() => stats.value?.tickets?.chart?.[chartPeriod.value] ?? [])
const maxVal = computed(() => Math.max(1, ...chartData.value.map(d => Math.max(d.tickets, d.users))))

function formatDayLabel(date: string): string {
  const d = new Date(date)
  return `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })
}

async function load(): Promise<void> {
  try {
    const res = await apiFetch<{ success: true; data: Stats }>('/admin/stats')
    stats.value = res.data
  } catch {
    // show zeros
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>
