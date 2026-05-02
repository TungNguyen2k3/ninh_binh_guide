import { useAuthStore } from '~/stores/auth.store'

export default defineNuxtRouteMiddleware((to) => {
  // Auth state is restored client-side only (auth.client.ts plugin).
  // Skipping on server prevents redirect loops caused by empty store during SSR.
  if (import.meta.server) return

  const authStore = useAuthStore()

  const publicRoutes = ['/auth/login', '/auth/register']
  const isPublicRoute = publicRoutes.includes(to.path)

  // Not authenticated — redirect to login unless on a public route
  if (!authStore.isAuthenticated && !isPublicRoute) {
    // Allow tourists to reach the activate page without a ticket
    if (to.path === '/auth/activate') return
    return navigateTo('/auth/login')
  }

  // Already authenticated — redirect away from auth pages to role home
  if (authStore.isAuthenticated && isPublicRoute) {
    if (authStore.isAdmin) return navigateTo('/admin')
    if (authStore.isStaff) return navigateTo('/staff')
    return navigateTo('/explore')
  }

  // Admin guard
  if (to.path.startsWith('/admin') && !authStore.isAdmin) {
    return navigateTo('/')
  }

  // Staff guard
  if (to.path.startsWith('/staff') && !authStore.isStaff && !authStore.isAdmin) {
    return navigateTo('/')
  }

  // Tourist without active ticket — redirect to activate before entering /explore
  if (to.path.startsWith('/explore') && authStore.isTourist && !authStore.hasActiveTicket) {
    return navigateTo('/auth/activate')
  }
})
