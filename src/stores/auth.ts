import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const apiKey = ref<string | null>(localStorage.getItem('api_key'))
  const tenantId = ref<string | null>(localStorage.getItem('tenant_id'))

  const isAuthenticated = computed(() => !!apiKey.value)

  function login(key: string, tenant: string | null = null) {
    apiKey.value = key
    tenantId.value = tenant
    localStorage.setItem('api_key', key)
    if (tenant) {
      localStorage.setItem('tenant_id', tenant)
    }
  }

  function logout() {
    apiKey.value = null
    tenantId.value = null
    localStorage.removeItem('api_key')
    localStorage.removeItem('tenant_id')
  }

  function setTenantId(tenant: string) {
    tenantId.value = tenant
    localStorage.setItem('tenant_id', tenant)
  }

  return {
    apiKey,
    tenantId,
    isAuthenticated,
    login,
    logout,
    setTenantId,
  }
})

