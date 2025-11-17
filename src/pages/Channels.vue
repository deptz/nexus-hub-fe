<template>
  <ApiLayout>
    <div class="space-y-6">
      <!-- Create Channel Form -->
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-lg font-medium text-gray-900 mb-4">Create Channel</h2>
        <form @submit.prevent="handleCreateChannel" class="space-y-4">
          <FormInput
            id="channel-name"
            v-model="createForm.name"
            label="Name"
            placeholder="whatsapp-main"
            required
          />
          <FormInput
            id="channel-type"
            v-model="createForm.channel_type"
            label="Channel Type"
            placeholder="whatsapp, web, slack, telegram"
            required
          />
          <FormInput
            id="channel-external-id"
            v-model="createForm.external_id"
            label="External ID (Optional)"
            placeholder="+1234567890"
          />
          <div>
            <label for="channel-config" class="block text-sm font-medium text-gray-700 mb-1">
              Config (JSON, Optional)
            </label>
            <textarea
              id="channel-config"
              v-model="configJson"
              rows="3"
              placeholder='{"webhook_url": "https://example.com/webhook"}'
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 font-mono text-sm"
            ></textarea>
          </div>
          <div>
            <label class="flex items-center">
              <input
                v-model="createForm.is_active"
                type="checkbox"
                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <span class="ml-2 text-sm text-gray-700">Active</span>
            </label>
          </div>

          <ErrorMessage v-if="error" :message="error" @dismiss="clearError" />

          <div class="flex justify-end">
            <button
              type="submit"
              :disabled="loading"
              class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
            >
              Create Channel
            </button>
          </div>
        </form>
      </div>

      <!-- Channels List -->
      <div class="bg-white shadow rounded-lg p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-medium text-gray-900">Channels</h2>
          <div class="flex items-center space-x-4">
            <select
              v-model="filterChannelType"
              @change="loadChannels"
              class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">All Types</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="web">Web</option>
              <option value="slack">Slack</option>
              <option value="telegram">Telegram</option>
            </select>
            <select
              v-model="filterIsActive"
              @change="loadChannels"
              class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option :value="null">All Status</option>
              <option :value="true">Active</option>
              <option :value="false">Inactive</option>
            </select>
            <button
              @click="loadChannels"
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
          :items="channels"
          :loading="loading"
          :actions="true"
        >
          <template #cell-is_active="{ value }">
            <span
              class="px-2 py-1 text-xs font-semibold rounded-full"
              :class="value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
            >
              {{ value ? 'Active' : 'Inactive' }}
            </span>
          </template>
          <template #cell-config="{ value }">
            <div class="max-w-md truncate" :title="JSON.stringify(value)">
              {{ Object.keys(value || {}).length > 0 ? JSON.stringify(value) : 'None' }}
            </div>
          </template>
          <template #cell-created_at="{ value }">
            {{ new Date(value).toLocaleString() }}
          </template>
          <template #actions="{ item }">
            <router-link
              :to="`/channels/${item.id}`"
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
        title="Delete Channel"
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
import { useChannels } from '@/composables/useChannels'
import { useChannelsStore } from '@/stores/channels'
import { useAuth } from '@/composables/useAuth'
import type { CreateChannelRequest } from '@/api/generated/models/CreateChannelRequest'

const { tenantId } = useAuth()
const channelsStore = useChannelsStore()
const { loading, error, listChannels, createChannel, deleteChannel, clearError } = useChannels(tenantId.value || '')

const showConfirmDialog = ref(false)
const deleteChannelId = ref<string | null>(null)

const filterChannelType = ref<string | null>('')
const filterIsActive = ref<boolean | null>(null)

const channels = computed(() => channelsStore.channels)

const createForm = ref<CreateChannelRequest>({
  name: '',
  channel_type: '',
  external_id: null,
  config: {},
  is_active: true,
})

const configJson = ref('{}')

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name' },
  { key: 'channel_type', label: 'Type' },
  { key: 'external_id', label: 'External ID' },
  { key: 'is_active', label: 'Status' },
  { key: 'config', label: 'Config' },
  { key: 'created_at', label: 'Created' },
]

async function loadChannels() {
  try {
    await listChannels(filterChannelType.value || null, filterIsActive.value)
  } catch (err) {
    // Error handled by composable
  }
}

async function handleCreateChannel() {
  try {
    let config = {}
    if (configJson.value) {
      try {
        config = JSON.parse(configJson.value)
      } catch (e) {
        channelsStore.setError('Invalid JSON in config')
        return
      }
    }

    const request: CreateChannelRequest = {
      ...createForm.value,
      config,
    }

    await createChannel(request)
    createForm.value = {
      name: '',
      channel_type: '',
      external_id: null,
      config: {},
      is_active: true,
    }
    configJson.value = '{}'
    await loadChannels()
  } catch (err) {
    // Error handled by composable
  }
}

function handleDelete(channelId: string) {
  deleteChannelId.value = channelId
  showConfirmDialog.value = true
}

const confirmMessage = computed(() => {
  if (!deleteChannelId.value) return ''
  return `Are you sure you want to delete channel ${deleteChannelId.value}? This action cannot be undone.`
})

async function confirmDelete() {
  if (!deleteChannelId.value) return
  try {
    await deleteChannel(deleteChannelId.value)
    showConfirmDialog.value = false
    deleteChannelId.value = null
    await loadChannels()
  } catch (err) {
    // Error handled by composable
  }
}

onMounted(() => {
  loadChannels()
})
</script>

