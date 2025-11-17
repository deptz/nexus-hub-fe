<template>
  <ApiLayout>
    <div class="space-y-6">
      <!-- Create MCP Server Form -->
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-lg font-medium text-gray-900 mb-4">Create MCP Server</h2>
        <form @submit.prevent="handleCreateServer" class="space-y-4">
          <FormInput
            id="server-name"
            v-model="createForm.name"
            label="Name"
            placeholder="crm_server"
            required
          />
          <FormInput
            id="server-endpoint"
            v-model="createForm.endpoint"
            label="Endpoint"
            placeholder="https://mcp.example.com/api"
            required
          />
          <div>
            <label for="server-auth-config" class="block text-sm font-medium text-gray-700 mb-1">
              Auth Config (JSON) <span class="text-red-500">*</span>
            </label>
            <textarea
              id="server-auth-config"
              v-model="authConfigJson"
              placeholder='{"type": "api_key", "key": "secret_key_here"}'
              required
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 font-mono text-sm"
            ></textarea>
            <p class="mt-1 text-xs text-gray-500">
              Authentication configuration for the MCP server
            </p>
          </div>

          <ErrorMessage v-if="error" :message="error" @dismiss="clearError" />

          <div class="flex justify-end">
            <button
              type="submit"
              :disabled="loading"
              class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
            >
              Create MCP Server
            </button>
          </div>
        </form>
      </div>

      <!-- MCP Servers List -->
      <div class="bg-white shadow rounded-lg p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-medium text-gray-900">MCP Servers</h2>
          <div class="flex items-center space-x-4">
            <select
              v-model="filterIsActive"
              @change="loadServers"
              class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option :value="null">All Status</option>
              <option :value="true">Active</option>
              <option :value="false">Inactive</option>
            </select>
            <button
              @click="loadServers"
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
          :items="servers"
          :loading="loading"
          :actions="true"
        >
          <template #cell-is_active="{ value }">
            <span
              class="px-2 py-1 text-xs font-semibold rounded-full"
              :class="value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
            >
              {{ value ? 'Active' : 'Inactive' }}
            </span>
          </template>
          <template #cell-auth_config="{ value }">
            <div class="max-w-md truncate" :title="JSON.stringify(value)">
              {{ Object.keys(value || {}).length > 0 ? '***' : 'None' }}
            </div>
          </template>
          <template #cell-created_at="{ value }">
            {{ new Date(value).toLocaleString() }}
          </template>
          <template #cell-updated_at="{ value }">
            {{ new Date(value).toLocaleString() }}
          </template>
          <template #actions="{ item }">
            <router-link
              :to="`/mcp-servers/${item.id}`"
              class="text-blue-600 hover:text-blue-900 mr-3"
            >
              View
            </router-link>
            <button
              @click="handleDelete(item.id)"
              class="text-red-600 hover:text-red-900"
            >
              Delete
            </button>
          </template>
        </DataTable>
      </div>

      <ConfirmDialog
        :show="showConfirmDialog"
        title="Delete MCP Server"
        :message="confirmMessage"
        confirm-text="Delete"
        @confirm="confirmDelete"
        @cancel="showConfirmDialog = false"
      />
    </div>
  </ApiLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import ApiLayout from '@/components/layout/ApiLayout.vue'
import FormInput from '@/components/common/FormInput.vue'
import ErrorMessage from '@/components/common/ErrorMessage.vue'
import DataTable from '@/components/common/DataTable.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import { useMcpServers } from '@/composables/useMcpServers'
import { useMcpServersStore } from '@/stores/mcpServers'
import { useAuth } from '@/composables/useAuth'
import type { CreateMCPServerRequest } from '@/api/generated/models/CreateMCPServerRequest'

const { tenantId } = useAuth()
const mcpStore = useMcpServersStore()
const { loading, error, listMcpServers, createMcpServer, deleteMcpServer, clearError } = useMcpServers(tenantId.value || '')

const showConfirmDialog = ref(false)
const deleteServerId = ref<string | null>(null)

const filterIsActive = ref<boolean | null>(null)

const servers = computed(() => mcpStore.servers)

const createForm = ref<CreateMCPServerRequest>({
  name: '',
  endpoint: '',
  auth_config: {},
})

const authConfigJson = ref('{}')

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name' },
  { key: 'endpoint', label: 'Endpoint' },
  { key: 'is_active', label: 'Status' },
  { key: 'auth_config', label: 'Auth Config' },
  { key: 'created_at', label: 'Created' },
  { key: 'updated_at', label: 'Updated' },
]

async function loadServers() {
  try {
    await listMcpServers(filterIsActive.value)
  } catch (err) {
    // Error handled by composable
  }
}

async function handleCreateServer() {
  try {
    let authConfig = {}
    try {
      authConfig = JSON.parse(authConfigJson.value)
    } catch (e) {
      mcpStore.setError('Invalid JSON in auth config')
      return
    }

    const request: CreateMCPServerRequest = {
      ...createForm.value,
      auth_config: authConfig,
    }

    await createMcpServer(request)
    createForm.value = {
      name: '',
      endpoint: '',
      auth_config: {},
    }
    authConfigJson.value = '{}'
    await loadServers()
  } catch (err) {
    // Error handled by composable
  }
}

function handleDelete(serverId: string) {
  deleteServerId.value = serverId
  showConfirmDialog.value = true
}

const confirmMessage = computed(() => {
  if (!deleteServerId.value) return ''
  return `Are you sure you want to delete MCP server ${deleteServerId.value}? This action cannot be undone and will delete all associated tools.`
})

async function confirmDelete() {
  if (!deleteServerId.value) return
  try {
    await deleteMcpServer(deleteServerId.value)
    showConfirmDialog.value = false
    deleteServerId.value = null
    await loadServers()
  } catch (err) {
    // Error handled by composable
  }
}

onMounted(() => {
  loadServers()
})
</script>

