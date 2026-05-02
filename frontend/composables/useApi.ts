import { useApiFetch } from '~/utils/api'

/**
 * Composable re-export for convenient use in components and other composables.
 * Never call $fetch directly from components — always go through this composable
 * or the auth store actions.
 */
export function useApi() {
  const { apiFetch } = useApiFetch()
  return { apiFetch }
}
