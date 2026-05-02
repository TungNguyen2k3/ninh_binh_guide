<template>
  <div class="space-y-6">
    <!-- Audio Tiếng Việt -->
    <div class="rounded-2xl border border-gray-200 p-4 space-y-3">
      <h4 class="text-sm font-semibold text-gray-700">{{ $t('admin.audio_vi') }}</h4>

      <!-- Current player -->
      <audio
        v-if="audioViUrl"
        :src="audioViUrl"
        controls
        class="w-full h-10"
        preload="none"
      />

      <!-- Upload label -->
      <label
        class="inline-flex items-center gap-2 cursor-pointer text-sm font-medium rounded-xl border border-dashed border-brand-400 px-4 py-2.5 text-brand-600 hover:bg-brand-50 transition-colors"
        :class="uploadingVi ? 'opacity-60 pointer-events-none' : ''"
      >
        <svg v-if="uploadingVi" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
        <span>{{ uploadingVi ? $t('common.uploading') : audioViUrl ? $t('admin.replace_audio') : $t('admin.upload_audio') }}</span>
        <input
          ref="inputVi"
          type="file"
          accept=".mp3,audio/*"
          class="hidden"
          :disabled="uploadingVi"
          @change="handleUploadVi"
        />
      </label>
    </div>

    <!-- Audio English -->
    <div class="rounded-2xl border border-gray-200 p-4 space-y-3">
      <h4 class="text-sm font-semibold text-gray-700">{{ $t('admin.audio_en') }}</h4>

      <audio
        v-if="audioEnUrl"
        :src="audioEnUrl"
        controls
        class="w-full h-10"
        preload="none"
      />

      <label
        class="inline-flex items-center gap-2 cursor-pointer text-sm font-medium rounded-xl border border-dashed border-brand-400 px-4 py-2.5 text-brand-600 hover:bg-brand-50 transition-colors"
        :class="uploadingEn ? 'opacity-60 pointer-events-none' : ''"
      >
        <svg v-if="uploadingEn" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
        <span>{{ uploadingEn ? $t('common.uploading') : audioEnUrl ? $t('admin.replace_audio') : $t('admin.upload_audio') }}</span>
        <input
          ref="inputEn"
          type="file"
          accept=".mp3,audio/*"
          class="hidden"
          :disabled="uploadingEn"
          @change="handleUploadEn"
        />
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  locationId: string
  audioViUrl: string | null
  audioEnUrl: string | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  uploaded: []
}>()

const locationStore = useLocationStore()
const { toast } = useToast()
const { t } = useI18n()

const uploadingVi = ref(false)
const uploadingEn = ref(false)
const inputVi = ref<HTMLInputElement | null>(null)
const inputEn = ref<HTMLInputElement | null>(null)

async function handleUploadVi(event: Event): Promise<void> {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  uploadingVi.value = true
  try {
    await locationStore.uploadAudio(props.locationId, file, 'vi')
    toast.success(t('admin.upload_audio') + ' OK')
    emit('uploaded')
  } catch {
    toast.error(t('error.server_error'))
  } finally {
    uploadingVi.value = false
    if (inputVi.value) inputVi.value.value = ''
  }
}

async function handleUploadEn(event: Event): Promise<void> {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  uploadingEn.value = true
  try {
    await locationStore.uploadAudio(props.locationId, file, 'en')
    toast.success(t('admin.upload_audio') + ' OK')
    emit('uploaded')
  } catch {
    toast.error(t('error.server_error'))
  } finally {
    uploadingEn.value = false
    if (inputEn.value) inputEn.value.value = ''
  }
}
</script>
