<template>
  <ApiLayout>
    <div class="space-y-6" v-if="channel">
      <!-- Channel Header -->
      <div class="bg-white shadow rounded-lg p-6">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h2 class="text-lg font-medium text-gray-900">Channel Details</h2>
            <p class="text-sm text-gray-500 mt-1">ID: {{ channel.id }}</p>
          </div>
          <router-link
            to="/channels"
            class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Back to List
          </router-link>
        </div>

        <div class="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label class="text-sm font-medium text-gray-700">Name</label>
            <p class="mt-1 text-sm text-gray-900">{{ channel.name }}</p>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-700">Type</label>
            <p class="mt-1 text-sm text-gray-900">{{ channel.channel_type }}</p>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-700">External ID</label>
            <p class="mt-1 text-sm text-gray-900">{{ channel.external_id || 'N/A' }}</p>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-700">Status</label>
            <p class="mt-1">
              <span
                class="px-2 py-1 text-xs font-semibold rounded-full"
                :class="channel.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
              >
                {{ channel.is_active ? 'Active' : 'Inactive' }}
              </span>
            </p>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-700">Created At</label>
            <p class="mt-1 text-sm text-gray-900">{{ new Date(channel.created_at).toLocaleString() }}</p>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-700">Updated At</label>
            <p class="mt-1 text-sm text-gray-900">{{ new Date(channel.updated_at).toLocaleString() }}</p>
          </div>
        </div>

        <div v-if="Object.keys(channel.config || {}).length > 0" class="mt-4">
          <label class="text-sm font-medium text-gray-700">Config</label>
          <div class="mt-1 p-3 bg-gray-50 rounded-md">
            <pre class="text-xs">{{ JSON.stringify(channel.config, null, 2) }}</pre>
          </div>
        </div>
      </div>
    </div>
    <div v-else-if="channelsStore.loading" class="text-center py-8">
      <LoadingSpinner />
    </div>
    <div v-else class="text-center py-8 text-gray-500">
      Channel not found or an error occurred.
      <ErrorMessage v-if="channelsStore.error" :message="channelsStore.error" @dismiss="clearError" />
    </div>
  </ApiLayout>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import ApiLayout from '@/components/layout/ApiLayout.vue'
import ErrorMessage from '@/components/common/ErrorMessage.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import { useChannels } from '@/composables/useChannels'
import { useChannelsStore } from '@/stores/channels'
import { useAuth } from '@/composables/useAuth'

const route = useRoute()
const { tenantId } = useAuth()
const channelId = computed(() => route.params.id as string)

const channelsStore = useChannelsStore()
const { getChannel, clearError } = useChannels(tenantId.value || '')

const channel = computed(() => channelsStore.currentChannel)

async function loadChannel() {
  try {
    await getChannel(channelId.value)
  } catch (err) {
    // Error handled by composable
  }
}

onMounted(() => {
  loadChannel()
})
</script>

