<template>
  <div class="space-y-2">
    <div class="grid grid-cols-3 gap-2">
      <!-- Existing images -->
      <div
        v-for="img in images"
        :key="img.id"
        class="relative aspect-square"
      >
        <img
          :src="img.url"
          class="w-full h-full object-cover rounded-lg"
        />
        <button
          type="button"
          class="absolute top-0.5 right-0.5 w-5 h-5 bg-black/50 text-white rounded-full text-xs flex items-center justify-center hover:bg-black/70 transition-colors"
          :disabled="deletingId === img.id"
          @click="handleDelete(img.id)"
        >
          <svg
            v-if="deletingId === img.id"
            class="animate-spin w-2.5 h-2.5"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span v-else class="text-[10px]">✕</span>
        </button>
      </div>

      <!-- Upload button -->
      <label
        class="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-brand-400 transition-colors"
        :class="uploading ? 'opacity-60 pointer-events-none' : ''"
      >
        <svg
          v-if="uploading"
          class="animate-spin w-4 h-4 text-brand-600"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <span v-else class="text-xl text-gray-400">+</span>
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          class="hidden"
          :disabled="uploading"
          @change="handleUpload"
        />
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
interface SpotImage {
  id: string
  url: string
}

interface Props {
  locationId: string
  spotId: string
  images: SpotImage[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  uploaded: []
  deleted: []
}>()

const config = useRuntimeConfig()
const authStore = useAuthStore()
const { toast } = useToast()
const { t } = useI18n()

const uploading = ref(false)
const deletingId = ref<string | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

async function handleUpload(event: Event): Promise<void> {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  uploading.value = true
  try {
    const form = new FormData()
    form.append('file', file)
    await $fetch(`/admin/locations/${props.locationId}/spots/${props.spotId}/images`, {
      method: 'POST',
      baseURL: config.public.apiUrl as string,
      headers: authStore.accessToken
        ? { Authorization: `Bearer ${authStore.accessToken}` }
        : {},
      body: form
    })
    emit('uploaded')
  } catch {
    toast.error(t('error.server_error'))
  } finally {
    uploading.value = false
    if (fileInput.value) fileInput.value.value = ''
  }
}

async function handleDelete(imageId: string): Promise<void> {
  deletingId.value = imageId
  try {
    await $fetch(`/admin/locations/${props.locationId}/spots/${props.spotId}/images/${imageId}`, {
      method: 'DELETE',
      baseURL: config.public.apiUrl as string,
      headers: authStore.accessToken
        ? { Authorization: `Bearer ${authStore.accessToken}` }
        : {}
    })
    emit('deleted')
  } catch {
    toast.error(t('error.server_error'))
  } finally {
    deletingId.value = null
  }
}
</script>
