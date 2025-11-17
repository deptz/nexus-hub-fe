<template>
  <ApiLayout>
    <div class="space-y-6">
      <!-- Conversations List -->
      <div class="bg-white shadow rounded-lg p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-medium text-gray-900">Conversations</h2>
          <div class="flex items-center space-x-4">
            <select
              v-model="filterStatus"
              @change="loadConversations"
              class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">All Status</option>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
              <option value="archived">Archived</option>
            </select>
            <input
              v-model="filterChannelId"
              type="text"
              placeholder="Channel ID"
              @change="loadConversations"
              class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
            <input
              v-model="filterStartDate"
              type="date"
              @change="loadConversations"
              class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
            <input
              v-model="filterEndDate"
              type="date"
              @change="loadConversations"
              class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
            <button
              @click="loadConversations"
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
          :items="conversations"
          :loading="loading"
          :actions="true"
        >
          <template #cell-status="{ value }">
            <span
              class="px-2 py-1 text-xs font-semibold rounded-full"
              :class="{
                'bg-green-100 text-green-800': value === 'open',
                'bg-gray-100 text-gray-800': value === 'closed',
                'bg-red-100 text-red-800': value === 'archived',
              }"
            >
              {{ value }}
            </span>
          </template>
          <template #cell-created_at="{ value }">
            {{ new Date(value).toLocaleString() }}
          </template>
          <template #cell-updated_at="{ value }">
            {{ new Date(value).toLocaleString() }}
          </template>
          <template #actions="{ item }">
            <router-link
              :to="`/conversations/${item.id}`"
              class="text-blue-600 hover:text-blue-900 mr-3"
            >
              View
            </router-link>
            <button
              @click="handleResolve(item)"
              :class="item.status === 'closed' ? 'text-green-600 hover:text-green-900' : 'text-orange-600 hover:text-orange-900'"
              class="mr-3"
            >
              {{ item.status === 'closed' ? 'Reopen' : 'Resolve' }}
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

      <ConfirmDialog
        :show="showConfirmDialog"
        title="Delete Conversation"
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
import ErrorMessage from '@/components/common/ErrorMessage.vue'
import DataTable from '@/components/common/DataTable.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import { useConversations } from '@/composables/useConversations'
import { useConversationsStore } from '@/stores/conversations'
import { useAuth } from '@/composables/useAuth'
import type { ConversationResponse } from '@/api/generated/models/ConversationResponse'

const { tenantId } = useAuth()
const convStore = useConversationsStore()
const { loading, error, listConversations, resolveConversation, deleteConversation, clearError } = useConversations(tenantId.value || '')

const showConfirmDialog = ref(false)
const deleteConvId = ref<string | null>(null)

const filterStatus = ref<string | null>('')
const filterChannelId = ref<string | null>('')
const filterStartDate = ref<string | null>('')
const filterEndDate = ref<string | null>('')

const conversations = computed(() => convStore.conversations)

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'subject', label: 'Subject' },
  { key: 'status', label: 'Status' },
  { key: 'channel_id', label: 'Channel' },
  { key: 'created_at', label: 'Created' },
  { key: 'updated_at', label: 'Updated' },
]

async function loadConversations() {
  try {
    await listConversations(
      filterStatus.value || null,
      filterChannelId.value || null,
      filterStartDate.value || null,
      filterEndDate.value || null
    )
  } catch (err) {
    // Error handled by composable
  }
}

async function handleResolve(conv: ConversationResponse) {
  try {
    const resolved = conv.status !== 'closed'
    await resolveConversation(conv.id, resolved)
    await loadConversations()
  } catch (err) {
    // Error handled by composable
  }
}

function handleDelete(convId: string) {
  deleteConvId.value = convId
  showConfirmDialog.value = true
}

const confirmMessage = computed(() => {
  if (!deleteConvId.value) return ''
  return `Are you sure you want to delete conversation ${deleteConvId.value}? This action cannot be undone.`
})

async function confirmDelete() {
  if (!deleteConvId.value) return
  try {
    await deleteConversation(deleteConvId.value)
    showConfirmDialog.value = false
    deleteConvId.value = null
    await loadConversations()
  } catch (err) {
    // Error handled by composable
  }
}

onMounted(() => {
  loadConversations()
})
</script>

