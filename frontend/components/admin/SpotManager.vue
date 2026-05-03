<template>
  <div class="space-y-3">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <p class="text-xs text-gray-500">{{ spots.length }} {{ $t('admin.spots_count') }}</p>
      <button type="button"
        class="inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors"
        @click="addPendingSpot">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        {{ $t('admin.add_spot') }}
      </button>
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
              class="text-[10px] bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded-full">
              ⚠ Chưa có ảnh/audio
            </span>
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

      <!-- Expanded edit + upload -->
      <div v-if="expanded[spot.id]" class="border-t border-gray-100 bg-gray-50/50">
        <!-- Lang tabs -->
        <div class="flex gap-1 p-4 pb-0">
          <div class="flex gap-1 bg-white rounded-lg border border-gray-200 p-0.5">
            <button v-for="lang in (['vi', 'en'] as const)" :key="lang" type="button"
              class="px-3 py-1 text-xs font-medium rounded-md transition-colors"
              :class="spotLang[spot.id] === lang ? 'bg-brand-600 text-white' : 'text-gray-500'"
              @click="spotLang[spot.id] = lang">
              {{ lang === 'vi' ? 'Tiếng Việt' : 'English' }}
            </button>
          </div>
        </div>

        <!-- Text fields -->
        <div class="p-4 space-y-3">
          <template v-if="spotLang[spot.id] === 'vi'">
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1">{{ $t('admin.spot_name_vi') }} *</label>
              <input v-model="editForms[spot.id].nameVi" type="text"
                class="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1">{{ $t('admin.spot_description') }} (VI)</label>
              <textarea v-model="editForms[spot.id].descriptionVi" rows="3"
                class="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none" />
            </div>
          </template>
          <template v-else>
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1">{{ $t('admin.spot_name_en') }} *</label>
              <input v-model="editForms[spot.id].nameEn" type="text"
                class="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1">{{ $t('admin.spot_description') }} (EN)</label>
              <textarea v-model="editForms[spot.id].descriptionEn" rows="3"
                class="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none" />
            </div>
          </template>

          <!-- Save text fields -->
          <div class="flex justify-end">
            <AppButton size="sm" variant="secondary" :loading="savingSpotId === spot.id"
              @click="handleSaveSpot(spot.id)">
              {{ $t('common.save') }}
            </AppButton>
          </div>
        </div>

        <!-- Images section -->
        <div class="border-t border-gray-100 p-4">
          <h5 class="text-xs font-semibold text-gray-700 mb-3">🖼 Hình ảnh khu vực</h5>
          <AdminSpotImageUpload
            :location-id="locationId"
            :spot-id="spot.id"
            :images="spot.images"
            @uploaded="emit('updated')"
            @deleted="emit('updated')"
          />
        </div>

        <!-- Audio section -->
        <div class="border-t border-gray-100 p-4">
          <h5 class="text-xs font-semibold text-gray-700 mb-3">🎧 Audio thuyết minh</h5>
          <AdminSpotAudioUpload
            :location-id="locationId"
            :spot-id="spot.id"
            :audio-vi-url="spot.audioViUrl ?? null"
            :audio-en-url="spot.audioEnUrl ?? null"
            @uploaded="emit('updated')"
          />
        </div>
      </div>
    </div>

    <!-- Just-created spots (have spotId, waiting for parent reload) -->
    <!-- Shows upload sections immediately after creation -->
    <div v-for="jc in justCreatedSpots" :key="jc.id"
      class="border-2 border-green-300 rounded-2xl overflow-hidden bg-green-50/30">
      <div class="flex items-center gap-2 p-4 border-b border-green-100">
        <span class="text-green-600 text-lg">✅</span>
        <div class="flex-1">
          <p class="text-sm font-semibold text-gray-900">{{ jc.nameVi }}</p>
          <p class="text-xs text-green-600">Khu vực đã tạo — thêm ảnh và audio bên dưới</p>
        </div>
        <button type="button" class="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 border border-gray-200 rounded-lg bg-white"
          @click="doneJustCreated(jc.id)">
          Xong
        </button>
      </div>

      <!-- Images -->
      <div class="p-4">
        <h5 class="text-xs font-semibold text-gray-700 mb-3">🖼 Hình ảnh khu vực</h5>
        <AdminSpotImageUpload
          :location-id="locationId"
          :spot-id="jc.id"
          :images="jc.images"
          @uploaded="refreshJustCreated(jc.id)"
          @deleted="refreshJustCreated(jc.id)"
        />
      </div>

      <!-- Audio -->
      <div class="border-t border-green-100 p-4">
        <h5 class="text-xs font-semibold text-gray-700 mb-3">🎧 Audio thuyết minh</h5>
        <AdminSpotAudioUpload
          :location-id="locationId"
          :spot-id="jc.id"
          :audio-vi-url="jc.audioViUrl"
          :audio-en-url="jc.audioEnUrl"
          @uploaded="refreshJustCreated(jc.id)"
        />
      </div>
    </div>

    <!-- Pending (unsaved) spots -->
    <div v-for="(pending, idx) in pendingSpots" :key="pending._key"
      class="border-2 border-brand-300 rounded-2xl p-4 space-y-3 bg-brand-50/40">
      <div class="flex items-center justify-between">
        <span class="text-sm font-semibold text-brand-700">
          ✨ {{ $t('admin.new_spot') }}
          <span v-if="pendingSpots.length > 1" class="text-brand-400 font-normal">#{{ idx + 1 }}</span>
        </span>
        <button type="button" class="text-xs text-gray-400 hover:text-gray-600" @click="removePendingSpot(idx)">
          {{ $t('common.cancel') }}
        </button>
      </div>

      <!-- Both VI and EN always visible -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-medium text-gray-600 mb-1">{{ $t('admin.spot_name_vi') }} *</label>
          <input v-model="pending.nameVi" type="text" :placeholder="$t('admin.spot_name_vi')"
            class="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" />
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-600 mb-1">{{ $t('admin.spot_name_en') }} *</label>
          <input v-model="pending.nameEn" type="text" :placeholder="$t('admin.spot_name_en')"
            class="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" />
        </div>
      </div>
      <div>
        <label class="block text-xs font-medium text-gray-600 mb-1">{{ $t('admin.spot_description') }} (VI)</label>
        <textarea v-model="pending.descriptionVi" rows="2" :placeholder="$t('admin.spot_description') + '...'"
          class="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none" />
      </div>
      <div>
        <label class="block text-xs font-medium text-gray-600 mb-1">{{ $t('admin.spot_description') }} (EN)</label>
        <textarea v-model="pending.descriptionEn" rows="2" :placeholder="$t('admin.spot_description') + '...'"
          class="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none" />
      </div>

      <!-- Save pending — bottom of card -->
      <AppButton :loading="pending.saving" class="w-full" @click="handleCreateSpot(idx)">
        {{ pending.saving ? $t('common.saving') : $t('admin.create_spot') }}
      </AppButton>
    </div>

    <!-- Add button — always at bottom -->
    <button type="button"
      class="w-full py-3 border-2 border-dashed border-gray-200 rounded-2xl text-sm text-gray-400 hover:border-brand-400 hover:text-brand-600 transition-colors flex items-center justify-center gap-2"
      @click="addPendingSpot">
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

interface JustCreatedSpot {
  id: string; nameVi: string; nameEn: string
  audioViUrl: string | null; audioEnUrl: string | null
  images: SpotImage[]
}

interface PendingSpot {
  _key: number
  nameVi: string; nameEn: string
  descriptionVi: string; descriptionEn: string
  saving: boolean
}

interface Props { locationId: string; spots: Spot[] }
const props = defineProps<Props>()
const emit = defineEmits<{ updated: [] }>()

const { toast } = useToast()
const { t } = useI18n()
const { useApiFetch } = await import('~/utils/api')
const { apiFetch } = useApiFetch()

let pendingKey = 0
const pendingSpots = ref<PendingSpot[]>([])
const justCreatedSpots = ref<JustCreatedSpot[]>([])
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
    // Remove from justCreated once it appears in saved spots
    const jcIdx = justCreatedSpots.value.findIndex(jc => jc.id === spot.id)
    if (jcIdx !== -1) justCreatedSpots.value.splice(jcIdx, 1)
  }
}, { immediate: true })

function addPendingSpot(): void {
  pendingSpots.value.push({
    _key: ++pendingKey,
    nameVi: '', nameEn: '',
    descriptionVi: '', descriptionEn: '',
    saving: false,
  })
}

function removePendingSpot(idx: number): void {
  pendingSpots.value.splice(idx, 1)
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
    await apiFetch(`/admin/locations/${props.locationId}/spots/${spotId}`, { method: 'PUT', body: form })
    toast.success(t('admin.update_success'))
    emit('updated')
  } catch { toast.error(t('error.server_error')) }
  finally { savingSpotId.value = null }
}

async function handleDeleteSpot(spotId: string): Promise<void> {
  deletingSpotId.value = spotId
  try {
    await apiFetch(`/admin/locations/${props.locationId}/spots/${spotId}`, { method: 'DELETE' })
    emit('updated')
  } catch { toast.error(t('error.server_error')) }
  finally { deletingSpotId.value = null }
}

async function handleCreateSpot(idx: number): Promise<void> {
  const pending = pendingSpots.value[idx]
  if (!pending.nameVi.trim() || !pending.nameEn.trim()) {
    toast.error(t('error.required')); return
  }
  pending.saving = true
  try {
    // API returns the created spot with its id
    const res = await apiFetch<{ success: true; data: Spot }>(`/admin/locations/${props.locationId}/spots`, {
      method: 'POST',
      body: {
        nameVi: pending.nameVi.trim(), nameEn: pending.nameEn.trim(),
        descriptionVi: pending.descriptionVi.trim() || undefined,
        descriptionEn: pending.descriptionEn.trim() || undefined,
      },
    })
    // Show just-created card immediately (for audio/image upload without waiting for reload)
    justCreatedSpots.value.push({
      id: res.data.id,
      nameVi: res.data.nameVi, nameEn: res.data.nameEn,
      audioViUrl: null, audioEnUrl: null, images: [],
    })
    pendingSpots.value.splice(idx, 1)
    emit('updated') // reload parent in background
    toast.success(t('admin.create_success'))
  } catch { toast.error(t('error.server_error')) }
  finally { if (pendingSpots.value[idx]) pendingSpots.value[idx].saving = false }
}

async function refreshJustCreated(spotId: string): Promise<void> {
  // After uploading to a just-created spot, reload the spot data to show badges
  try {
    const res = await apiFetch<{ success: true; data: Spot }>(`/admin/locations/${props.locationId}/spots/${spotId}`)
    const idx = justCreatedSpots.value.findIndex(jc => jc.id === spotId)
    if (idx !== -1) {
      justCreatedSpots.value[idx] = {
        id: res.data.id, nameVi: res.data.nameVi, nameEn: res.data.nameEn,
        audioViUrl: res.data.audioViUrl, audioEnUrl: res.data.audioEnUrl,
        images: res.data.images,
      }
    }
  } catch { /* ignore */ }
}

function doneJustCreated(spotId: string): void {
  const idx = justCreatedSpots.value.findIndex(jc => jc.id === spotId)
  if (idx !== -1) justCreatedSpots.value.splice(idx, 1)
  emit('updated') // trigger final reload
}
</script>
