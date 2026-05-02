<template>
  <div class="max-w-2xl space-y-6">
    <!-- Header -->
    <div class="flex items-center gap-3">
      <button
        type="button"
        class="text-gray-400 hover:text-gray-600 transition-colors"
        @click="navigateTo('/admin/packages')"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <div>
        <h1 class="text-2xl font-bold text-gray-900">{{ $t('admin.assign_locations') }}</h1>
        <p v-if="packageStore.current" class="text-sm text-gray-500 mt-0.5">
          {{ packageStore.current.name }}
        </p>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="flex justify-center items-center py-16">
      <svg class="animate-spin h-6 w-6 text-brand-600" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
    </div>

    <template v-else-if="packageStore.current">
      <!-- All-locations notice -->
      <div
        v-if="packageStore.current.type === 'all_locations'"
        class="bg-blue-50 border border-blue-200 rounded-2xl p-5 flex gap-3"
      >
        <svg class="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="text-sm text-blue-700">{{ $t('admin.package_all_locations_note') }}</p>
      </div>

      <!-- Custom package: multi-select -->
      <template v-else>
        <!-- Search filter -->
        <AppInput
          v-model="searchFilter"
          type="search"
          :placeholder="$t('common.search_placeholder')"
          class="max-w-xs"
        />

        <div class="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <!-- Empty locations list -->
          <div v-if="filteredLocations.length === 0" class="py-12 text-center text-sm text-gray-500">
            {{ $t('admin.no_locations') }}
          </div>

          <!-- Checkbox list -->
          <div v-else class="divide-y divide-gray-100">
            <!-- Select all -->
            <div class="flex items-center gap-3 px-4 py-3 bg-gray-50">
              <input
                id="select-all"
                type="checkbox"
                class="w-4 h-4 accent-brand-600"
                :checked="isAllSelected"
                :indeterminate="isSomeSelected"
                @change="toggleSelectAll"
              />
              <label for="select-all" class="text-sm font-medium text-gray-700 cursor-pointer select-none">
                {{ isAllSelected ? 'Bỏ chọn tất cả' : 'Chọn tất cả' }}
                <span class="text-gray-400">({{ selectedIds.length }}/{{ filteredLocations.length }})</span>
              </label>
            </div>

            <div
              v-for="loc in filteredLocations"
              :key="loc.id"
              class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
            >
              <input
                :id="`loc-${loc.id}`"
                v-model="selectedIds"
                type="checkbox"
                :value="loc.id"
                class="w-4 h-4 accent-brand-600 flex-shrink-0"
              />
              <label :for="`loc-${loc.id}`" class="flex-1 min-w-0 cursor-pointer select-none">
                <p class="text-sm font-medium text-gray-900 truncate">{{ loc.nameVi }}</p>
                <p class="text-xs text-gray-500 truncate">{{ loc.nameEn }}</p>
              </label>
              <span
                class="px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0"
                :class="loc.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'"
              >
                {{ loc.isActive ? $t('common.active') : $t('common.inactive') }}
              </span>
            </div>
          </div>
        </div>

        <!-- Save button -->
        <div class="flex justify-end gap-3">
          <AppButton
            variant="secondary"
            @click="navigateTo('/admin/packages')"
          >
            {{ $t('common.cancel') }}
          </AppButton>
          <AppButton :loading="isSaving" @click="handleSave">
            {{ isSaving ? $t('common.saving') : $t('admin.save_changes') }}
          </AppButton>
        </div>
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { Location } from '~/stores/location.store'

definePageMeta({ layout: 'admin' })
const { t } = useI18n()
useHead({ title: () => t('admin.assign_locations') })

const route = useRoute()
const packageStore = usePackageStore()
const locationStore = useLocationStore()
const { toast } = useToast()

const isLoading = ref(true)
const isSaving = ref(false)
const searchFilter = ref('')
const selectedIds = ref<string[]>([])

const filteredLocations = computed<Location[]>(() => {
  const q = searchFilter.value.trim().toLowerCase()
  if (!q) return locationStore.locations
  return locationStore.locations.filter(
    (l) =>
      l.nameVi.toLowerCase().includes(q) ||
      l.nameEn.toLowerCase().includes(q) ||
      l.slug.includes(q)
  )
})

const isAllSelected = computed(
  () =>
    filteredLocations.value.length > 0 &&
    filteredLocations.value.every((l) => selectedIds.value.includes(l.id))
)

const isSomeSelected = computed(
  () =>
    filteredLocations.value.some((l) => selectedIds.value.includes(l.id)) &&
    !isAllSelected.value
)

function toggleSelectAll(): void {
  if (isAllSelected.value) {
    // Deselect all filtered
    const filteredIds = filteredLocations.value.map((l) => l.id)
    selectedIds.value = selectedIds.value.filter((id) => !filteredIds.includes(id))
  } else {
    // Select all filtered (merge with existing)
    const filteredIds = filteredLocations.value.map((l) => l.id)
    const merged = new Set([...selectedIds.value, ...filteredIds])
    selectedIds.value = Array.from(merged)
  }
}

async function handleSave(): Promise<void> {
  isSaving.value = true
  try {
    await packageStore.assignLocations(route.params.id as string, selectedIds.value)
    toast.success(t('admin.update_success'))
    await navigateTo('/admin/packages')
  } catch {
    toast.error(t('error.server_error'))
  } finally {
    isSaving.value = false
  }
}

// Load both package and all locations
const pkgId = route.params.id as string
try {
  await Promise.all([
    packageStore.fetchOne(pkgId),
    locationStore.fetchList({ limit: 200 })
  ])

  // Pre-fill selected ids from current package locations
  if (packageStore.current) {
    selectedIds.value = packageStore.current.locations.map((pl) => pl.location.id)
  }
} finally {
  isLoading.value = false
}
</script>
