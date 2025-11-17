import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { LLMTraceResponse } from '@/api/generated/models/LLMTraceResponse'

export const useTracesStore = defineStore('traces', () => {
  const traces = ref<LLMTraceResponse[]>([])
  const currentTrace = ref<LLMTraceResponse | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const filters = ref<{
    conversation_id?: string | null
    message_id?: string | null
    provider?: string | null
    model?: string | null
    start_date?: string | null
    end_date?: string | null
    limit?: number
    offset?: number
  }>({})

  function setTraces(tracesList: LLMTraceResponse[]) {
    traces.value = tracesList
  }

  function setCurrentTrace(trace: LLMTraceResponse | null) {
    currentTrace.value = trace
  }

  function setFilters(newFilters: {
    conversation_id?: string | null
    message_id?: string | null
    provider?: string | null
    model?: string | null
    start_date?: string | null
    end_date?: string | null
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
    traces,
    currentTrace,
    loading,
    error,
    filters,
    setTraces,
    setCurrentTrace,
    setFilters,
    clearError,
    setError,
  }
})

