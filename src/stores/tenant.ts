import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTenantStore = defineStore('tenant', () => {
  const prompt = ref<string | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  function setPrompt(p: string | null) {
    prompt.value = p
  }

  function clearError() {
    error.value = null
  }

  function setError(err: string) {
    error.value = err
  }

  return {
    prompt,
    loading,
    error,
    setPrompt,
    clearError,
    setError,
  }
})

