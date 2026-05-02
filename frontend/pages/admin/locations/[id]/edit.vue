<template>
  <div class="max-w-3xl space-y-6">
    <!-- Page header -->
    <div class="flex items-center gap-3">
      <button
        type="button"
        class="text-gray-400 hover:text-gray-600 transition-colors"
        @click="navigateTo('/admin/locations')"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <h1 class="text-2xl font-bold text-gray-900">{{ $t('admin.edit_location') }}</h1>
    </div>

    <!-- Loading skeleton -->
    <div v-if="locationStore.isLoading && !locationStore.current" class="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
      <div v-for="i in 6" :key="i" class="h-10 bg-gray-100 rounded-xl animate-pulse" />
    </div>

    <template v-else-if="locationStore.current">
      <!-- Main form -->
      <div class="bg-white rounded-2xl border border-gray-200 p-6">
        <AdminLocationForm
          v-model="formData"
          :is-loading="isSubmitting"
          @submit="handleSubmit"
        />
      </div>

      <!-- Audio upload -->
      <div class="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
        <h2 class="text-base font-semibold text-gray-900">Audio</h2>
        <AdminAudioUpload
          :location-id="locationStore.current.id"
          :audio-vi-url="locationStore.current.audioViUrl"
          :audio-en-url="locationStore.current.audioEnUrl"
          @uploaded="reloadCurrent"
        />
      </div>

      <!-- Image upload -->
      <div class="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
        <h2 class="text-base font-semibold text-gray-900">{{ $t('admin.upload_image') }}</h2>
        <AdminImageUpload
          :location-id="locationStore.current.id"
          :image-url="locationStore.current.imageUrl"
          @uploaded="reloadCurrent"
        />
      </div>
    </template>

    <!-- Not found -->
    <div v-else class="bg-white rounded-2xl border border-gray-200 p-6 text-center text-gray-500">
      {{ $t('error.not_found') }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { LocationFormData } from '~/stores/location.store'

definePageMeta({ layout: 'admin' })
const { t } = useI18n()
useHead({ title: () => t('admin.edit_location') })

const route = useRoute()
const locationStore = useLocationStore()
const { toast } = useToast()
const isSubmitting = ref(false)

const formData = ref<LocationFormData>({
  nameVi: '',
  nameEn: '',
  slug: '',
  descriptionVi: '',
  descriptionEn: '',
  latitude: null,
  longitude: null,
  displayOrder: 0,
  isActive: true
})

async function loadLocation(): Promise<void> {
  const id = route.params.id as string
  await locationStore.fetchOne(id)
  if (locationStore.current) {
    const loc = locationStore.current
    formData.value = {
      nameVi: loc.nameVi,
      nameEn: loc.nameEn,
      slug: loc.slug,
      descriptionVi: loc.descriptionVi ?? '',
      descriptionEn: loc.descriptionEn ?? '',
      latitude: loc.latitude,
      longitude: loc.longitude,
      displayOrder: loc.displayOrder,
      isActive: loc.isActive
    }
  }
}

async function reloadCurrent(): Promise<void> {
  await locationStore.fetchOne(route.params.id as string)
}

async function handleSubmit(): Promise<void> {
  if (!formData.value.nameVi || !formData.value.nameEn || !formData.value.slug) {
    toast.error(t('error.required'))
    return
  }
  if (formData.value.latitude === null || formData.value.longitude === null) {
    toast.error(t('location.latitude') + ' / ' + t('location.longitude') + ': ' + t('error.required'))
    return
  }

  isSubmitting.value = true
  try {
    await locationStore.update(route.params.id as string, formData.value)
    toast.success(t('admin.update_success'))
  } catch {
    toast.error(t('error.server_error'))
  } finally {
    isSubmitting.value = false
  }
}

await loadLocation()
</script>
