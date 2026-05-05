<template>
  <Teleport to="body">
    <div
      class="fixed top-4 right-4 z-[2000] flex flex-col gap-2 w-full max-w-sm pointer-events-none"
      aria-live="polite"
      aria-atomic="false"
    >
      <TransitionGroup
        name="toast"
        tag="div"
        class="flex flex-col gap-2"
      >
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium"
          :class="toastClasses[toast.type]"
          role="alert"
        >
          <!-- Icon -->
          <span class="flex-shrink-0 mt-0.5 text-lg leading-none" aria-hidden="true">
            {{ toastIcons[toast.type] }}
          </span>

          <!-- Message -->
          <span class="flex-1 leading-snug">{{ toast.message }}</span>

          <!-- Dismiss button -->
          <button
            type="button"
            class="flex-shrink-0 touch-target flex items-center justify-center -mr-1 -mt-1 rounded-lg opacity-70 hover:opacity-100 transition-opacity"
            :aria-label="$t('common.close')"
            @click="removeToast(toast.id)"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import type { ToastType } from '~/composables/useToast'

const { toasts, removeToast } = useToast()

const toastClasses: Record<ToastType, string> = {
  success: 'bg-green-50 text-green-800 border border-green-200',
  error: 'bg-red-50 text-red-800 border border-red-200',
  warning: 'bg-amber-50 text-amber-800 border border-amber-200',
  info: 'bg-blue-50 text-blue-800 border border-blue-200'
}

const toastIcons: Record<ToastType, string> = {
  success: '✓',
  error: '✕',
  warning: '⚠',
  info: 'ℹ'
}
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.toast-move {
  transition: transform 0.3s ease;
}
</style>
