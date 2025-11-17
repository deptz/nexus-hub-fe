import { TenantManagementService } from '@/api/generated/services/TenantManagementService'
import type { CreateAPIKeyRequest } from '@/api/generated/models/CreateAPIKeyRequest'
import { useApiKeysStore } from '@/stores/apiKeys'
import { useApi } from './useApi'
import { getApiErrorMessage } from '@/api/client'
import type { ApiKeyInfo, CreateApiKeyResponse } from '@/api/types'

export function useApiKeys(tenantId: string) {
  const apiKeysStore = useApiKeysStore()
  const api = useApi<ApiKeyInfo[]>()

  async function listApiKeys(includeInactive: boolean = false) {
    try {
      apiKeysStore.loading = true
      const result = await TenantManagementService.listApiKeysEndpointTenantsTenantIdApiKeysGet(
        tenantId,
        includeInactive
      )
      const keys = (Array.isArray(result) ? result : []) as ApiKeyInfo[]
      apiKeysStore.setApiKeys(keys)
      apiKeysStore.includeInactive = includeInactive
      return keys
    } catch (error) {
      const errorMsg = getApiErrorMessage(error)
      apiKeysStore.setError(errorMsg)
      throw error
    } finally {
      apiKeysStore.loading = false
    }
  }

  async function createApiKey(request: CreateAPIKeyRequest): Promise<CreateApiKeyResponse> {
    try {
      apiKeysStore.loading = true
      const result = await TenantManagementService.createApiKeyEndpointTenantsTenantIdApiKeysPost(
        tenantId,
        request
      )
      const newKey = result as CreateApiKeyResponse
      apiKeysStore.addApiKey({
        id: newKey.id,
        name: newKey.name,
        description: newKey.description,
        created_at: newKey.created_at,
        expires_at: newKey.expires_at,
        is_active: true,
        rate_limit_per_minute: newKey.rate_limit_per_minute,
      })
      return newKey
    } catch (error) {
      const errorMsg = getApiErrorMessage(error)
      apiKeysStore.setError(errorMsg)
      throw error
    } finally {
      apiKeysStore.loading = false
    }
  }

  async function revokeApiKey(keyId: string, permanent: boolean = false) {
    try {
      apiKeysStore.loading = true
      await TenantManagementService.revokeApiKeyEndpointTenantsTenantIdApiKeysKeyIdDelete(
        tenantId,
        keyId,
        permanent
      )
      if (permanent) {
        apiKeysStore.removeApiKey(keyId)
      } else {
        apiKeysStore.updateApiKey(keyId, { is_active: false })
      }
    } catch (error) {
      const errorMsg = getApiErrorMessage(error)
      apiKeysStore.setError(errorMsg)
      throw error
    } finally {
      apiKeysStore.loading = false
    }
  }

  return {
    ...api,
    listApiKeys,
    createApiKey,
    revokeApiKey,
  }
}

