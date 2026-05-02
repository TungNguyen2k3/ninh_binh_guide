import { useAuthStore } from '~/stores/auth.store'

export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()

  const publicRoutes = ['/auth/login', '/auth/register']
  const isPublicRoute = publicRoutes.includes(to.path)

  // Not authenticated — redirect to login unless on a public route
  if (!authStore.isAuthenticated && !isPublicRoute) {
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
})
