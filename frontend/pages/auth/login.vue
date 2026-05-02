<template>
  <div>
    <div class="mb-6 text-center">
      <h2 class="text-xl font-bold text-gray-900">{{ $t('auth.login_title') }}</h2>
      <p class="mt-1 text-sm text-gray-500">{{ $t('auth.login_subtitle') }}</p>
    </div>

    <form class="space-y-4" novalidate @submit.prevent="handleSubmit">
      <!-- Email / Phone -->
      <AppInput
        v-model="form.identifier"
        :label="$t('auth.email_or_phone')"
        type="text"
        :placeholder="$t('auth.email_placeholder')"
        :error="errors.identifier"
        autocomplete="username"
        required
        @blur="validateIdentifier"
      />

      <!-- Password -->
      <div class="flex flex-col gap-1">
        <AppInput
          v-model="form.password"
          :label="$t('auth.password')"
          :type="showPassword ? 'text' : 'password'"
          :placeholder="$t('auth.password_placeholder')"
          :error="errors.password"
          autocomplete="current-password"
          required
          @blur="validatePassword"
        >
          <template #suffix>
            <button
              type="button"
              class="touch-target flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
              :aria-label="showPassword ? $t('auth.hide_password') : $t('auth.show_password')"
              @click="showPassword = !showPassword"
            >
              <svg v-if="showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
          </template>
        </AppInput>
      </div>

      <!-- Submit -->
      <AppButton
        type="submit"
        variant="primary"
        size="lg"
        :loading="authStore.isLoading"
        class="w-full mt-2"
      >
        {{ $t('auth.login') }}
      </AppButton>
    </form>

    <!-- Register link -->
    <p class="mt-5 text-center text-sm text-gray-500">
      {{ $t('auth.no_account') }}
      <NuxtLink
        to="/auth/register"
        class="font-semibold text-brand-600 hover:text-brand-700 underline-offset-2 hover:underline"
      >
        {{ $t('auth.register') }}
      </NuxtLink>
    </p>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'auth' })

const authStore = useAuthStore()
const { toast } = useToast()
const { t } = useI18n()

useHead({ title: () => t('auth.login') })

const form = reactive({
  identifier: '',
  password: ''
})

const errors = reactive({
  identifier: '',
  password: ''
})

const showPassword = ref(false)

function validateIdentifier(): boolean {
  if (!form.identifier.trim()) {
    errors.identifier = t('error.required')
    return false
  }
  errors.identifier = ''
  return true
}

function validatePassword(): boolean {
  if (!form.password) {
    errors.password = t('error.required')
    return false
  }
  if (form.password.length < 8) {
    errors.password = t('error.min_length', { min: 8 })
    return false
  }
  errors.password = ''
  return true
}

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

async function handleSubmit(): Promise<void> {
  const identifierValid = validateIdentifier()
  const passwordValid = validatePassword()
  if (!identifierValid || !passwordValid) return

  try {
    const credentials = isEmail(form.identifier)
      ? { email: form.identifier, password: form.password }
      : { phone: form.identifier, password: form.password }

    await authStore.login(credentials)
    toast.success(t('auth.login_success'))

    const dest = authStore.isAdmin ? '/admin' : authStore.isStaff ? '/staff' : '/explore'
    await navigateTo(dest)
  } catch (err: unknown) {
    const apiErr = err as { response?: { _data?: { error?: { code?: string } } } }
    const code = apiErr?.response?._data?.error?.code

    if (code === 'UNAUTHORIZED' || code === 'NOT_FOUND') {
      toast.error(t('error.invalid_credentials'))
    } else if (code === 'RATE_LIMIT_EXCEEDED') {
      toast.error(t('error.rate_limit'))
    } else {
      toast.error(t('error.login_failed'))
    }
  }
}
</script>
