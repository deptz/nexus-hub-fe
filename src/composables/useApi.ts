import { ref } from 'vue'
import { getApiErrorMessage } from '@/api/client'

export function useApi<T>() {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const data = ref<T | null>(null)

  async function execute(apiCall: () => Promise<T>) {
    loading.value = true
    error.value = null
    try {
      data.value = await apiCall()
      return data.value
    } catch (err) {
      error.value = getApiErrorMessage(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  function clearError() {
    error.value = null
  }

  return {
    loading,
    error,
    data,
    execute,
    clearError,
  }
}

