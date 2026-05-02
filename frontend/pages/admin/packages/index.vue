<template>
  <div class="space-y-6">
    <!-- Page header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <h1 class="text-2xl font-bold text-gray-900">{{ $t('nav.packages') }}</h1>
      <AppButton @click="openCreateModal">
        {{ $t('admin.add_package') }}
      </AppButton>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-2xl border border-gray-200">
      <!-- Loading -->
      <div v-if="packageStore.isLoading" class="flex justify-center items-center py-16">
        <svg class="animate-spin h-6 w-6 text-brand-600" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>

      <!-- Empty -->
      <div v-else-if="packageStore.packages.length === 0" class="flex flex-col items-center justify-center py-16 text-center">
        <svg class="w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
        <p class="text-sm text-gray-500">{{ $t('admin.no_packages') }}</p>
      </div>

      <!-- Table content -->
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 text-sm">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                {{ $t('package.name') }}
              </th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap hidden sm:table-cell">
                {{ $t('package.type') }}
              </th>
              <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap hidden md:table-cell">
                {{ $t('admin.validity_hours') }}
              </th>
              <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap hidden md:table-cell">
                {{ $t('admin.price_vnd') }}
              </th>
              <th class="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap hidden lg:table-cell">
                {{ $t('package.locations_count') }}
              </th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                {{ $t('location.status') }}
              </th>
              <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                {{ $t('common.actions') }}
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 bg-white">
            <tr v-for="pkg in packageStore.packages" :key="pkg.id" class="hover:bg-gray-50 transition-colors">
              <!-- Name + description -->
              <td class="px-4 py-3">
                <p class="font-medium text-gray-900 whitespace-nowrap">{{ pkg.name }}</p>
                <p v-if="pkg.description" class="text-xs text-gray-400 mt-0.5 max-w-48 truncate">{{ pkg.description }}</p>
              </td>

              <!-- Type badge -->
              <td class="px-4 py-3 hidden sm:table-cell">
                <span
                  class="px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap"
                  :class="pkg.type === 'all_locations'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-purple-100 text-purple-700'"
                >
                  {{ pkg.type === 'all_locations' ? $t('admin.all_locations_type') : $t('admin.custom_type') }}
                </span>
              </td>

              <!-- Validity -->
              <td class="px-4 py-3 text-right text-gray-600 hidden md:table-cell whitespace-nowrap">
                {{ pkg.validityHours }}h
              </td>

              <!-- Price -->
              <td class="px-4 py-3 text-right text-gray-600 hidden md:table-cell whitespace-nowrap">
                {{ formatPrice(pkg.price) }}
              </td>

              <!-- Locations count -->
              <td class="px-4 py-3 text-center text-gray-600 hidden lg:table-cell">
                <span v-if="pkg.type === 'all_locations'" class="text-blue-500 font-medium">&#8734;</span>
                <span v-else>{{ pkg.locations?.length ?? 0 }}</span>
              </td>

              <!-- Status -->
              <td class="px-4 py-3">
                <span
                  class="px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap"
                  :class="pkg.isActive
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-500'"
                >
                  {{ pkg.isActive ? $t('common.active') : $t('common.inactive') }}
                </span>
              </td>

              <!-- Actions -->
              <td class="px-4 py-3">
                <div class="flex items-center justify-end gap-1 flex-wrap">
                  <button
                    type="button"
                    class="text-brand-600 hover:text-brand-700 font-medium text-sm px-2 py-1 rounded-lg hover:bg-brand-50 transition-colors whitespace-nowrap"
                    @click="openEditModal(pkg)"
                  >
                    {{ $t('common.edit') }}
                  </button>
                  <button
                    v-if="pkg.type === 'custom'"
                    type="button"
                    class="text-purple-600 hover:text-purple-700 font-medium text-sm px-2 py-1 rounded-lg hover:bg-purple-50 transition-colors whitespace-nowrap"
                    @click="navigateTo(`/admin/packages/${pkg.id}/locations`)"
                  >
                    {{ $t('admin.assign_locations') }}
                  </button>
                  <button
                    type="button"
                    class="text-red-600 hover:text-red-700 font-medium text-sm px-2 py-1 rounded-lg hover:bg-red-50 transition-colors whitespace-nowrap"
                    @click="confirmDelete(pkg)"
                  >
                    {{ $t('common.delete') }}
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create/Edit modal -->
    <Teleport to="body">
      <div
        v-if="showModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
        @keydown.esc="closeModal"
      >
        <div class="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
          <h3 class="text-lg font-bold text-gray-900 mb-5">
            {{ editingPackage ? $t('admin.edit_package') : $t('admin.add_package') }}
          </h3>

          <form class="space-y-4" @submit.prevent="handleSave">
            <!-- Name -->
            <AppInput
              v-model="modalForm.name"
              :label="$t('package.name')"
              :placeholder="$t('package.name')"
              required
            />

            <!-- Description -->
            <div class="flex flex-col gap-1">
              <label class="text-sm font-medium text-gray-700">{{ $t('package.description') }}</label>
              <textarea
                v-model="modalForm.description"
                rows="3"
                :placeholder="$t('package.description')"
                class="block w-full rounded-xl border border-gray-300 px-3 py-2.5 text-base text-gray-900 placeholder-gray-400 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200 resize-none transition-colors"
              />
            </div>

            <!-- Type -->
            <div class="flex flex-col gap-2">
              <label class="text-sm font-medium text-gray-700">{{ $t('package.type') }}</label>
              <div class="flex gap-4">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input
                    v-model="modalForm.type"
                    type="radio"
                    value="all_locations"
                    class="accent-brand-600"
                  />
                  <span class="text-sm">{{ $t('admin.all_locations_type') }}</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer">
                  <input
                    v-model="modalForm.type"
                    type="radio"
                    value="custom"
                    class="accent-brand-600"
                  />
                  <span class="text-sm">{{ $t('admin.custom_type') }}</span>
                </label>
              </div>
            </div>

            <!-- Validity + Price -->
            <div class="grid grid-cols-2 gap-4">
              <div class="flex flex-col gap-1">
                <label class="text-sm font-medium text-gray-700">{{ $t('admin.validity_hours') }}</label>
                <input
                  v-model.number="modalForm.validityHours"
                  type="number"
                  min="1"
                  placeholder="24"
                  class="block w-full rounded-xl border border-gray-300 px-3 py-2.5 text-base outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200 transition-colors"
                />
              </div>
              <div class="flex flex-col gap-1">
                <label class="text-sm font-medium text-gray-700">{{ $t('admin.price_vnd') }}</label>
                <input
                  v-model.number="modalForm.price"
                  type="number"
                  min="0"
                  placeholder="0"
                  class="block w-full rounded-xl border border-gray-300 px-3 py-2.5 text-base outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200 transition-colors"
                />
              </div>
            </div>

            <!-- isActive -->
            <div class="flex items-center gap-3">
              <button
                type="button"
                role="switch"
                :aria-checked="modalForm.isActive"
                class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
                :class="modalForm.isActive ? 'bg-brand-600' : 'bg-gray-200'"
                @click="modalForm.isActive = !modalForm.isActive"
              >
                <span
                  class="pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow ring-0 transition duration-200"
                  :class="modalForm.isActive ? 'translate-x-5' : 'translate-x-0'"
                />
              </button>
              <span class="text-sm font-medium text-gray-700">
                {{ modalForm.isActive ? $t('common.active') : $t('common.inactive') }}
              </span>
            </div>

            <!-- Buttons -->
            <div class="flex gap-3 pt-2">
              <AppButton
                variant="secondary"
                class="flex-1"
                type="button"
                :disabled="isSaving"
                @click="closeModal"
              >
                {{ $t('common.cancel') }}
              </AppButton>
              <AppButton type="submit" class="flex-1" :loading="isSaving">
                {{ isSaving ? $t('common.saving') : $t('common.save') }}
              </AppButton>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Confirm delete -->
    <AppConfirm
      :open="!!deletingPackage"
      :title="$t('admin.delete_package_title')"
      :message="deletingPackage ? `${deletingPackage.name} — ${$t('common.delete_confirm_message')}` : ''"
      :is-loading="isDeleting"
      @confirm="handleDelete"
      @cancel="deletingPackage = null"
    />
  </div>
</template>

<script setup lang="ts">
import type { Package, PackageFormData } from '~/stores/package.store'

definePageMeta({ layout: 'admin' })
const { t } = useI18n()
useHead({ title: () => t('nav.packages') })

const packageStore = usePackageStore()
const { toast } = useToast()

const showModal = ref(false)
const editingPackage = ref<Package | null>(null)
const deletingPackage = ref<Package | null>(null)
const isSaving = ref(false)
const isDeleting = ref(false)

const emptyForm = (): PackageFormData => ({
  name: '',
  description: '',
  type: 'all_locations',
  validityHours: 24,
  price: 0,
  isActive: true
})

const modalForm = ref<PackageFormData>(emptyForm())

function formatPrice(price: number): string {
  return new Intl.NumberFormat('vi-VN').format(price) + ' ₫'
}

function openCreateModal(): void {
  editingPackage.value = null
  modalForm.value = emptyForm()
  showModal.value = true
}

function openEditModal(pkg: Package): void {
  editingPackage.value = pkg
  modalForm.value = {
    name: pkg.name,
    description: pkg.description ?? '',
    type: pkg.type,
    validityHours: pkg.validityHours,
    price: pkg.price,
    isActive: pkg.isActive
  }
  showModal.value = true
}

function closeModal(): void {
  showModal.value = false
  editingPackage.value = null
}

async function handleSave(): Promise<void> {
  if (!modalForm.value.name) {
    toast.error(t('error.required'))
    return
  }
  isSaving.value = true
  try {
    if (editingPackage.value) {
      await packageStore.update(editingPackage.value.id, modalForm.value)
      toast.success(t('admin.update_success'))
    } else {
      await packageStore.create(modalForm.value)
      toast.success(t('admin.create_success'))
    }
    closeModal()
  } catch {
    toast.error(t('error.server_error'))
  } finally {
    isSaving.value = false
  }
}

function confirmDelete(pkg: Package): void {
  deletingPackage.value = pkg
}

async function handleDelete(): Promise<void> {
  if (!deletingPackage.value) return
  isDeleting.value = true
  try {
    await packageStore.remove(deletingPackage.value.id)
    toast.success(t('admin.delete_success'))
    deletingPackage.value = null
  } catch {
    toast.error(t('error.server_error'))
  } finally {
    isDeleting.value = false
  }
}

await packageStore.fetchList()
</script>
