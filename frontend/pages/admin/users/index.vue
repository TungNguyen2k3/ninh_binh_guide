<template>
  <div class="space-y-6">
    <!-- Page header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <h1 class="text-2xl font-bold text-gray-900">{{ $t('nav.users') }}</h1>
      <AppButton @click="openCreateModal">
        {{ $t('user.create') }}
      </AppButton>
    </div>

    <!-- Filters -->
    <div class="flex flex-col sm:flex-row gap-3">
      <!-- Search -->
      <div class="relative flex-1">
        <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1016.65 16.65z" />
          </svg>
        </div>
        <input
          v-model="searchInput"
          type="search"
          :placeholder="$t('common.search_placeholder')"
          class="block w-full rounded-xl border border-gray-300 bg-white pl-9 pr-3 py-2.5 text-base text-gray-900 placeholder-gray-400 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200 transition-colors"
          @input="debouncedSearch"
        />
      </div>
      <!-- Role filter -->
      <select
        v-model="roleFilter"
        class="rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-base text-gray-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200 transition-colors"
        @change="onFilterChange"
      >
        <option value="">{{ $t('user.all_roles') }}</option>
        <option value="admin">{{ $t('user.role_admin') }}</option>
        <option value="staff">{{ $t('user.role_staff') }}</option>
        <option value="tourist">{{ $t('user.role_tourist') }}</option>
      </select>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="flex justify-center items-center py-16">
      <svg class="animate-spin h-6 w-6 text-brand-600" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
    </div>

    <!-- Empty state -->
    <div
      v-else-if="users.length === 0"
      class="flex flex-col items-center justify-center py-16 text-center"
    >
      <div class="text-5xl mb-3">👥</div>
      <p class="text-sm text-gray-500">{{ $t('user.no_users') }}</p>
    </div>

    <!-- Users cards -->
    <div v-else class="space-y-2">
      <div
        v-for="u in users"
        :key="u.id"
        class="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-sm transition-shadow"
      >
        <!-- Main info -->
        <div class="flex items-center gap-3 px-4 py-3">
          <!-- Avatar initials -->
          <div
            class="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
            :class="roleBadgeClass(u.role)"
          >
            {{ u.name.charAt(0).toUpperCase() }}
          </div>

          <!-- Name + contact -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <p class="font-semibold text-gray-900 text-sm leading-tight">{{ u.name }}</p>
              <span :class="roleBadgeClass(u.role)" class="text-[10px] font-medium px-2 py-0.5 rounded-full">
                {{ roleLabel(u.role) }}
              </span>
              <!-- Self badge -->
              <span v-if="u.id === authStore.user?.id"
                class="text-[10px] font-medium px-2 py-0.5 rounded-full bg-brand-100 text-brand-700">
                Bạn
              </span>
            </div>
            <p class="text-xs text-gray-400 mt-0.5 truncate">{{ u.email ?? u.phone ?? '—' }}</p>
            <p class="text-[10px] text-gray-300 mt-0.5">{{ formatDate(u.createdAt) }}</p>
          </div>

          <!-- Role change (not self) -->
          <select
            v-if="u.id !== authStore.user?.id"
            :value="u.role"
            class="flex-shrink-0 rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs text-gray-700 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-200 transition-colors"
            @change="onRoleChange(u, ($event.target as HTMLSelectElement).value as UserRole)"
          >
            <option value="admin">{{ $t('user.role_admin') }}</option>
            <option value="staff">{{ $t('user.role_staff') }}</option>
            <option value="tourist">{{ $t('user.role_tourist') }}</option>
          </select>
        </div>

        <!-- Action bar (not self) -->
        <div v-if="u.id !== authStore.user?.id" class="border-t border-gray-100">
          <button
            type="button"
            class="w-full py-2 text-xs font-medium text-red-500 hover:bg-red-50 transition-colors flex items-center justify-center gap-1.5"
            @click="confirmDelete(u)"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            {{ $t('common.delete') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex items-center justify-center gap-3 pt-2">
      <AppButton variant="secondary" size="sm" :disabled="page <= 1" @click="changePage(page - 1)">
        {{ $t('common.prev') }}
      </AppButton>
      <span class="text-sm text-gray-600">{{ page }} / {{ totalPages }}</span>
      <AppButton variant="secondary" size="sm" :disabled="page >= totalPages" @click="changePage(page + 1)">
        {{ $t('common.next') }}
      </AppButton>
    </div>

    <!-- Delete confirm dialog -->
    <AppConfirm
      :open="deleteDialog.open"
      :title="$t('user.delete_confirm')"
      :message="$t('common.delete_confirm_message')"
      :is-loading="deleteDialog.isLoading"
      @confirm="doDelete"
      @cancel="deleteDialog.open = false"
    />

    <!-- Create user modal -->
    <Teleport to="body">
      <div
        v-if="createModal.open"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
        role="dialog"
        aria-modal="true"
        @keydown.esc="createModal.open = false"
      >
        <div class="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl">
          <h3 class="text-lg font-bold text-gray-900 mb-5">{{ $t('user.create_title') }}</h3>
          <form class="space-y-4" @submit.prevent="doCreate">
            <AppInput
              v-model="createForm.name"
              :label="$t('user.name')"
              :placeholder="$t('auth.name_placeholder')"
              required
              :error="createErrors.name"
            />
            <AppInput
              v-model="createForm.emailOrPhone"
              :label="$t('auth.email_or_phone')"
              :placeholder="$t('auth.email_placeholder')"
              required
              :error="createErrors.emailOrPhone"
            />
            <AppInput
              v-model="createForm.password"
              :label="$t('auth.password')"
              type="password"
              :placeholder="$t('auth.password_placeholder')"
              required
              :error="createErrors.password"
            />
            <!-- Role selector -->
            <div class="flex flex-col gap-1">
              <label class="text-sm font-medium text-gray-700">
                {{ $t('user.role') }} <span class="text-red-500 ml-0.5">*</span>
              </label>
              <div class="flex gap-3">
                <button
                  type="button"
                  :class="createForm.role === 'admin'
                    ? 'bg-red-100 text-red-700 border-red-300'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'"
                  class="flex-1 rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors"
                  @click="createForm.role = 'admin'"
                >
                  {{ $t('user.role_admin') }}
                </button>
                <button
                  type="button"
                  :class="createForm.role === 'staff'
                    ? 'bg-blue-100 text-blue-700 border-blue-300'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'"
                  class="flex-1 rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors"
                  @click="createForm.role = 'staff'"
                >
                  {{ $t('user.role_staff') }}
                </button>
              </div>
            </div>

            <p v-if="createErrors.general" class="text-sm text-red-600">{{ createErrors.general }}</p>

            <div class="flex gap-3 pt-2">
              <AppButton
                type="button"
                variant="secondary"
                class="flex-1"
                :disabled="createModal.isLoading"
                @click="createModal.open = false"
              >
                {{ $t('common.cancel') }}
              </AppButton>
              <AppButton
                type="submit"
                class="flex-1"
                :loading="createModal.isLoading"
              >
                {{ $t('user.create') }}
              </AppButton>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })
const { t } = useI18n()
useHead({ title: () => t('nav.users') })

const authStore = useAuthStore()
const { apiFetch } = useApiFetch()

type UserRole = 'admin' | 'staff' | 'tourist'

interface UserItem {
  id: string
  name: string
  email: string | null
  phone: string | null
  role: UserRole
  createdAt: string
}

interface UsersResponse {
  success: true
  data: UserItem[]
  meta: { total: number; page: number; limit: number }
}

// State
const users = ref<UserItem[]>([])
const isLoading = ref(false)
const page = ref(1)
const limit = 20
const total = ref(0)
const searchInput = ref('')
const roleFilter = ref('')

const totalPages = computed(() => Math.max(1, Math.ceil(total.value / limit)))

// Delete dialog
const deleteDialog = reactive({
  open: false,
  isLoading: false,
  targetId: '' as string
})

// Create modal
const createModal = reactive({
  open: false,
  isLoading: false
})

const createForm = reactive({
  name: '',
  emailOrPhone: '',
  password: '',
  role: 'staff' as 'admin' | 'staff'
})

const createErrors = reactive({
  name: '',
  emailOrPhone: '',
  password: '',
  general: ''
})

// Helpers
function roleBadgeClass(role: UserRole): string {
  const map: Record<UserRole, string> = {
    admin: 'bg-red-100 text-red-700',
    staff: 'bg-blue-100 text-blue-700',
    tourist: 'bg-green-100 text-green-700'
  }
  return map[role]
}

function roleLabel(role: UserRole): string {
  const map: Record<UserRole, string> = {
    admin: t('user.role_admin'),
    staff: t('user.role_staff'),
    tourist: t('user.role_tourist')
  }
  return map[role]
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

// Data fetching
async function load(): Promise<void> {
  isLoading.value = true
  try {
    const params = new URLSearchParams({
      page: String(page.value),
      limit: String(limit)
    })
    if (searchInput.value.trim()) params.set('search', searchInput.value.trim())
    if (roleFilter.value) params.set('role', roleFilter.value)

    const res = await apiFetch<UsersResponse>(
      `/admin/users?${params.toString()}`
    )
    users.value = res.data
    total.value = res.meta.total
  } catch {
    users.value = []
  } finally {
    isLoading.value = false
  }
}

// Debounce search
let debounceTimer: ReturnType<typeof setTimeout> | null = null
function debouncedSearch(): void {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    page.value = 1
    load()
  }, 400)
}

function onFilterChange(): void {
  page.value = 1
  load()
}

async function changePage(next: number): Promise<void> {
  page.value = next
  await load()
}

// Role change
async function onRoleChange(user: UserItem, newRole: UserRole): Promise<void> {
  if (newRole === user.role) return
  try {
    await apiFetch(`/admin/users/${user.id}/role`, {
      method: 'PUT',
      body: { role: newRole }
    })
    user.role = newRole
  } catch {
    // Revert is handled by Vue's reactive binding on reload
    await load()
  }
}

// Delete
function confirmDelete(user: UserItem): void {
  deleteDialog.targetId = user.id
  deleteDialog.open = true
}

async function doDelete(): Promise<void> {
  deleteDialog.isLoading = true
  try {
    await apiFetch(`/admin/users/${deleteDialog.targetId}`, { method: 'DELETE' })
    deleteDialog.open = false
    await load()
  } catch {
    deleteDialog.open = false
  } finally {
    deleteDialog.isLoading = false
  }
}

// Create
function openCreateModal(): void {
  createForm.name = ''
  createForm.emailOrPhone = ''
  createForm.password = ''
  createForm.role = 'staff'
  createErrors.name = ''
  createErrors.emailOrPhone = ''
  createErrors.password = ''
  createErrors.general = ''
  createModal.open = true
}

function validateCreate(): boolean {
  let valid = true
  createErrors.name = ''
  createErrors.emailOrPhone = ''
  createErrors.password = ''
  createErrors.general = ''

  if (!createForm.name.trim()) {
    createErrors.name = t('error.required')
    valid = false
  }
  if (!createForm.emailOrPhone.trim()) {
    createErrors.emailOrPhone = t('error.required')
    valid = false
  }
  if (createForm.password.length < 8) {
    createErrors.password = t('error.min_length', { min: 8 })
    valid = false
  }
  return valid
}

async function doCreate(): Promise<void> {
  if (!validateCreate()) return
  createModal.isLoading = true
  try {
    const isEmail = createForm.emailOrPhone.includes('@')
    const body: Record<string, string> = {
      name: createForm.name.trim(),
      password: createForm.password,
      role: createForm.role
    }
    if (isEmail) {
      body.email = createForm.emailOrPhone.trim()
    } else {
      body.phone = createForm.emailOrPhone.trim()
    }
    await apiFetch('/admin/users', { method: 'POST', body })
    createModal.open = false
    page.value = 1
    await load()
  } catch (err: unknown) {
    const msg = (err as { data?: { error?: { message?: string } } })?.data?.error?.message
    createErrors.general = msg ?? t('error.server_error')
  } finally {
    createModal.isLoading = false
  }
}

onMounted(load)
</script>
