import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLogsStore = defineStore('logs', () => {
  const eventLogs = ref<any[]>([])
  const toolCallLogs = ref<any[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const filters = ref<{
    conversation_id?: string | null
    event_type?: string | null
    provider?: string | null
    tool_name?: string | null
    status?: string | null
    start_date?: string | null
    end_date?: string | null
    limit?: number
    offset?: number
  }>({})

  function setEventLogs(logs: any[]) {
    eventLogs.value = logs
  }

  function setToolCallLogs(logs: any[]) {
    toolCallLogs.value = logs
  }

  function setFilters(newFilters: {
    conversation_id?: string | null
    event_type?: string | null
    provider?: string | null
    tool_name?: string | null
    status?: string | null
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
    eventLogs,
    toolCallLogs,
    loading,
    error,
    filters,
    setEventLogs,
    setToolCallLogs,
    setFilters,
    clearError,
    setError,
  }
})

