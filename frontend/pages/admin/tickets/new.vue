<template>
  <div class="max-w-lg mx-auto">
    <div v-if="created" class="text-center py-8">
      <div class="text-6xl mb-4">🎫</div>
      <h2 class="text-xl font-bold text-gray-900">{{ $t('ticket.create_success') }}</h2>
      <div class="my-6 p-6 bg-brand-50 rounded-2xl">
        <p class="text-sm text-gray-500 mb-2">{{ $t('ticket.code_label') }}</p>
        <div class="text-4xl font-mono font-bold text-brand-700 tracking-[0.2em]">
          {{ lastCreated?.code }}
        </div>
        <p class="text-sm text-gray-600 mt-3">{{ lastCreated?.guestName }}</p>
        <p class="text-sm text-gray-500">{{ lastCreated?.package?.name }}</p>
      </div>
      <AppButton variant="secondary" @click="copyCode">
        {{ $t('ticket.copy_code') }}
      </AppButton>
      <div class="flex gap-3 mt-6">
        <AppButton variant="secondary" class="flex-1" @click="reset">
          {{ $t('ticket.create_new') }}
        </AppButton>
        <AppButton variant="primary" class="flex-1" @click="navigateTo('/admin/tickets')">
          {{ $t('ticket.all_tickets') }}
        </AppButton>
      </div>
    </div>

    <div v-else>
      <button type="button"
        class="flex items-center gap-1 text-sm text-gray-500 mb-4 hover:text-gray-700 transition-colors"
        @click="navigateTo('/admin/tickets')">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        {{ $t('common.back') }}
      </button>

      <h1 class="text-2xl font-bold text-gray-900 mb-6">{{ $t('ticket.create_new') }}</h1>

      <form class="space-y-4" @submit.prevent="handleSubmit">
        <AppInput v-model="form.guestName" :label="$t('ticket.guest_name')"
          :placeholder="$t('auth.name_placeholder')" :error="errors.guestName" required />
        <AppInput v-model="form.guestPhone" :label="$t('ticket.guest_phone')"
          :placeholder="$t('auth.phone_placeholder')" type="tel" />

        <div class="flex flex-col gap-1">
          <label class="text-sm font-medium text-gray-700">
            {{ $t('ticket.select_package') }}
            <span class="text-red-500 ml-0.5" aria-hidden="true">*</span>
          </label>
          <div v-if="packages.length === 0" class="h-11 rounded-xl bg-gray-100 animate-pulse" />
          <select v-else v-model="form.packageId"
            class="block w-full rounded-xl border bg-white px-3 py-2.5 text-base text-gray-900 outline-none transition-colors duration-150"
            :class="errors.packageId ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200' : 'border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200'">
            <option value="" disabled>{{ $t('ticket.select_package') }}</option>
            <option v-for="pkg in packages" :key="pkg.id" :value="pkg.id">
              {{ pkg.name }} ({{ pkg.validityHours }}h)
            </option>
          </select>
          <p v-if="errors.packageId" class="text-sm text-red-600">{{ errors.packageId }}</p>
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-sm font-medium text-gray-700">{{ $t('ticket.note') }}</label>
          <textarea v-model="form.note" rows="3" :placeholder="$t('ticket.note')"
            class="block w-full rounded-xl border border-gray-300 px-3 py-2.5 text-base text-gray-900 placeholder-gray-400 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200 resize-none transition-colors" />
        </div>

        <AppButton type="submit" variant="primary" size="lg" :loading="isSubmitting" class="w-full">
          {{ isSubmitting ? $t('common.saving') : $t('ticket.create_new') }}
        </AppButton>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })
const { t } = useI18n()
useHead({ title: () => t('ticket.create_new') })

const { toast } = useToast()
const { apiFetch } = useApiFetch()

interface PackageItem { id: string; name: string; type: string; validityHours: number; isActive: boolean }
interface CreatedTicket { code: string; guestName: string; package: { name: string } | null }

const packages = ref<PackageItem[]>([])
const lastCreated = ref<CreatedTicket | null>(null)
const created = ref(false)
const isSubmitting = ref(false)

const form = ref({ guestName: '', guestPhone: '', packageId: '', note: '' })
const errors = ref({ guestName: '', packageId: '' })

function validate(): boolean {
  errors.value.guestName = ''
  errors.value.packageId = ''
  let valid = true
  if (!form.value.guestName.trim()) { errors.value.guestName = t('error.required'); valid = false }
  if (!form.value.packageId) { errors.value.packageId = t('error.required'); valid = false }
  return valid
}

async function handleSubmit(): Promise<void> {
  if (!validate()) return
  isSubmitting.value = true
  try {
    const res = await apiFetch<{ success: true; data: CreatedTicket }>(
      '/staff/tickets',
      {
        method: 'POST',
        body: {
          packageId: form.value.packageId,
          guestName: form.value.guestName.trim(),
          guestPhone: form.value.guestPhone.trim() || undefined,
          note: form.value.note.trim() || undefined,
        },
      }
    )
    lastCreated.value = res.data
    created.value = true
    toast.success(t('ticket.create_success'))
  } catch (err: unknown) {
    const apiErr = err as { data?: { error?: { message?: string } } }
    toast.error(apiErr?.data?.error?.message ?? t('error.server_error'))
  } finally {
    isSubmitting.value = false
  }
}

async function copyCode(): Promise<void> {
  try {
    await navigator.clipboard.writeText(lastCreated.value?.code ?? '')
    toast.success(t('ticket.copy_code'))
  } catch {
    toast.error(t('error.server_error'))
  }
}

function reset(): void {
  created.value = false
  lastCreated.value = null
  form.value = { guestName: '', guestPhone: '', packageId: '', note: '' }
  errors.value = { guestName: '', packageId: '' }
}

onMounted(async () => {
  const res = await apiFetch<{ success: true; data: PackageItem[] }>('/admin/packages')
  packages.value = (res.data ?? []).filter((p) => p.isActive)
})
</script>
