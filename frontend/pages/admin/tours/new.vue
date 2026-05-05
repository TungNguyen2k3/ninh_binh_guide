<template>
  <div class="max-w-2xl space-y-5">
    <div class="flex items-center gap-3">
      <button type="button" class="text-gray-400 hover:text-gray-600" @click="navigateTo('/admin/tours')">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <h1 class="text-2xl font-bold text-gray-900">{{ $t('admin.add_tour') }}</h1>
    </div>

    <div class="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <AppInput v-model="form.nameVi" :label="'Tên tour (VI) *'" placeholder="Ninh Bình trong 1 ngày" :error="errors.nameVi" required />
        <AppInput v-model="form.nameEn" :label="'Tên tour (EN) *'" placeholder="Ninh Binh in One Day" :error="errors.nameEn" required />
      </div>
      <AppInput v-model="form.duration" :label="'Thời gian *'" placeholder="1 ngày / 2 ngày 1 đêm" :error="errors.duration" required />
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <AppInput v-model="form.badgeVi" :label="'Badge (VI)'" placeholder="Phổ biến / Tâm linh" />
        <AppInput v-model="form.badgeEn" :label="'Badge (EN)'" placeholder="Popular / Spiritual" />
      </div>
      <div class="flex flex-col gap-1">
        <label class="text-sm font-medium text-gray-700">Ghi chú chung (VI)</label>
        <textarea v-model="form.noteVi" rows="3" placeholder="Nên thuê xe máy để di chuyển linh hoạt..."
          class="block w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none" />
      </div>
      <div class="flex flex-col gap-1">
        <label class="text-sm font-medium text-gray-700">Ghi chú chung (EN)</label>
        <textarea v-model="form.noteEn" rows="3" placeholder="Recommend renting a motorbike..."
          class="block w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none" />
      </div>
      <AppInput v-model.number="form.displayOrder" type="number" :label="'Thứ tự hiển thị'" placeholder="0" />
    </div>

    <div class="flex justify-end">
      <AppButton :loading="saving" @click="handleSubmit">
        {{ saving ? $t('common.saving') : $t('admin.add_tour') }}
      </AppButton>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })
const { t } = useI18n()
useHead({ title: () => t('admin.add_tour') })

const tourStore = useTourStore()
const { toast } = useToast()
const saving = ref(false)

const form = ref({
  nameVi: '', nameEn: '', duration: '',
  badgeVi: '', badgeEn: '', noteVi: '', noteEn: '',
  displayOrder: 0,
})
const errors = ref({ nameVi: '', nameEn: '', duration: '' })

async function handleSubmit() {
  errors.value = { nameVi: '', nameEn: '', duration: '' }
  let valid = true
  if (!form.value.nameVi.trim()) { errors.value.nameVi = t('error.required'); valid = false }
  if (!form.value.nameEn.trim()) { errors.value.nameEn = t('error.required'); valid = false }
  if (!form.value.duration.trim()) { errors.value.duration = t('error.required'); valid = false }
  if (!valid) return

  saving.value = true
  try {
    const tour = await tourStore.create({
      ...form.value,
      badgeVi: form.value.badgeVi || undefined,
      badgeEn: form.value.badgeEn || undefined,
      noteVi: form.value.noteVi || undefined,
      noteEn: form.value.noteEn || undefined,
    } as any)
    toast.success(t('admin.create_success'))
    navigateTo(`/admin/tours/${tour.id}/edit`)
  } catch {
    toast.error(t('error.server_error'))
  } finally {
    saving.value = false
  }
}
</script>
