<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-900">Lịch trình tour</h1>
      <AppButton @click="navigateTo('/admin/tours/new')">+ Thêm tour</AppButton>
    </div>

    <div v-if="tourStore.isLoading" class="space-y-3">
      <div v-for="i in 3" :key="i" class="h-20 bg-gray-100 rounded-2xl animate-pulse" />
    </div>

    <div v-else-if="tourStore.tours.length === 0"
      class="flex flex-col items-center justify-center py-16 text-center">
      <div class="text-5xl mb-3">🗺️</div>
      <p class="text-sm text-gray-500">{{ $t('admin.no_tours') }}</p>
      <AppButton class="mt-4" @click="navigateTo('/admin/tours/new')">{{ $t('admin.add_tour') }}</AppButton>
    </div>

    <div v-else class="space-y-3">
      <div v-for="tour in tourStore.tours" :key="tour.id"
        class="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-sm transition-shadow">

        <!-- Main row -->
        <div class="flex items-start gap-3 px-4 pt-4 pb-3">
          <!-- Order badge -->
          <span class="mt-0.5 w-7 h-7 rounded-full bg-gray-100 text-gray-600 text-xs font-bold flex items-center justify-center flex-shrink-0">
            {{ tour.displayOrder }}
          </span>

          <!-- Info -->
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between gap-2">
              <div class="min-w-0">
                <p class="font-bold text-gray-900 leading-tight">{{ tour.nameVi }}</p>
                <p class="text-xs text-gray-400 mt-0.5 truncate">{{ tour.nameEn }}</p>
              </div>
              <!-- Active toggle — top right -->
              <button type="button"
                class="flex-shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-colors mt-0.5"
                :class="tour.isActive
                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'"
                @click="toggleActive(tour)">
                <span class="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  :class="tour.isActive ? 'bg-green-500' : 'bg-gray-400'" />
                {{ tour.isActive ? $t('common.active') : $t('common.inactive') }}
              </button>
            </div>

            <!-- Meta chips -->
            <div class="flex items-center gap-2 mt-2 flex-wrap">
              <span class="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded-full">
                🕐 {{ tour.duration }}
              </span>
              <span class="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded-full">
                📍 {{ tour.stops.length }} điểm dừng
              </span>
              <span v-if="tour.badgeVi"
                class="inline-flex items-center text-xs font-medium bg-brand-50 text-brand-700 border border-brand-200 px-2 py-0.5 rounded-full">
                {{ tour.badgeVi }}
              </span>
            </div>
          </div>
        </div>

        <!-- Action bar -->
        <div class="flex border-t border-gray-100 divide-x divide-gray-100">
          <button type="button"
            class="flex-1 py-2.5 text-xs font-medium text-brand-600 hover:bg-brand-50 transition-colors flex items-center justify-center gap-1.5"
            @click="navigateTo(`/admin/tours/${tour.id}/edit`)">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            {{ $t('common.edit') }}
          </button>
          <button type="button"
            class="flex-1 py-2.5 text-xs font-medium text-red-500 hover:bg-red-50 transition-colors flex items-center justify-center gap-1.5"
            @click="confirmDelete(tour)">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            {{ $t('common.delete') }}
          </button>
        </div>
      </div>
    </div>

    <AppConfirm
      :open="!!deletingTour"
      :title="$t('admin.delete_tour_title')"
      :message="deletingTour ? `${deletingTour.nameVi} — ${$t('common.delete_confirm_message')}` : ''"
      :is-loading="isDeleting"
      @confirm="doDelete"
      @cancel="deletingTour = null"
    />
  </div>
</template>

<script setup lang="ts">
import type { Tour } from '~/stores/tour.store'

definePageMeta({ layout: 'admin' })
const { t } = useI18n()
useHead({ title: () => 'Lịch trình tour' })

const tourStore = useTourStore()
const { toast } = useToast()

const deletingTour = ref<Tour | null>(null)
const isDeleting = ref(false)

function confirmDelete(tour: Tour) { deletingTour.value = tour }

async function doDelete() {
  if (!deletingTour.value) return
  isDeleting.value = true
  try {
    await tourStore.remove(deletingTour.value.id)
    toast.success(t('admin.delete_success'))
    deletingTour.value = null
  } catch { toast.error(t('error.server_error')) }
  finally { isDeleting.value = false }
}

async function toggleActive(tour: Tour) {
  try {
    await tourStore.update(tour.id, { isActive: !tour.isActive })
  } catch { toast.error(t('error.server_error')) }
}

onMounted(() => tourStore.fetchList())
</script>
