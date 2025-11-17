import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { MCPServerResponse } from '@/api/generated/models/MCPServerResponse'
import type { MCPServerToolResponse } from '@/api/generated/models/MCPServerToolResponse'

export const useMcpServersStore = defineStore('mcpServers', () => {
  const servers = ref<MCPServerResponse[]>([])
  const currentServer = ref<MCPServerResponse | null>(null)
  const serverTools = ref<MCPServerToolResponse[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const filters = ref<{
    is_active?: boolean | null
  }>({})

  function setServers(serversList: MCPServerResponse[]) {
    servers.value = serversList
  }

  function addServer(server: MCPServerResponse) {
    servers.value.push(server)
  }

  function removeServer(serverId: string) {
    servers.value = servers.value.filter((server) => server.id !== serverId)
  }

  function updateServer(serverId: string, updates: Partial<MCPServerResponse>) {
    const index = servers.value.findIndex((server) => server.id === serverId)
    if (index !== -1) {
      servers.value[index] = { ...servers.value[index], ...updates }
    }
    if (currentServer.value?.id === serverId) {
      currentServer.value = { ...currentServer.value, ...updates }
    }
  }

  function setCurrentServer(server: MCPServerResponse | null) {
    currentServer.value = server
  }

  function setServerTools(tools: MCPServerToolResponse[]) {
    serverTools.value = tools
  }

  function addServerTool(tool: MCPServerToolResponse) {
    serverTools.value.push(tool)
  }

  function removeServerTool(toolName: string) {
    serverTools.value = serverTools.value.filter((tool) => tool.tool_name !== toolName)
  }

  function setFilters(newFilters: { is_active?: boolean | null }) {
    filters.value = newFilters
  }

  function clearError() {
    error.value = null
  }

  function setError(err: string) {
    error.value = err
  }

  return {
    servers,
    currentServer,
    serverTools,
    loading,
    error,
    filters,
    setServers,
    addServer,
    removeServer,
    updateServer,
    setCurrentServer,
    setServerTools,
    addServerTool,
    removeServerTool,
    setFilters,
    clearError,
    setError,
  }
})

