import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { KnowledgeBaseResponse } from '@/api/generated/models/KnowledgeBaseResponse'

export const useKnowledgeBasesStore = defineStore('knowledgeBases', () => {
  const knowledgeBases = ref<KnowledgeBaseResponse[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const filters = ref<{
    provider?: string | null
    is_active?: boolean | null
  }>({})

  function setKnowledgeBases(kbs: KnowledgeBaseResponse[]) {
    knowledgeBases.value = kbs
  }

  function addKnowledgeBase(kb: KnowledgeBaseResponse) {
    knowledgeBases.value.push(kb)
  }

  function removeKnowledgeBase(kbId: string) {
    knowledgeBases.value = knowledgeBases.value.filter((kb) => kb.id !== kbId)
  }

  function updateKnowledgeBase(kbId: string, updates: Partial<KnowledgeBaseResponse>) {
    const index = knowledgeBases.value.findIndex((kb) => kb.id === kbId)
    if (index !== -1) {
      knowledgeBases.value[index] = { ...knowledgeBases.value[index], ...updates }
    }
  }

  function setFilters(newFilters: { provider?: string | null; is_active?: boolean | null }) {
    filters.value = newFilters
  }

  function clearError() {
    error.value = null
  }

  function setError(err: string) {
    error.value = err
  }

  return {
    knowledgeBases,
    loading,
    error,
    filters,
    setKnowledgeBases,
    addKnowledgeBase,
    removeKnowledgeBase,
    updateKnowledgeBase,
    setFilters,
    clearError,
    setError,
  }
})

