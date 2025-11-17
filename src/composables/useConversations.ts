import { ConversationsService } from '@/api/generated/services/ConversationsService'
import type { UpdateConversationRequest } from '@/api/generated/models/UpdateConversationRequest'
import type { ConversationResponse } from '@/api/generated/models/ConversationResponse'
import type { ConversationListResponse } from '@/api/generated/models/ConversationListResponse'
import type { ConversationStatsResponse } from '@/api/generated/models/ConversationStatsResponse'
import { useConversationsStore } from '@/stores/conversations'
import { useApi } from './useApi'
import { getApiErrorMessage } from '@/api/client'

export function useConversations(tenantId: string) {
  const convStore = useConversationsStore()
  const api = useApi()

  async function listConversations(
    status?: string | null,
    channelId?: string | null,
    startDate?: string | null,
    endDate?: string | null,
    limit: number = 100,
    offset?: number,
    sortBy: string = 'created_at',
    sortOrder: string = 'desc'
  ): Promise<ConversationResponse[]> {
    try {
      convStore.loading = true
      const result = await api.execute(() =>
        ConversationsService.listConversationsTenantsTenantIdConversationsGet(
          tenantId,
          status,
          channelId,
          startDate,
          endDate,
          limit,
          offset,
          sortBy,
          sortOrder
        )
      )
      const response = result as ConversationListResponse
      const convs = response.items || []
      convStore.setConversations(convs)
      convStore.setFilters({ status, channel_id: channelId, start_date: startDate, end_date: endDate, limit, offset, sort_by: sortBy, sort_order: sortOrder })
      return convs
    } catch (error) {
      const errorMsg = getApiErrorMessage(error)
      convStore.setError(errorMsg)
      throw error
    } finally {
      convStore.loading = false
    }
  }

  async function getConversation(conversationId: string): Promise<ConversationResponse> {
    try {
      convStore.loading = true
      const result = await api.execute(() =>
        ConversationsService.getConversationTenantsTenantIdConversationsConversationIdGet(
          tenantId,
          conversationId
        )
      )
      const conv = result as ConversationResponse
      convStore.setCurrentConversation(conv)
      return conv
    } catch (error) {
      const errorMsg = getApiErrorMessage(error)
      convStore.setError(errorMsg)
      throw error
    } finally {
      convStore.loading = false
    }
  }

  async function updateConversation(
    conversationId: string,
    request: UpdateConversationRequest
  ): Promise<ConversationResponse> {
    try {
      convStore.loading = true
      const result = await api.execute(() =>
        ConversationsService.updateConversationTenantsTenantIdConversationsConversationIdPut(
          tenantId,
          conversationId,
          request
        )
      )
      const updatedConv = result as ConversationResponse
      convStore.updateConversation(conversationId, updatedConv)
      if (convStore.currentConversation?.id === conversationId) {
        convStore.setCurrentConversation(updatedConv)
      }
      return updatedConv
    } catch (error) {
      const errorMsg = getApiErrorMessage(error)
      convStore.setError(errorMsg)
      throw error
    } finally {
      convStore.loading = false
    }
  }

  async function deleteConversation(conversationId: string): Promise<void> {
    try {
      convStore.loading = true
      await api.execute(() =>
        ConversationsService.deleteConversationTenantsTenantIdConversationsConversationIdDelete(
          tenantId,
          conversationId
        )
      )
      convStore.removeConversation(conversationId)
      if (convStore.currentConversation?.id === conversationId) {
        convStore.setCurrentConversation(null)
      }
    } catch (error) {
      const errorMsg = getApiErrorMessage(error)
      convStore.setError(errorMsg)
      throw error
    } finally {
      convStore.loading = false
    }
  }

  async function getConversationStats(conversationId: string): Promise<ConversationStatsResponse> {
    try {
      convStore.loading = true
      const result = await api.execute(() =>
        ConversationsService.getConversationStatsTenantsTenantIdConversationsConversationIdStatsGet(
          tenantId,
          conversationId
        )
      )
      const stats = result as ConversationStatsResponse
      convStore.setConversationStats(stats)
      return stats
    } catch (error) {
      const errorMsg = getApiErrorMessage(error)
      convStore.setError(errorMsg)
      throw error
    } finally {
      convStore.loading = false
    }
  }

  async function resolveConversation(conversationId: string, resolved: boolean = true): Promise<void> {
    try {
      convStore.loading = true
      await api.execute(() =>
        ConversationsService.resolveConversationTenantsTenantIdConversationsConversationIdResolvePut(
          tenantId,
          conversationId,
          resolved
        )
      )
      // Update the conversation status
      const status = resolved ? 'closed' : 'open'
      convStore.updateConversation(conversationId, { status })
      if (convStore.currentConversation?.id === conversationId) {
        convStore.setCurrentConversation({ ...convStore.currentConversation, status })
      }
    } catch (error) {
      const errorMsg = getApiErrorMessage(error)
      convStore.setError(errorMsg)
      throw error
    } finally {
      convStore.loading = false
    }
  }

  return {
    ...api,
    listConversations,
    getConversation,
    updateConversation,
    deleteConversation,
    getConversationStats,
    resolveConversation,
  }
}

