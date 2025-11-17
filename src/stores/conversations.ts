import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ConversationResponse } from '@/api/generated/models/ConversationResponse'
import type { ConversationStatsResponse } from '@/api/generated/models/ConversationStatsResponse'

export const useConversationsStore = defineStore('conversations', () => {
  const conversations = ref<ConversationResponse[]>([])
  const currentConversation = ref<ConversationResponse | null>(null)
  const conversationStats = ref<ConversationStatsResponse | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const filters = ref<{
    status?: string | null
    channel_id?: string | null
    start_date?: string | null
    end_date?: string | null
    limit?: number
    offset?: number
    sort_by?: string
    sort_order?: string
  }>({})

  function setConversations(convs: ConversationResponse[]) {
    conversations.value = convs
  }

  function addConversation(conv: ConversationResponse) {
    conversations.value.push(conv)
  }

  function removeConversation(convId: string) {
    conversations.value = conversations.value.filter((conv) => conv.id !== convId)
  }

  function updateConversation(convId: string, updates: Partial<ConversationResponse>) {
    const index = conversations.value.findIndex((conv) => conv.id === convId)
    if (index !== -1) {
      conversations.value[index] = { ...conversations.value[index], ...updates }
    }
    if (currentConversation.value?.id === convId) {
      currentConversation.value = { ...currentConversation.value, ...updates }
    }
  }

  function setCurrentConversation(conv: ConversationResponse | null) {
    currentConversation.value = conv
  }

  function setConversationStats(stats: ConversationStatsResponse | null) {
    conversationStats.value = stats
  }

  function setFilters(newFilters: {
    status?: string | null
    channel_id?: string | null
    start_date?: string | null
    end_date?: string | null
    limit?: number
    offset?: number
    sort_by?: string
    sort_order?: string
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
    conversations,
    currentConversation,
    conversationStats,
    loading,
    error,
    filters,
    setConversations,
    addConversation,
    removeConversation,
    updateConversation,
    setCurrentConversation,
    setConversationStats,
    setFilters,
    clearError,
    setError,
  }
})

