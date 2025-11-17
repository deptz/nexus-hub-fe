import { McpServersService } from '@/api/generated/services/McpServersService'
import type { CreateMCPServerRequest } from '@/api/generated/models/CreateMCPServerRequest'
import type { UpdateMCPServerRequest } from '@/api/generated/models/UpdateMCPServerRequest'
import type { MCPServerResponse } from '@/api/generated/models/MCPServerResponse'
import type { CreateMCPServerToolRequest } from '@/api/generated/models/CreateMCPServerToolRequest'
import type { MCPServerToolResponse } from '@/api/generated/models/MCPServerToolResponse'
import { useMcpServersStore } from '@/stores/mcpServers'
import { useApi } from './useApi'
import { getApiErrorMessage } from '@/api/client'

export function useMcpServers(tenantId: string) {
  const mcpStore = useMcpServersStore()
  const api = useApi()

  async function listMcpServers(isActive?: boolean | null): Promise<MCPServerResponse[]> {
    try {
      mcpStore.loading = true
      const result = await api.execute(() =>
        McpServersService.listMcpServersTenantsTenantIdMcpServersGet(tenantId, isActive)
      )
      // The API returns any, but we expect an array or object with items
      let servers: MCPServerResponse[] = []
      if (Array.isArray(result)) {
        servers = result as MCPServerResponse[]
      } else if (result && typeof result === 'object' && 'items' in result) {
        servers = (result as any).items || []
      }
      mcpStore.setServers(servers)
      mcpStore.setFilters({ is_active: isActive })
      return servers
    } catch (error) {
      const errorMsg = getApiErrorMessage(error)
      mcpStore.setError(errorMsg)
      throw error
    } finally {
      mcpStore.loading = false
    }
  }

  async function getMcpServer(serverId: string): Promise<MCPServerResponse> {
    try {
      mcpStore.loading = true
      const result = await api.execute(() =>
        McpServersService.getMcpServerTenantsTenantIdMcpServersServerIdGet(tenantId, serverId)
      )
      const server = result as MCPServerResponse
      mcpStore.setCurrentServer(server)
      return server
    } catch (error) {
      const errorMsg = getApiErrorMessage(error)
      mcpStore.setError(errorMsg)
      throw error
    } finally {
      mcpStore.loading = false
    }
  }

  async function createMcpServer(request: CreateMCPServerRequest): Promise<MCPServerResponse> {
    try {
      mcpStore.loading = true
      const result = await api.execute(() =>
        McpServersService.createMcpServerTenantsTenantIdMcpServersPost(tenantId, request)
      )
      const newServer = result as MCPServerResponse
      mcpStore.addServer(newServer)
      return newServer
    } catch (error) {
      const errorMsg = getApiErrorMessage(error)
      mcpStore.setError(errorMsg)
      throw error
    } finally {
      mcpStore.loading = false
    }
  }

  async function updateMcpServer(
    serverId: string,
    request: UpdateMCPServerRequest
  ): Promise<MCPServerResponse> {
    try {
      mcpStore.loading = true
      const result = await api.execute(() =>
        McpServersService.updateMcpServerTenantsTenantIdMcpServersServerIdPut(
          tenantId,
          serverId,
          request
        )
      )
      const updatedServer = result as MCPServerResponse
      mcpStore.updateServer(serverId, updatedServer)
      if (mcpStore.currentServer?.id === serverId) {
        mcpStore.setCurrentServer(updatedServer)
      }
      return updatedServer
    } catch (error) {
      const errorMsg = getApiErrorMessage(error)
      mcpStore.setError(errorMsg)
      throw error
    } finally {
      mcpStore.loading = false
    }
  }

  async function deleteMcpServer(serverId: string): Promise<void> {
    try {
      mcpStore.loading = true
      await api.execute(() =>
        McpServersService.deleteMcpServerTenantsTenantIdMcpServersServerIdDelete(tenantId, serverId)
      )
      mcpStore.removeServer(serverId)
      if (mcpStore.currentServer?.id === serverId) {
        mcpStore.setCurrentServer(null)
      }
    } catch (error) {
      const errorMsg = getApiErrorMessage(error)
      mcpStore.setError(errorMsg)
      throw error
    } finally {
      mcpStore.loading = false
    }
  }

  async function listMcpServerTools(serverId: string): Promise<MCPServerToolResponse[]> {
    try {
      mcpStore.loading = true
      const result = await api.execute(() =>
        McpServersService.listMcpServerToolsTenantsTenantIdMcpServersServerIdToolsGet(
          tenantId,
          serverId
        )
      )
      // The API returns any, but we expect an array or object with items
      let tools: MCPServerToolResponse[] = []
      if (Array.isArray(result)) {
        tools = result as MCPServerToolResponse[]
      } else if (result && typeof result === 'object' && 'items' in result) {
        tools = (result as any).items || []
      }
      mcpStore.setServerTools(tools)
      return tools
    } catch (error) {
      const errorMsg = getApiErrorMessage(error)
      mcpStore.setError(errorMsg)
      throw error
    } finally {
      mcpStore.loading = false
    }
  }

  async function createMcpServerTool(
    serverId: string,
    request: CreateMCPServerToolRequest
  ): Promise<MCPServerToolResponse> {
    try {
      mcpStore.loading = true
      const result = await api.execute(() =>
        McpServersService.createMcpServerToolTenantsTenantIdMcpServersServerIdToolsPost(
          tenantId,
          serverId,
          request
        )
      )
      const tool = result as MCPServerToolResponse
      mcpStore.addServerTool(tool)
      return tool
    } catch (error) {
      const errorMsg = getApiErrorMessage(error)
      mcpStore.setError(errorMsg)
      throw error
    } finally {
      mcpStore.loading = false
    }
  }

  async function deleteMcpServerTool(serverId: string, toolName: string): Promise<void> {
    try {
      mcpStore.loading = true
      await api.execute(() =>
        McpServersService.deleteMcpServerToolTenantsTenantIdMcpServersServerIdToolsToolNameDelete(
          tenantId,
          serverId,
          toolName
        )
      )
      mcpStore.removeServerTool(toolName)
    } catch (error) {
      const errorMsg = getApiErrorMessage(error)
      mcpStore.setError(errorMsg)
      throw error
    } finally {
      mcpStore.loading = false
    }
  }

  return {
    ...api,
    listMcpServers,
    getMcpServer,
    createMcpServer,
    updateMcpServer,
    deleteMcpServer,
    listMcpServerTools,
    createMcpServerTool,
    deleteMcpServerTool,
  }
}

