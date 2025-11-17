import { AnalyticsService } from '@/api/generated/services/AnalyticsService'
import type { ConversationAnalyticsResponse } from '@/api/generated/models/ConversationAnalyticsResponse'
import type { CostSummaryResponse } from '@/api/generated/models/CostSummaryResponse'
import type { KPISnapshotsListResponse } from '@/api/generated/models/KPISnapshotsListResponse'
import type { UsageStatisticsResponse } from '@/api/generated/models/UsageStatisticsResponse'
import { useAnalyticsStore } from '@/stores/analytics'
import { useApi } from './useApi'
import { getApiErrorMessage } from '@/api/client'

export function useAnalytics(tenantId: string) {
  const analyticsStore = useAnalyticsStore()
  const api = useApi()

  async function getConversationAnalytics(
    startDate?: string | null,
    endDate?: string | null
  ): Promise<ConversationAnalyticsResponse> {
    try {
      analyticsStore.loading = true
      const result = await api.execute(() =>
        AnalyticsService.getConversationAnalyticsTenantsTenantIdAnalyticsConversationsGet(
          tenantId,
          startDate,
          endDate
        )
      )
      const analytics = result as ConversationAnalyticsResponse
      analyticsStore.setConversationAnalytics(analytics)
      analyticsStore.setFilters({ start_date: startDate, end_date: endDate })
      return analytics
    } catch (error) {
      const errorMsg = getApiErrorMessage(error)
      analyticsStore.setError(errorMsg)
      throw error
    } finally {
      analyticsStore.loading = false
    }
  }

  async function getCostAnalytics(
    startDate?: string | null,
    endDate?: string | null
  ): Promise<CostSummaryResponse> {
    try {
      analyticsStore.loading = true
      const result = await api.execute(() =>
        AnalyticsService.getCostAnalyticsTenantsTenantIdAnalyticsCostsGet(
          tenantId,
          startDate,
          endDate
        )
      )
      const analytics = result as CostSummaryResponse
      analyticsStore.setCostAnalytics(analytics)
      analyticsStore.setFilters({ start_date: startDate, end_date: endDate })
      return analytics
    } catch (error) {
      const errorMsg = getApiErrorMessage(error)
      analyticsStore.setError(errorMsg)
      throw error
    } finally {
      analyticsStore.loading = false
    }
  }

  async function listKpiSnapshots(
    periodType?: string | null,
    startDate?: string | null,
    endDate?: string | null,
    limit: number = 100,
    offset?: number
  ): Promise<KPISnapshotsListResponse> {
    try {
      analyticsStore.loading = true
      const result = await api.execute(() =>
        AnalyticsService.listKpiSnapshotsTenantsTenantIdAnalyticsKpisGet(
          tenantId,
          periodType,
          startDate,
          endDate,
          limit,
          offset
        )
      )
      const snapshots = result as KPISnapshotsListResponse
      analyticsStore.setKpiSnapshots(snapshots)
      analyticsStore.setFilters({
        period_type: periodType,
        start_date: startDate,
        end_date: endDate,
        limit,
        offset,
      })
      return snapshots
    } catch (error) {
      const errorMsg = getApiErrorMessage(error)
      analyticsStore.setError(errorMsg)
      throw error
    } finally {
      analyticsStore.loading = false
    }
  }

  async function getKpisByPeriod(
    periodType: string,
    periodStart?: string | null
  ): Promise<KPISnapshotsListResponse> {
    try {
      analyticsStore.loading = true
      const result = await api.execute(() =>
        AnalyticsService.getKpisByPeriodTenantsTenantIdAnalyticsKpisPeriodTypeGet(
          tenantId,
          periodType,
          periodStart
        )
      )
      const snapshots = result as KPISnapshotsListResponse
      analyticsStore.setKpiSnapshots(snapshots)
      analyticsStore.setFilters({ period_type: periodType, period_start: periodStart })
      return snapshots
    } catch (error) {
      const errorMsg = getApiErrorMessage(error)
      analyticsStore.setError(errorMsg)
      throw error
    } finally {
      analyticsStore.loading = false
    }
  }

  async function computeKpis(
    periodType: string = 'daily',
    periodStart?: string | null
  ): Promise<void> {
    try {
      analyticsStore.loading = true
      await api.execute(() =>
        AnalyticsService.computeKpisTenantsTenantIdAnalyticsKpisComputePost(
          tenantId,
          periodType,
          periodStart
        )
      )
      // Refresh KPI snapshots after computation
      await listKpiSnapshots(periodType, periodStart)
    } catch (error) {
      const errorMsg = getApiErrorMessage(error)
      analyticsStore.setError(errorMsg)
      throw error
    } finally {
      analyticsStore.loading = false
    }
  }

  async function getUsageStatistics(
    startDate?: string | null,
    endDate?: string | null
  ): Promise<UsageStatisticsResponse> {
    try {
      analyticsStore.loading = true
      const result = await api.execute(() =>
        AnalyticsService.getUsageStatisticsTenantsTenantIdAnalyticsUsageGet(
          tenantId,
          startDate,
          endDate
        )
      )
      const stats = result as UsageStatisticsResponse
      analyticsStore.setUsageStatistics(stats)
      analyticsStore.setFilters({ start_date: startDate, end_date: endDate })
      return stats
    } catch (error) {
      const errorMsg = getApiErrorMessage(error)
      analyticsStore.setError(errorMsg)
      throw error
    } finally {
      analyticsStore.loading = false
    }
  }

  return {
    ...api,
    getConversationAnalytics,
    getCostAnalytics,
    listKpiSnapshots,
    getKpisByPeriod,
    computeKpis,
    getUsageStatistics,
  }
}

