import { KnowledgeBasesService } from '@/api/generated/services/KnowledgeBasesService'
import type { CreateKnowledgeBaseRequest } from '@/api/generated/models/CreateKnowledgeBaseRequest'
import type { UpdateKnowledgeBaseRequest } from '@/api/generated/models/UpdateKnowledgeBaseRequest'
import type { KnowledgeBaseResponse } from '@/api/generated/models/KnowledgeBaseResponse'
import type { KnowledgeBasesListResponse } from '@/api/generated/models/KnowledgeBasesListResponse'
import type { SyncStatusResponse } from '@/api/generated/models/SyncStatusResponse'
import type { ProviderSyncStatus } from '@/api/generated/models/ProviderSyncStatus'
import { useKnowledgeBasesStore } from '@/stores/knowledgeBases'
import { useApi } from './useApi'
import { getApiErrorMessage } from '@/api/client'

export function useKnowledgeBases(tenantId: string) {
  const kbStore = useKnowledgeBasesStore()
  const api = useApi()

  async function listKnowledgeBases(
    provider?: string | null,
    isActive?: boolean | null
  ): Promise<KnowledgeBaseResponse[]> {
    try {
      kbStore.loading = true
      const result = await api.execute(() =>
        KnowledgeBasesService.listKnowledgeBasesTenantsTenantIdKnowledgeBasesGet(
          tenantId,
          provider,
          isActive
        )
      )
      const response = result as KnowledgeBasesListResponse
      const kbs = response.items || []
      kbStore.setKnowledgeBases(kbs)
      kbStore.setFilters({ provider, is_active: isActive })
      return kbs
    } catch (error) {
      const errorMsg = getApiErrorMessage(error)
      kbStore.setError(errorMsg)
      throw error
    } finally {
      kbStore.loading = false
    }
  }

  async function getKnowledgeBase(kbId: string): Promise<KnowledgeBaseResponse> {
    try {
      kbStore.loading = true
      const result = await api.execute(() =>
        KnowledgeBasesService.getKnowledgeBaseTenantsTenantIdKnowledgeBasesKbIdGet(tenantId, kbId)
      )
      return result as KnowledgeBaseResponse
    } catch (error) {
      const errorMsg = getApiErrorMessage(error)
      kbStore.setError(errorMsg)
      throw error
    } finally {
      kbStore.loading = false
    }
  }

  async function createKnowledgeBase(
    request: CreateKnowledgeBaseRequest
  ): Promise<KnowledgeBaseResponse> {
    try {
      kbStore.loading = true
      const result = await api.execute(() =>
        KnowledgeBasesService.createKnowledgeBaseTenantsTenantIdKnowledgeBasesPost(tenantId, request)
      )
      const newKb = result as KnowledgeBaseResponse
      kbStore.addKnowledgeBase(newKb)
      return newKb
    } catch (error) {
      const errorMsg = getApiErrorMessage(error)
      kbStore.setError(errorMsg)
      throw error
    } finally {
      kbStore.loading = false
    }
  }

  async function updateKnowledgeBase(
    kbId: string,
    request: UpdateKnowledgeBaseRequest
  ): Promise<KnowledgeBaseResponse> {
    try {
      kbStore.loading = true
      const result = await api.execute(() =>
        KnowledgeBasesService.updateKnowledgeBaseTenantsTenantIdKnowledgeBasesKbIdPut(
          tenantId,
          kbId,
          request
        )
      )
      const updatedKb = result as KnowledgeBaseResponse
      kbStore.updateKnowledgeBase(kbId, updatedKb)
      return updatedKb
    } catch (error) {
      const errorMsg = getApiErrorMessage(error)
      kbStore.setError(errorMsg)
      throw error
    } finally {
      kbStore.loading = false
    }
  }

  async function deleteKnowledgeBase(kbId: string): Promise<void> {
    try {
      kbStore.loading = true
      await api.execute(() =>
        KnowledgeBasesService.deleteKnowledgeBaseTenantsTenantIdKnowledgeBasesKbIdDelete(
          tenantId,
          kbId
        )
      )
      kbStore.removeKnowledgeBase(kbId)
    } catch (error) {
      const errorMsg = getApiErrorMessage(error)
      kbStore.setError(errorMsg)
      throw error
    } finally {
      kbStore.loading = false
    }
  }

  async function syncKnowledgeBase(
    kbId: string,
    provider?: string | null
  ): Promise<SyncStatusResponse> {
    try {
      kbStore.loading = true
      const result = await api.execute(() =>
        KnowledgeBasesService.syncKnowledgeBaseTenantsTenantIdKnowledgeBasesKbIdSyncPost(
          tenantId,
          kbId,
          provider
        )
      )
      // Refresh the KB to get updated sync status
      await getKnowledgeBase(kbId)
      return result as SyncStatusResponse
    } catch (error) {
      const errorMsg = getApiErrorMessage(error)
      kbStore.setError(errorMsg)
      throw error
    } finally {
      kbStore.loading = false
    }
  }

  async function getSyncStatus(kbId: string): Promise<ProviderSyncStatus[]> {
    try {
      kbStore.loading = true
      const result = await api.execute(() =>
        KnowledgeBasesService.getSyncStatusTenantsTenantIdKnowledgeBasesKbIdSyncStatusGet(
          tenantId,
          kbId
        )
      )
      return (result as any) as ProviderSyncStatus[]
    } catch (error) {
      const errorMsg = getApiErrorMessage(error)
      kbStore.setError(errorMsg)
      throw error
    } finally {
      kbStore.loading = false
    }
  }

  return {
    ...api,
    listKnowledgeBases,
    getKnowledgeBase,
    createKnowledgeBase,
    updateKnowledgeBase,
    deleteKnowledgeBase,
    syncKnowledgeBase,
    getSyncStatus,
  }
}

