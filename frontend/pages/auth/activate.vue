<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
    <div class="w-full max-w-sm">
      <!-- Header -->
      <div class="text-center mb-6">
        <div class="text-5xl mb-3">🎫</div>
        <h2 class="text-xl font-bold text-gray-900">{{ $t('ticket.activate_title') }}</h2>
        <p class="text-sm text-gray-500 mt-1">{{ $t('ticket.activate_subtitle') }}</p>
      </div>

      <!-- Form card -->
      <div class="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <form @submit.prevent="handleActivate">
          <!-- Code input -->
          <div class="flex flex-col gap-1 mb-4">
            <label class="text-sm font-medium text-gray-700">
              {{ $t('ticket.code_label') }}
              <span class="text-red-500 ml-0.5" aria-hidden="true">*</span>
            </label>
            <input
              v-model="code"
              type="text"
              :placeholder="$t('ticket.code_placeholder')"
              maxlength="10"
              autocomplete="off"
              autocapitalize="characters"
              spellcheck="false"
              class="block w-full rounded-xl border bg-white px-3 py-2.5 text-lg text-center font-mono uppercase tracking-widest placeholder-gray-300 transition-colors duration-150 outline-none"
              :class="error
                ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                : 'border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200'"
              @input="formatCode"
            />
            <p v-if="error" class="text-sm text-red-600" role="alert">
              {{ error }}
            </p>
          </div>

          <AppButton
            type="submit"
            variant="primary"
            size="lg"
            :loading="loading"
            class="w-full"
          >
            {{ $t('ticket.activate') }}
          </AppButton>
        </form>
      </div>

      <!-- Logout link -->
      <p class="text-center text-sm text-gray-500 mt-4">
        <button
          type="button"
          class="text-brand-600 hover:underline font-medium"
          @click="handleLogout"
        >
          {{ $t('auth.logout') }}
        </button>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })
const { t } = useI18n()
useHead({ title: () => t('ticket.activate_title') })

const ticketStore = useTicketStore()
const authStore = useAuthStore()
const { toast } = useToast()

const code = ref('')
const error = ref('')
const loading = ref(false)

function formatCode(event: Event): void {
  let val = (event.target as HTMLInputElement).value
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')

  // Insert dash after the first 3 characters (NBG prefix)
  if (val.length > 3) {
    val = val.slice(0, 3) + '-' + val.slice(3, 9)
  }
  code.value = val
}

async function handleActivate(): Promise<void> {
  error.value = ''

  const cleaned = code.value.trim()
  if (!cleaned) {
    error.value = t('error.required')
    return
  }

  loading.value = true
  try {
    await ticketStore.activateTicket(cleaned)
    // Refresh user object so hasActiveTicket getter updates
    await authStore.fetchMe()
    toast.success(t('ticket.activate_success'))
    window.location.href = '/explore'
  } catch (err: unknown) {
    const apiErr = err as { data?: { error?: { code?: string; message?: string } } }
    const errCode = apiErr?.data?.error?.code ?? ''

    if (errCode === 'TICKET_NOT_FOUND') {
      error.value = t('ticket.not_found')
    } else if (errCode === 'TICKET_EXPIRED') {
      error.value = t('ticket.expired_error')
    } else if (errCode === 'TICKET_ALREADY_OWNED') {
      error.value = t('ticket.already_owned')
    } else if (errCode === 'TICKET_INVALID') {
      error.value = t('ticket.invalid_code')
    } else {
      error.value = apiErr?.data?.error?.message ?? t('error.server_error')
    }
  } finally {
    loading.value = false
  }
}

async function handleLogout(): Promise<void> {
  await authStore.logout()
  window.location.href = '/auth/login'
}
</script>
