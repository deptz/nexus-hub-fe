<template>
  <ApiLayout>
    <div class="space-y-6">
      <!-- Conversation Header -->
      <div class="bg-white shadow rounded-lg p-6" v-if="conversation">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h2 class="text-lg font-medium text-gray-900">Conversation Details</h2>
            <p class="text-sm text-gray-500 mt-1">ID: {{ conversation.id }}</p>
          </div>
          <div class="flex items-center space-x-3">
            <span
              class="px-3 py-1 text-sm font-semibold rounded-full"
              :class="{
                'bg-green-100 text-green-800': conversation.status === 'open',
                'bg-gray-100 text-gray-800': conversation.status === 'closed',
                'bg-red-100 text-red-800': conversation.status === 'archived',
              }"
            >
              {{ conversation.status }}
            </span>
            <button
              @click="handleResolve"
              :disabled="loading.value"
              class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
            >
              {{ conversation?.status === 'closed' ? 'Reopen' : 'Resolve' }}
            </button>
            <router-link
              to="/conversations"
              class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Back to List
            </router-link>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label class="text-sm font-medium text-gray-700">Subject</label>
            <p class="mt-1 text-sm text-gray-900">{{ conversation.subject || 'N/A' }}</p>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-700">Channel ID</label>
            <p class="mt-1 text-sm text-gray-900">{{ conversation.channel_id || 'N/A' }}</p>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-700">Created At</label>
            <p class="mt-1 text-sm text-gray-900">{{ new Date(conversation.created_at).toLocaleString() }}</p>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-700">Updated At</label>
            <p class="mt-1 text-sm text-gray-900">{{ new Date(conversation.updated_at).toLocaleString() }}</p>
          </div>
        </div>
      </div>

      <!-- Conversation Stats -->
      <div class="bg-white shadow rounded-lg p-6" v-if="stats">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Statistics</h3>
        <div class="grid grid-cols-4 gap-4">
          <div>
            <label class="text-sm font-medium text-gray-700">Total Messages</label>
            <p class="mt-1 text-2xl font-semibold text-gray-900">{{ stats.total_messages }}</p>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-700">Tool Calls</label>
            <p class="mt-1 text-2xl font-semibold text-gray-900">{{ stats.tool_calls }}</p>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-700">Risk Flags</label>
            <p class="mt-1 text-2xl font-semibold text-gray-900">{{ stats.risk_flags }}</p>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-700">Resolution Time</label>
            <p class="mt-1 text-2xl font-semibold text-gray-900">
              {{ stats.resolution_time_ms ? `${(stats.resolution_time_ms / 1000).toFixed(1)}s` : 'N/A' }}
            </p>
          </div>
        </div>
      </div>

      <!-- Messages List -->
      <div class="bg-white shadow rounded-lg p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900">Messages</h3>
          <button
            @click="loadMessages"
            :disabled="loading.value"
            class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50"
          >
            Refresh
          </button>
        </div>

        <ErrorMessage v-if="error.value" :message="error.value" @dismiss="clearError" />

        <div v-if="loading.value && messages.length === 0" class="text-center py-8">
          <LoadingSpinner />
        </div>

        <div v-else-if="messages.length === 0" class="text-center py-8 text-gray-500">
          No messages found
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="message in messages"
            :key="message.id"
            class="border border-gray-200 rounded-lg p-4"
            :class="{
              'bg-blue-50': message.direction === 'inbound',
              'bg-green-50': message.direction === 'outbound',
            }"
          >
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center space-x-2">
                <span
                  class="px-2 py-1 text-xs font-semibold rounded"
                  :class="{
                    'bg-blue-100 text-blue-800': message.direction === 'inbound',
                    'bg-green-100 text-green-800': message.direction === 'outbound',
                  }"
                >
                  {{ message.direction }}
                </span>
                <span class="text-sm text-gray-600">{{ message.from_display_name || message.from_external_id || 'Unknown' }}</span>
              </div>
              <span class="text-xs text-gray-500">{{ new Date(message.created_at).toLocaleString() }}</span>
            </div>
            <div class="text-sm text-gray-900 whitespace-pre-wrap">{{ message.content_text }}</div>
            <div v-if="Object.keys(message.metadata || {}).length > 0" class="mt-2 text-xs text-gray-500">
              <details>
                <summary class="cursor-pointer">Metadata</summary>
                <pre class="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">{{ JSON.stringify(message.metadata, null, 2) }}</pre>
              </details>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ApiLayout>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import ApiLayout from '@/components/layout/ApiLayout.vue'
import ErrorMessage from '@/components/common/ErrorMessage.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import { useConversations } from '@/composables/useConversations'
import { useMessages } from '@/composables/useMessages'
import { useConversationsStore } from '@/stores/conversations'
import { useMessagesStore } from '@/stores/messages'
import { useAuth } from '@/composables/useAuth'

const route = useRoute()
const { tenantId } = useAuth()
const conversationId = computed(() => route.params.id as string)

const convStore = useConversationsStore()
const messagesStore = useMessagesStore()

const {
  loading: convLoading,
  error: convError,
  getConversation,
  getConversationStats,
  resolveConversation,
  clearError: clearConvError,
} = useConversations(tenantId.value || '')

const {
  loading: msgLoading,
  error: msgError,
  listConversationMessages,
  clearError: clearMsgError,
} = useMessages(tenantId.value || undefined)

const loading = computed(() => convLoading || msgLoading)
const error = computed(() => convError || msgError)

const conversation = computed(() => convStore.currentConversation)
const stats = computed(() => convStore.conversationStats)
const messages = computed(() => messagesStore.messages)

async function loadConversation() {
  try {
    await getConversation(conversationId.value)
    await getConversationStats(conversationId.value)
  } catch (err) {
    // Error handled by composable
  }
}

async function loadMessages() {
  try {
    await listConversationMessages(conversationId.value)
  } catch (err) {
    // Error handled by composable
  }
}

async function handleResolve() {
  if (!conversation.value) return
  try {
    const resolved = conversation.value.status !== 'closed'
    await resolveConversation(conversation.value.id, resolved)
    await loadConversation()
  } catch (err) {
    // Error handled by composable
  }
}

function clearError() {
  clearConvError()
  clearMsgError()
}

onMounted(async () => {
  await Promise.all([loadConversation(), loadMessages()])
})
</script>

