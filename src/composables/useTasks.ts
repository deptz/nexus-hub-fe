import { TasksService } from '@/api/generated/services/TasksService'
import type { TaskResponse } from '@/api/generated/models/TaskResponse'
import type { CreateTaskRequest } from '@/api/generated/models/CreateTaskRequest'
import { useTasksStore } from '@/stores/tasks'
import { useApi } from './useApi'
import { getApiErrorMessage } from '@/api/client'

export function useTasks() {
  const tasksStore = useTasksStore()
  const api = useApi()

  async function createTask(request: CreateTaskRequest): Promise<TaskResponse> {
    try {
      tasksStore.loading = true
      const result = await api.execute(() =>
        TasksService.createNewTaskTasksPost(request)
      )
      tasksStore.addTask(result)
      return result
    } catch (error) {
      const errorMsg = getApiErrorMessage(error)
      tasksStore.setError(errorMsg)
      throw error
    } finally {
      tasksStore.loading = false
    }
  }

  async function listTasks(
    status?: string | null,
    limit: number = 50,
    offset?: number
  ): Promise<TaskResponse[]> {
    try {
      tasksStore.loading = true
      const result = await api.execute(() =>
        TasksService.listTenantTasksTasksGet(status, limit, offset)
      )
      tasksStore.setTasks(result)
      tasksStore.setFilters({ status, limit, offset })
      return result
    } catch (error) {
      const errorMsg = getApiErrorMessage(error)
      tasksStore.setError(errorMsg)
      throw error
    } finally {
      tasksStore.loading = false
    }
  }

  async function getTask(taskId: string): Promise<TaskResponse> {
    try {
      tasksStore.loading = true
      const result = await api.execute(() =>
        TasksService.getTaskStatusTasksTaskIdGet(taskId)
      )
      tasksStore.setCurrentTask(result)
      // Update task in list if it exists
      tasksStore.updateTask(taskId, result)
      return result
    } catch (error) {
      const errorMsg = getApiErrorMessage(error)
      tasksStore.setError(errorMsg)
      throw error
    } finally {
      tasksStore.loading = false
    }
  }

  async function resumeTask(taskId: string): Promise<TaskResponse> {
    try {
      tasksStore.loading = true
      const result = await api.execute(() =>
        TasksService.resumeInterruptedTaskTasksTaskIdResumePost(taskId)
      )
      tasksStore.setCurrentTask(result)
      tasksStore.updateTask(taskId, result)
      return result
    } catch (error) {
      const errorMsg = getApiErrorMessage(error)
      tasksStore.setError(errorMsg)
      throw error
    } finally {
      tasksStore.loading = false
    }
  }

  async function cancelTask(taskId: string): Promise<void> {
    try {
      tasksStore.loading = true
      await api.execute(() =>
        TasksService.cancelRunningTaskTasksTaskIdCancelPost(taskId)
      )
      // Update task status to cancelled
      tasksStore.updateTask(taskId, { status: 'cancelled' as any })
      if (tasksStore.currentTask?.task_id === taskId) {
        tasksStore.setCurrentTask({ ...tasksStore.currentTask, status: 'cancelled' as any })
      }
    } catch (error) {
      const errorMsg = getApiErrorMessage(error)
      tasksStore.setError(errorMsg)
      throw error
    } finally {
      tasksStore.loading = false
    }
  }

  function clearError() {
    tasksStore.clearError()
  }

  return {
    ...api,
    createTask,
    listTasks,
    getTask,
    resumeTask,
    cancelTask,
    clearError,
  }
}
