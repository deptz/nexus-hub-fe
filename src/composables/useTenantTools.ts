import { TenantManagementService } from '@/api/generated/services/TenantManagementService'
import type { EnableToolRequest } from '@/api/generated/models/EnableToolRequest'
import type { UpdateToolPolicyRequest } from '@/api/generated/models/UpdateToolPolicyRequest'
import type { TenantToolResponse } from '@/api/generated/models/TenantToolResponse'
import type { TenantToolsListResponse } from '@/api/generated/models/TenantToolsListResponse'
import { useTenantToolsStore } from '@/stores/tenantTools'
import { useApi } from './useApi'
import { getApiErrorMessage } from '@/api/client'

export function useTenantTools(tenantId: string) {
  const toolsStore = useTenantToolsStore()
  const api = useApi()

  async function listTenantTools(includeDisabled: boolean = false): Promise<TenantToolResponse[]> {
    try {
      toolsStore.loading = true
      const result = await api.execute(() =>
        TenantManagementService.listTenantToolsTenantsTenantIdToolsGet(tenantId, includeDisabled)
      )
      const response = result as TenantToolsListResponse
      const tools = response.items || []
      toolsStore.setTools(tools)
      toolsStore.setFilters({ include_disabled: includeDisabled })
      return tools
    } catch (error) {
      const errorMsg = getApiErrorMessage(error)
      toolsStore.setError(errorMsg)
      throw error
    } finally {
      toolsStore.loading = false
    }
  }

  async function enableTool(request: EnableToolRequest): Promise<TenantToolResponse> {
    try {
      toolsStore.loading = true
      const result = await api.execute(() =>
        TenantManagementService.enableToolForTenantTenantsTenantIdToolsPost(tenantId, request)
      )
      const tool = result as TenantToolResponse
      toolsStore.addTool(tool)
      return tool
    } catch (error) {
      const errorMsg = getApiErrorMessage(error)
      toolsStore.setError(errorMsg)
      throw error
    } finally {
      toolsStore.loading = false
    }
  }

  async function updateToolPolicy(
    toolName: string,
    request: UpdateToolPolicyRequest
  ): Promise<TenantToolResponse> {
    try {
      toolsStore.loading = true
      const result = await api.execute(() =>
        TenantManagementService.updateToolPolicyTenantsTenantIdToolsToolNamePut(
          tenantId,
          toolName,
          request
        )
      )
      const updatedTool = result as TenantToolResponse
      toolsStore.updateTool(toolName, updatedTool)
      return updatedTool
    } catch (error) {
      const errorMsg = getApiErrorMessage(error)
      toolsStore.setError(errorMsg)
      throw error
    } finally {
      toolsStore.loading = false
    }
  }

  async function disableTool(toolName: string): Promise<void> {
    try {
      toolsStore.loading = true
      await api.execute(() =>
        TenantManagementService.disableToolForTenantTenantsTenantIdToolsToolNameDelete(
          tenantId,
          toolName
        )
      )
      toolsStore.removeTool(toolName)
    } catch (error) {
      const errorMsg = getApiErrorMessage(error)
      toolsStore.setError(errorMsg)
      throw error
    } finally {
      toolsStore.loading = false
    }
  }

  return {
    ...api,
    listTenantTools,
    enableTool,
    updateToolPolicy,
    disableTool,
  }
}

