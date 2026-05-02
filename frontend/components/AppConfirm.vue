<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      role="dialog"
      aria-modal="true"
      @keydown.esc="$emit('cancel')"
    >
      <div class="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-xl">
        <h3 class="text-lg font-bold text-gray-900">{{ title }}</h3>
        <p class="mt-2 text-sm text-gray-500">{{ message }}</p>
        <div class="flex gap-3 mt-6">
          <AppButton
            variant="secondary"
            class="flex-1"
            :disabled="isLoading"
            @click="$emit('cancel')"
          >
            {{ $t('common.cancel') }}
          </AppButton>
          <AppButton
            variant="danger"
            class="flex-1"
            :loading="isLoading"
            @click="$emit('confirm')"
          >
            {{ $t('common.confirm_delete') }}
          </AppButton>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
interface Props {
  open: boolean
  title: string
  message: string
  isLoading?: boolean
}

withDefaults(defineProps<Props>(), {
  isLoading: false
})

defineEmits<{
  confirm: []
  cancel: []
}>()
</script>
