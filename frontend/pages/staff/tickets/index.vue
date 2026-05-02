<template>
  <div class="space-y-4">
    <!-- Page header -->
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-900">{{ $t('staff.tickets_title') }}</h1>
      <AppButton size="sm" @click="goToNew">
        {{ $t('ticket.create_new') }}
      </AppButton>
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
      <AppButton class="mt-4" @click="goToNew">
        {{ $t('ticket.create_new') }}
      </AppButton>
    </div>

    <!-- Ticket list -->
    <div v-else class="space-y-3">
      <TicketCard
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
definePageMeta({ layout: 'staff' })
const { t } = useI18n()
useHead({ title: () => t('staff.tickets_title') })

const ticketStore = useTicketStore()

const page = ref(1)
const limit = 20

const totalPages = computed(() => Math.max(1, Math.ceil(ticketStore.total / limit)))

function goToNew(): void {
  window.location.href = '/staff/tickets/new'
}

async function load(): Promise<void> {
  await ticketStore.fetchMyTickets({ page: page.value, limit })
}

async function changePage(next: number): Promise<void> {
  page.value = next
  await load()
}

await load()
</script>
