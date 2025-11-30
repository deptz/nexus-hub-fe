<template>
  <ApiLayout>
    <div class="space-y-6">
      <!-- Server Header -->
      <div class="bg-white shadow rounded-lg p-6" v-if="server">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h2 class="text-lg font-medium text-gray-900">MCP Server Details</h2>
            <p class="text-sm text-gray-500 mt-1">ID: {{ server.id }}</p>
          </div>
          <router-link
            to="/mcp-servers"
            class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Back to List
          </router-link>
        </div>

        <div class="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label class="text-sm font-medium text-gray-700">Name</label>
            <p class="mt-1 text-sm text-gray-900">{{ server.name }}</p>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-700">Status</label>
            <p class="mt-1">
              <span
                class="px-2 py-1 text-xs font-semibold rounded-full"
                :class="server.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
              >
                {{ server.is_active ? 'Active' : 'Inactive' }}
              </span>
            </p>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-700">Endpoint</label>
            <p class="mt-1 text-sm text-gray-900">{{ server.endpoint }}</p>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-700">Created At</label>
            <p class="mt-1 text-sm text-gray-900">{{ new Date(server.created_at).toLocaleString() }}</p>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-700">Updated At</label>
            <p class="mt-1 text-sm text-gray-900">{{ new Date(server.updated_at).toLocaleString() }}</p>
          </div>
        </div>

        <div v-if="Object.keys(server.auth_config || {}).length > 0" class="mt-4">
          <label class="text-sm font-medium text-gray-700">Auth Config</label>
          <div class="mt-1 p-3 bg-gray-50 rounded-md">
            <pre class="text-xs">{{ JSON.stringify(server.auth_config, null, 2) }}</pre>
          </div>
        </div>
      </div>

      <!-- Update Server -->
      <div class="bg-white shadow rounded-lg p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Update Server</h3>
        <form @submit.prevent="handleUpdateServer" class="space-y-4">
          <FormInput
            id="update-endpoint"
            v-model="updateForm.endpoint"
            label="Endpoint"
            placeholder="https://mcp.example.com/api"
          />
          <div>
            <label for="update-auth-config" class="block text-sm font-medium text-gray-700 mb-1">
              Auth Config (JSON)
            </label>
            <textarea
              id="update-auth-config"
              v-model="updateAuthConfigJson"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 font-mono text-sm"
            ></textarea>
          </div>
          <div>
            <label class="flex items-center">
              <input
                v-model="updateForm.is_active"
                type="checkbox"
                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <span class="ml-2 text-sm text-gray-700">Active</span>
            </label>
          </div>
          <div class="flex justify-end">
            <button
              type="submit"
              :disabled="mcpStore.loading"
              class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
            >
              Update Server
            </button>
          </div>
        </form>
      </div>

      <!-- Create Tool Form -->
      <div class="bg-white shadow rounded-lg p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Create Tool</h3>
        <form @submit.prevent="handleCreateTool" class="space-y-4">
          <FormInput
            id="tool-name"
            v-model="createToolForm.tool_name"
            label="Tool Name"
            placeholder="get_customer_info"
            required
          />
          <FormInput
            id="tool-description"
            v-model="createToolForm.description"
            label="Description (Optional)"
            placeholder="Get customer information"
          />
          <div>
            <label for="tool-schema" class="block text-sm font-medium text-gray-700 mb-1">
              Schema (JSON, Optional)
            </label>
            <textarea
              id="tool-schema"
              v-model="toolSchemaJson"
              rows="5"
              placeholder='{"type": "object", "properties": {...}}'
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 font-mono text-sm"
            ></textarea>
          </div>
          <div class="flex justify-end">
            <button
              type="submit"
              :disabled="mcpStore.loading"
              class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
            >
              Create Tool
            </button>
          </div>
        </form>
      </div>

      <!-- Server Tools List -->
      <div class="bg-white shadow rounded-lg p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900">Server Tools</h3>
          <button
            @click="loadTools"
            :disabled="mcpStore.loading"
            class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50"
          >
            Refresh
          </button>
        </div>

        <ErrorMessage v-if="mcpStore.error" :message="mcpStore.error" @dismiss="clearError" />

        <div v-if="mcpStore.loading && tools.length === 0" class="text-center py-8">
          <LoadingSpinner />
        </div>

        <div v-else-if="tools.length === 0" class="text-center py-8 text-gray-500">
          No tools found
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="tool in tools"
            :key="tool.id"
            class="border border-gray-200 rounded-lg p-4"
          >
            <div class="flex items-center justify-between mb-2">
              <div>
                <h4 class="font-medium text-gray-900">{{ tool.tool_name }}</h4>
                <p v-if="tool.description" class="text-sm text-gray-600 mt-1">{{ tool.description }}</p>
              </div>
              <button
                @click="handleDeleteTool(tool.tool_name)"
                class="text-red-600 hover:text-red-900"
              >
                Delete
              </button>
            </div>
            <div v-if="Object.keys((tool as any).json_schema || tool.schema || {}).length > 0" class="mt-2">
              <details>
                <summary class="cursor-pointer text-sm text-gray-600">Schema</summary>
                <pre class="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">{{ JSON.stringify((tool as any).json_schema || tool.schema, null, 2) }}</pre>
              </details>
            </div>
            <div class="mt-2 text-xs text-gray-500">
              Created: {{ new Date(tool.created_at).toLocaleString() }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </ApiLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import ApiLayout from '@/components/layout/ApiLayout.vue'
import FormInput from '@/components/common/FormInput.vue'
import ErrorMessage from '@/components/common/ErrorMessage.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import { useMcpServers } from '@/composables/useMcpServers'
import { useMcpServersStore } from '@/stores/mcpServers'
import { useAuth } from '@/composables/useAuth'
import type { UpdateMCPServerRequest } from '@/api/generated/models/UpdateMCPServerRequest'
import type { CreateMCPServerToolRequest } from '@/api/generated/models/CreateMCPServerToolRequest'

const route = useRoute()
const { tenantId } = useAuth()
const serverId = computed(() => route.params.id as string)

const mcpStore = useMcpServersStore()
const {
  getMcpServer,
  updateMcpServer,
  listMcpServerTools,
  createMcpServerTool,
  deleteMcpServerTool,
  clearError,
} = useMcpServers(tenantId.value || '')

const server = computed(() => mcpStore.currentServer)
const tools = computed(() => mcpStore.serverTools)

const updateForm = ref<UpdateMCPServerRequest>({
  endpoint: null,
  auth_config: null,
  is_active: null,
})

const updateAuthConfigJson = ref('{}')

watch(server, (s) => {
  if (s) {
    updateForm.value = {
      endpoint: s.endpoint,
      auth_config: s.auth_config,
      is_active: s.is_active,
    }
    updateAuthConfigJson.value = JSON.stringify(s.auth_config || {}, null, 2)
  }
})

const createToolForm = ref<CreateMCPServerToolRequest>({
  tool_name: '',
  description: null,
  schema: undefined,
})

const toolSchemaJson = ref('{}')

async function loadServer() {
  try {
    await getMcpServer(serverId.value)
  } catch (err) {
    // Error handled by composable
  }
}

async function loadTools() {
  try {
    await listMcpServerTools(serverId.value)
  } catch (err) {
    // Error handled by composable
  }
}

async function handleUpdateServer() {
  try {
    let authConfig = updateForm.value.auth_config
    if (updateAuthConfigJson.value) {
      try {
        authConfig = JSON.parse(updateAuthConfigJson.value)
      } catch (e) {
        mcpStore.setError('Invalid JSON in auth config')
        return
      }
    }

    const request: UpdateMCPServerRequest = {
      endpoint: updateForm.value.endpoint,
      auth_config: authConfig,
      is_active: updateForm.value.is_active,
    }

    await updateMcpServer(serverId.value, request)
    await loadServer()
  } catch (err) {
    // Error handled by composable
  }
}

async function handleCreateTool() {
  try {
    let schema = undefined
    if (toolSchemaJson.value && toolSchemaJson.value !== '{}') {
      try {
        schema = JSON.parse(toolSchemaJson.value)
      } catch (e) {
        mcpStore.setError('Invalid JSON in schema')
        return
      }
    }

    const request: CreateMCPServerToolRequest = {
      tool_name: createToolForm.value.tool_name,
      description: createToolForm.value.description,
      schema: schema,
    }

    await createMcpServerTool(serverId.value, request)
    createToolForm.value = {
      tool_name: '',
      description: null,
      schema: undefined,
    }
    toolSchemaJson.value = '{}'
    await loadTools()
  } catch (err) {
    // Error handled by composable
  }
}

async function handleDeleteTool(toolName: string) {
  try {
    await deleteMcpServerTool(serverId.value, toolName)
    await loadTools()
  } catch (err) {
    // Error handled by composable
  }
}

onMounted(async () => {
  await Promise.all([loadServer(), loadTools()])
})
</script>

