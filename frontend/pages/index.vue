<script setup lang="ts">
/**
 * Root index page — redirects to the appropriate home for the user's role,
 * or to /auth/login if not authenticated.
 * The global auth middleware handles unauthenticated redirects, so this
 * page only runs when the user is already authenticated.
 */
const authStore = useAuthStore()

if (authStore.isAdmin) {
  await navigateTo('/admin', { replace: true })
} else if (authStore.isStaff) {
  await navigateTo('/staff', { replace: true })
} else {
  await navigateTo('/explore', { replace: true })
}
</script>
