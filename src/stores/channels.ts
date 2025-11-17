import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ChannelResponse } from '@/api/generated/models/ChannelResponse'

export const useChannelsStore = defineStore('channels', () => {
  const channels = ref<ChannelResponse[]>([])
  const currentChannel = ref<ChannelResponse | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const filters = ref<{
    channel_type?: string | null
    is_active?: boolean | null
  }>({})

  function setChannels(channelsList: ChannelResponse[]) {
    channels.value = channelsList
  }

  function addChannel(channel: ChannelResponse) {
    channels.value.push(channel)
  }

  function removeChannel(channelId: string) {
    channels.value = channels.value.filter((channel) => channel.id !== channelId)
  }

  function updateChannel(channelId: string, updates: Partial<ChannelResponse>) {
    const index = channels.value.findIndex((channel) => channel.id === channelId)
    if (index !== -1) {
      channels.value[index] = { ...channels.value[index], ...updates }
    }
    if (currentChannel.value?.id === channelId) {
      currentChannel.value = { ...currentChannel.value, ...updates }
    }
  }

  function setCurrentChannel(channel: ChannelResponse | null) {
    currentChannel.value = channel
  }

  function setFilters(newFilters: { channel_type?: string | null; is_active?: boolean | null }) {
    filters.value = newFilters
  }

  function clearError() {
    error.value = null
  }

  function setError(err: string) {
    error.value = err
  }

  return {
    channels,
    currentChannel,
    loading,
    error,
    filters,
    setChannels,
    addChannel,
    removeChannel,
    updateChannel,
    setCurrentChannel,
    setFilters,
    clearError,
    setError,
  }
})

