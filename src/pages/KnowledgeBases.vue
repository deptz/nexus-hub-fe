<template>
  <ApiLayout>
    <div class="space-y-6">
      <!-- Create Knowledge Base Form -->
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-lg font-medium text-gray-900 mb-4">Create Knowledge Base</h2>
        <form @submit.prevent="handleCreateKB" class="space-y-4">
          <FormInput
            id="kb-name"
            v-model="createForm.name"
            label="Name"
            placeholder="support_faq"
            required
          />
          <FormInput
            id="kb-description"
            v-model="createForm.description"
            label="Description (Optional)"
            placeholder="Support FAQ knowledge base"
          />
          <div>
            <label for="kb-providers" class="block text-sm font-medium text-gray-700 mb-1">
              Providers (Optional)
            </label>
            <select
              id="kb-providers"
              v-model="selectedProviders"
              multiple
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="internal_rag">Internal RAG</option>
              <option value="openai_file">OpenAI File Search</option>
              <option value="gemini_file">Gemini File Search</option>
            </select>
            <p class="mt-1 text-xs text-gray-500">
              Select providers to enable. If none selected, all enabled tools will be used automatically.
            </p>
          </div>
          
          <ErrorMessage v-if="error" :message="error" @dismiss="clearError" />
          
          <div class="flex justify-end">
            <button
              type="submit"
              :disabled="loading"
              class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
            >
              Create Knowledge Base
            </button>
          </div>
        </form>
      </div>

      <!-- Knowledge Bases List -->
      <div class="bg-white shadow rounded-lg p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-medium text-gray-900">Knowledge Bases</h2>
          <div class="flex items-center space-x-4">
            <select
              v-model="filterProvider"
              @change="loadKnowledgeBases"
              class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">All Providers</option>
              <option value="internal_rag">Internal RAG</option>
              <option value="openai_file">OpenAI File Search</option>
              <option value="gemini_file">Gemini File Search</option>
            </select>
            <select
              v-model="filterIsActive"
              @change="loadKnowledgeBases"
              class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option :value="null">All Status</option>
              <option :value="true">Active</option>
              <option :value="false">Inactive</option>
            </select>
            <button
              @click="loadKnowledgeBases"
              :disabled="loading"
              class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50"
            >
              Refresh
            </button>
          </div>
        </div>

        <DataTable
          :columns="columns"
          :items="knowledgeBases"
          :loading="loading"
          :actions="true"
        >
          <template #cell-provider_sync_status="{ value }">
            <div class="flex flex-wrap gap-1">
              <span
                v-for="status in (value || [])"
                :key="status.provider"
                :class="{
                  'px-2 py-1 text-xs font-semibold rounded-full': true,
                  'bg-green-100 text-green-800': status.sync_status === 'enabled' && status.is_active,
                  'bg-yellow-100 text-yellow-800': status.sync_status === 'syncing',
                  'bg-red-100 text-red-800': status.sync_status === 'error' || !status.is_active,
                  'bg-gray-100 text-gray-800': status.sync_status === 'disabled',
                }"
                :title="status.error_message || `${status.provider}: ${status.sync_status}`"
              >
                {{ status.provider }}: {{ status.sync_status }}
              </span>
              <span v-if="!value || value.length === 0" class="text-xs text-gray-500">No providers</span>
            </div>
          </template>
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
          <template #actions="{ item }">
            <button
              @click="handleSync(item)"
              class="text-green-600 hover:text-green-900 mr-3"
              :disabled="loading"
              title="Sync to all providers"
            >
              Sync
            </button>
            <button
              @click="handleEdit(item)"
              class="text-blue-600 hover:text-blue-900 mr-3"
            >
              Edit
            </button>
            <button
              @click="handleDelete(item.id)"
              class="text-red-600 hover:text-red-900"
            >
              Delete
            </button>
          </template>
        </DataTable>
      </div>

      <!-- Edit Knowledge Base Modal -->
      <div
        v-if="editingKB"
        class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
        @click.self="editingKB = null"
      >
        <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Edit Knowledge Base</h3>
          <form @submit.prevent="handleUpdateKB" class="space-y-4">
            <FormInput
              id="edit-kb-description"
              v-model="editForm.description"
              label="Description"
              placeholder="Knowledge base description"
            />
            <div v-if="editingKB?.provider_sync_status && editingKB.provider_sync_status.length > 0" class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">Provider Sync Status</label>
              <div class="space-y-2">
                <div
                  v-for="status in editingKB.provider_sync_status"
                  :key="status.provider"
                  class="p-2 bg-gray-50 rounded border"
                >
                  <div class="flex items-center justify-between">
                    <span class="text-sm font-medium">{{ status.provider }}</span>
                    <span
                      :class="{
                        'px-2 py-1 text-xs font-semibold rounded-full': true,
                        'bg-green-100 text-green-800': status.sync_status === 'enabled' && status.is_active,
                        'bg-yellow-100 text-yellow-800': status.sync_status === 'syncing',
                        'bg-red-100 text-red-800': status.sync_status === 'error' || !status.is_active,
                        'bg-gray-100 text-gray-800': status.sync_status === 'disabled',
                      }"
                    >
                      {{ status.sync_status }}
                    </span>
                  </div>
                  <div v-if="status.store_id" class="text-xs text-gray-600 mt-1">
                    Store: {{ status.store_id }}
                  </div>
                  <div v-if="status.last_sync_at" class="text-xs text-gray-600 mt-1">
                    Last sync: {{ new Date(status.last_sync_at).toLocaleString() }}
                  </div>
                  <div v-if="status.error_message" class="text-xs text-red-600 mt-1">
                    Error: {{ status.error_message }}
                  </div>
                  <button
                    @click="handleSyncProvider(editingKB.id, status.provider)"
                    class="mt-2 text-xs text-blue-600 hover:text-blue-900"
                    :disabled="loading"
                  >
                    Sync this provider
                  </button>
                </div>
              </div>
            </div>
            <div>
              <label class="flex items-center">
                <input
                  v-model="editForm.is_active"
                  type="checkbox"
                  class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <span class="ml-2 text-sm text-gray-700">Active</span>
              </label>
            </div>
            <div class="flex justify-end space-x-3">
              <button
                type="button"
                @click="editingKB = null"
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

      <ConfirmDialog
        :show="showConfirmDialog"
        title="Delete Knowledge Base"
        message="Are you sure you want to delete this knowledge base? This action cannot be undone."
        confirm-text="Delete"
        @confirm="confirmDelete"
        @cancel="showConfirmDialog = false"
      />
    </div>
  </ApiLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import ApiLayout from '@/components/layout/ApiLayout.vue'
import FormInput from '@/components/common/FormInput.vue'
import ErrorMessage from '@/components/common/ErrorMessage.vue'
import DataTable from '@/components/common/DataTable.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import { useKnowledgeBases } from '@/composables/useKnowledgeBases'
import { useKnowledgeBasesStore } from '@/stores/knowledgeBases'
import { useAuth } from '@/composables/useAuth'
import type { CreateKnowledgeBaseRequest } from '@/api/generated/models/CreateKnowledgeBaseRequest'
import type { UpdateKnowledgeBaseRequest } from '@/api/generated/models/UpdateKnowledgeBaseRequest'
import type { KnowledgeBaseResponse } from '@/api/generated/models/KnowledgeBaseResponse'

const { tenantId } = useAuth()
const kbStore = useKnowledgeBasesStore()
const { loading, error, listKnowledgeBases, getKnowledgeBase, createKnowledgeBase, updateKnowledgeBase, deleteKnowledgeBase, syncKnowledgeBase, clearError } = useKnowledgeBases(tenantId.value || '')

const showConfirmDialog = ref(false)
const deleteKbId = ref<string | null>(null)
const editingKB = ref<KnowledgeBaseResponse | null>(null)

const filterProvider = ref<string | null>('')
const filterIsActive = ref<boolean | null>(null)

const knowledgeBases = computed(() => kbStore.knowledgeBases)

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'description', label: 'Description' },
  { key: 'provider_sync_status', label: 'Providers' },
  { key: 'is_active', label: 'Status' },
  { key: 'created_at', label: 'Created' },
]

const createForm = ref<CreateKnowledgeBaseRequest>({
  name: '',
  description: null,
  providers: null,
})

const selectedProviders = ref<string[]>([])

const editForm = ref<UpdateKnowledgeBaseRequest>({
  description: null,
  is_active: null,
})

watch(editingKB, (kb) => {
  if (kb) {
    editForm.value = {
      description: kb.description,
      is_active: kb.is_active,
    }
  }
})

async function handleCreateKB() {
  try {
    const request: CreateKnowledgeBaseRequest = {
      name: createForm.value.name,
      description: createForm.value.description,
      providers: selectedProviders.value.length > 0 ? selectedProviders.value : null,
    }
    
    await createKnowledgeBase(request)
    createForm.value = {
      name: '',
      description: null,
      providers: null,
    }
    selectedProviders.value = []
    await loadKnowledgeBases()
  } catch (err) {
    // Error handled by composable
  }
}

async function handleUpdateKB() {
  if (!editingKB.value) return
  
  try {
    const request: UpdateKnowledgeBaseRequest = {
      description: editForm.value.description,
      is_active: editForm.value.is_active,
    }
    
    await updateKnowledgeBase(editingKB.value.id, request)
    editingKB.value = null
    await loadKnowledgeBases()
  } catch (err) {
    // Error handled by composable
  }
}

async function handleSync(kb: KnowledgeBaseResponse) {
  try {
    await syncKnowledgeBase(kb.id)
    await loadKnowledgeBases()
  } catch (err) {
    // Error handled by composable
  }
}

async function handleSyncProvider(kbId: string, provider: string) {
  try {
    await syncKnowledgeBase(kbId, provider)
    // Refresh the editing KB to show updated status
    if (editingKB.value?.id === kbId) {
      const updated = await getKnowledgeBase(kbId)
      editingKB.value = updated
    }
    await loadKnowledgeBases()
  } catch (err) {
    // Error handled by composable
  }
}

async function loadKnowledgeBases() {
  try {
    await listKnowledgeBases(filterProvider.value || null, filterIsActive.value)
  } catch (err) {
    // Error handled by composable
  }
}

function handleEdit(kb: KnowledgeBaseResponse) {
  editingKB.value = kb
}

function handleDelete(kbId: string) {
  deleteKbId.value = kbId
  showConfirmDialog.value = true
}

async function confirmDelete() {
  if (!deleteKbId.value) return
  try {
    await deleteKnowledgeBase(deleteKbId.value)
    showConfirmDialog.value = false
    deleteKbId.value = null
    await loadKnowledgeBases()
  } catch (err) {
    // Error handled by composable
  }
}

onMounted(() => {
  loadKnowledgeBases()
})
</script>

