<template>
  <div class="space-y-6">
    <!-- Page header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">{{ $t('nav.locations') }}</h1>
        <p class="text-sm text-gray-500 mt-0.5">{{ total }} địa điểm</p>
      </div>
      <AppButton @click="navigateTo('/admin/locations/new')">
        {{ $t('admin.add_location') }}
      </AppButton>
    </div>

    <!-- Search -->
    <div class="max-w-xs">
      <AppInput
        v-model="searchQuery"
        type="search"
        :placeholder="$t('common.search_placeholder')"
      />
    </div>

    <!-- Loading state -->
    <div v-if="locationStore.isLoading" class="flex justify-center items-center py-16">
      <svg class="animate-spin h-6 w-6 text-brand-600" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
    </div>

    <!-- Empty state -->
    <div v-else-if="locationStore.locations.length === 0" class="flex flex-col items-center justify-center py-16 text-center">
      <svg class="w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
      <p class="text-sm text-gray-500">{{ $t('admin.no_locations') }}</p>
    </div>

    <!-- Card list -->
    <div v-else class="space-y-2">
      <div
        v-for="loc in locationStore.locations"
        :key="loc.id"
        class="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-sm transition-shadow"
      >
        <!-- Main info row -->
        <div class="flex items-start gap-3 px-4 pt-3 pb-2">
          <!-- Name -->
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between gap-2">
              <div class="min-w-0">
                <p class="font-semibold text-gray-900 leading-tight truncate">{{ loc.nameVi }}</p>
                <p class="text-xs text-gray-400 mt-0.5 truncate">{{ loc.nameEn }}</p>
              </div>
              <!-- Status toggle -->
              <button
                type="button"
                :disabled="togglingId === loc.id"
                class="flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors mt-0.5 disabled:opacity-50"
                :class="loc.isActive ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'"
                @click="handleToggleActive(loc)"
              >
                <span class="w-1.5 h-1.5 rounded-full flex-shrink-0" :class="loc.isActive ? 'bg-green-500' : 'bg-gray-400'" />
                {{ loc.isActive ? $t('common.active') : $t('common.inactive') }}
              </button>
            </div>

            <!-- Meta row -->
            <div class="flex items-center gap-2 mt-1.5 flex-wrap">
              <code class="text-[10px] bg-gray-100 text-gray-500 rounded px-1.5 py-0.5 truncate max-w-[120px]">{{ loc.slug }}</code>
              <span class="text-[10px] flex items-center gap-1" :class="loc.audioViUrl ? 'text-green-600' : 'text-gray-300'">
                🎧 VI {{ loc.audioViUrl ? '✓' : '—' }}
              </span>
              <span class="text-[10px] flex items-center gap-1" :class="loc.audioEnUrl ? 'text-green-600' : 'text-gray-300'">
                🎧 EN {{ loc.audioEnUrl ? '✓' : '—' }}
              </span>
            </div>
          </div>
        </div>

        <!-- Action bar -->
        <div class="flex border-t border-gray-100 divide-x divide-gray-100">
          <button
            type="button"
            class="flex-1 py-2 text-xs font-medium text-brand-600 hover:bg-brand-50 transition-colors flex items-center justify-center gap-1.5"
            @click="navigateTo(`/admin/locations/${loc.id}/edit`)"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            {{ $t('common.edit') }}
          </button>
          <button
            type="button"
            class="flex-1 py-2 text-xs font-medium text-red-500 hover:bg-red-50 transition-colors flex items-center justify-center gap-1.5"
            @click="confirmDelete(loc)"
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
    <div
      v-if="totalPages > 1"
      class="flex items-center justify-between px-4 py-3 border-t border-gray-200"
    >
      <p class="text-sm text-gray-500">
        Trang {{ currentPage }} / {{ totalPages }}
      </p>
      <div class="flex gap-2">
        <AppButton
          variant="secondary"
          size="sm"
          :disabled="currentPage <= 1"
          @click="goToPage(currentPage - 1)"
        >
          {{ $t('common.prev') }}
        </AppButton>
        <AppButton
          variant="secondary"
          size="sm"
          :disabled="currentPage >= totalPages"
          @click="goToPage(currentPage + 1)"
        >
          {{ $t('common.next') }}
        </AppButton>
      </div>
    </div>

    <!-- Confirm delete modal -->
    <AppConfirm
      :open="!!deletingLocation"
      :title="$t('admin.delete_location_title')"
      :message="deletingLocation ? `${deletingLocation.nameVi} — ${$t('common.delete_confirm_message')}` : ''"
      :is-loading="isDeleting"
      @confirm="handleDelete"
      @cancel="deletingLocation = null"
    />
  </div>
</template>

<script setup lang="ts">
import type { Location } from '~/stores/location.store'

definePageMeta({ layout: 'admin' })
const { t } = useI18n()
useHead({ title: () => t('nav.locations') })

const locationStore = useLocationStore()
const { toast } = useToast()

const LIMIT = 20
const searchQuery = ref('')
const currentPage = ref(1)
const deletingLocation = ref<Location | null>(null)
const isDeleting = ref(false)
const togglingId = ref<string | null>(null)

const total = computed(() => locationStore.total)
const totalPages = computed(() => Math.ceil(total.value / LIMIT))

// Debounce search
let debounceTimer: ReturnType<typeof setTimeout> | null = null
watch(searchQuery, (val) => {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    currentPage.value = 1
    loadLocations()
  }, 400)
  // silence unused warning
  void val
})

async function loadLocations(): Promise<void> {
  await locationStore.fetchList({
    search: searchQuery.value || undefined,
    page: currentPage.value,
    limit: LIMIT
  })
}

function goToPage(page: number): void {
  currentPage.value = page
  loadLocations()
}

function confirmDelete(loc: Location): void {
  deletingLocation.value = loc
}

async function handleDelete(): Promise<void> {
  if (!deletingLocation.value) return
  isDeleting.value = true
  try {
    await locationStore.remove(deletingLocation.value.id)
    toast.success(t('admin.delete_success'))
    deletingLocation.value = null
  } catch {
    toast.error(t('error.server_error'))
  } finally {
    isDeleting.value = false
  }
}

async function handleToggleActive(loc: Location): Promise<void> {
  togglingId.value = loc.id
  try {
    await locationStore.toggleActive(loc.id, !loc.isActive)
  } catch {
    toast.error(t('error.server_error'))
  } finally {
    togglingId.value = null
  }
}

// Client-side only — SSR has no auth token
onMounted(loadLocations)
</script>
