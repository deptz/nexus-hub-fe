<template>
  <ApiLayout>
    <div class="space-y-6">
      <!-- Tabs -->
      <div class="bg-white shadow rounded-lg">
        <div class="border-b border-gray-200">
          <nav class="flex -mb-px">
            <button
              @click="activeTab = 'events'"
              :class="
                activeTab === 'events'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              "
              class="whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm"
            >
              Event Logs
            </button>
            <button
              @click="activeTab = 'tool-calls'"
              :class="
                activeTab === 'tool-calls'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              "
              class="whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm"
            >
              Tool Call Logs
            </button>
          </nav>
        </div>

        <!-- Event Logs Tab -->
        <div v-if="activeTab === 'events'" class="p-6">
          <div class="mb-4 space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
              <FormInput
                id="event-conversation-id"
                v-model="eventFilters.conversation_id"
                label="Conversation ID"
                placeholder="Filter by conversation"
              />
              <FormInput
                id="event-type"
                v-model="eventFilters.event_type"
                label="Event Type"
                placeholder="Filter by event type"
              />
              <FormInput
                id="event-provider"
                v-model="eventFilters.provider"
                label="Provider"
                placeholder="Filter by provider"
              />
              <div class="flex items-end">
                <button
                  @click="loadEventLogs"
                  :disabled="logsStore.loading"
                  class="w-full px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
                >
                  Search
                </button>
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormInput
                id="event-start-date"
                v-model="eventFilters.start_date"
                label="Start Date"
                type="datetime-local"
              />
              <FormInput
                id="event-end-date"
                v-model="eventFilters.end_date"
                label="End Date"
                type="datetime-local"
              />
              <FormInput
                id="event-limit"
                v-model.number="eventFilters.limit"
                label="Limit"
                type="number"
              />
            </div>
          </div>

          <ErrorMessage v-if="logsStore.error" :message="logsStore.error" @dismiss="clearError" />

          <div v-if="logsStore.loading" class="text-center py-8">
            <LoadingSpinner />
          </div>

          <div v-else-if="eventLogs.length === 0" class="text-center py-8 text-gray-500">
            No event logs found
          </div>

          <div v-else class="space-y-2">
            <div
              v-for="(log, index) in eventLogs"
              :key="index"
              class="border border-gray-200 rounded-lg p-4"
            >
              <pre class="text-xs overflow-auto">{{ JSON.stringify(log, null, 2) }}</pre>
            </div>
          </div>
        </div>

        <!-- Tool Call Logs Tab -->
        <div v-if="activeTab === 'tool-calls'" class="p-6">
          <div class="mb-4 space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
              <FormInput
                id="tool-conversation-id"
                v-model="toolCallFilters.conversation_id"
                label="Conversation ID"
                placeholder="Filter by conversation"
              />
              <FormInput
                id="tool-name"
                v-model="toolCallFilters.tool_name"
                label="Tool Name"
                placeholder="Filter by tool name"
              />
              <FormInput
                id="tool-status"
                v-model="toolCallFilters.status"
                label="Status"
                placeholder="success or failure"
              />
              <div class="flex items-end">
                <button
                  @click="loadToolCallLogs"
                  :disabled="logsStore.loading"
                  class="w-full px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
                >
                  Search
                </button>
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormInput
                id="tool-start-date"
                v-model="toolCallFilters.start_date"
                label="Start Date"
                type="datetime-local"
              />
              <FormInput
                id="tool-end-date"
                v-model="toolCallFilters.end_date"
                label="End Date"
                type="datetime-local"
              />
              <FormInput
                id="tool-limit"
                v-model.number="toolCallFilters.limit"
                label="Limit"
                type="number"
              />
            </div>
          </div>

          <ErrorMessage v-if="logsStore.error" :message="logsStore.error" @dismiss="clearError" />

          <div v-if="logsStore.loading" class="text-center py-8">
            <LoadingSpinner />
          </div>

          <div v-else-if="toolCallLogs.length === 0" class="text-center py-8 text-gray-500">
            No tool call logs found
          </div>

          <div v-else class="space-y-2">
            <div
              v-for="(log, index) in toolCallLogs"
              :key="index"
              class="border border-gray-200 rounded-lg p-4"
            >
              <pre class="text-xs overflow-auto">{{ JSON.stringify(log, null, 2) }}</pre>
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
import { useLogs } from '@/composables/useLogs'
import { useLogsStore } from '@/stores/logs'
import { useAuth } from '@/composables/useAuth'

const { tenantId } = useAuth()
const logsStore = useLogsStore()
const { getEventLogs, getToolCallLogs, clearError } = useLogs(tenantId.value || '')

const activeTab = ref<'events' | 'tool-calls'>('events')

const eventFilters = ref({
  conversation_id: '',
  event_type: '',
  provider: '',
  start_date: '',
  end_date: '',
  limit: 100,
})

const toolCallFilters = ref({
  conversation_id: '',
  tool_name: '',
  status: '',
  start_date: '',
  end_date: '',
  limit: 100,
})

const eventLogs = computed(() => logsStore.eventLogs)
const toolCallLogs = computed(() => logsStore.toolCallLogs)

async function loadEventLogs() {
  try {
    await getEventLogs(
      eventFilters.value.conversation_id || null,
      eventFilters.value.event_type || null,
      eventFilters.value.provider || null,
      eventFilters.value.start_date || null,
      eventFilters.value.end_date || null,
      eventFilters.value.limit
    )
  } catch (err) {
    // Error handled by composable
  }
}

async function loadToolCallLogs() {
  try {
    await getToolCallLogs(
      toolCallFilters.value.conversation_id || null,
      toolCallFilters.value.tool_name || null,
      toolCallFilters.value.status || null,
      toolCallFilters.value.start_date || null,
      toolCallFilters.value.end_date || null,
      toolCallFilters.value.limit
    )
  } catch (err) {
    // Error handled by composable
  }
}

onMounted(() => {
  loadEventLogs()
})
</script>

