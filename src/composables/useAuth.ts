import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

export function useAuth() {
  const authStore = useAuthStore()
  const router = useRouter()

  const isAuthenticated = computed(() => authStore.isAuthenticated)
  const apiKey = computed(() => authStore.apiKey)
  const tenantId = computed(() => authStore.tenantId)

  function login(key: string, tenant?: string) {
    authStore.login(key, tenant)
  }

  function logout() {
    authStore.logout()
    router.push('/login')
  }

  function requireAuth() {
    if (!authStore.isAuthenticated) {
      router.push('/login')
      return false
    }
    return true
  }

  return {
    isAuthenticated,
    apiKey,
    tenantId,
    login,
    logout,
    requireAuth,
  }
}

