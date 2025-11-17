import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { TenantToolResponse } from '@/api/generated/models/TenantToolResponse'

export const useTenantToolsStore = defineStore('tenantTools', () => {
  const tools = ref<TenantToolResponse[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const filters = ref<{
    include_disabled?: boolean
  }>({})

  function setTools(toolsList: TenantToolResponse[]) {
    tools.value = toolsList
  }

  function addTool(tool: TenantToolResponse) {
    tools.value.push(tool)
  }

  function removeTool(toolName: string) {
    tools.value = tools.value.filter((tool) => tool.tool_name !== toolName)
  }

  function updateTool(toolName: string, updates: Partial<TenantToolResponse>) {
    const index = tools.value.findIndex((tool) => tool.tool_name === toolName)
    if (index !== -1) {
      tools.value[index] = { ...tools.value[index], ...updates }
    }
  }

  function setFilters(newFilters: { include_disabled?: boolean }) {
    filters.value = newFilters
  }

  function clearError() {
    error.value = null
  }

  function setError(err: string) {
    error.value = err
  }

  return {
    tools,
    loading,
    error,
    filters,
    setTools,
    addTool,
    removeTool,
    updateTool,
    setFilters,
    clearError,
    setError,
  }
})

