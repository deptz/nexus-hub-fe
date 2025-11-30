import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface HealthStatus {
  status: 'healthy' | 'unhealthy'
  timestamp: string
}

export interface LivenessStatus {
  status: 'alive' | 'dead'
  timestamp: string
}

export interface ReadinessStatus {
  status: 'ready' | 'not_ready'
  timestamp: string
}

export const useHealthStore = defineStore('health', () => {
  const health = ref<HealthStatus | null>(null)
  const liveness = ref<LivenessStatus | null>(null)
  const readiness = ref<ReadinessStatus | null>(null)
  const metrics = ref<string | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  function setHealth(status: HealthStatus) {
    health.value = status
  }

  function setLiveness(status: LivenessStatus) {
    liveness.value = status
  }

  function setReadiness(status: ReadinessStatus) {
    readiness.value = status
  }

  function setMetrics(m: string) {
    metrics.value = m
  }

  function clearError() {
    error.value = null
  }

  function setError(err: string) {
    error.value = err
  }

  return {
    health,
    liveness,
    readiness,
    metrics,
    loading,
    error,
    setHealth,
    setLiveness,
    setReadiness,
    setMetrics,
    clearError,
    setError,
  }
})


