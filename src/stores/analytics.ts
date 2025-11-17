import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ConversationAnalyticsResponse } from '@/api/generated/models/ConversationAnalyticsResponse'
import type { CostSummaryResponse } from '@/api/generated/models/CostSummaryResponse'
import type { KPISnapshotsListResponse } from '@/api/generated/models/KPISnapshotsListResponse'
import type { UsageStatisticsResponse } from '@/api/generated/models/UsageStatisticsResponse'

export const useAnalyticsStore = defineStore('analytics', () => {
  const conversationAnalytics = ref<ConversationAnalyticsResponse | null>(null)
  const costAnalytics = ref<CostSummaryResponse | null>(null)
  const kpiSnapshots = ref<KPISnapshotsListResponse | null>(null)
  const usageStatistics = ref<UsageStatisticsResponse | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const filters = ref<{
    start_date?: string | null
    end_date?: string | null
    period_type?: string | null
    period_start?: string | null
    limit?: number
    offset?: number
  }>({})

  function setConversationAnalytics(analytics: ConversationAnalyticsResponse | null) {
    conversationAnalytics.value = analytics
  }

  function setCostAnalytics(analytics: CostSummaryResponse | null) {
    costAnalytics.value = analytics
  }

  function setKpiSnapshots(snapshots: KPISnapshotsListResponse | null) {
    kpiSnapshots.value = snapshots
  }

  function setUsageStatistics(stats: UsageStatisticsResponse | null) {
    usageStatistics.value = stats
  }

  function setFilters(newFilters: {
    start_date?: string | null
    end_date?: string | null
    period_type?: string | null
    period_start?: string | null
    limit?: number
    offset?: number
  }) {
    filters.value = newFilters
  }

  function clearError() {
    error.value = null
  }

  function setError(err: string) {
    error.value = err
  }

  return {
    conversationAnalytics,
    costAnalytics,
    kpiSnapshots,
    usageStatistics,
    loading,
    error,
    filters,
    setConversationAnalytics,
    setCostAnalytics,
    setKpiSnapshots,
    setUsageStatistics,
    setFilters,
    clearError,
    setError,
  }
})

