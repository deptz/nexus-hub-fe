<template>
  <ApiLayout>
    <div class="space-y-6">
      <div v-if="task" class="bg-white shadow rounded-lg p-6">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h2 class="text-lg font-medium text-gray-900">Task Details</h2>
            <p class="text-sm text-gray-500 mt-1">ID: {{ task.task_id }}</p>
          </div>
          <div class="flex items-center space-x-3">
            <button
              v-if="task.status === 'failed' || task.status === 'planning'"
              @click="handleResume"
              :disabled="loading"
              class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              Resume
            </button>
            <button
              v-if="task.status === 'executing' || task.status === 'planning'"
              @click="handleCancel"
              :disabled="loading"
              class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
            >
              Cancel
            </button>
            <router-link
              to="/tasks"
              class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Back to List
            </router-link>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label class="text-sm font-medium text-gray-700">Goal</label>
            <p class="mt-1 text-sm text-gray-900">{{ task.goal }}</p>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-700">Status</label>
            <p class="mt-1">
              <span
                class="px-2 py-1 text-xs font-semibold rounded-full"
                :class="{
                  'bg-green-100 text-green-800': task.status === 'completed',
                  'bg-blue-100 text-blue-800': task.status === 'executing',
                  'bg-yellow-100 text-yellow-800': task.status === 'planning',
                  'bg-red-100 text-red-800': task.status === 'failed' || task.status === 'cancelled',
                }"
              >
                {{ task.status }}
              </span>
            </p>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-700">Current Step</label>
            <p class="mt-1 text-sm text-gray-900">{{ task.current_step }}</p>
          </div>
          <div v-if="task.plan_id">
            <label class="text-sm font-medium text-gray-700">Plan ID</label>
            <p class="mt-1">
              <router-link
                :to="`/plans/${task.plan_id}`"
                class="text-blue-600 hover:text-blue-900 text-sm"
              >
                {{ task.plan_id }}
              </router-link>
            </p>
          </div>
          <div v-if="task.conversation_id">
            <label class="text-sm font-medium text-gray-700">Conversation ID</label>
            <p class="mt-1">
              <router-link
                :to="`/conversations/${task.conversation_id}`"
                class="text-blue-600 hover:text-blue-900 text-sm"
              >
                {{ task.conversation_id }}
              </router-link>
            </p>
          </div>
          <div v-if="task.created_at">
            <label class="text-sm font-medium text-gray-700">Created At</label>
            <p class="mt-1 text-sm text-gray-900">{{ new Date(task.created_at).toLocaleString() }}</p>
          </div>
          <div v-if="task.completed_at">
            <label class="text-sm font-medium text-gray-700">Completed At</label>
            <p class="mt-1 text-sm text-gray-900">{{ new Date(task.completed_at).toLocaleString() }}</p>
          </div>
        </div>

        <div class="mt-6 border-t pt-4">
          <h3 class="text-sm font-medium text-gray-900 mb-4">Progress</h3>
          <div class="w-full bg-gray-200 rounded-full h-2.5">
            <div
              class="bg-blue-600 h-2.5 rounded-full transition-all"
              :style="{ width: `${((task.current_step + 1) / 10) * 100}%` }"
            ></div>
          </div>
          <p class="text-xs text-gray-600 mt-2">Step {{ task.current_step + 1 }} of estimated steps</p>
        </div>

        <div v-if="task.state && Object.keys(task.state).length > 0" class="mt-6 border-t pt-4">
          <h3 class="text-sm font-medium text-gray-900 mb-4">Task State</h3>
          <div class="bg-gray-50 rounded-lg p-4">
            <pre class="text-xs overflow-auto">{{ JSON.stringify(task.state, null, 2) }}</pre>
          </div>
        </div>
      </div>

      <ErrorMessage v-if="error" :message="error" @dismiss="clearError" />
      <LoadingSpinner v-if="loading && !task" />

      <ConfirmDialog
        :show="showCancelConfirm"
        title="Cancel Task"
        message="Are you sure you want to cancel this task? This action cannot be undone."
        confirm-text="Cancel Task"
        @confirm="confirmCancel"
        @cancel="showCancelConfirm = false"
      />
    </div>
  </ApiLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import ApiLayout from '@/components/layout/ApiLayout.vue'
import ErrorMessage from '@/components/common/ErrorMessage.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import { useTasks } from '@/composables/useTasks'
import { useTasksStore } from '@/stores/tasks'

const route = useRoute()
const taskId = computed(() => route.params.id as string)

const tasksStore = useTasksStore()
const { loading, error, getTask, resumeTask, cancelTask, clearError } = useTasks()

const task = computed(() => tasksStore.currentTask)
const showCancelConfirm = ref(false)

async function loadTask() {
  try {
    await getTask(taskId.value)
  } catch (err) {
    // Error handled by composable
  }
}

async function handleResume() {
  try {
    await resumeTask(taskId.value)
    await loadTask()
  } catch (err) {
    // Error handled by composable
  }
}

async function handleCancel() {
  showCancelConfirm.value = true
}

async function confirmCancel() {
  try {
    await cancelTask(taskId.value)
    showCancelConfirm.value = false
    await loadTask()
  } catch (err) {
    // Error handled by composable
  }
}

onMounted(() => {
  loadTask()
})
</script>
