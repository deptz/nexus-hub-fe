import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { PlanResponse } from '@/api/generated/models/PlanResponse'

export const usePlansStore = defineStore('plans', () => {
  const currentPlan = ref<PlanResponse | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  function setCurrentPlan(plan: PlanResponse | null) {
    currentPlan.value = plan
  }

  function clearError() {
    error.value = null
  }

  function setError(err: string) {
    error.value = err
  }

  return {
    currentPlan,
    loading,
    error,
    setCurrentPlan,
    clearError,
    setError,
  }
})
