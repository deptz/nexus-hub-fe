<template>
  <ApiLayout>
    <div class="space-y-6">
      <!-- Document Header -->
      <div class="bg-white shadow rounded-lg p-6" v-if="document">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h2 class="text-lg font-medium text-gray-900">RAG Document Details</h2>
            <p class="text-sm text-gray-500 mt-1">ID: {{ document.id }}</p>
          </div>
          <router-link
            to="/rag/documents"
            class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Back to List
          </router-link>
        </div>

        <div class="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label class="text-sm font-medium text-gray-700">Knowledge Base</label>
            <p class="mt-1 text-sm text-gray-900">{{ document.kb_name }}</p>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-700">Title</label>
            <p class="mt-1 text-sm text-gray-900">{{ document.title || 'N/A' }}</p>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-700">External ID</label>
            <p class="mt-1 text-sm text-gray-900">{{ document.external_id || 'N/A' }}</p>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-700">Created At</label>
            <p class="mt-1 text-sm text-gray-900">{{ new Date(document.created_at).toLocaleString() }}</p>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-700">Updated At</label>
            <p class="mt-1 text-sm text-gray-900">{{ new Date(document.updated_at).toLocaleString() }}</p>
          </div>
        </div>

        <div class="mt-4">
          <label class="text-sm font-medium text-gray-700">Content</label>
          <div class="mt-1 p-3 bg-gray-50 rounded-md max-h-60 overflow-y-auto">
            <pre class="text-sm whitespace-pre-wrap">{{ document.content }}</pre>
          </div>
        </div>

        <div v-if="Object.keys(document.metadata || {}).length > 0" class="mt-4">
          <label class="text-sm font-medium text-gray-700">Metadata</label>
          <div class="mt-1 p-3 bg-gray-50 rounded-md">
            <pre class="text-xs">{{ JSON.stringify(document.metadata, null, 2) }}</pre>
          </div>
        </div>
      </div>

      <!-- Reindex Document -->
      <div class="bg-white shadow rounded-lg p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Reindex Document</h3>
        <p class="text-sm text-gray-600 mb-4">
          Reindex the document to rechunk and regenerate embeddings. This will delete existing chunks and recreate them.
        </p>
        <form @submit.prevent="handleReindex" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <FormInput
              id="reindex-chunk-size"
              v-model.number="reindexForm.chunk_size"
              label="Chunk Size"
              type="number"
              placeholder="1000"
              required
            />
            <FormInput
              id="reindex-chunk-overlap"
              v-model.number="reindexForm.chunk_overlap"
              label="Chunk Overlap"
              type="number"
              placeholder="200"
              required
            />
          </div>
          <div class="flex justify-end">
            <button
              type="submit"
              :disabled="ragStore.loading"
              class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
            >
              Reindex Document
            </button>
          </div>
        </form>
      </div>

      <!-- Document Chunks -->
      <div class="bg-white shadow rounded-lg p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900">Document Chunks</h3>
          <button
            @click="loadChunks"
            :disabled="ragStore.loading"
            class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50"
          >
            Refresh
          </button>
        </div>

        <ErrorMessage v-if="ragStore.error" :message="ragStore.error" @dismiss="clearError" />

        <div v-if="ragStore.loading && chunks.length === 0" class="text-center py-8">
          <LoadingSpinner />
        </div>

        <div v-else-if="chunks.length === 0" class="text-center py-8 text-gray-500">
          No chunks found
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="chunk in chunks"
            :key="chunk.id"
            class="border border-gray-200 rounded-lg p-4"
          >
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center space-x-2">
                <span class="px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded">
                  Chunk #{{ chunk.chunk_index }}
                </span>
                <span class="text-xs text-gray-500">ID: {{ chunk.id }}</span>
              </div>
              <span class="text-xs text-gray-500">{{ new Date(chunk.created_at).toLocaleString() }}</span>
            </div>
            <div class="text-sm text-gray-900 whitespace-pre-wrap">{{ chunk.content }}</div>
            <div v-if="Object.keys(chunk.metadata || {}).length > 0" class="mt-2 text-xs text-gray-500">
              <details>
                <summary class="cursor-pointer">Metadata</summary>
                <pre class="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">{{ JSON.stringify(chunk.metadata, null, 2) }}</pre>
              </details>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ApiLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import ApiLayout from '@/components/layout/ApiLayout.vue'
import FormInput from '@/components/common/FormInput.vue'
import ErrorMessage from '@/components/common/ErrorMessage.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import { useRagDocuments } from '@/composables/useRagDocuments'
import { useRagDocumentsStore } from '@/stores/ragDocuments'
import { useAuth } from '@/composables/useAuth'

const route = useRoute()
const { tenantId } = useAuth()
const docId = computed(() => route.params.id as string)

const ragStore = useRagDocumentsStore()
const {
  getRagDocument,
  reindexRagDocument,
  listRagDocumentChunks,
  clearError,
} = useRagDocuments(tenantId.value || '')

const document = computed(() => ragStore.currentDocument)
const chunks = computed(() => ragStore.documentChunks)

const reindexForm = ref({
  chunk_size: 1000,
  chunk_overlap: 200,
})

async function loadDocument() {
  try {
    await getRagDocument(docId.value)
  } catch (err) {
    // Error handled by composable
  }
}

async function loadChunks() {
  try {
    await listRagDocumentChunks(docId.value)
  } catch (err) {
    // Error handled by composable
  }
}

async function handleReindex() {
  try {
    await reindexRagDocument(
      docId.value,
      reindexForm.value.chunk_size,
      reindexForm.value.chunk_overlap
    )
  } catch (err) {
    // Error handled by composable
  }
}

onMounted(async () => {
  await Promise.all([loadDocument(), loadChunks()])
})
</script>

