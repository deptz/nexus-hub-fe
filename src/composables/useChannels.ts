import { TenantManagementService } from '@/api/generated/services/TenantManagementService'
import type { CreateChannelRequest } from '@/api/generated/models/CreateChannelRequest'
import type { UpdateChannelRequest } from '@/api/generated/models/UpdateChannelRequest'
import type { ChannelResponse } from '@/api/generated/models/ChannelResponse'
import type { ChannelListResponse } from '@/api/generated/models/ChannelListResponse'
import { useChannelsStore } from '@/stores/channels'
import { useApi } from './useApi'
import { getApiErrorMessage } from '@/api/client'

export function useChannels(tenantId: string) {
  const channelsStore = useChannelsStore()
  const api = useApi()

  async function listChannels(
    channelType?: string | null,
    isActive?: boolean | null
  ): Promise<ChannelResponse[]> {
    try {
      channelsStore.loading = true
      const result = await api.execute(() =>
        TenantManagementService.listChannelsTenantsTenantIdChannelsGet(
          tenantId,
          channelType,
          isActive
        )
      )
      const response = result as ChannelListResponse
      const channels = response.items || []
      channelsStore.setChannels(channels)
      channelsStore.setFilters({ channel_type: channelType, is_active: isActive })
      return channels
    } catch (error) {
      const errorMsg = getApiErrorMessage(error)
      channelsStore.setError(errorMsg)
      throw error
    } finally {
      channelsStore.loading = false
    }
  }

  async function getChannel(channelId: string): Promise<ChannelResponse> {
    try {
      channelsStore.loading = true
      const result = await api.execute(() =>
        TenantManagementService.getChannelTenantsTenantIdChannelsChannelIdGet(
          tenantId,
          channelId
        )
      )
      const channel = result as ChannelResponse
      channelsStore.setCurrentChannel(channel)
      return channel
    } catch (error) {
      const errorMsg = getApiErrorMessage(error)
      channelsStore.setError(errorMsg)
      throw error
    } finally {
      channelsStore.loading = false
    }
  }

  async function createChannel(request: CreateChannelRequest): Promise<ChannelResponse> {
    try {
      channelsStore.loading = true
      const result = await api.execute(() =>
        TenantManagementService.createChannelTenantsTenantIdChannelsPost(tenantId, request)
      )
      const newChannel = result as ChannelResponse
      channelsStore.addChannel(newChannel)
      return newChannel
    } catch (error) {
      const errorMsg = getApiErrorMessage(error)
      channelsStore.setError(errorMsg)
      throw error
    } finally {
      channelsStore.loading = false
    }
  }

  async function updateChannel(
    channelId: string,
    request: UpdateChannelRequest
  ): Promise<ChannelResponse> {
    try {
      channelsStore.loading = true
      const result = await api.execute(() =>
        TenantManagementService.updateChannelTenantsTenantIdChannelsChannelIdPut(
          tenantId,
          channelId,
          request
        )
      )
      const updatedChannel = result as ChannelResponse
      channelsStore.updateChannel(channelId, updatedChannel)
      if (channelsStore.currentChannel?.id === channelId) {
        channelsStore.setCurrentChannel(updatedChannel)
      }
      return updatedChannel
    } catch (error) {
      const errorMsg = getApiErrorMessage(error)
      channelsStore.setError(errorMsg)
      throw error
    } finally {
      channelsStore.loading = false
    }
  }

  async function deleteChannel(channelId: string): Promise<void> {
    try {
      channelsStore.loading = true
      await api.execute(() =>
        TenantManagementService.deleteChannelTenantsTenantIdChannelsChannelIdDelete(
          tenantId,
          channelId
        )
      )
      channelsStore.removeChannel(channelId)
      if (channelsStore.currentChannel?.id === channelId) {
        channelsStore.setCurrentChannel(null)
      }
    } catch (error) {
      const errorMsg = getApiErrorMessage(error)
      channelsStore.setError(errorMsg)
      throw error
    } finally {
      channelsStore.loading = false
    }
  }

  return {
    ...api,
    listChannels,
    getChannel,
    createChannel,
    updateChannel,
    deleteChannel,
  }
}

