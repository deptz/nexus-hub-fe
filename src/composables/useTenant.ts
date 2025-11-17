import { TenantManagementService } from '@/api/generated/services/TenantManagementService'
import type { UpdatePromptRequest } from '@/api/generated/models/UpdatePromptRequest'
import type { GetPromptResponse } from '@/api/generated/models/GetPromptResponse'
import { useTenantStore } from '@/stores/tenant'
import { useApi } from './useApi'
import { getApiErrorMessage } from '@/api/client'

export function useTenant(tenantId: string) {
  const tenantStore = useTenantStore()
  const api = useApi()

  async function getPrompt(): Promise<GetPromptResponse | null> {
    try {
      tenantStore.loading = true
      const result = await api.execute(() =>
        TenantManagementService.getTenantPromptTenantsTenantIdPromptGet(tenantId)
      )
      if (result && typeof result === 'object' && 'custom_system_prompt' in result) {
        tenantStore.setPrompt((result as GetPromptResponse).custom_system_prompt)
      }
      return result as GetPromptResponse
    } catch (error) {
      const errorMsg = getApiErrorMessage(error)
      // 404 is expected if no prompt exists
      if (errorMsg.includes('404') || errorMsg.includes('Not Found')) {
        tenantStore.setPrompt(null)
        return null
      }
      tenantStore.setError(errorMsg)
      throw error
    } finally {
      tenantStore.loading = false
    }
  }

  async function updatePrompt(request: UpdatePromptRequest) {
    try {
      tenantStore.loading = true
      const result = await api.execute(() =>
        TenantManagementService.updateTenantPromptTenantsTenantIdPromptPut(tenantId, request)
      )
      if (result && typeof result === 'object' && 'effective_prompt' in result) {
        tenantStore.setPrompt((result as any).effective_prompt)
      }
      return result
    } catch (error) {
      const errorMsg = getApiErrorMessage(error)
      tenantStore.setError(errorMsg)
      throw error
    } finally {
      tenantStore.loading = false
    }
  }

  async function deletePrompt() {
    try {
      tenantStore.loading = true
      await api.execute(() =>
        TenantManagementService.deleteTenantPromptTenantsTenantIdPromptDelete(tenantId)
      )
      tenantStore.setPrompt(null)
    } catch (error) {
      const errorMsg = getApiErrorMessage(error)
      tenantStore.setError(errorMsg)
      throw error
    } finally {
      tenantStore.loading = false
    }
  }

  return {
    ...api,
    getPrompt,
    updatePrompt,
    deletePrompt,
  }
}

