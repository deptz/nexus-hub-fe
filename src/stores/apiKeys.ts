import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ApiKeyInfo } from '@/api/types'

export const useApiKeysStore = defineStore('apiKeys', () => {
  const apiKeys = ref<ApiKeyInfo[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const includeInactive = ref(false)

  function setApiKeys(keys: ApiKeyInfo[]) {
    apiKeys.value = keys
  }

  function addApiKey(key: ApiKeyInfo) {
    apiKeys.value.push(key)
  }

  function removeApiKey(keyId: string) {
    apiKeys.value = apiKeys.value.filter((k) => k.id !== keyId)
  }

  function updateApiKey(keyId: string, updates: Partial<ApiKeyInfo>) {
    const index = apiKeys.value.findIndex((k) => k.id === keyId)
    if (index !== -1) {
      apiKeys.value[index] = { ...apiKeys.value[index], ...updates }
    }
  }

  function clearError() {
    error.value = null
  }

  function setError(err: string) {
    error.value = err
  }

  return {
    apiKeys,
    loading,
    error,
    includeInactive,
    setApiKeys,
    addApiKey,
    removeApiKey,
    updateApiKey,
    clearError,
    setError,
  }
})


