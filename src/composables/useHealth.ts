import { HealthService } from '@/api/generated/services/HealthService'
import { useHealthStore } from '@/stores/health'
import { useApi } from './useApi'
import { getApiErrorMessage } from '@/api/client'

export function useHealth() {
  const healthStore = useHealthStore()
  const api = useApi()

  async function checkHealth() {
    try {
      healthStore.loading = true
      const result = await api.execute(() => HealthService.healthCheckHealthGet())
      healthStore.setHealth({
        status: result.status === 'ok' || result.status === 'healthy' ? 'healthy' : 'unhealthy',
        timestamp: new Date().toISOString(),
      })
      return result
    } catch (error) {
      const errorMsg = getApiErrorMessage(error)
      healthStore.setError(errorMsg)
      healthStore.setHealth({
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
      })
      throw error
    } finally {
      healthStore.loading = false
    }
  }

  async function checkLiveness() {
    try {
      const result = await api.execute(() => HealthService.livenessProbeHealthLiveGet())
      healthStore.setLiveness({
        status: 'alive',
        timestamp: new Date().toISOString(),
      })
      return result
    } catch (error) {
      healthStore.setLiveness({
        status: 'dead',
        timestamp: new Date().toISOString(),
      })
      throw error
    }
  }

  async function checkReadiness() {
    try {
      const result = await api.execute(() => HealthService.readinessProbeHealthReadyGet())
      healthStore.setReadiness({
        status: 'ready',
        timestamp: new Date().toISOString(),
      })
      return result
    } catch (error) {
      healthStore.setReadiness({
        status: 'not_ready',
        timestamp: new Date().toISOString(),
      })
      throw error
    }
  }

  async function getMetrics() {
    try {
      const result = await api.execute(() => HealthService.metricsMetricsGet())
      if (typeof result === 'string') {
        healthStore.setMetrics(result)
      }
      return result
    } catch (error) {
      const errorMsg = getApiErrorMessage(error)
      healthStore.setError(errorMsg)
      throw error
    }
  }

  return {
    ...api,
    checkHealth,
    checkLiveness,
    checkReadiness,
    getMetrics,
  }
}

