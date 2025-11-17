<template>
  <ApiLayout>
    <div class="space-y-6">
      <!-- Enable Tool Form -->
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-lg font-medium text-gray-900 mb-4">Enable Tool</h2>
        <form @submit.prevent="handleEnableTool" class="space-y-4">
          <FormInput
            id="tool-name"
            v-model="enableForm.tool_name"
            label="Tool Name"
            placeholder="openai_file_search"
            required
          />
          <div>
            <label for="tool-config-override" class="block text-sm font-medium text-gray-700 mb-1">
              Config Override (JSON, Optional)
            </label>
            <textarea
              id="tool-config-override"
              v-model="configOverrideJson"
              rows="3"
              placeholder='{"kb_name": "custom_kb"}'
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 font-mono text-sm"
            ></textarea>
          </div>

          <ErrorMessage v-if="error" :message="error" @dismiss="clearError" />

          <div class="flex justify-end">
            <button
              type="submit"
              :disabled="loading"
              class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
            >
              Enable Tool
            </button>
          </div>
        </form>
      </div>

      <!-- Tools List -->
      <div class="bg-white shadow rounded-lg p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-medium text-gray-900">Tenant Tools</h2>
          <div class="flex items-center space-x-4">
            <label class="flex items-center">
              <input
                v-model="includeDisabled"
                type="checkbox"
                @change="loadTools"
                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <span class="ml-2 text-sm text-gray-700">Include Disabled</span>
            </label>
            <button
              @click="loadTools"
              :disabled="loading"
              class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50"
            >
              Refresh
            </button>
          </div>
        </div>

        <ErrorMessage v-if="error" :message="error" @dismiss="clearError" />

        <DataTable
          :columns="columns"
          :items="tools"
          :loading="loading"
          :actions="true"
        >
          <template #cell-is_enabled="{ value }">
            <span
              class="px-2 py-1 text-xs font-semibold rounded-full"
              :class="value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
            >
              {{ value ? 'Enabled' : 'Disabled' }}
            </span>
          </template>
          <template #cell-config_override="{ value }">
            <div class="max-w-md truncate" :title="JSON.stringify(value)">
              {{ Object.keys(value || {}).length > 0 ? JSON.stringify(value) : 'None' }}
            </div>
          </template>
          <template #cell-created_at="{ value }">
            {{ new Date(value).toLocaleString() }}
          </template>
          <template #cell-updated_at="{ value }">
            {{ new Date(value).toLocaleString() }}
          </template>
          <template #actions="{ item }">
            <button
              @click="handleEdit(item)"
              class="text-blue-600 hover:text-blue-900 mr-3"
            >
              Edit
            </button>
            <button
              @click="handleDisable(item.tool_name)"
              class="text-red-600 hover:text-red-900"
            >
              Disable
            </button>
          </template>
        </DataTable>
      </div>

      <!-- Edit Tool Modal -->
      <div
        v-if="editingTool"
        class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
        @click.self="editingTool = null"
      >
        <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Update Tool Policy</h3>
          <form @submit.prevent="handleUpdateTool" class="space-y-4">
            <div>
              <label class="flex items-center">
                <input
                  v-model="editForm.is_enabled"
                  type="checkbox"
                  class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <span class="ml-2 text-sm text-gray-700">Enabled</span>
              </label>
            </div>
            <div>
              <label for="edit-tool-config-override" class="block text-sm font-medium text-gray-700 mb-1">
                Config Override (JSON)
              </label>
              <textarea
                id="edit-tool-config-override"
                v-model="editConfigOverrideJson"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 font-mono text-sm"
              ></textarea>
            </div>
            <div class="flex justify-end space-x-3">
              <button
                type="button"
                @click="editingTool = null"
                class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="loading"
                class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
              >
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </ApiLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import ApiLayout from '@/components/layout/ApiLayout.vue'
import FormInput from '@/components/common/FormInput.vue'
import ErrorMessage from '@/components/common/ErrorMessage.vue'
import DataTable from '@/components/common/DataTable.vue'
import { useTenantTools } from '@/composables/useTenantTools'
import { useTenantToolsStore } from '@/stores/tenantTools'
import { useAuth } from '@/composables/useAuth'
import type { EnableToolRequest } from '@/api/generated/models/EnableToolRequest'
import type { UpdateToolPolicyRequest } from '@/api/generated/models/UpdateToolPolicyRequest'
import type { TenantToolResponse } from '@/api/generated/models/TenantToolResponse'

const { tenantId } = useAuth()
const toolsStore = useTenantToolsStore()
const { loading, error, listTenantTools, enableTool, updateToolPolicy, disableTool, clearError } = useTenantTools(tenantId.value || '')

const includeDisabled = ref(false)
const editingTool = ref<TenantToolResponse | null>(null)

const enableForm = ref<EnableToolRequest>({
  tool_name: '',
  config_override: null,
})

const configOverrideJson = ref('{}')

const editForm = ref<UpdateToolPolicyRequest>({
  is_enabled: null,
  config_override: null,
})

const editConfigOverrideJson = ref('{}')

watch(editingTool, (tool) => {
  if (tool) {
    editForm.value = {
      is_enabled: tool.is_enabled,
      config_override: tool.config_override,
    }
    editConfigOverrideJson.value = JSON.stringify(tool.config_override || {}, null, 2)
  }
})

const tools = computed(() => toolsStore.tools)

const columns = [
  { key: 'tool_name', label: 'Tool Name' },
  { key: 'description', label: 'Description' },
  { key: 'provider', label: 'Provider' },
  { key: 'is_enabled', label: 'Status' },
  { key: 'config_override', label: 'Config Override' },
  { key: 'created_at', label: 'Created' },
  { key: 'updated_at', label: 'Updated' },
]

async function loadTools() {
  try {
    await listTenantTools(includeDisabled.value)
  } catch (err) {
    // Error handled by composable
  }
}

async function handleEnableTool() {
  try {
    let configOverride = null
    if (configOverrideJson.value) {
      try {
        configOverride = JSON.parse(configOverrideJson.value)
      } catch (e) {
        toolsStore.setError('Invalid JSON in config override')
        return
      }
    }

    const request: EnableToolRequest = {
      tool_name: enableForm.value.tool_name,
      config_override: configOverride,
    }

    await enableTool(request)
    enableForm.value = {
      tool_name: '',
      config_override: null,
    }
    configOverrideJson.value = '{}'
    await loadTools()
  } catch (err) {
    // Error handled by composable
  }
}

function handleEdit(tool: TenantToolResponse) {
  editingTool.value = tool
}

async function handleUpdateTool() {
  if (!editingTool.value) return

  try {
    let configOverride = editForm.value.config_override
    if (editConfigOverrideJson.value) {
      try {
        configOverride = JSON.parse(editConfigOverrideJson.value)
      } catch (e) {
        toolsStore.setError('Invalid JSON in config override')
        return
      }
    }

    const request: UpdateToolPolicyRequest = {
      is_enabled: editForm.value.is_enabled,
      config_override: configOverride,
    }

    await updateToolPolicy(editingTool.value.tool_name, request)
    editingTool.value = null
    await loadTools()
  } catch (err) {
    // Error handled by composable
  }
}

async function handleDisable(toolName: string) {
  try {
    await disableTool(toolName)
    await loadTools()
  } catch (err) {
    // Error handled by composable
  }
}

onMounted(() => {
  loadTools()
})
</script>

