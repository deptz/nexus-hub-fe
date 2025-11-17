import { CostsService } from '@/api/generated/services/CostsService'
import type { CostSummaryResponse } from '@/api/generated/models/CostSummaryResponse'
import type { CostBreakdownResponse } from '@/api/generated/models/CostBreakdownResponse'
import type { CostByPeriodResponse } from '@/api/generated/models/CostByPeriodResponse'
import type { CostByConversationResponse } from '@/api/generated/models/CostByConversationResponse'
import type { CostEstimateRequest } from '@/api/generated/models/CostEstimateRequest'
import type { CostEstimateResponse } from '@/api/generated/models/CostEstimateResponse'
import { useCostsStore } from '@/stores/costs'
import { useApi } from './useApi'
import { getApiErrorMessage } from '@/api/client'

export function useCosts(tenantId: string) {
  const costsStore = useCostsStore()
  const api = useApi()

  async function getCostSummary(
    startDate?: string | null,
    endDate?: string | null
  ): Promise<CostSummaryResponse> {
    try {
      costsStore.loading = true
      const result = await api.execute(() =>
        CostsService.getCostSummaryTenantsTenantIdCostsGet(tenantId, startDate, endDate)
      )
      const summary = result as CostSummaryResponse
      costsStore.setCostSummary(summary)
      costsStore.setFilters({ start_date: startDate, end_date: endDate })
      return summary
    } catch (error) {
      const errorMsg = getApiErrorMessage(error)
      costsStore.setError(errorMsg)
      throw error
    } finally {
      costsStore.loading = false
    }
  }

  async function getCostBreakdown(
    startDate?: string | null,
    endDate?: string | null
  ): Promise<CostBreakdownResponse> {
    try {
      costsStore.loading = true
      const result = await api.execute(() =>
        CostsService.getCostBreakdownTenantsTenantIdCostsBreakdownGet(tenantId, startDate, endDate)
      )
      const breakdown = result as CostBreakdownResponse
      costsStore.setCostBreakdown(breakdown)
      return breakdown
    } catch (error) {
      const errorMsg = getApiErrorMessage(error)
      costsStore.setError(errorMsg)
      throw error
    } finally {
      costsStore.loading = false
    }
  }

  async function getCostsByPeriod(
    periodType: string = 'daily',
    startDate?: string | null,
    endDate?: string | null
  ): Promise<CostByPeriodResponse> {
    try {
      costsStore.loading = true
      const result = await api.execute(() =>
        CostsService.getCostsByPeriodTenantsTenantIdCostsByPeriodGet(
          tenantId,
          periodType,
          startDate,
          endDate
        )
      )
      const byPeriod = result as CostByPeriodResponse
      costsStore.setCostByPeriod(byPeriod)
      costsStore.setFilters({ period_type: periodType, start_date: startDate, end_date: endDate })
      return byPeriod
    } catch (error) {
      const errorMsg = getApiErrorMessage(error)
      costsStore.setError(errorMsg)
      throw error
    } finally {
      costsStore.loading = false
    }
  }

  async function getCostsByConversation(
    startDate?: string | null,
    endDate?: string | null,
    limit: number = 100,
    offset?: number
  ): Promise<CostByConversationResponse> {
    try {
      costsStore.loading = true
      const result = await api.execute(() =>
        CostsService.getCostsByConversationTenantsTenantIdCostsByConversationGet(
          tenantId,
          startDate,
          endDate,
          limit,
          offset
        )
      )
      const byConversation = result as CostByConversationResponse
      costsStore.setCostByConversation(byConversation)
      costsStore.setFilters({ start_date: startDate, end_date: endDate, limit, offset })
      return byConversation
    } catch (error) {
      const errorMsg = getApiErrorMessage(error)
      costsStore.setError(errorMsg)
      throw error
    } finally {
      costsStore.loading = false
    }
  }

  async function estimateCost(request: CostEstimateRequest): Promise<CostEstimateResponse> {
    try {
      costsStore.loading = true
      const result = await api.execute(() =>
        CostsService.estimateCostTenantsTenantIdCostsEstimatePost(tenantId, request)
      )
      const estimate = result as CostEstimateResponse
      costsStore.setCostEstimate(estimate)
      return estimate
    } catch (error) {
      const errorMsg = getApiErrorMessage(error)
      costsStore.setError(errorMsg)
      throw error
    } finally {
      costsStore.loading = false
    }
  }

  return {
    ...api,
    getCostSummary,
    getCostBreakdown,
    getCostsByPeriod,
    getCostsByConversation,
    estimateCost,
  }
}

