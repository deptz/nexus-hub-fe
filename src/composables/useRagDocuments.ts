import { KnowledgeBasesService } from '@/api/generated/services/KnowledgeBasesService'
import type { CreateRAGDocumentRequest } from '@/api/generated/models/CreateRAGDocumentRequest'
import type { UpdateRAGDocumentRequest } from '@/api/generated/models/UpdateRAGDocumentRequest'
import type { RAGDocumentResponse } from '@/api/generated/models/RAGDocumentResponse'
import type { RAGDocumentListResponse } from '@/api/generated/models/RAGDocumentListResponse'
import type { RAGChunkResponse } from '@/api/generated/models/RAGChunkResponse'
import type { RAGChunkListResponse } from '@/api/generated/models/RAGChunkListResponse'
import { useRagDocumentsStore } from '@/stores/ragDocuments'
import { useApi } from './useApi'
import { getApiErrorMessage } from '@/api/client'

export function useRagDocuments(tenantId: string) {
  const ragStore = useRagDocumentsStore()
  const api = useApi()

  async function listRagDocuments(
    kbName?: string | null,
    limit: number = 100,
    offset?: number
  ): Promise<RAGDocumentResponse[]> {
    try {
      ragStore.loading = true
      const result = await api.execute(() =>
        KnowledgeBasesService.listRagDocumentsTenantsTenantIdRagDocumentsGet(
          tenantId,
          kbName,
          limit,
          offset
        )
      )
      const response = result as RAGDocumentListResponse
      const docs = response.items || []
      ragStore.setDocuments(docs)
      ragStore.setFilters({ kb_name: kbName, limit, offset })
      return docs
    } catch (error) {
      const errorMsg = getApiErrorMessage(error)
      ragStore.setError(errorMsg)
      throw error
    } finally {
      ragStore.loading = false
    }
  }

  async function getRagDocument(docId: string): Promise<RAGDocumentResponse> {
    try {
      ragStore.loading = true
      const result = await api.execute(() =>
        KnowledgeBasesService.getRagDocumentTenantsTenantIdRagDocumentsDocIdGet(tenantId, docId)
      )
      const doc = result as RAGDocumentResponse
      ragStore.setCurrentDocument(doc)
      return doc
    } catch (error) {
      const errorMsg = getApiErrorMessage(error)
      ragStore.setError(errorMsg)
      throw error
    } finally {
      ragStore.loading = false
    }
  }

  async function createRagDocument(
    request: CreateRAGDocumentRequest
  ): Promise<RAGDocumentResponse> {
    try {
      ragStore.loading = true
      const result = await api.execute(() =>
        KnowledgeBasesService.createRagDocumentTenantsTenantIdRagDocumentsPost(tenantId, request)
      )
      const newDoc = result as RAGDocumentResponse
      ragStore.addDocument(newDoc)
      return newDoc
    } catch (error) {
      const errorMsg = getApiErrorMessage(error)
      ragStore.setError(errorMsg)
      throw error
    } finally {
      ragStore.loading = false
    }
  }

  async function updateRagDocument(
    docId: string,
    request: UpdateRAGDocumentRequest
  ): Promise<RAGDocumentResponse> {
    try {
      ragStore.loading = true
      const result = await api.execute(() =>
        KnowledgeBasesService.updateRagDocumentTenantsTenantIdRagDocumentsDocIdPut(
          tenantId,
          docId,
          request
        )
      )
      const updatedDoc = result as RAGDocumentResponse
      ragStore.updateDocument(docId, updatedDoc)
      if (ragStore.currentDocument?.id === docId) {
        ragStore.setCurrentDocument(updatedDoc)
      }
      return updatedDoc
    } catch (error) {
      const errorMsg = getApiErrorMessage(error)
      ragStore.setError(errorMsg)
      throw error
    } finally {
      ragStore.loading = false
    }
  }

  async function deleteRagDocument(docId: string): Promise<void> {
    try {
      ragStore.loading = true
      await api.execute(() =>
        KnowledgeBasesService.deleteRagDocumentTenantsTenantIdRagDocumentsDocIdDelete(
          tenantId,
          docId
        )
      )
      ragStore.removeDocument(docId)
      if (ragStore.currentDocument?.id === docId) {
        ragStore.setCurrentDocument(null)
      }
    } catch (error) {
      const errorMsg = getApiErrorMessage(error)
      ragStore.setError(errorMsg)
      throw error
    } finally {
      ragStore.loading = false
    }
  }

  async function reindexRagDocument(
    docId: string,
    chunkSize: number = 1000,
    chunkOverlap: number = 200
  ): Promise<void> {
    try {
      ragStore.loading = true
      await api.execute(() =>
        KnowledgeBasesService.reindexRagDocumentTenantsTenantIdRagDocumentsDocIdReindexPost(
          tenantId,
          docId,
          chunkSize,
          chunkOverlap
        )
      )
      // Reload document and chunks after reindexing
      await getRagDocument(docId)
      await listRagDocumentChunks(docId)
    } catch (error) {
      const errorMsg = getApiErrorMessage(error)
      ragStore.setError(errorMsg)
      throw error
    } finally {
      ragStore.loading = false
    }
  }

  async function listRagDocumentChunks(
    docId: string,
    limit: number = 100,
    offset?: number
  ): Promise<RAGChunkResponse[]> {
    try {
      ragStore.loading = true
      const result = await api.execute(() =>
        KnowledgeBasesService.listRagDocumentChunksTenantsTenantIdRagDocumentsDocIdChunksGet(
          tenantId,
          docId,
          limit,
          offset
        )
      )
      const response = result as RAGChunkListResponse
      const chunks = response.items || []
      ragStore.setDocumentChunks(chunks)
      return chunks
    } catch (error) {
      const errorMsg = getApiErrorMessage(error)
      ragStore.setError(errorMsg)
      throw error
    } finally {
      ragStore.loading = false
    }
  }

  return {
    ...api,
    listRagDocuments,
    getRagDocument,
    createRagDocument,
    updateRagDocument,
    deleteRagDocument,
    reindexRagDocument,
    listRagDocumentChunks,
  }
}

