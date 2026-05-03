<template>
  <div class="space-y-3">
    <!-- Existing spots -->
    <div
      v-for="spot in spots"
      :key="spot.id"
      class="border border-gray-200 rounded-2xl p-4"
    >
      <!-- Spot header -->
      <div class="flex items-center justify-between">
        <h4 class="font-medium text-gray-900">{{ spot.nameVi }}</h4>
        <div class="flex gap-2">
          <button
            type="button"
            class="text-sm text-brand-600 hover:text-brand-700 transition-colors"
            @click="toggleExpand(spot.id)"
          >
            {{ expanded[spot.id] ? $t('common.close') : $t('common.edit') }}
          </button>
          <button
            type="button"
            class="text-sm text-red-500 hover:text-red-600 transition-colors"
            :disabled="deletingSpotId === spot.id"
            @click="handleDeleteSpot(spot.id)"
          >
            {{ deletingSpotId === spot.id ? '...' : $t('common.delete') }}
          </button>
        </div>
      </div>

      <!-- Expanded form -->
      <div v-if="expanded[spot.id]" class="mt-4 space-y-4">
        <!-- Language tab -->
        <div class="flex gap-2 border-b border-gray-100 pb-2">
          <button
            v-for="lang in (['vi', 'en'] as const)"
            :key="lang"
            type="button"
            class="px-3 py-1 text-sm rounded-lg transition-colors"
            :class="spotLang[spot.id] === lang
              ? 'bg-brand-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
            @click="spotLang[spot.id] = lang"
          >
            {{ lang === 'vi' ? 'Tiếng Việt' : 'English' }}
          </button>
        </div>

        <!-- Name fields -->
        <div v-if="spotLang[spot.id] !== 'en'" class="space-y-3">
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">{{ $t('admin.spot_name_vi') }}</label>
            <input
              v-model="editForms[spot.id].nameVi"
              type="text"
              class="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">{{ $t('admin.spot_description') }} (VI)</label>
            <textarea
              v-model="editForms[spot.id].descriptionVi"
              rows="3"
              class="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none"
            />
          </div>
        </div>

        <div v-if="spotLang[spot.id] === 'en'" class="space-y-3">
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">{{ $t('admin.spot_name_en') }}</label>
            <input
              v-model="editForms[spot.id].nameEn"
              type="text"
              class="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">{{ $t('admin.spot_description') }} (EN)</label>
            <textarea
              v-model="editForms[spot.id].descriptionEn"
              rows="3"
              class="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none"
            />
          </div>
        </div>

        <!-- Audio upload -->
        <div class="space-y-2">
          <h5 class="text-xs font-semibold text-gray-600 uppercase tracking-wide">Audio</h5>
          <AdminSpotAudioUpload
            :location-id="locationId"
            :spot-id="spot.id"
            :audio-vi-url="spot.audioViUrl ?? null"
            :audio-en-url="spot.audioEnUrl ?? null"
            @uploaded="emit('updated')"
          />
        </div>

        <!-- Spot images -->
        <div class="space-y-2">
          <h5 class="text-xs font-semibold text-gray-600 uppercase tracking-wide">{{ $t('admin.images_section') }}</h5>
          <AdminSpotImageUpload
            :location-id="locationId"
            :spot-id="spot.id"
            :images="spot.images"
            @uploaded="emit('updated')"
            @deleted="emit('updated')"
          />
        </div>

        <!-- Save button -->
        <button
          type="button"
          class="w-full py-2.5 rounded-xl bg-brand-600 text-white text-sm font-medium hover:bg-brand-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
          :disabled="savingSpotId === spot.id"
          @click="handleSaveSpot(spot.id)"
        >
          <svg
            v-if="savingSpotId === spot.id"
            class="animate-spin w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          {{ savingSpotId === spot.id ? $t('common.saving') : $t('admin.save_changes') }}
        </button>
      </div>
    </div>

    <!-- Add new spot form -->
    <div v-if="showNewSpotForm" class="border-2 border-brand-200 rounded-2xl p-4 space-y-3 bg-brand-50/30">
      <h4 class="text-sm font-semibold text-gray-800">{{ $t('admin.add_spot') }}</h4>
      <div>
        <label class="block text-xs font-medium text-gray-600 mb-1">{{ $t('admin.spot_name_vi') }} *</label>
        <input
          v-model="newSpot.nameVi"
          type="text"
          class="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
        />
      </div>
      <div>
        <label class="block text-xs font-medium text-gray-600 mb-1">{{ $t('admin.spot_name_en') }} *</label>
        <input
          v-model="newSpot.nameEn"
          type="text"
          class="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
        />
      </div>
      <div>
        <label class="block text-xs font-medium text-gray-600 mb-1">{{ $t('admin.spot_description') }} (VI)</label>
        <textarea
          v-model="newSpot.descriptionVi"
          rows="2"
          class="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none"
        />
      </div>
      <div>
        <label class="block text-xs font-medium text-gray-600 mb-1">{{ $t('admin.spot_description') }} (EN)</label>
        <textarea
          v-model="newSpot.descriptionEn"
          rows="2"
          class="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none"
        />
      </div>
      <div class="flex gap-2">
        <button
          type="button"
          class="flex-1 py-2.5 rounded-xl bg-brand-600 text-white text-sm font-medium hover:bg-brand-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
          :disabled="creatingSpot"
          @click="handleCreateSpot"
        >
          <svg
            v-if="creatingSpot"
            class="animate-spin w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          {{ creatingSpot ? $t('common.saving') : $t('common.save') }}
        </button>
        <button
          type="button"
          class="px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          @click="cancelNewSpot"
        >
          {{ $t('common.cancel') }}
        </button>
      </div>
    </div>

    <!-- Add spot button -->
    <button
      v-if="!showNewSpotForm"
      type="button"
      class="w-full py-3 border-2 border-dashed border-gray-300 rounded-2xl text-sm text-gray-500 hover:border-brand-400 hover:text-brand-600 transition-colors"
      @click="showNewSpotForm = true"
    >
      + {{ $t('admin.add_spot') }}
    </button>
  </div>
</template>

<script setup lang="ts">
export interface SpotImage {
  id: string
  url: string
}

export interface Spot {
  id: string
  nameVi: string
  nameEn: string
  descriptionVi: string | null
  descriptionEn: string | null
  audioViUrl: string | null
  audioEnUrl: string | null
  images: SpotImage[]
  order: number
}

interface SpotEditForm {
  nameVi: string
  nameEn: string
  descriptionVi: string
  descriptionEn: string
}

interface Props {
  locationId: string
  spots: Spot[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  updated: []
}>()

const { toast } = useToast()
const { t } = useI18n()
const { useApiFetch } = await import('~/utils/api')
const { apiFetch } = useApiFetch()

// Expand/collapse state per spot
const expanded = ref<Record<string, boolean>>({})
// Language tab per spot (default VI)
const spotLang = ref<Record<string, 'vi' | 'en'>>({})
// Edit form data per spot
const editForms = ref<Record<string, SpotEditForm>>({})

const savingSpotId = ref<string | null>(null)
const deletingSpotId = ref<string | null>(null)

// New spot form
const showNewSpotForm = ref(false)
const creatingSpot = ref(false)
const newSpot = ref({ nameVi: '', nameEn: '', descriptionVi: '', descriptionEn: '' })

// Initialize edit forms when spots change
watch(
  () => props.spots,
  (newSpots) => {
    for (const spot of newSpots) {
      if (!editForms.value[spot.id]) {
        editForms.value[spot.id] = {
          nameVi: spot.nameVi,
          nameEn: spot.nameEn,
          descriptionVi: spot.descriptionVi ?? '',
          descriptionEn: spot.descriptionEn ?? ''
        }
      }
      if (!(spot.id in spotLang.value)) {
        spotLang.value[spot.id] = 'vi'
      }
    }
  },
  { immediate: true }
)

function toggleExpand(spotId: string): void {
  expanded.value[spotId] = !expanded.value[spotId]
  // Reset form to current values when opening
  if (expanded.value[spotId]) {
    const spot = props.spots.find((s) => s.id === spotId)
    if (spot) {
      editForms.value[spotId] = {
        nameVi: spot.nameVi,
        nameEn: spot.nameEn,
        descriptionVi: spot.descriptionVi ?? '',
        descriptionEn: spot.descriptionEn ?? ''
      }
    }
  }
}

async function handleSaveSpot(spotId: string): Promise<void> {
  const form = editForms.value[spotId]
  if (!form) return
  savingSpotId.value = spotId
  try {
    await apiFetch(`/admin/locations/${props.locationId}/spots/${spotId}`, {
      method: 'PUT',
      body: form
    })
    toast.success(t('admin.update_success'))
    emit('updated')
    expanded.value[spotId] = false
  } catch {
    toast.error(t('error.server_error'))
  } finally {
    savingSpotId.value = null
  }
}

async function handleDeleteSpot(spotId: string): Promise<void> {
  deletingSpotId.value = spotId
  try {
    await apiFetch(`/admin/locations/${props.locationId}/spots/${spotId}`, {
      method: 'DELETE'
    })
    emit('updated')
  } catch {
    toast.error(t('error.server_error'))
  } finally {
    deletingSpotId.value = null
  }
}

async function handleCreateSpot(): Promise<void> {
  if (!newSpot.value.nameVi.trim() || !newSpot.value.nameEn.trim()) {
    toast.error(t('error.required'))
    return
  }
  creatingSpot.value = true
  try {
    await apiFetch(`/admin/locations/${props.locationId}/spots`, {
      method: 'POST',
      body: {
        nameVi: newSpot.value.nameVi.trim(),
        nameEn: newSpot.value.nameEn.trim(),
        descriptionVi: newSpot.value.descriptionVi.trim() || undefined,
        descriptionEn: newSpot.value.descriptionEn.trim() || undefined
      }
    })
    toast.success(t('admin.create_success'))
    emit('updated')
    cancelNewSpot()
  } catch {
    toast.error(t('error.server_error'))
  } finally {
    creatingSpot.value = false
  }
}

function cancelNewSpot(): void {
  showNewSpotForm.value = false
  newSpot.value = { nameVi: '', nameEn: '', descriptionVi: '', descriptionEn: '' }
}
</script>
