<template>
  <div class="space-y-3">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <p class="text-xs text-gray-500">{{ spots.length + draftSpots.length }} {{ $t('admin.spots_count') }}</p>
      <button type="button"
        class="inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors disabled:opacity-50"
        :disabled="creatingNew"
        @click="addDraftSpot">
        <svg v-if="creatingNew" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        {{ $t('admin.add_spot') }}
      </button>
    </div>

    <!-- Draft spots — newly created, full form visible immediately -->
    <div v-for="draft in draftSpots" :key="draft.id"
      class="border-2 border-brand-300 rounded-2xl overflow-hidden bg-white">

      <!-- Draft header -->
      <div class="flex items-center justify-between px-4 py-3 bg-brand-50 border-b border-brand-100">
        <span class="text-sm font-semibold text-brand-700 flex items-center gap-1.5">
          ✏️ {{ $t('admin.new_spot') }}
        </span>
        <button type="button"
          class="text-xs text-red-400 hover:text-red-600 transition-colors"
          @click="deleteDraft(draft.id)">
          {{ $t('common.cancel') }} & Xóa
        </button>
      </div>

      <div class="p-4 space-y-4">
        <!-- Name fields (side by side) -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">{{ $t('admin.spot_name_vi') }} *</label>
            <input v-model="draft.nameVi" type="text" :placeholder="$t('admin.spot_name_vi')"
              class="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">{{ $t('admin.spot_name_en') }} *</label>
            <input v-model="draft.nameEn" type="text" :placeholder="$t('admin.spot_name_en')"
              class="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" />
          </div>
        </div>

        <!-- Description (VI/EN tabs) -->
        <div>
          <div class="flex gap-1 bg-gray-100 rounded-lg p-0.5 w-fit mb-2">
            <button v-for="lang in (['vi', 'en'] as const)" :key="lang" type="button"
              class="px-3 py-1 text-xs font-medium rounded-md transition-colors"
              :class="draft.descLang === lang ? 'bg-white text-brand-700 shadow-sm' : 'text-gray-500'"
              @click="draft.descLang = lang">
              {{ lang === 'vi' ? 'Tiếng Việt' : 'English' }}
            </button>
          </div>
          <textarea v-if="draft.descLang === 'vi'" v-model="draft.descriptionVi" rows="3"
            :placeholder="$t('admin.spot_description') + ' (VI)...'"
            class="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none" />
          <textarea v-else v-model="draft.descriptionEn" rows="3"
            :placeholder="$t('admin.spot_description') + ' (EN)...'"
            class="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none" />
        </div>

        <!-- Images -->
        <div>
          <h5 class="text-xs font-semibold text-gray-600 mb-2">🖼 {{ $t('admin.images_section') }}</h5>
          <AdminSpotImageUpload
            :location-id="locationId"
            :spot-id="draft.id"
            :images="draft.images"
            @uploaded="refreshDraft(draft.id)"
            @deleted="refreshDraft(draft.id)"
          />
        </div>

        <!-- Audio -->
        <div>
          <h5 class="text-xs font-semibold text-gray-600 mb-2">🎧 {{ $t('admin.audio_vi') }} / {{ $t('admin.audio_en') }}</h5>
          <AdminSpotAudioUpload
            :location-id="locationId"
            :spot-id="draft.id"
            :audio-vi-url="draft.audioViUrl"
            :audio-en-url="draft.audioEnUrl"
            @uploaded="refreshDraft(draft.id)"
          />
        </div>

        <!-- Single save button at bottom -->
        <AppButton :loading="draft.saving" class="w-full" @click="saveDraft(draft.id)">
          {{ draft.saving ? $t('common.saving') : $t('admin.save_spot') }}
        </AppButton>
      </div>
    </div>

    <!-- Saved spots -->
    <div v-for="spot in spots" :key="spot.id"
      class="border border-gray-200 rounded-2xl overflow-hidden hover:shadow-sm transition-shadow">

      <!-- Collapsed header -->
      <button type="button"
        class="w-full flex items-center gap-3 p-4 text-left hover:bg-gray-50 transition-colors"
        @click="toggleExpand(spot.id)">
        <div class="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 flex items-center justify-center">
          <img v-if="spot.images?.[0]" :src="spot.images[0].url" class="w-full h-full object-cover" />
          <span v-else class="text-xl">📍</span>
        </div>
        <div class="flex-1 min-w-0">
          <p class="font-medium text-gray-900 text-sm truncate">{{ spot.nameVi }}</p>
          <p class="text-xs text-gray-400 truncate">{{ spot.nameEn }}</p>
          <div class="flex gap-1.5 mt-1.5 flex-wrap">
            <span v-if="spot.images?.length"
              class="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-full">
              🖼 {{ spot.images.length }} ảnh
            </span>
            <span v-if="spot.audioViUrl" class="text-[10px] bg-green-50 text-green-600 px-1.5 py-0.5 rounded-full">🎧 VI</span>
            <span v-if="spot.audioEnUrl" class="text-[10px] bg-purple-50 text-purple-600 px-1.5 py-0.5 rounded-full">🎧 EN</span>
            <span v-if="!spot.images?.length && !spot.audioViUrl && !spot.audioEnUrl"
              class="text-[10px] bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded-full">⚠ Chưa có ảnh/audio</span>
          </div>
        </div>
        <div class="flex items-center gap-2 flex-shrink-0">
          <button type="button"
            class="text-xs text-red-400 hover:text-red-600 px-2 py-1 rounded-lg hover:bg-red-50 transition-colors"
            :disabled="deletingSpotId === spot.id"
            @click.stop="handleDeleteSpot(spot.id)">
            {{ deletingSpotId === spot.id ? '...' : $t('common.delete') }}
          </button>
          <svg class="w-4 h-4 text-gray-400 transition-transform"
            :class="expanded[spot.id] ? 'rotate-180' : ''"
            fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      <!-- Expanded edit -->
      <div v-if="expanded[spot.id]" class="border-t border-gray-100 p-4 space-y-4 bg-gray-50/30">
        <!-- Name fields -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">{{ $t('admin.spot_name_vi') }} *</label>
            <input v-model="editForms[spot.id].nameVi" type="text"
              class="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">{{ $t('admin.spot_name_en') }} *</label>
            <input v-model="editForms[spot.id].nameEn" type="text"
              class="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" />
          </div>
        </div>

        <!-- Description tabs -->
        <div>
          <div class="flex gap-1 bg-white rounded-lg border border-gray-200 p-0.5 w-fit mb-2">
            <button v-for="lang in (['vi', 'en'] as const)" :key="lang" type="button"
              class="px-3 py-1 text-xs font-medium rounded-md transition-colors"
              :class="spotLang[spot.id] === lang ? 'bg-brand-600 text-white' : 'text-gray-500'"
              @click="spotLang[spot.id] = lang">
              {{ lang === 'vi' ? 'Tiếng Việt' : 'English' }}
            </button>
          </div>
          <textarea v-if="spotLang[spot.id] === 'vi'" v-model="editForms[spot.id].descriptionVi" rows="3"
            class="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none" />
          <textarea v-else v-model="editForms[spot.id].descriptionEn" rows="3"
            class="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none" />
        </div>

        <!-- Images -->
        <div>
          <h5 class="text-xs font-semibold text-gray-600 mb-2">🖼 Hình ảnh khu vực</h5>
          <AdminSpotImageUpload
            :location-id="locationId"
            :spot-id="spot.id"
            :images="spot.images"
            @uploaded="emit('updated')"
            @deleted="emit('updated')"
          />
        </div>

        <!-- Audio -->
        <div>
          <h5 class="text-xs font-semibold text-gray-600 mb-2">🎧 Audio thuyết minh</h5>
          <AdminSpotAudioUpload
            :location-id="locationId"
            :spot-id="spot.id"
            :audio-vi-url="spot.audioViUrl ?? null"
            :audio-en-url="spot.audioEnUrl ?? null"
            @uploaded="emit('updated')"
          />
        </div>

        <!-- Save text fields -->
        <div class="flex justify-end pt-1">
          <AppButton size="sm" :loading="savingSpotId === spot.id" @click="handleSaveSpot(spot.id)">
            {{ $t('admin.save_changes') }}
          </AppButton>
        </div>
      </div>
    </div>

    <!-- Add button at bottom -->
    <button type="button"
      class="w-full py-3 border-2 border-dashed border-gray-200 rounded-2xl text-sm text-gray-400 hover:border-brand-400 hover:text-brand-600 transition-colors flex items-center justify-center gap-2"
      :disabled="creatingNew"
      @click="addDraftSpot">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
      {{ $t('admin.add_spot') }}
    </button>
  </div>
</template>

<script setup lang="ts">
export interface SpotImage { id: string; url: string }
export interface Spot {
  id: string; nameVi: string; nameEn: string
  descriptionVi: string | null; descriptionEn: string | null
  audioViUrl: string | null; audioEnUrl: string | null
  images: SpotImage[]; order: number
}

interface DraftSpot {
  id: string
  nameVi: string; nameEn: string
  descriptionVi: string; descriptionEn: string
  descLang: 'vi' | 'en'
  audioViUrl: string | null; audioEnUrl: string | null
  images: SpotImage[]
  saving: boolean
}

interface Props { locationId: string; spots: Spot[] }
const props = defineProps<Props>()
const emit = defineEmits<{ updated: [] }>()

const { toast } = useToast()
const { t } = useI18n()
const config = useRuntimeConfig()
const authStore = useAuthStore()

function authHeaders(): Record<string, string> {
  return authStore.accessToken ? { Authorization: `Bearer ${authStore.accessToken}` } : {}
}
function apiUrl(path: string): string {
  return `${config.public.apiUrl}${path}`
}

// Draft spots: created in DB, waiting for user to fill name + save
const draftSpots = ref<DraftSpot[]>([])
const creatingNew = ref(false)

// Saved spots edit state
const expanded = ref<Record<string, boolean>>({})
const spotLang = ref<Record<string, 'vi' | 'en'>>({})
const editForms = ref<Record<string, { nameVi: string; nameEn: string; descriptionVi: string; descriptionEn: string }>>({})
const savingSpotId = ref<string | null>(null)
const deletingSpotId = ref<string | null>(null)

watch(() => props.spots, (newSpots) => {
  for (const spot of newSpots) {
    if (!editForms.value[spot.id]) {
      editForms.value[spot.id] = {
        nameVi: spot.nameVi, nameEn: spot.nameEn,
        descriptionVi: spot.descriptionVi ?? '',
        descriptionEn: spot.descriptionEn ?? '',
      }
    }
    if (!(spot.id in spotLang.value)) spotLang.value[spot.id] = 'vi'
  }
}, { immediate: true })

// Click "+ Add area" → create spot in DB immediately → show full form
async function addDraftSpot(): Promise<void> {
  creatingNew.value = true
  try {
    const res = await $fetch<{ success: true; data: Spot }>(
      apiUrl(`/admin/locations/${props.locationId}/spots`),
      {
        method: 'POST',
        headers: authHeaders(),
        body: { nameVi: 'Khu vực mới', nameEn: 'New area' },
      }
    )
    draftSpots.value.push({
      id: res.data.id,
      nameVi: '', nameEn: '',
      descriptionVi: '', descriptionEn: '',
      descLang: 'vi',
      audioViUrl: null, audioEnUrl: null,
      images: [],
      saving: false,
    })
  } catch { toast.error(t('error.server_error')) }
  finally { creatingNew.value = false }
}

// Save draft text fields (name/description)
async function saveDraft(draftId: string): Promise<void> {
  const draft = draftSpots.value.find(d => d.id === draftId)
  if (!draft) return
  if (!draft.nameVi.trim() || !draft.nameEn.trim()) {
    toast.error(t('error.required')); return
  }
  draft.saving = true
  try {
    await $fetch(apiUrl(`/admin/locations/${props.locationId}/spots/${draftId}`), {
      method: 'PUT',
      headers: authHeaders(),
      body: {
        nameVi: draft.nameVi.trim(), nameEn: draft.nameEn.trim(),
        descriptionVi: draft.descriptionVi.trim() || undefined,
        descriptionEn: draft.descriptionEn.trim() || undefined,
      },
    })
    const idx = draftSpots.value.findIndex(d => d.id === draftId)
    if (idx !== -1) draftSpots.value.splice(idx, 1)
    toast.success(t('admin.create_success'))
    emit('updated')
  } catch { toast.error(t('error.server_error')) }
  finally { if (draft) draft.saving = false }
}

// Delete draft (cancel)
async function deleteDraft(draftId: string): Promise<void> {
  try {
    await $fetch(apiUrl(`/admin/locations/${props.locationId}/spots/${draftId}`), {
      method: 'DELETE', headers: authHeaders()
    })
    const idx = draftSpots.value.findIndex(d => d.id === draftId)
    if (idx !== -1) draftSpots.value.splice(idx, 1)
    emit('updated')
  } catch { toast.error(t('error.server_error')) }
}

// Refresh draft data after image/audio upload
async function refreshDraft(draftId: string): Promise<void> {
  try {
    const res = await $fetch<{ success: true; data: Spot }>(
      apiUrl(`/admin/locations/${props.locationId}/spots/${draftId}`),
      { headers: authHeaders() }
    )
    const draft = draftSpots.value.find(d => d.id === draftId)
    if (draft) {
      draft.audioViUrl = res.data.audioViUrl
      draft.audioEnUrl = res.data.audioEnUrl
      draft.images = res.data.images ?? []
    }
  } catch { /* ignore */ }
}

function toggleExpand(spotId: string): void {
  expanded.value[spotId] = !expanded.value[spotId]
  if (expanded.value[spotId]) {
    const spot = props.spots.find(s => s.id === spotId)
    if (spot) {
      editForms.value[spotId] = {
        nameVi: spot.nameVi, nameEn: spot.nameEn,
        descriptionVi: spot.descriptionVi ?? '',
        descriptionEn: spot.descriptionEn ?? '',
      }
    }
  }
}

async function handleSaveSpot(spotId: string): Promise<void> {
  const form = editForms.value[spotId]
  if (!form) return
  savingSpotId.value = spotId
  try {
    await $fetch(apiUrl(`/admin/locations/${props.locationId}/spots/${spotId}`), {
      method: 'PUT', headers: authHeaders(), body: form
    })
    toast.success(t('admin.update_success'))
    emit('updated')
  } catch { toast.error(t('error.server_error')) }
  finally { savingSpotId.value = null }
}

async function handleDeleteSpot(spotId: string): Promise<void> {
  deletingSpotId.value = spotId
  try {
    await $fetch(apiUrl(`/admin/locations/${props.locationId}/spots/${spotId}`), {
      method: 'DELETE', headers: authHeaders()
    })
    emit('updated')
  } catch { toast.error(t('error.server_error')) }
  finally { deletingSpotId.value = null }
}
</script>
