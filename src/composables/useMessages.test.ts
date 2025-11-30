import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useMessagesStore } from '@/stores/messages'
import { MessagesService } from '@/api/generated/services/MessagesService'
import type { CanonicalMessage } from '@/api/generated/models/CanonicalMessage'

// Mock the MessagesService
vi.mock('@/api/generated/services/MessagesService', () => ({
  MessagesService: {
    handleInboundMessageMessagesInboundPost: vi.fn(),
    getMessageStatusMessagesStatusJobIdGet: vi.fn(),
  },
}))

// Mock getApiErrorMessage
vi.mock('@/api/client', () => ({
  getApiErrorMessage: (error: unknown) => {
    if (error instanceof Error) return error.message
    return 'An unexpected error occurred'
  },
}))

describe('useMessages', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('sendInboundMessage', () => {
    it('should send message with external_id successfully', async () => {
      const mockResponse = {
        status: 'success',
        message: { id: 'msg-123' },
        latency_ms: 1500,
        tool_calls_executed: 3,
      }

      vi.mocked(MessagesService.handleInboundMessageMessagesInboundPost).mockResolvedValue(
        mockResponse as any
      )

      const { useMessages } = await import('./useMessages')
      const { sendInboundMessage } = useMessages('tenant-123')

      const message: CanonicalMessage = {
        id: 'msg-123',
        tenant_id: 'tenant-123',
        conversation_id: 'conv-123',
        channel: 'web',
        direction: 'inbound',
        from: {
          type: 'user',
          external_id: 'user-123',
        },
        to: {
          type: 'bot',
          external_id: 'bot-123',
        },
        content: {
          type: 'text',
          text: 'Hello',
        },
        timestamp: new Date().toISOString(),
      }

      const result = await sendInboundMessage(message, false)

      expect(MessagesService.handleInboundMessageMessagesInboundPost).toHaveBeenCalledWith(
        message,
        false
      )
      expect(result).toEqual(mockResponse)
    })

    it('should handle error when sending message', async () => {
      const mockError = new Error('API Error')
      vi.mocked(MessagesService.handleInboundMessageMessagesInboundPost).mockRejectedValue(
        mockError
      )

      const { useMessages } = await import('./useMessages')
      const { sendInboundMessage } = useMessages('tenant-123')
      const messagesStore = useMessagesStore()

      const message: CanonicalMessage = {
        id: 'msg-123',
        tenant_id: 'tenant-123',
        conversation_id: 'conv-123',
        channel: 'web',
        direction: 'inbound',
        from: {
          type: 'user',
          external_id: 'user-123',
        },
        to: {
          type: 'bot',
          external_id: 'bot-123',
        },
        content: {
          type: 'text',
          text: 'Hello',
        },
        timestamp: new Date().toISOString(),
      }

      await expect(sendInboundMessage(message, false)).rejects.toThrow('API Error')
      expect(messagesStore.error).toBe('API Error')
    })
  })
})
