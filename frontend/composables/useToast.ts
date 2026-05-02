export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  type: ToastType
  message: string
  duration: number
}

// Module-level reactive state so it is shared across all composable instances
const toasts = ref<Toast[]>([])

function addToast(type: ToastType, message: string, duration = 4000): void {
  const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
  const toast: Toast = { id, type, message, duration }
  toasts.value.push(toast)

  setTimeout(() => {
    removeToast(id)
  }, duration)
}

function removeToast(id: string): void {
  const index = toasts.value.findIndex((t) => t.id === id)
  if (index !== -1) {
    toasts.value.splice(index, 1)
  }
}

export function useToast() {
  const toast = {
    success: (message: string, duration?: number) =>
      addToast('success', message, duration),
    error: (message: string, duration?: number) =>
      addToast('error', message, duration),
    warning: (message: string, duration?: number) =>
      addToast('warning', message, duration),
    info: (message: string, duration?: number) =>
      addToast('info', message, duration)
  }

  return { toasts: readonly(toasts), toast, removeToast }
}
