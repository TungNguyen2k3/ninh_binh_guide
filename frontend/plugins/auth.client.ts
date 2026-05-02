import { useAuthStore } from '~/stores/auth.store'

/**
 * Client-side plugin: initialize auth state on app load by attempting
 * a silent token refresh using the httpOnly refresh token cookie.
 * Runs once before the first route render.
 */
export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore()
  await authStore.initialize()
})
