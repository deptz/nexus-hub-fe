<template>
  <ApiLayout>
    <div class="space-y-6">
      <!-- Filters -->
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-lg font-medium text-gray-900 mb-4">LLM Traces</h2>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <FormInput
            id="trace-conversation-id"
            v-model="filters.conversation_id"
            label="Conversation ID"
            placeholder="Filter by conversation"
          />
          <FormInput
            id="trace-message-id"
            v-model="filters.message_id"
            label="Message ID"
            placeholder="Filter by message"
          />
          <FormInput
            id="trace-provider"
            v-model="filters.provider"
            label="Provider"
            placeholder="openai or gemini"
          />
          <FormInput
            id="trace-model"
            v-model="filters.model"
            label="Model"
            placeholder="Filter by model"
          />
        </div>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <FormInput
            id="trace-start-date"
            v-model="filters.start_date"
            label="Start Date"
            type="datetime-local"
          />
          <FormInput
            id="trace-end-date"
            v-model="filters.end_date"
            label="End Date"
            type="datetime-local"
          />
          <FormInput
            id="trace-limit"
            v-model.number="filters.limit"
            label="Limit"
            type="number"
          />
          <div class="flex items-end">
            <button
              @click="loadTraces"
              :disabled="tracesStore.loading"
              class="w-full px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      <!-- Traces List -->
      <div class="bg-white shadow rounded-lg p-6">
        <ErrorMessage v-if="tracesStore.error" :message="tracesStore.error" @dismiss="clearError" />

        <div v-if="tracesStore.loading" class="text-center py-8">
          <LoadingSpinner />
        </div>

        <div v-else-if="traces.length === 0" class="text-center py-8 text-gray-500">
          No traces found
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="trace in traces"
            :key="trace.id"
            class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
            @click="$router.push(`/traces/${trace.id}`)"
          >
            <div class="flex items-center justify-between mb-2">
              <div>
                <h3 class="font-medium text-gray-900">{{ trace.provider }} - {{ trace.model }}</h3>
                <p class="text-sm text-gray-500">ID: {{ trace.id }}</p>
              </div>
              <span class="text-xs text-gray-500">{{ new Date(trace.created_at).toLocaleString() }}</span>
            </div>
            <div v-if="trace.conversation_id" class="text-sm text-gray-600">
              Conversation: {{ trace.conversation_id }}
            </div>
            <div v-if="trace.message_id" class="text-sm text-gray-600">
              Message: {{ trace.message_id }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </ApiLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import ApiLayout from '@/components/layout/ApiLayout.vue'
import FormInput from '@/components/common/FormInput.vue'
import ErrorMessage from '@/components/common/ErrorMessage.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import { useTraces } from '@/composables/useTraces'
import { useTracesStore } from '@/stores/traces'
import { useAuth } from '@/composables/useAuth'

const { tenantId } = useAuth()
const tracesStore = useTracesStore()
const { listLlmTraces, clearError } = useTraces(tenantId.value || '')

const filters = ref({
  conversation_id: '',
  message_id: '',
  provider: '',
  model: '',
  start_date: '',
  end_date: '',
  limit: 100,
})

const traces = computed(() => tracesStore.traces)

async function loadTraces() {
  try {
    await listLlmTraces(
      filters.value.conversation_id || null,
      filters.value.message_id || null,
      filters.value.provider || null,
      filters.value.model || null,
      filters.value.start_date || null,
      filters.value.end_date || null,
      filters.value.limit
    )
  } catch (err) {
    // Error handled by composable
  }
}

onMounted(() => {
  loadTraces()
})
</script>

