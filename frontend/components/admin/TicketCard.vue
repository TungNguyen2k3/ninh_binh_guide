<template>
  <div class="bg-white rounded-2xl border border-gray-200 p-4">
    <!-- Ticket code — large, mono, easy to read -->
    <div class="text-2xl font-mono font-bold text-brand-700 tracking-widest">
      {{ ticket.code }}
    </div>

    <!-- Guest details -->
    <div class="mt-2 space-y-1 text-sm text-gray-600">
      <p>{{ ticket.guestName }}</p>
      <p v-if="ticket.guestPhone">{{ ticket.guestPhone }}</p>
      <p>{{ ticket.package.name }}</p>
      <p>{{ $t('ticket.expires_at') }}: {{ formatExpiry(ticket.expiresAt) }}</p>
      <p v-if="ticket.createdBy">{{ $t('ticket.created_by') }}: {{ ticket.createdBy.name }}</p>
    </div>

    <!-- Status badge -->
    <div class="mt-3 flex items-center justify-between">
      <span
        class="text-xs font-medium px-2 py-1 rounded-full"
        :class="statusClass"
      >
        {{ statusLabel }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Ticket } from '~/stores/ticket.store'

interface Props {
  ticket: Ticket
}

const props = defineProps<Props>()
const { t } = useI18n()

function isExpired(ticket: Ticket): boolean {
  return new Date(ticket.expiresAt) < new Date()
}

function isActivated(ticket: Ticket): boolean {
  return ticket.ticketUsers.length > 0
}

function formatExpiry(dateStr: string): string {
  return new Date(dateStr).toLocaleString('vi-VN', {
    dateStyle: 'short',
    timeStyle: 'short'
  })
}

const statusClass = computed<string>(() => {
  if (isExpired(props.ticket)) return 'bg-red-100 text-red-700'
  if (isActivated(props.ticket)) return 'bg-blue-100 text-blue-700'
  return 'bg-green-100 text-green-700'
})

const statusLabel = computed<string>(() => {
  if (isExpired(props.ticket)) return t('ticket.expired')
  if (isActivated(props.ticket)) return t('ticket.activated')
  return t('ticket.pending')
})
</script>
