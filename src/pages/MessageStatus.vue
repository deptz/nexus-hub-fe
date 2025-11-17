<template>
  <ApiLayout>
    <div class="bg-white shadow rounded-lg p-6">
      <h2 class="text-lg font-medium text-gray-900 mb-4">Message Status</h2>
      
      <LoadingSpinner v-if="loading" />
      <ErrorMessage v-else-if="error" :message="error" />
      
      <div v-else-if="status" class="space-y-4">
        <div>
          <strong>Job ID:</strong> {{ status.job_id }}
        </div>
        <div>
          <strong>Status:</strong> 
          <span :class="{
            'text-green-600': status.status === 'completed',
            'text-yellow-600': status.status === 'processing' || status.status === 'queued',
            'text-red-600': status.status === 'failed',
          }">
            {{ status.status }}
          </span>
        </div>
        <div v-if="status.result">
          <strong>Result:</strong>
          <pre class="mt-2 p-4 bg-gray-50 rounded text-sm overflow-auto">{{ JSON.stringify(status.result, null, 2) }}</pre>
        </div>
        <div v-if="status.error">
          <strong>Error:</strong>
          <pre class="mt-2 p-4 bg-red-50 rounded text-sm text-red-800">{{ status.error }}</pre>
        </div>
        <button
          @click="refresh"
          :disabled="loading"
          class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
        >
          Refresh
        </button>
      </div>
    </div>
  </ApiLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import ApiLayout from '@/components/layout/ApiLayout.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import ErrorMessage from '@/components/common/ErrorMessage.vue'
import { useMessages } from '@/composables/useMessages'
import type { JobStatus } from '@/api/types'

const route = useRoute()
const { loading, error, getMessageStatus } = useMessages()

const status = ref<JobStatus | null>(null)
const jobId = route.params.jobId as string

async function refresh() {
  try {
    const result = await getMessageStatus(jobId)
    status.value = {
      status: result.status || 'unknown',
      job_id: jobId,
      result: result.result,
      error: result.error,
    } as JobStatus
  } catch (err) {
    // Error handled by composable
  }
}

onMounted(() => {
  refresh()
})
</script>

