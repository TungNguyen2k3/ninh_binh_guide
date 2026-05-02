<template>
  <div class="space-y-6">
    <!-- Page header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <h1 class="text-2xl font-bold text-gray-900">{{ $t('ticket.all_tickets') }}</h1>
    </div>

    <!-- Search bar -->
    <div class="relative">
      <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1016.65 16.65z" />
        </svg>
      </div>
      <input
        v-model="searchInput"
        type="search"
        :placeholder="$t('ticket.search_placeholder')"
        class="block w-full rounded-xl border border-gray-300 bg-white pl-9 pr-3 py-2.5 text-base text-gray-900 placeholder-gray-400 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200 transition-colors"
        @input="debouncedSearch"
      />
    </div>

    <!-- Loading -->
    <div v-if="ticketStore.isLoading" class="flex justify-center items-center py-16">
      <svg class="animate-spin h-6 w-6 text-brand-600" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
    </div>

    <!-- Empty state -->
    <div
      v-else-if="ticketStore.tickets.length === 0"
      class="flex flex-col items-center justify-center py-16 text-center"
    >
      <div class="text-5xl mb-3">🎫</div>
      <p class="text-sm text-gray-500">{{ $t('ticket.no_tickets') }}</p>
    </div>

    <!-- Ticket grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <AdminTicketCard
        v-for="ticket in ticketStore.tickets"
        :key="ticket.id"
        :ticket="ticket"
      />
    </div>

    <!-- Pagination -->
    <div
      v-if="totalPages > 1"
      class="flex items-center justify-center gap-3 pt-2"
    >
      <AppButton
        variant="secondary"
        size="sm"
        :disabled="page <= 1"
        @click="changePage(page - 1)"
      >
        {{ $t('common.prev') }}
      </AppButton>
      <span class="text-sm text-gray-600">{{ page }} / {{ totalPages }}</span>
      <AppButton
        variant="secondary"
        size="sm"
        :disabled="page >= totalPages"
        @click="changePage(page + 1)"
      >
        {{ $t('common.next') }}
      </AppButton>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })
const { t } = useI18n()
useHead({ title: () => t('ticket.all_tickets') })

const ticketStore = useTicketStore()

const page = ref(1)
const limit = 20
const searchInput = ref('')
let debounceTimer: ReturnType<typeof setTimeout> | null = null

const totalPages = computed(() => Math.max(1, Math.ceil(ticketStore.total / limit)))

async function load(): Promise<void> {
  await ticketStore.fetchAllTickets({
    page: page.value,
    limit,
    search: searchInput.value.trim() || undefined
  })
}

function debouncedSearch(): void {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(async () => {
    page.value = 1
    await load()
  }, 400)
}

async function changePage(next: number): Promise<void> {
  page.value = next
  await load()
}

onMounted(load)
</script>
