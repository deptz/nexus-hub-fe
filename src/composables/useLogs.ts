import { LogsService } from '@/api/generated/services/LogsService'
import type { LogQueryResponse } from '@/api/generated/models/LogQueryResponse'
import { useLogsStore } from '@/stores/logs'
import { useApi } from './useApi'
import { getApiErrorMessage } from '@/api/client'

export function useLogs(tenantId: string) {
  const logsStore = useLogsStore()
  const api = useApi()

  async function getEventLogs(
    conversationId?: string | null,
    eventType?: string | null,
    provider?: string | null,
    startDate?: string | null,
    endDate?: string | null,
    limit: number = 100,
    offset?: number
  ): Promise<LogQueryResponse> {
    try {
      logsStore.loading = true
      const result = await api.execute(() =>
        LogsService.getEventLogsTenantsTenantIdLogsEventsGet(
          tenantId,
          conversationId,
          eventType,
          provider,
          startDate,
          endDate,
          limit,
          offset
        )
      )
      const response = result as LogQueryResponse
      logsStore.setEventLogs(response.items || [])
      logsStore.setFilters({
        conversation_id: conversationId,
        event_type: eventType,
        provider,
        start_date: startDate,
        end_date: endDate,
        limit,
        offset,
      })
      return response
    } catch (error) {
      const errorMsg = getApiErrorMessage(error)
      logsStore.setError(errorMsg)
      throw error
    } finally {
      logsStore.loading = false
    }
  }

  async function getToolCallLogs(
    conversationId?: string | null,
    toolName?: string | null,
    status?: string | null,
    startDate?: string | null,
    endDate?: string | null,
    limit: number = 100,
    offset?: number
  ): Promise<LogQueryResponse> {
    try {
      logsStore.loading = true
      const result = await api.execute(() =>
        LogsService.getToolCallLogsTenantsTenantIdLogsToolCallsGet(
          tenantId,
          conversationId,
          toolName,
          status,
          startDate,
          endDate,
          limit,
          offset
        )
      )
      const response = result as LogQueryResponse
      logsStore.setToolCallLogs(response.items || [])
      logsStore.setFilters({
        conversation_id: conversationId,
        tool_name: toolName,
        status,
        start_date: startDate,
        end_date: endDate,
        limit,
        offset,
      })
      return response
    } catch (error) {
      const errorMsg = getApiErrorMessage(error)
      logsStore.setError(errorMsg)
      throw error
    } finally {
      logsStore.loading = false
    }
  }

  return {
    ...api,
    getEventLogs,
    getToolCallLogs,
  }
}

