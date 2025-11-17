<template>
  <ApiLayout>
    <div class="space-y-6">
      <!-- Health Status Cards -->
      <div class="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg
                  class="h-6 w-6"
                  :class="healthStore.health?.status === 'healthy' ? 'text-green-400' : 'text-red-400'"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Health</dt>
                  <dd
                    class="text-lg font-medium"
                    :class="healthStore.health?.status === 'healthy' ? 'text-green-600' : 'text-red-600'"
                  >
                    {{ healthStore.health?.status === 'healthy' ? 'Healthy' : 'Unhealthy' }}
                  </dd>
                  <dd v-if="healthStore.health" class="text-xs text-gray-500">
                    {{ new Date(healthStore.health.timestamp).toLocaleString() }}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg
                  class="h-6 w-6"
                  :class="healthStore.liveness?.status === 'alive' ? 'text-green-400' : 'text-red-400'"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Liveness</dt>
                  <dd
                    class="text-lg font-medium"
                    :class="healthStore.liveness?.status === 'alive' ? 'text-green-600' : 'text-red-600'"
                  >
                    {{ healthStore.liveness?.status === 'alive' ? 'Alive' : 'Dead' }}
                  </dd>
                  <dd v-if="healthStore.liveness" class="text-xs text-gray-500">
                    {{ new Date(healthStore.liveness.timestamp).toLocaleString() }}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg
                  class="h-6 w-6"
                  :class="healthStore.readiness?.status === 'ready' ? 'text-green-400' : 'text-red-400'"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Readiness</dt>
                  <dd
                    class="text-lg font-medium"
                    :class="healthStore.readiness?.status === 'ready' ? 'text-green-600' : 'text-red-600'"
                  >
                    {{ healthStore.readiness?.status === 'ready' ? 'Ready' : 'Not Ready' }}
                  </dd>
                  <dd v-if="healthStore.readiness" class="text-xs text-gray-500">
                    {{ new Date(healthStore.readiness.timestamp).toLocaleString() }}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-lg font-medium text-gray-900 mb-4">Health Checks</h2>
        <div class="flex flex-wrap gap-3">
          <button
            @click="checkHealth"
            :disabled="loading"
            class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
          >
            Check Health
          </button>
          <button
            @click="checkLiveness"
            :disabled="loading"
            class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50"
          >
            Check Liveness
          </button>
          <button
            @click="checkReadiness"
            :disabled="loading"
            class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50"
          >
            Check Readiness
          </button>
          <button
            @click="getMetrics"
            :disabled="loading"
            class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50"
          >
            Get Metrics
          </button>
        </div>

        <ErrorMessage v-if="error" :message="error" @dismiss="clearError" />
      </div>

      <!-- Metrics Display -->
      <div v-if="healthStore.metrics" class="bg-white shadow rounded-lg p-6">
        <h2 class="text-lg font-medium text-gray-900 mb-4">Prometheus Metrics</h2>
        <div class="bg-gray-50 p-4 rounded border overflow-auto">
          <pre class="text-xs font-mono whitespace-pre">{{ healthStore.metrics }}</pre>
        </div>
      </div>
    </div>
  </ApiLayout>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import ApiLayout from '@/components/layout/ApiLayout.vue'
import ErrorMessage from '@/components/common/ErrorMessage.vue'
import { useHealth } from '@/composables/useHealth'
import { useHealthStore } from '@/stores/health'

const healthStore = useHealthStore()
const { loading, error, checkHealth, checkLiveness, checkReadiness, getMetrics, clearError } = useHealth()

onMounted(() => {
  checkHealth()
  checkLiveness()
  checkReadiness()
})
</script>

