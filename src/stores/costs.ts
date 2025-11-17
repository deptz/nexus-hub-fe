import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { CostSummaryResponse } from '@/api/generated/models/CostSummaryResponse'
import type { CostBreakdownResponse } from '@/api/generated/models/CostBreakdownResponse'
import type { CostByPeriodResponse } from '@/api/generated/models/CostByPeriodResponse'
import type { CostByConversationResponse } from '@/api/generated/models/CostByConversationResponse'
import type { CostEstimateResponse } from '@/api/generated/models/CostEstimateResponse'

export const useCostsStore = defineStore('costs', () => {
  const costSummary = ref<CostSummaryResponse | null>(null)
  const costBreakdown = ref<CostBreakdownResponse | null>(null)
  const costByPeriod = ref<CostByPeriodResponse | null>(null)
  const costByConversation = ref<CostByConversationResponse | null>(null)
  const costEstimate = ref<CostEstimateResponse | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const filters = ref<{
    start_date?: string | null
    end_date?: string | null
    period_type?: string
    limit?: number
    offset?: number
  }>({})

  function setCostSummary(summary: CostSummaryResponse | null) {
    costSummary.value = summary
  }

  function setCostBreakdown(breakdown: CostBreakdownResponse | null) {
    costBreakdown.value = breakdown
  }

  function setCostByPeriod(byPeriod: CostByPeriodResponse | null) {
    costByPeriod.value = byPeriod
  }

  function setCostByConversation(byConversation: CostByConversationResponse | null) {
    costByConversation.value = byConversation
  }

  function setCostEstimate(estimate: CostEstimateResponse | null) {
    costEstimate.value = estimate
  }

  function setFilters(newFilters: {
    start_date?: string | null
    end_date?: string | null
    period_type?: string
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
    costSummary,
    costBreakdown,
    costByPeriod,
    costByConversation,
    costEstimate,
    loading,
    error,
    filters,
    setCostSummary,
    setCostBreakdown,
    setCostByPeriod,
    setCostByConversation,
    setCostEstimate,
    setFilters,
    clearError,
    setError,
  }
})

