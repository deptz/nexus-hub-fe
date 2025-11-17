import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { RAGDocumentResponse } from '@/api/generated/models/RAGDocumentResponse'
import type { RAGChunkResponse } from '@/api/generated/models/RAGChunkResponse'

export const useRagDocumentsStore = defineStore('ragDocuments', () => {
  const documents = ref<RAGDocumentResponse[]>([])
  const currentDocument = ref<RAGDocumentResponse | null>(null)
  const documentChunks = ref<RAGChunkResponse[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const filters = ref<{
    kb_name?: string | null
    limit?: number
    offset?: number
  }>({})

  function setDocuments(docs: RAGDocumentResponse[]) {
    documents.value = docs
  }

  function addDocument(doc: RAGDocumentResponse) {
    documents.value.push(doc)
  }

  function removeDocument(docId: string) {
    documents.value = documents.value.filter((doc) => doc.id !== docId)
  }

  function updateDocument(docId: string, updates: Partial<RAGDocumentResponse>) {
    const index = documents.value.findIndex((doc) => doc.id === docId)
    if (index !== -1) {
      documents.value[index] = { ...documents.value[index], ...updates }
    }
    if (currentDocument.value?.id === docId) {
      currentDocument.value = { ...currentDocument.value, ...updates }
    }
  }

  function setCurrentDocument(doc: RAGDocumentResponse | null) {
    currentDocument.value = doc
  }

  function setDocumentChunks(chunks: RAGChunkResponse[]) {
    documentChunks.value = chunks
  }

  function setFilters(newFilters: {
    kb_name?: string | null
    limit?: number
    offset?: number
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
    documents,
    currentDocument,
    documentChunks,
    loading,
    error,
    filters,
    setDocuments,
    addDocument,
    removeDocument,
    updateDocument,
    setCurrentDocument,
    setDocumentChunks,
    setFilters,
    clearError,
    setError,
  }
})

