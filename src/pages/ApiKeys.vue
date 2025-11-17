<template>
  <ApiLayout>
    <div class="space-y-6">
      <!-- Create API Key Form -->
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-lg font-medium text-gray-900 mb-4">Create API Key</h2>
        <form @submit.prevent="handleCreateKey" class="space-y-4">
          <FormInput
            id="key-name"
            v-model="createForm.name"
            label="Name (Optional)"
            placeholder="My API Key"
          />
          <FormInput
            id="key-description"
            v-model="createForm.description"
            label="Description (Optional)"
            placeholder="Description for this API key"
          />
          <FormInput
            id="expires-in-days"
            v-model.number="createForm.expires_in_days"
            label="Expires In Days (Optional)"
            type="number"
            placeholder="30"
          />
          <FormInput
            id="rate-limit"
            v-model.number="createForm.rate_limit_per_minute"
            label="Rate Limit Per Minute"
            type="number"
            required
          />
          
          <ErrorMessage v-if="error" :message="error" @dismiss="clearError" />
          
          <div class="flex justify-end">
            <button
              type="submit"
              :disabled="loading"
              class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
            >
              Create API Key
            </button>
          </div>
        </form>
      </div>

      <!-- New API Key Display -->
      <div v-if="newApiKey" class="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 class="text-lg font-medium text-yellow-900 mb-2">New API Key Created</h3>
        <p class="text-sm text-yellow-800 mb-4">
          <strong>WARNING:</strong> This API key will only be shown once. Please copy it now and store it securely.
        </p>
        <div class="bg-white p-4 rounded border border-yellow-300">
          <code class="text-sm font-mono break-all">{{ newApiKey.key }}</code>
        </div>
        <button
          @click="newApiKey = null"
          class="mt-4 px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
        >
          I've Saved It
        </button>
      </div>

      <!-- API Keys List -->
      <div class="bg-white shadow rounded-lg p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-medium text-gray-900">API Keys</h2>
          <div class="flex items-center space-x-4">
            <label class="flex items-center">
              <input
                v-model="includeInactive"
                type="checkbox"
                @change="loadApiKeys"
                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <span class="ml-2 text-sm text-gray-700">Include Inactive</span>
            </label>
            <button
              @click="loadApiKeys"
              :disabled="loading"
              class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50"
            >
              Refresh
            </button>
          </div>
        </div>

        <DataTable
          :columns="columns"
          :items="apiKeys"
          :loading="loading"
          :actions="true"
        >
          <template #cell-is_active="{ value }">
            <span
              :class="{
                'px-2 py-1 text-xs font-semibold rounded-full': true,
                'bg-green-100 text-green-800': value,
                'bg-red-100 text-red-800': !value,
              }"
            >
              {{ value ? 'Active' : 'Inactive' }}
            </span>
          </template>
          <template #cell-created_at="{ value }">
            {{ new Date(value).toLocaleString() }}
          </template>
          <template #cell-expires_at="{ value }">
            {{ value ? new Date(value).toLocaleString() : 'Never' }}
          </template>
          <template #actions="{ item }">
            <button
              @click="handleRevoke(item.id, false)"
              :disabled="!item.is_active"
              class="text-red-600 hover:text-red-900 disabled:text-gray-400 disabled:cursor-not-allowed mr-3"
            >
              Deactivate
            </button>
            <button
              @click="handleRevoke(item.id, true)"
              class="text-red-600 hover:text-red-900"
            >
              Delete
            </button>
          </template>
        </DataTable>
      </div>

      <ConfirmDialog
        :show="showConfirmDialog"
        title="Revoke API Key"
        :message="confirmMessage"
        confirm-text="Revoke"
        @confirm="confirmRevoke"
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
import { useApiKeys } from '@/composables/useApiKeys'
import { useApiKeysStore } from '@/stores/apiKeys'
import { useAuth } from '@/composables/useAuth'
import type { CreateAPIKeyRequest } from '@/api/generated/models/CreateAPIKeyRequest'
import type { CreateApiKeyResponse } from '@/api/types'

const { tenantId } = useAuth()
const apiKeysStore = useApiKeysStore()
const { loading, error, listApiKeys, createApiKey, revokeApiKey, clearError } = useApiKeys(tenantId.value || '')

const newApiKey = ref<CreateApiKeyResponse | null>(null)
const showConfirmDialog = ref(false)
const revokeKeyId = ref<string | null>(null)
const revokePermanent = ref(false)

const includeInactive = computed({
  get: () => apiKeysStore.includeInactive,
  set: (value) => {
    apiKeysStore.includeInactive = value
  },
})

const apiKeys = computed(() => apiKeysStore.apiKeys)

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'description', label: 'Description' },
  { key: 'is_active', label: 'Status' },
  { key: 'rate_limit_per_minute', label: 'Rate Limit' },
  { key: 'created_at', label: 'Created' },
  { key: 'expires_at', label: 'Expires' },
]

const createForm = ref<CreateAPIKeyRequest>({
  name: null,
  description: null,
  expires_in_days: null,
  rate_limit_per_minute: 100,
  metadata: null,
})

const confirmMessage = computed(() => {
  if (revokePermanent.value) {
    return 'Are you sure you want to permanently delete this API key? This action cannot be undone.'
  }
  return 'Are you sure you want to deactivate this API key? It can be reactivated later.'
})

async function handleCreateKey() {
  try {
    const result = await createApiKey(createForm.value)
    newApiKey.value = result
    createForm.value = {
      name: null,
      description: null,
      expires_in_days: null,
      rate_limit_per_minute: 100,
      metadata: null,
    }
    await loadApiKeys()
  } catch (err) {
    // Error handled by composable
  }
}

async function loadApiKeys() {
  try {
    await listApiKeys(includeInactive.value)
  } catch (err) {
    // Error handled by composable
  }
}

function handleRevoke(keyId: string, permanent: boolean) {
  revokeKeyId.value = keyId
  revokePermanent.value = permanent
  showConfirmDialog.value = true
}

async function confirmRevoke() {
  if (!revokeKeyId.value) return
  try {
    await revokeApiKey(revokeKeyId.value, revokePermanent.value)
    showConfirmDialog.value = false
    revokeKeyId.value = null
    await loadApiKeys()
  } catch (err) {
    // Error handled by composable
  }
}

onMounted(() => {
  loadApiKeys()
})
</script>

