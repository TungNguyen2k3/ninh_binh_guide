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

    <!-- Table wrapper — horizontal scroll on mobile -->
    <div class="bg-white rounded-2xl border border-gray-200 overflow-hidden">
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

      <!-- Table -->
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 text-sm">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                {{ $t('location.name_vi') }}
              </th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap hidden md:table-cell">
                {{ $t('location.slug') }}
              </th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap hidden lg:table-cell">
                {{ $t('location.coordinates') }}
              </th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                {{ $t('location.status') }}
              </th>
              <th class="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap hidden sm:table-cell">
                {{ $t('admin.audio_vi') }}
              </th>
              <th class="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap hidden sm:table-cell">
                {{ $t('admin.audio_en') }}
              </th>
              <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                {{ $t('common.actions') }}
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 bg-white">
            <tr v-for="loc in locationStore.locations" :key="loc.id" class="hover:bg-gray-50 transition-colors">
              <!-- Name -->
              <td class="px-4 py-3">
                <p class="font-medium text-gray-900 whitespace-nowrap">{{ loc.nameVi }}</p>
                <p class="text-xs text-gray-400 mt-0.5 whitespace-nowrap">{{ loc.nameEn }}</p>
              </td>

              <!-- Slug -->
              <td class="px-4 py-3 text-gray-500 hidden md:table-cell">
                <code class="text-xs bg-gray-100 rounded px-1.5 py-0.5">{{ loc.slug }}</code>
              </td>

              <!-- Coordinates -->
              <td class="px-4 py-3 text-gray-500 hidden lg:table-cell whitespace-nowrap">
                {{ loc.latitude.toFixed(4) }}, {{ loc.longitude.toFixed(4) }}
              </td>

              <!-- Status toggle -->
              <td class="px-4 py-3">
                <button
                  type="button"
                  :disabled="togglingId === loc.id"
                  class="flex items-center gap-1.5"
                  @click="handleToggleActive(loc)"
                >
                  <span
                    class="px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap"
                    :class="loc.isActive
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-500'"
                  >
                    {{ loc.isActive ? $t('common.active') : $t('common.inactive') }}
                  </span>
                </button>
              </td>

              <!-- Audio Vi -->
              <td class="px-4 py-3 text-center hidden sm:table-cell">
                <span v-if="loc.audioViUrl" class="text-green-500 font-bold">&#10003;</span>
                <span v-else class="text-gray-300">&#8212;</span>
              </td>

              <!-- Audio En -->
              <td class="px-4 py-3 text-center hidden sm:table-cell">
                <span v-if="loc.audioEnUrl" class="text-green-500 font-bold">&#10003;</span>
                <span v-else class="text-gray-300">&#8212;</span>
              </td>

              <!-- Actions -->
              <td class="px-4 py-3">
                <div class="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    class="text-brand-600 hover:text-brand-700 font-medium text-sm px-2 py-1 rounded-lg hover:bg-brand-50 transition-colors whitespace-nowrap"
                    @click="navigateTo(`/admin/locations/${loc.id}/edit`)"
                  >
                    {{ $t('common.edit') }}
                  </button>
                  <button
                    type="button"
                    class="text-red-600 hover:text-red-700 font-medium text-sm px-2 py-1 rounded-lg hover:bg-red-50 transition-colors whitespace-nowrap"
                    @click="confirmDelete(loc)"
                  >
                    {{ $t('common.delete') }}
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
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

// Initial load
await loadLocations()
</script>
