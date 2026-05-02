<template>
  <div class="rounded-2xl border border-gray-200 p-4 space-y-3">
    <h4 class="text-sm font-semibold text-gray-700">{{ $t('admin.upload_image') }}</h4>

    <!-- Current thumbnail -->
    <div v-if="imageUrl" class="relative w-full max-w-xs">
      <img
        :src="imageUrl"
        alt="Location thumbnail"
        class="w-full h-40 object-cover rounded-xl border border-gray-200"
      />
    </div>

    <!-- Upload label -->
    <label
      class="inline-flex items-center gap-2 cursor-pointer text-sm font-medium rounded-xl border border-dashed border-brand-400 px-4 py-2.5 text-brand-600 hover:bg-brand-50 transition-colors"
      :class="uploading ? 'opacity-60 pointer-events-none' : ''"
    >
      <svg v-if="uploading" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
      <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
      </svg>
      <span>{{ uploading ? $t('common.uploading') : imageUrl ? $t('admin.replace_image') : $t('admin.upload_image') }}</span>
      <input
        ref="inputEl"
        type="file"
        accept="image/*"
        class="hidden"
        :disabled="uploading"
        @change="handleUpload"
      />
    </label>
  </div>
</template>

<script setup lang="ts">
interface Props {
  locationId: string
  imageUrl: string | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  uploaded: []
}>()

const locationStore = useLocationStore()
const { toast } = useToast()
const { t } = useI18n()

const uploading = ref(false)
const inputEl = ref<HTMLInputElement | null>(null)

async function handleUpload(event: Event): Promise<void> {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  uploading.value = true
  try {
    await locationStore.uploadImage(props.locationId, file)
    toast.success(t('admin.upload_image') + ' OK')
    emit('uploaded')
  } catch {
    toast.error(t('error.server_error'))
  } finally {
    uploading.value = false
    if (inputEl.value) inputEl.value.value = ''
  }
}
</script>
