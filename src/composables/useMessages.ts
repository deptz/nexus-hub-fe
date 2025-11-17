import { MessagesService } from '@/api/generated/services/MessagesService'
import type { CanonicalMessage } from '@/api/generated/models/CanonicalMessage'
import type { MessageResponse } from '@/api/generated/models/MessageResponse'
import type { MessageListResponse } from '@/api/generated/models/MessageListResponse'
import { useMessagesStore } from '@/stores/messages'
import { useApi } from './useApi'
import { getApiErrorMessage } from '@/api/client'

export function useMessages(tenantId?: string) {
  const messagesStore = useMessagesStore()
  const api = useApi()

  async function sendInboundMessage(
    message: CanonicalMessage,
    asyncProcessing: boolean = false
  ) {
    try {
      const result = await api.execute(() =>
        MessagesService.handleInboundMessageMessagesInboundPost(message, asyncProcessing)
      )
      return result
    } catch (error) {
      messagesStore.setError(getApiErrorMessage(error))
      throw error
    }
  }

  async function getMessageStatus(jobId: string) {
    try {
      const result = await api.execute(() =>
        MessagesService.getMessageStatusMessagesStatusJobIdGet(jobId)
      )
      const status = {
        status: result.status || 'unknown',
        job_id: jobId,
        result: result.result,
        error: result.error,
      }
      messagesStore.setJobStatus(jobId, status as any)
      return result
    } catch (error) {
      messagesStore.setError(getApiErrorMessage(error))
      throw error
    }
  }

  async function listMessages(
    conversationId?: string | null,
    direction?: string | null,
    contentType?: string | null,
    startDate?: string | null,
    endDate?: string | null,
    limit: number = 100,
    offset?: number,
    sortBy: string = 'created_at',
    sortOrder: string = 'desc'
  ): Promise<MessageResponse[]> {
    if (!tenantId) {
      throw new Error('Tenant ID is required')
    }
    try {
      messagesStore.loading = true
      const result = await api.execute(() =>
        MessagesService.listMessagesTenantsTenantIdMessagesGet(
          tenantId,
          conversationId,
          direction,
          contentType,
          startDate,
          endDate,
          limit,
          offset,
          sortBy,
          sortOrder
        )
      )
      const response = result as MessageListResponse
      const messages = response.items || []
      messagesStore.setMessages(messages)
      return messages
    } catch (error) {
      const errorMsg = getApiErrorMessage(error)
      messagesStore.setError(errorMsg)
      throw error
    } finally {
      messagesStore.loading = false
    }
  }

  async function getMessage(messageId: string): Promise<MessageResponse> {
    if (!tenantId) {
      throw new Error('Tenant ID is required')
    }
    try {
      messagesStore.loading = true
      const result = await api.execute(() =>
        MessagesService.getMessageTenantsTenantIdMessagesMessageIdGet(tenantId, messageId)
      )
      return result as MessageResponse
    } catch (error) {
      const errorMsg = getApiErrorMessage(error)
      messagesStore.setError(errorMsg)
      throw error
    } finally {
      messagesStore.loading = false
    }
  }

  async function listConversationMessages(
    conversationId: string,
    direction?: string | null,
    limit: number = 100,
    offset?: number,
    sortOrder: string = 'asc'
  ): Promise<MessageResponse[]> {
    if (!tenantId) {
      throw new Error('Tenant ID is required')
    }
    try {
      messagesStore.loading = true
      const result = await api.execute(() =>
        MessagesService.listConversationMessagesTenantsTenantIdConversationsConversationIdMessagesGet(
          tenantId,
          conversationId,
          direction,
          limit,
          offset,
          sortOrder
        )
      )
      const response = result as MessageListResponse
      const messages = response.items || []
      messagesStore.setMessages(messages)
      return messages
    } catch (error) {
      const errorMsg = getApiErrorMessage(error)
      messagesStore.setError(errorMsg)
      throw error
    } finally {
      messagesStore.loading = false
    }
  }

  function pollMessageStatus(jobId: string, interval: number = 2000, maxAttempts: number = 30) {
    let attempts = 0
    const poll = async () => {
      if (attempts >= maxAttempts) {
        messagesStore.setError('Polling timeout: Message status check exceeded maximum attempts')
        return
      }
      attempts++
      try {
        const status = await getMessageStatus(jobId)
        if (status.status === 'completed' || status.status === 'failed') {
          return status
        }
        setTimeout(poll, interval)
      } catch (error) {
        messagesStore.setError(getApiErrorMessage(error))
      }
    }
    poll()
  }

  return {
    ...api,
    sendInboundMessage,
    getMessageStatus,
    pollMessageStatus,
    listMessages,
    getMessage,
    listConversationMessages,
  }
}

