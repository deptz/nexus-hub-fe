import { LogsService } from '@/api/generated/services/LogsService'
import type { LLMTraceResponse } from '@/api/generated/models/LLMTraceResponse'
import type { LLMTraceListResponse } from '@/api/generated/models/LLMTraceListResponse'
import { useTracesStore } from '@/stores/traces'
import { useApi } from './useApi'
import { getApiErrorMessage } from '@/api/client'

export function useTraces(tenantId: string) {
  const tracesStore = useTracesStore()
  const api = useApi()

  async function listLlmTraces(
    conversationId?: string | null,
    messageId?: string | null,
    provider?: string | null,
    model?: string | null,
    startDate?: string | null,
    endDate?: string | null,
    limit: number = 100,
    offset?: number
  ): Promise<LLMTraceResponse[]> {
    try {
      tracesStore.loading = true
      const result = await api.execute(() =>
        LogsService.listLlmTracesTenantsTenantIdTracesLlmGet(
          tenantId,
          conversationId,
          messageId,
          provider,
          model,
          startDate,
          endDate,
          limit,
          offset
        )
      )
      const response = result as LLMTraceListResponse
      const traces = response.items || []
      tracesStore.setTraces(traces)
      tracesStore.setFilters({
        conversation_id: conversationId,
        message_id: messageId,
        provider,
        model,
        start_date: startDate,
        end_date: endDate,
        limit,
        offset,
      })
      return traces
    } catch (error) {
      const errorMsg = getApiErrorMessage(error)
      tracesStore.setError(errorMsg)
      throw error
    } finally {
      tracesStore.loading = false
    }
  }

  async function getLlmTrace(traceId: string): Promise<LLMTraceResponse> {
    try {
      tracesStore.loading = true
      const result = await api.execute(() =>
        LogsService.getLlmTraceTenantsTenantIdTracesLlmTraceIdGet(tenantId, traceId)
      )
      const trace = result as LLMTraceResponse
      tracesStore.setCurrentTrace(trace)
      return trace
    } catch (error) {
      const errorMsg = getApiErrorMessage(error)
      tracesStore.setError(errorMsg)
      throw error
    } finally {
      tracesStore.loading = false
    }
  }

  async function getConversationTraces(
    conversationId: string,
    provider?: string | null,
    limit: number = 100,
    offset?: number
  ): Promise<LLMTraceResponse[]> {
    try {
      tracesStore.loading = true
      const result = await api.execute(() =>
        LogsService.getConversationTracesTenantsTenantIdConversationsConversationIdTracesGet(
          tenantId,
          conversationId,
          provider,
          limit,
          offset
        )
      )
      const response = result as LLMTraceListResponse
      const traces = response.items || []
      tracesStore.setTraces(traces)
      return traces
    } catch (error) {
      const errorMsg = getApiErrorMessage(error)
      tracesStore.setError(errorMsg)
      throw error
    } finally {
      tracesStore.loading = false
    }
  }

  async function getMessageTrace(messageId: string): Promise<LLMTraceResponse> {
    try {
      tracesStore.loading = true
      const result = await api.execute(() =>
        LogsService.getMessageTraceTenantsTenantIdMessagesMessageIdTraceGet(tenantId, messageId)
      )
      const trace = result as LLMTraceResponse
      tracesStore.setCurrentTrace(trace)
      return trace
    } catch (error) {
      const errorMsg = getApiErrorMessage(error)
      tracesStore.setError(errorMsg)
      throw error
    } finally {
      tracesStore.loading = false
    }
  }

  return {
    ...api,
    listLlmTraces,
    getLlmTrace,
    getConversationTraces,
    getMessageTrace,
  }
}

