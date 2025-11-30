<template>
  <ApiLayout>
    <div class="space-y-6">
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-lg font-medium text-gray-900 mb-4">Send Inbound Message</h2>
        <form @submit.prevent="handleSendMessage" class="space-y-4">
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormInput
              id="message-id"
              v-model="form.id"
              label="Message ID"
              placeholder="UUID"
              required
            />
            <FormInput
              id="tenant-id"
              v-model="form.tenant_id"
              label="Tenant ID"
              placeholder="UUID"
              required
            />
            <FormInput
              id="conversation-id"
              v-model="form.conversation_id"
              label="Conversation ID"
              placeholder="UUID"
              required
            />
            <FormInput
              id="channel"
              v-model="form.channel"
              label="Channel"
              placeholder="whatsapp, web, slack, email, telegram"
              required
            />
            <div>
              <label for="source-message-id" class="block text-sm font-medium text-gray-700 mb-1">
                Source Message ID (Optional)
              </label>
              <input
                id="source-message-id"
                v-model="form.source_message_id"
                type="text"
                class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="Source message ID"
              />
            </div>
            <FormInput
              id="timestamp"
              v-model="form.timestamp"
              label="Timestamp"
              type="datetime-local"
              required
            />
          </div>

          <div class="border-t pt-4">
            <h3 class="text-sm font-medium text-gray-900 mb-2">From</h3>
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <FormInput
                id="from-type"
                v-model="form.from.type"
                label="Type"
                placeholder="user or bot"
                required
              />
              <FormInput
                id="from-external-id"
                v-model="form.from.external_id"
                label="External ID"
                required
              />
              <div>
                <label for="from-display-name" class="block text-sm font-medium text-gray-700 mb-1">
                  Display Name (Optional)
                </label>
                <input
                  id="from-display-name"
                  v-model="form.from.display_name"
                  type="text"
                  class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="Display name"
                />
              </div>
            </div>
          </div>

          <div class="border-t pt-4">
            <h3 class="text-sm font-medium text-gray-900 mb-2">To</h3>
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <FormInput
                id="to-type"
                v-model="form.to.type"
                label="Type"
                placeholder="user or bot"
                required
              />
              <FormInput
                id="to-external-id"
                v-model="form.to.external_id"
                label="External ID"
                required
              />
              <div>
                <label for="to-display-name" class="block text-sm font-medium text-gray-700 mb-1">
                  Display Name (Optional)
                </label>
                <input
                  id="to-display-name"
                  v-model="form.to.display_name"
                  type="text"
                  class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="Display name"
                />
              </div>
            </div>
          </div>

          <div class="border-t pt-4">
            <h3 class="text-sm font-medium text-gray-900 mb-2">Content</h3>
            <div>
              <label for="content-text" class="block text-sm font-medium text-gray-700 mb-1">
                Message Text *
              </label>
              <textarea
                id="content-text"
                v-model="form.content.text"
                rows="4"
                required
                class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="Enter message text"
              ></textarea>
            </div>
          </div>

          <div class="flex items-center">
            <input
              id="async-processing"
              v-model="form.async_processing"
              type="checkbox"
              class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label for="async-processing" class="ml-2 block text-sm text-gray-900">
              Async Processing
            </label>
          </div>

          <ErrorMessage v-if="error" :message="error" @dismiss="clearError" />

          <div class="flex justify-end">
            <button
              type="submit"
              :disabled="loading"
              class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              <span v-if="loading">Sending...</span>
              <span v-else>Send Message</span>
            </button>
          </div>
        </form>
      </div>

      <div v-if="jobId" class="bg-white shadow rounded-lg p-6">
        <h2 class="text-lg font-medium text-gray-900 mb-4">Message Status</h2>
        <div class="space-y-2">
          <p><strong>Job ID:</strong> {{ jobId }}</p>
          <button
            @click="checkStatus"
            :disabled="loading"
            class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50"
          >
            Check Status
          </button>
        </div>
        <div v-if="statusResult" class="mt-4 p-4 bg-gray-50 rounded">
          <pre class="text-sm">{{ JSON.stringify(statusResult, null, 2) }}</pre>
        </div>
      </div>

      <div v-if="statusResult && !jobId" class="bg-white shadow rounded-lg p-6">
        <h2 class="text-lg font-medium text-gray-900 mb-4">Message Response</h2>
        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-sm font-medium text-gray-700">Status</p>
              <p class="text-sm text-gray-900">{{ statusResult.status }}</p>
            </div>
            <div v-if="statusResult.latency_ms">
              <p class="text-sm font-medium text-gray-700">Latency</p>
              <p class="text-sm text-gray-900">{{ statusResult.latency_ms }} ms</p>
            </div>
            <div v-if="statusResult.tool_calls_executed !== undefined">
              <p class="text-sm font-medium text-gray-700">Tool Calls Executed</p>
              <p class="text-sm text-gray-900">{{ statusResult.tool_calls_executed }}</p>
            </div>
          </div>
          
          <div v-if="statusResult.metadata" class="border-t pt-4">
            <h3 class="text-sm font-medium text-gray-900 mb-2">Metadata</h3>
            <div class="flex flex-wrap gap-2">
              <router-link
                v-if="statusResult.metadata.plan_id"
                :to="`/plans/${statusResult.metadata.plan_id}`"
                class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200"
              >
                Plan: {{ statusResult.metadata.plan_id.substring(0, 8) }}...
              </router-link>
              <router-link
                v-if="statusResult.metadata.task_id"
                :to="`/tasks/${statusResult.metadata.task_id}`"
                class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 hover:bg-green-200"
              >
                Task: {{ statusResult.metadata.task_id.substring(0, 8) }}...
              </router-link>
            </div>
          </div>

          <div class="border-t pt-4">
            <h3 class="text-sm font-medium text-gray-900 mb-2">Response Details</h3>
            <pre class="text-xs bg-gray-50 p-3 rounded overflow-auto">{{ JSON.stringify(statusResult, null, 2) }}</pre>
          </div>
        </div>
      </div>
    </div>
  </ApiLayout>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import ApiLayout from '@/components/layout/ApiLayout.vue'
import FormInput from '@/components/common/FormInput.vue'
import ErrorMessage from '@/components/common/ErrorMessage.vue'
import { useMessages } from '@/composables/useMessages'
import { useAuth } from '@/composables/useAuth'
import { useMessagesStore } from '@/stores/messages'
import type { CanonicalMessage } from '@/api/generated/models/CanonicalMessage'
import type { ExtendedInboundMessageResponse } from '@/api/types'

const { tenantId } = useAuth()
const messagesStore = useMessagesStore()
const { loading, error, sendInboundMessage, getMessageStatus, clearError } = useMessages(tenantId.value || undefined)

const jobId = ref<string | null>(null)
const statusResult = ref<ExtendedInboundMessageResponse | null>(null)

const form = ref<CanonicalMessage & { async_processing: boolean }>({
  id: crypto.randomUUID(),
  tenant_id: tenantId.value || '',
  conversation_id: crypto.randomUUID(),
  channel: 'web',
  direction: 'inbound',
  source_message_id: null,
  from: {
    type: 'user',
    external_id: '',
    display_name: null,
  },
  to: {
    type: 'bot',
    external_id: '',
    display_name: null,
  },
  content: {
    type: 'text',
    text: '',
  },
  metadata: {},
  timestamp: new Date().toISOString(),
  async_processing: false,
})

// Auto-populate tenant_id from auth store when available
watch(tenantId, (newTenantId) => {
  if (newTenantId && !form.value.tenant_id) {
    form.value.tenant_id = newTenantId
  }
}, { immediate: true })

async function handleSendMessage() {
  // Validate from.external_id is not empty
  if (!form.value.from.external_id || form.value.from.external_id.trim() === '') {
    messagesStore.setError('Message must include user external_id in \'from\' field')
    return
  }

  // Validate tenant_id matches API key tenant_id
  if (tenantId.value && form.value.tenant_id !== tenantId.value) {
    messagesStore.setError('Tenant ID mismatch - Tenant ID must match your API key')
    return
  }

  try {
    const { async_processing, ...message } = form.value
    const result = await sendInboundMessage(message, async_processing)
    
    if (async_processing && result.job_id) {
      jobId.value = result.job_id
    } else {
      statusResult.value = result
    }
  } catch (err) {
    // Error handled by composable
  }
}

async function checkStatus() {
  if (!jobId.value) return
  try {
    const result = await getMessageStatus(jobId.value)
    statusResult.value = result
  } catch (err) {
    // Error handled by composable
  }
}
</script>

