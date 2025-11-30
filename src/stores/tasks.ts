import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { TaskResponse } from '@/api/generated/models/TaskResponse'

export const useTasksStore = defineStore('tasks', () => {
  const tasks = ref<TaskResponse[]>([])
  const currentTask = ref<TaskResponse | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const filters = ref<{
    status?: string | null
    limit?: number
    offset?: number
  }>({})

  function setTasks(tasksList: TaskResponse[]) {
    tasks.value = tasksList
  }

  function addTask(task: TaskResponse) {
    tasks.value.push(task)
  }

  function updateTask(taskId: string, updates: Partial<TaskResponse>) {
    const index = tasks.value.findIndex((t) => t.task_id === taskId)
    if (index !== -1) {
      tasks.value[index] = { ...tasks.value[index], ...updates }
    }
    if (currentTask.value?.task_id === taskId) {
      currentTask.value = { ...currentTask.value, ...updates }
    }
  }

  function setCurrentTask(task: TaskResponse | null) {
    currentTask.value = task
  }

  function setFilters(newFilters: { status?: string | null; limit?: number; offset?: number }) {
    filters.value = newFilters
  }

  function clearError() {
    error.value = null
  }

  function setError(err: string) {
    error.value = err
  }

  return {
    tasks,
    currentTask,
    loading,
    error,
    filters,
    setTasks,
    addTask,
    updateTask,
    setCurrentTask,
    setFilters,
    clearError,
    setError,
  }
})
