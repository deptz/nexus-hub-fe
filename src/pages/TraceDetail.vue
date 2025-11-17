<template>
  <ApiLayout>
    <div class="space-y-6" v-if="trace">
      <!-- Trace Header -->
      <div class="bg-white shadow rounded-lg p-6">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h2 class="text-lg font-medium text-gray-900">LLM Trace Details</h2>
            <p class="text-sm text-gray-500 mt-1">ID: {{ trace.id }}</p>
          </div>
          <router-link
            to="/traces"
            class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Back to List
          </router-link>
        </div>

        <div class="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label class="text-sm font-medium text-gray-700">Provider</label>
            <p class="mt-1 text-sm text-gray-900">{{ trace.provider }}</p>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-700">Model</label>
            <p class="mt-1 text-sm text-gray-900">{{ trace.model }}</p>
          </div>
          <div v-if="trace.conversation_id">
            <label class="text-sm font-medium text-gray-700">Conversation ID</label>
            <p class="mt-1 text-sm text-gray-900">{{ trace.conversation_id }}</p>
          </div>
          <div v-if="trace.message_id">
            <label class="text-sm font-medium text-gray-700">Message ID</label>
            <p class="mt-1 text-sm text-gray-900">{{ trace.message_id }}</p>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-700">Created At</label>
            <p class="mt-1 text-sm text-gray-900">{{ new Date(trace.created_at).toLocaleString() }}</p>
          </div>
        </div>
      </div>

      <!-- Request Payload -->
      <div class="bg-white shadow rounded-lg p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Request Payload</h3>
        <div class="bg-gray-50 rounded-md p-4 overflow-auto max-h-96">
          <pre class="text-xs">{{ JSON.stringify(trace.request_payload, null, 2) }}</pre>
        </div>
      </div>

      <!-- Response Payload -->
      <div class="bg-white shadow rounded-lg p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Response Payload</h3>
        <div class="bg-gray-50 rounded-md p-4 overflow-auto max-h-96">
          <pre class="text-xs">{{ JSON.stringify(trace.response_payload, null, 2) }}</pre>
        </div>
      </div>
    </div>
    <div v-else-if="tracesStore.loading" class="text-center py-8">
      <LoadingSpinner />
    </div>
    <div v-else class="text-center py-8 text-gray-500">
      Trace not found or an error occurred.
      <ErrorMessage v-if="tracesStore.error" :message="tracesStore.error" @dismiss="clearError" />
    </div>
  </ApiLayout>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import ApiLayout from '@/components/layout/ApiLayout.vue'
import ErrorMessage from '@/components/common/ErrorMessage.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import { useTraces } from '@/composables/useTraces'
import { useTracesStore } from '@/stores/traces'
import { useAuth } from '@/composables/useAuth'

const route = useRoute()
const { tenantId } = useAuth()
const traceId = computed(() => route.params.id as string)

const tracesStore = useTracesStore()
const { getLlmTrace, clearError } = useTraces(tenantId.value || '')

const trace = computed(() => tracesStore.currentTrace)

async function loadTrace() {
  try {
    await getLlmTrace(traceId.value)
  } catch (err) {
    // Error handled by composable
  }
}

onMounted(() => {
  loadTrace()
})
</script>

