import { PlansService } from '@/api/generated/services/PlansService'
import type { PlanResponse } from '@/api/generated/models/PlanResponse'
import type { RefinePlanRequest } from '@/api/generated/models/RefinePlanRequest'
import { usePlansStore } from '@/stores/plans'
import { useApi } from './useApi'
import { getApiErrorMessage } from '@/api/client'

export function usePlans() {
  const plansStore = usePlansStore()
  const api = useApi()

  async function getPlan(planId: string): Promise<PlanResponse> {
    try {
      plansStore.loading = true
      const result = await api.execute(() =>
        PlansService.getPlanDetailsPlansPlanIdGet(planId)
      )
      plansStore.setCurrentPlan(result)
      return result
    } catch (error) {
      const errorMsg = getApiErrorMessage(error)
      plansStore.setError(errorMsg)
      throw error
    } finally {
      plansStore.loading = false
    }
  }

  async function refinePlan(planId: string, request: RefinePlanRequest): Promise<PlanResponse> {
    try {
      plansStore.loading = true
      const result = await api.execute(() =>
        PlansService.refinePlanEndpointPlansPlanIdRefinePost(planId, request)
      )
      plansStore.setCurrentPlan(result)
      return result
    } catch (error) {
      const errorMsg = getApiErrorMessage(error)
      plansStore.setError(errorMsg)
      throw error
    } finally {
      plansStore.loading = false
    }
  }

  function clearError() {
    plansStore.clearError()
  }

  return {
    ...api,
    getPlan,
    refinePlan,
    clearError,
  }
}
