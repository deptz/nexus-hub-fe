<template>
  <ApiLayout>
    <div class="space-y-6">
      <div class="bg-white shadow rounded-lg p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-medium text-gray-900">Tasks</h2>
          <div class="flex items-center space-x-4">
            <select
              v-model="filterStatus"
              @change="loadTasks"
              class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">All Status</option>
              <option value="planning">Planning</option>
              <option value="executing">Executing</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button
              @click="loadTasks"
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
          :items="tasks"
          :loading="loading"
          :actions="true"
        >
          <template #cell-status="{ value }">
            <span
              class="px-2 py-1 text-xs font-semibold rounded-full"
              :class="{
                'bg-green-100 text-green-800': value === 'completed',
                'bg-blue-100 text-blue-800': value === 'executing',
                'bg-yellow-100 text-yellow-800': value === 'planning',
                'bg-red-100 text-red-800': value === 'failed' || value === 'cancelled',
              }"
            >
              {{ value }}
            </span>
          </template>
          <template #cell-goal="{ value }">
            <span class="text-sm text-gray-900">{{ value || 'N/A' }}</span>
          </template>
          <template #cell-created_at="{ value }">
            {{ value ? new Date(value).toLocaleString() : 'N/A' }}
          </template>
          <template #actions="{ item }">
            <router-link
              :to="`/tasks/${item.task_id}`"
              class="text-blue-600 hover:text-blue-900 mr-3"
            >
              View
            </router-link>
          </template>
        </DataTable>
      </div>
    </div>
  </ApiLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import ApiLayout from '@/components/layout/ApiLayout.vue'
import ErrorMessage from '@/components/common/ErrorMessage.vue'
import DataTable from '@/components/common/DataTable.vue'
import { useTasks } from '@/composables/useTasks'
import { useTasksStore } from '@/stores/tasks'

const tasksStore = useTasksStore()
const { loading, error, listTasks, clearError } = useTasks()

const filterStatus = ref<string | null>('')

const tasks = computed(() => tasksStore.tasks)

const columns = [
  { key: 'task_id', label: 'Task ID' },
  { key: 'goal', label: 'Goal' },
  { key: 'status', label: 'Status' },
  { key: 'current_step', label: 'Current Step' },
  { key: 'created_at', label: 'Created' },
]

async function loadTasks() {
  try {
    await listTasks(filterStatus.value || null)
  } catch (err) {
    // Error handled by composable
  }
}

onMounted(() => {
  loadTasks()
})
</script>
