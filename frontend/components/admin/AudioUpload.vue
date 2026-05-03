<template>
  <div class="space-y-4">
    <!-- Vietnamese Audio -->
    <div class="rounded-2xl border p-4 space-y-3"
      :class="audioViUrl ? 'border-green-200 bg-green-50/50' : 'border-gray-200'">
      <div class="flex items-center justify-between">
        <h4 class="text-sm font-semibold text-gray-700">{{ $t('admin.audio_vi') }}</h4>
        <span v-if="audioViUrl" class="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
          <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
          Đã tải lên
        </span>
        <span v-else class="text-xs text-gray-400">Chưa có</span>
      </div>

      <!-- Custom player when audio exists -->
      <div v-if="audioViUrl" class="flex items-center gap-3 bg-white rounded-xl border border-green-200 px-3 py-2">
        <button type="button"
          class="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center flex-shrink-0 active:scale-95 transition-transform"
          @click="toggleVi">
          <svg v-if="!playingVi" class="w-4 h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          <svg v-else class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
        </button>
        <div class="flex-1 min-w-0">
          <div class="relative h-1.5 bg-gray-200 rounded-full cursor-pointer" @click="seekVi">
            <div class="absolute inset-y-0 left-0 bg-brand-500 rounded-full" :style="{ width: progressVi + '%' }"/>
          </div>
        </div>
        <span class="text-xs text-gray-400 flex-shrink-0 tabular-nums">{{ fmtVi }}</span>
      </div>

      <label class="inline-flex items-center gap-2 cursor-pointer text-sm font-medium rounded-xl border border-dashed px-4 py-2 transition-colors"
        :class="[uploadingVi ? 'opacity-60 pointer-events-none' : '', audioViUrl ? 'border-gray-300 text-gray-600 hover:bg-gray-50' : 'border-brand-400 text-brand-600 hover:bg-brand-50']">
        <svg v-if="uploadingVi" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
        <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
        </svg>
        <span>{{ uploadingVi ? $t('common.uploading') : audioViUrl ? $t('admin.replace_audio') : $t('admin.upload_audio') }}</span>
        <input ref="inputVi" type="file" accept=".mp3,audio/*" class="hidden" :disabled="uploadingVi" @change="handleUploadVi"/>
      </label>
    </div>

    <!-- English Audio -->
    <div class="rounded-2xl border p-4 space-y-3"
      :class="audioEnUrl ? 'border-green-200 bg-green-50/50' : 'border-gray-200'">
      <div class="flex items-center justify-between">
        <h4 class="text-sm font-semibold text-gray-700">{{ $t('admin.audio_en') }}</h4>
        <span v-if="audioEnUrl" class="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
          <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
          Uploaded
        </span>
        <span v-else class="text-xs text-gray-400">Not uploaded</span>
      </div>

      <div v-if="audioEnUrl" class="flex items-center gap-3 bg-white rounded-xl border border-green-200 px-3 py-2">
        <button type="button"
          class="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center flex-shrink-0 active:scale-95 transition-transform"
          @click="toggleEn">
          <svg v-if="!playingEn" class="w-4 h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          <svg v-else class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
        </button>
        <div class="flex-1 min-w-0">
          <div class="relative h-1.5 bg-gray-200 rounded-full cursor-pointer" @click="seekEn">
            <div class="absolute inset-y-0 left-0 bg-brand-500 rounded-full" :style="{ width: progressEn + '%' }"/>
          </div>
        </div>
        <span class="text-xs text-gray-400 flex-shrink-0 tabular-nums">{{ fmtEn }}</span>
      </div>

      <label class="inline-flex items-center gap-2 cursor-pointer text-sm font-medium rounded-xl border border-dashed px-4 py-2 transition-colors"
        :class="[uploadingEn ? 'opacity-60 pointer-events-none' : '', audioEnUrl ? 'border-gray-300 text-gray-600 hover:bg-gray-50' : 'border-brand-400 text-brand-600 hover:bg-brand-50']">
        <svg v-if="uploadingEn" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
        <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
        </svg>
        <span>{{ uploadingEn ? $t('common.uploading') : audioEnUrl ? $t('admin.replace_audio') : $t('admin.upload_audio') }}</span>
        <input ref="inputEn" type="file" accept=".mp3,audio/*" class="hidden" :disabled="uploadingEn" @change="handleUploadEn"/>
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
const emit = defineEmits<{ uploaded: [] }>()

const locationStore = useLocationStore()
const { toast } = useToast()
const { t } = useI18n()

const uploadingVi = ref(false)
const uploadingEn = ref(false)
const inputVi = ref<HTMLInputElement | null>(null)
const inputEn = ref<HTMLInputElement | null>(null)

// Mini player state — VI
const playingVi = ref(false)
const currentVi = ref(0)
const durationVi = ref(0)
const progressVi = computed(() => durationVi.value > 0 ? (currentVi.value / durationVi.value) * 100 : 0)
const fmtVi = computed(() => `${fmt(currentVi.value)} / ${fmt(durationVi.value)}`)
let audioVi: HTMLAudioElement | null = null

// Mini player state — EN
const playingEn = ref(false)
const currentEn = ref(0)
const durationEn = ref(0)
const progressEn = computed(() => durationEn.value > 0 ? (currentEn.value / durationEn.value) * 100 : 0)
const fmtEn = computed(() => `${fmt(currentEn.value)} / ${fmt(durationEn.value)}`)
let audioEn: HTMLAudioElement | null = null

function fmt(s: number) {
  if (!s || isNaN(s)) return '0:00'
  return `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, '0')}`
}

onMounted(() => {
  if (props.audioViUrl) {
    audioVi = new Audio(props.audioViUrl)
    audioVi.addEventListener('timeupdate', () => { currentVi.value = audioVi?.currentTime ?? 0 })
    audioVi.addEventListener('durationchange', () => { durationVi.value = audioVi?.duration ?? 0 })
    audioVi.addEventListener('ended', () => { playingVi.value = false })
  }
  if (props.audioEnUrl) {
    audioEn = new Audio(props.audioEnUrl)
    audioEn.addEventListener('timeupdate', () => { currentEn.value = audioEn?.currentTime ?? 0 })
    audioEn.addEventListener('durationchange', () => { durationEn.value = audioEn?.duration ?? 0 })
    audioEn.addEventListener('ended', () => { playingEn.value = false })
  }
})

onUnmounted(() => {
  audioVi?.pause(); audioEn?.pause()
})

function toggleVi() {
  if (!audioVi) return
  if (playingVi.value) { audioVi.pause(); playingVi.value = false }
  else { audioEn?.pause(); playingEn.value = false; audioVi.play(); playingVi.value = true }
}

function toggleEn() {
  if (!audioEn) return
  if (playingEn.value) { audioEn.pause(); playingEn.value = false }
  else { audioVi?.pause(); playingVi.value = false; audioEn.play(); playingEn.value = true }
}

function seekVi(e: MouseEvent) {
  if (!audioVi || !durationVi.value) return
  const r = (e.currentTarget as HTMLElement).getBoundingClientRect()
  audioVi.currentTime = ((e.clientX - r.left) / r.width) * durationVi.value
}

function seekEn(e: MouseEvent) {
  if (!audioEn || !durationEn.value) return
  const r = (e.currentTarget as HTMLElement).getBoundingClientRect()
  audioEn.currentTime = ((e.clientX - r.left) / r.width) * durationEn.value
}

async function handleUploadVi(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  uploadingVi.value = true
  try {
    await locationStore.uploadAudio(props.locationId, file, 'vi')
    toast.success(t('admin.update_success'))
    emit('uploaded')
  } catch {
    toast.error(t('error.server_error'))
  } finally {
    uploadingVi.value = false
    if (inputVi.value) inputVi.value.value = ''
  }
}

async function handleUploadEn(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  uploadingEn.value = true
  try {
    await locationStore.uploadAudio(props.locationId, file, 'en')
    toast.success(t('admin.update_success'))
    emit('uploaded')
  } catch {
    toast.error(t('error.server_error'))
  } finally {
    uploadingEn.value = false
    if (inputEn.value) inputEn.value.value = ''
  }
}
</script>
