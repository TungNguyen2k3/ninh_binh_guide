<template>
  <div class="space-y-3">
    <div class="flex items-center justify-between">
      <p class="text-xs text-gray-500">{{ stops.length }} điểm dừng</p>
      <button type="button"
        class="inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors disabled:opacity-50"
        :disabled="adding"
        @click="openAddStop">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        {{ $t('admin.add_stop') }}
      </button>
    </div>

    <!-- Add stop panel -->
    <div v-if="showAddPanel" class="border-2 border-brand-300 rounded-2xl p-4 bg-brand-50/30 space-y-3">
      <h4 class="text-sm font-semibold text-brand-700">Thêm điểm dừng mới</h4>
      <div class="flex flex-col gap-1">
        <label class="text-xs font-medium text-gray-600">Chọn địa điểm *</label>
        <select v-model="newStop.locationId"
          class="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400">
          <option value="" disabled>-- Chọn địa điểm --</option>
          <option v-for="loc in locations" :key="loc.id" :value="loc.id">{{ loc.nameVi }}</option>
        </select>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div class="flex flex-col gap-1">
          <label class="text-xs font-medium text-gray-600">Giờ gợi ý</label>
          <input v-model="newStop.suggestedTime" type="text" placeholder="7:30"
            class="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" />
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-xs font-medium text-gray-600">Thời gian</label>
          <input v-model="newStop.suggestedDuration" type="text" placeholder="2h"
            class="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" />
        </div>
      </div>
      <div class="flex flex-col gap-1">
        <label class="text-xs font-medium text-gray-600">Ghi chú (VI)</label>
        <textarea v-model="newStop.noteVi" rows="2" placeholder="Tham quan đền vua Đinh..."
          class="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none" />
      </div>
      <div class="flex flex-col gap-1">
        <label class="text-xs font-medium text-gray-600">Ghi chú (EN)</label>
        <textarea v-model="newStop.noteEn" rows="2" placeholder="Visit Dinh King temple..."
          class="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none" />
      </div>
      <div class="flex gap-3">
        <AppButton variant="secondary" class="flex-1" @click="showAddPanel = false">Hủy</AppButton>
        <AppButton class="flex-1" :loading="adding" @click="doAddStop">Thêm điểm dừng</AppButton>
      </div>
    </div>

    <!-- Existing stops -->
    <div v-for="stop in sortedStops" :key="stop.id"
      class="border border-gray-200 rounded-2xl overflow-hidden hover:shadow-sm transition-shadow">
      <!-- Header -->
      <button type="button"
        class="w-full flex items-center gap-3 p-4 text-left hover:bg-gray-50 transition-colors"
        @click="toggleExpand(stop.id)">
        <!-- Order input -->
        <input type="number" min="1" :max="sortedStops.length" :value="sortedStops.indexOf(stop) + 1"
          :disabled="reorderingId === stop.id"
          class="w-10 h-7 text-center text-xs font-semibold rounded-lg border border-gray-200 bg-white text-gray-700 outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-200 disabled:opacity-50 transition-colors flex-shrink-0"
          @click.stop
          @keydown.enter.stop="($event.target as HTMLInputElement).blur()"
          @blur.stop="setOrder(stop.id, +($event.target as HTMLInputElement).value)" />

        <!-- Location name -->
        <div class="flex-1 min-w-0">
          <p class="font-medium text-gray-900 text-sm truncate">{{ stop.location.nameVi }}</p>
          <p class="text-xs text-gray-400 truncate">
            {{ stop.suggestedTime ? `🕐 ${stop.suggestedTime}` : '' }}
            {{ stop.suggestedDuration ? `· ⏱ ${stop.suggestedDuration}` : '' }}
          </p>
        </div>

        <!-- Delete + chevron -->
        <div class="flex items-center gap-2 flex-shrink-0">
          <button type="button"
            class="text-xs text-red-400 hover:text-red-600 px-2 py-1 rounded-lg hover:bg-red-50 transition-colors"
            :disabled="deletingStopId === stop.id"
            @click.stop="doDeleteStop(stop.id)">
            {{ deletingStopId === stop.id ? '...' : $t('common.delete') }}
          </button>
          <svg class="w-4 h-4 text-gray-400 transition-transform"
            :class="expanded[stop.id] ? 'rotate-180' : ''"
            fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      <!-- Expanded edit form -->
      <div v-if="expanded[stop.id]" class="border-t border-gray-100 p-4 space-y-3 bg-gray-50/30">
        <div class="grid grid-cols-2 gap-3">
          <div class="flex flex-col gap-1">
            <label class="text-xs font-medium text-gray-600">Giờ gợi ý</label>
            <input v-model="editForms[stop.id].suggestedTime" type="text" placeholder="7:30"
              class="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-xs font-medium text-gray-600">Thời gian</label>
            <input v-model="editForms[stop.id].suggestedDuration" type="text" placeholder="2h"
              class="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" />
          </div>
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-xs font-medium text-gray-600">Ghi chú (VI)</label>
          <textarea v-model="editForms[stop.id].noteVi" rows="2"
            class="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none" />
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-xs font-medium text-gray-600">Ghi chú (EN)</label>
          <textarea v-model="editForms[stop.id].noteEn" rows="2"
            class="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none" />
        </div>
        <div class="flex justify-end">
          <AppButton size="sm" :loading="savingStopId === stop.id" @click="doSaveStop(stop.id)">
            {{ $t('admin.save_changes') }}
          </AppButton>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-if="stops.length === 0 && !showAddPanel"
      class="py-8 border-2 border-dashed border-gray-200 rounded-2xl text-center text-sm text-gray-400">
      Chưa có điểm dừng nào. Nhấn "+ Thêm điểm dừng" để bắt đầu.
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TourStop } from '~/stores/tour.store'

interface Props { tourId: string; stops: TourStop[] }
const props = defineProps<Props>()
const emit = defineEmits<{ updated: [] }>()

const { toast } = useToast()
const { t } = useI18n()
const tourStore = useTourStore()

// Locations for dropdown
const locations = ref<{ id: string; nameVi: string; nameEn: string }[]>([])

// Add stop state
const showAddPanel = ref(false)
const adding = ref(false)
const newStop = ref({ locationId: '', suggestedTime: '', suggestedDuration: '', noteVi: '', noteEn: '' })

// Expand/collapse
const expanded = ref<Record<string, boolean>>({})
const editForms = ref<Record<string, { suggestedTime: string; suggestedDuration: string; noteVi: string; noteEn: string }>>({})
const savingStopId = ref<string | null>(null)
const deletingStopId = ref<string | null>(null)
const reorderingId = ref<string | null>(null)

const sortedStops = computed(() => [...props.stops].sort((a, b) => a.order - b.order))

watch(() => props.stops, (newStops) => {
  for (const stop of newStops) {
    if (!editForms.value[stop.id]) {
      editForms.value[stop.id] = {
        suggestedTime: stop.suggestedTime ?? '',
        suggestedDuration: stop.suggestedDuration ?? '',
        noteVi: stop.noteVi ?? '',
        noteEn: stop.noteEn ?? '',
      }
    }
  }
}, { immediate: true })

function toggleExpand(stopId: string) {
  expanded.value[stopId] = !expanded.value[stopId]
}

async function openAddStop() {
  showAddPanel.value = true
  if (locations.value.length === 0) {
    const { apiFetch } = useApiFetch()
    const res = await apiFetch<{ success: true; data: typeof locations.value }>('/admin/locations?limit=100')
    locations.value = res.data
  }
}

async function doAddStop() {
  if (!newStop.value.locationId) { toast.error(t('error.required')); return }
  adding.value = true
  try {
    await tourStore.addStop(props.tourId, {
      locationId: newStop.value.locationId,
      order: props.stops.length,
      suggestedTime: newStop.value.suggestedTime || undefined,
      suggestedDuration: newStop.value.suggestedDuration || undefined,
      noteVi: newStop.value.noteVi || undefined,
      noteEn: newStop.value.noteEn || undefined,
    })
    newStop.value = { locationId: '', suggestedTime: '', suggestedDuration: '', noteVi: '', noteEn: '' }
    showAddPanel.value = false
    toast.success(t('admin.create_success'))
    emit('updated')
  } catch { toast.error(t('error.server_error')) }
  finally { adding.value = false }
}

async function doSaveStop(stopId: string) {
  const form = editForms.value[stopId]
  if (!form) return
  savingStopId.value = stopId
  try {
    await tourStore.updateStop(props.tourId, stopId, {
      suggestedTime: form.suggestedTime || undefined,
      suggestedDuration: form.suggestedDuration || undefined,
      noteVi: form.noteVi || undefined,
      noteEn: form.noteEn || undefined,
    })
    toast.success(t('admin.update_success'))
    emit('updated')
  } catch { toast.error(t('error.server_error')) }
  finally { savingStopId.value = null }
}

async function doDeleteStop(stopId: string) {
  deletingStopId.value = stopId
  try {
    await tourStore.removeStop(props.tourId, stopId)
    emit('updated')
  } catch { toast.error(t('error.server_error')) }
  finally { deletingStopId.value = null }
}

async function setOrder(stopId: string, newPos: number) {
  const list = sortedStops.value
  const clampedPos = Math.max(1, Math.min(newPos, list.length))
  const currentIdx = list.findIndex(s => s.id === stopId)
  if (currentIdx === -1 || currentIdx + 1 === clampedPos) return
  reorderingId.value = stopId
  try {
    const reordered = [...list]
    const [moved] = reordered.splice(currentIdx, 1)
    reordered.splice(clampedPos - 1, 0, moved)
    await tourStore.reorderStops(props.tourId, reordered.map((s, i) => ({ id: s.id, order: i })))
    emit('updated')
  } catch { toast.error(t('error.server_error')) }
  finally { reorderingId.value = null }
}
</script>
