<template>
  <div class="max-w-2xl space-y-5">
    <div class="flex items-center gap-3">
      <button type="button" class="text-gray-400 hover:text-gray-600" @click="navigateTo('/admin/tours')">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <div>
        <h1 class="text-2xl font-bold text-gray-900">{{ $t('admin.edit_tour') }}</h1>
        <p v-if="tourStore.current" class="text-sm text-gray-500 mt-0.5">{{ tourStore.current.nameVi }}</p>
      </div>
    </div>

    <div v-if="tourStore.isLoading && !tourStore.current"
      class="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
      <div v-for="i in 4" :key="i" class="h-10 bg-gray-100 rounded-xl animate-pulse" />
    </div>

    <template v-else-if="tourStore.current">
      <!-- Basic info -->
      <div class="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
        <h2 class="text-sm font-semibold text-gray-700">Thông tin cơ bản</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AppInput v-model="form.nameVi" label="Tên tour (VI) *" :error="errors.nameVi" required />
          <AppInput v-model="form.nameEn" label="Tên tour (EN) *" :error="errors.nameEn" required />
        </div>
        <AppInput v-model="form.duration" label="Thời gian *" placeholder="1 ngày" :error="errors.duration" required />
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AppInput v-model="form.badgeVi" label="Badge (VI)" placeholder="Phổ biến" />
          <AppInput v-model="form.badgeEn" label="Badge (EN)" placeholder="Popular" />
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-sm font-medium text-gray-700">Ghi chú (VI)</label>
          <textarea v-model="form.noteVi" rows="3"
            class="block w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none" />
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-sm font-medium text-gray-700">Ghi chú (EN)</label>
          <textarea v-model="form.noteEn" rows="3"
            class="block w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none" />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <AppInput v-model.number="form.displayOrder" type="number" label="Thứ tự hiển thị" />
          <div class="flex items-end pb-1">
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" v-model="form.isActive" class="rounded text-brand-600" />
              <span class="text-sm font-medium text-gray-700">{{ $t('common.active') }}</span>
            </label>
          </div>
        </div>
        <div class="flex justify-end">
          <AppButton :loading="saving" @click="handleSubmit">
            {{ saving ? $t('common.saving') : $t('admin.save_changes') }}
          </AppButton>
        </div>
      </div>

      <!-- Stop manager -->
      <div class="bg-white rounded-2xl border border-gray-200 p-5">
        <div class="mb-4">
          <h2 class="text-sm font-semibold text-gray-900">📍 Danh sách điểm dừng</h2>
          <p class="text-xs text-gray-400 mt-0.5">Thứ tự hiển thị cho du khách trong lịch trình</p>
        </div>
        <AdminTourStopManager
          :tour-id="tourStore.current.id"
          :stops="tourStore.current.stops"
          @updated="reload"
        />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })
const { t } = useI18n()
useHead({ title: () => t('admin.edit_tour') })

const route = useRoute()
const tourStore = useTourStore()
const { toast } = useToast()
const saving = ref(false)
const errors = ref({ nameVi: '', nameEn: '', duration: '' })

const form = ref({
  nameVi: '', nameEn: '', duration: '',
  badgeVi: '', badgeEn: '', noteVi: '', noteEn: '',
  displayOrder: 0, isActive: true,
})

async function reload() {
  await tourStore.fetchOne(route.params.id as string)
  if (tourStore.current) {
    const current = tourStore.current
    form.value = {
      nameVi: current.nameVi,
      nameEn: current.nameEn,
      duration: current.duration,
      badgeVi: current.badgeVi ?? '',
      badgeEn: current.badgeEn ?? '',
      noteVi: current.noteVi ?? '',
      noteEn: current.noteEn ?? '',
      displayOrder: current.displayOrder,
      isActive: current.isActive,
    }
  }
}

async function handleSubmit() {
  errors.value = { nameVi: '', nameEn: '', duration: '' }
  let valid = true
  if (!form.value.nameVi.trim()) { errors.value.nameVi = t('error.required'); valid = false }
  if (!form.value.nameEn.trim()) { errors.value.nameEn = t('error.required'); valid = false }
  if (!form.value.duration.trim()) { errors.value.duration = t('error.required'); valid = false }
  if (!valid) return

  saving.value = true
  try {
    await tourStore.update(route.params.id as string, form.value as any)
    toast.success(t('admin.update_success'))
  } catch {
    toast.error(t('error.server_error'))
  } finally {
    saving.value = false
  }
}

onMounted(reload)
</script>
