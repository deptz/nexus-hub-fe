<template>
  <ApiLayout>
    <div class="space-y-6">
      <!-- Create RAG Document Form -->
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-lg font-medium text-gray-900 mb-4">Create RAG Document</h2>
        <form @submit.prevent="handleCreateDocument" class="space-y-4">
          <div>
            <label for="doc-kb-name" class="block text-sm font-medium text-gray-700 mb-1">
              Knowledge Base Name <span class="text-red-500">*</span>
            </label>
            <select
              id="doc-kb-name"
              v-model="createForm.kb_name"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Select a knowledge base</option>
              <option v-for="kb in knowledgeBases" :key="kb.id" :value="kb.name">
                {{ kb.name }} {{ kb.description ? `- ${kb.description}` : '' }}
              </option>
            </select>
          </div>
          <FormInput
            id="doc-title"
            v-model="createForm.title"
            label="Title (Optional)"
            placeholder="Document title"
          />
          <FormInput
            id="doc-external-id"
            v-model="createForm.external_id"
            label="External ID (Optional)"
            placeholder="File ID, URL, etc."
          />
          <div>
            <label for="doc-content" class="block text-sm font-medium text-gray-700 mb-1">
              Content <span class="text-red-500">*</span>
            </label>
            <textarea
              id="doc-content"
              v-model="createForm.content"
              required
              rows="10"
              placeholder="Enter document content..."
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            ></textarea>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <FormInput
              id="doc-chunk-size"
              v-model.number="createForm.chunk_size"
              label="Chunk Size (Optional)"
              type="number"
              placeholder="1000"
            />
            <FormInput
              id="doc-chunk-overlap"
              v-model.number="createForm.chunk_overlap"
              label="Chunk Overlap (Optional)"
              type="number"
              placeholder="200"
            />
          </div>
          <div>
            <label for="doc-metadata" class="block text-sm font-medium text-gray-700 mb-1">
              Metadata (JSON, Optional)
            </label>
            <textarea
              id="doc-metadata"
              v-model="metadataJson"
              rows="3"
              placeholder='{"source": "website"}'
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
              Create Document
            </button>
          </div>
        </form>
      </div>

      <!-- RAG Documents List -->
      <div class="bg-white shadow rounded-lg p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-medium text-gray-900">RAG Documents</h2>
          <div class="flex items-center space-x-4">
            <select
              v-model="filterKbName"
              @change="loadDocuments"
              class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">All Knowledge Bases</option>
              <option v-for="kb in knowledgeBases" :key="kb.id" :value="kb.name">
                {{ kb.name }}
              </option>
            </select>
            <button
              @click="loadDocuments"
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
          :items="documents"
          :loading="loading"
          :actions="true"
        >
          <template #cell-content="{ value }">
            <div class="max-w-md truncate" :title="value">
              {{ value.substring(0, 100) }}{{ value.length > 100 ? '...' : '' }}
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
              :to="`/rag/documents/${item.id}`"
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
        title="Delete RAG Document"
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
import { useRagDocuments } from '@/composables/useRagDocuments'
import { useKnowledgeBases } from '@/composables/useKnowledgeBases'
import { useRagDocumentsStore } from '@/stores/ragDocuments'
import { useKnowledgeBasesStore } from '@/stores/knowledgeBases'
import { useAuth } from '@/composables/useAuth'
import type { CreateRAGDocumentRequest } from '@/api/generated/models/CreateRAGDocumentRequest'

const { tenantId } = useAuth()
const ragStore = useRagDocumentsStore()
const kbStore = useKnowledgeBasesStore()
const { loading, error, listRagDocuments, createRagDocument, deleteRagDocument, clearError } = useRagDocuments(tenantId.value || '')
const { listKnowledgeBases } = useKnowledgeBases(tenantId.value || '')

const showConfirmDialog = ref(false)
const deleteDocId = ref<string | null>(null)

const filterKbName = ref<string | null>('')

const documents = computed(() => ragStore.documents)
const knowledgeBases = computed(() => kbStore.knowledgeBases)

const createForm = ref<CreateRAGDocumentRequest>({
  kb_name: '',
  title: null,
  external_id: null,
  content: '',
  metadata: {},
  chunk_size: 1000,
  chunk_overlap: 200,
})

const metadataJson = ref('{}')

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'kb_name', label: 'KB Name' },
  { key: 'title', label: 'Title' },
  { key: 'content', label: 'Content' },
  { key: 'created_at', label: 'Created' },
  { key: 'updated_at', label: 'Updated' },
]

async function loadKnowledgeBases() {
  try {
    await listKnowledgeBases()
  } catch (err) {
    // Error handled by composable
  }
}

async function loadDocuments() {
  try {
    await listRagDocuments(filterKbName.value || null)
  } catch (err) {
    // Error handled by composable
  }
}

async function handleCreateDocument() {
  try {
    let metadata = {}
    if (metadataJson.value) {
      try {
        metadata = JSON.parse(metadataJson.value)
      } catch (e) {
        ragStore.setError('Invalid JSON in metadata')
        return
      }
    }

    const request: CreateRAGDocumentRequest = {
      ...createForm.value,
      metadata,
    }

    await createRagDocument(request)
    createForm.value = {
      kb_name: '',
      title: null,
      external_id: null,
      content: '',
      metadata: {},
      chunk_size: 1000,
      chunk_overlap: 200,
    }
    metadataJson.value = '{}'
    await loadDocuments()
  } catch (err) {
    // Error handled by composable
  }
}

function handleDelete(docId: string) {
  deleteDocId.value = docId
  showConfirmDialog.value = true
}

const confirmMessage = computed(() => {
  if (!deleteDocId.value) return ''
  return `Are you sure you want to delete document ${deleteDocId.value}? This action cannot be undone and will delete all associated chunks.`
})

async function confirmDelete() {
  if (!deleteDocId.value) return
  try {
    await deleteRagDocument(deleteDocId.value)
    showConfirmDialog.value = false
    deleteDocId.value = null
    await loadDocuments()
  } catch (err) {
    // Error handled by composable
  }
}

onMounted(async () => {
  await Promise.all([loadKnowledgeBases(), loadDocuments()])
})
</script>

