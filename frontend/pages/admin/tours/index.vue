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
        class="bg-white rounded-2xl border border-gray-200 p-4 flex items-center gap-4">
        <!-- Order + active -->
        <div class="flex-shrink-0 text-center">
          <span class="text-xs text-gray-400 block">{{ $t('location.display_order') }}</span>
          <span class="text-lg font-bold text-gray-700">{{ tour.displayOrder }}</span>
        </div>

        <!-- Info -->
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 flex-wrap">
            <p class="font-semibold text-gray-900 text-sm">{{ tour.nameVi }}</p>
            <span v-if="tour.badgeVi"
              class="text-[10px] font-medium bg-brand-100 text-brand-700 px-2 py-0.5 rounded-full">
              {{ tour.badgeVi }}
            </span>
          </div>
          <p class="text-xs text-gray-400 mt-0.5">{{ tour.nameEn }} · {{ tour.duration }} · {{ tour.stops.length }} điểm dừng</p>
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-2 flex-shrink-0">
          <!-- Toggle active -->
          <button type="button"
            class="px-2.5 py-1 rounded-full text-xs font-medium transition-colors"
            :class="tour.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'"
            @click="toggleActive(tour)">
            {{ tour.isActive ? $t('common.active') : $t('common.inactive') }}
          </button>
          <AppButton variant="secondary" size="sm" @click="navigateTo(`/admin/tours/${tour.id}/edit`)">
            {{ $t('common.edit') }}
          </AppButton>
          <AppButton variant="danger" size="sm" @click="confirmDelete(tour)">
            {{ $t('common.delete') }}
          </AppButton>
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
