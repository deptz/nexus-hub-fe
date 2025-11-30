import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { TasksService } from '@/api/generated/services/TasksService'
import type { TaskResponse } from '@/api/generated/models/TaskResponse'
import type { CreateTaskRequest } from '@/api/generated/models/CreateTaskRequest'

// Mock the TasksService
vi.mock('@/api/generated/services/TasksService', () => ({
  TasksService: {
    createNewTaskTasksPost: vi.fn(),
    listTenantTasksTasksGet: vi.fn(),
    getTaskStatusTasksTaskIdGet: vi.fn(),
    resumeInterruptedTaskTasksTaskIdResumePost: vi.fn(),
    cancelRunningTaskTasksTaskIdCancelPost: vi.fn(),
  },
}))

// Mock getApiErrorMessage
vi.mock('@/api/client', () => ({
  getApiErrorMessage: (error: unknown) => {
    if (error instanceof Error) return error.message
    return 'An unexpected error occurred'
  },
}))

describe('useTasks', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('createTask', () => {
    it('should create task successfully', async () => {
      const mockTask: TaskResponse = {
        task_id: 'task-123',
        goal: 'Test task',
        status: 'planning',
        current_step: 0,
        state: {},
      }

      const createRequest: CreateTaskRequest = {
        goal: 'Test task',
      }

      vi.mocked(TasksService.createNewTaskTasksPost).mockResolvedValue(mockTask)

      const { useTasks } = await import('./useTasks')
      const { createTask } = useTasks()

      const result = await createTask(createRequest)

      expect(TasksService.createNewTaskTasksPost).toHaveBeenCalledWith(createRequest)
      expect(result).toEqual(mockTask)
    })
  })

  describe('listTasks', () => {
    it('should list tasks with status filter', async () => {
      const mockTasks: TaskResponse[] = [
        {
          task_id: 'task-1',
          goal: 'Task 1',
          status: 'executing',
          current_step: 2,
          state: {},
        },
        {
          task_id: 'task-2',
          goal: 'Task 2',
          status: 'executing',
          current_step: 1,
          state: {},
        },
      ]

      vi.mocked(TasksService.listTenantTasksTasksGet).mockResolvedValue(mockTasks)

      const { useTasks } = await import('./useTasks')
      const { listTasks } = useTasks()

      const result = await listTasks('executing', 50, 0)

      expect(TasksService.listTenantTasksTasksGet).toHaveBeenCalledWith('executing', 50, 0)
      expect(result).toEqual(mockTasks)
    })
  })

  describe('getTask', () => {
    it('should get task details successfully', async () => {
      const mockTask: TaskResponse = {
        task_id: 'task-123',
        goal: 'Test task',
        status: 'executing',
        current_step: 3,
        state: { step_results: [] },
      }

      vi.mocked(TasksService.getTaskStatusTasksTaskIdGet).mockResolvedValue(mockTask)

      const { useTasks } = await import('./useTasks')
      const { getTask } = useTasks()

      const result = await getTask('task-123')

      expect(TasksService.getTaskStatusTasksTaskIdGet).toHaveBeenCalledWith('task-123')
      expect(result).toEqual(mockTask)
    })
  })

  describe('resumeTask', () => {
    it('should resume task successfully', async () => {
      const mockTask: TaskResponse = {
        task_id: 'task-123',
        goal: 'Test task',
        status: 'executing',
        current_step: 3,
        state: {},
      }

      vi.mocked(TasksService.resumeInterruptedTaskTasksTaskIdResumePost).mockResolvedValue(
        mockTask
      )

      const { useTasks } = await import('./useTasks')
      const { resumeTask } = useTasks()

      const result = await resumeTask('task-123')

      expect(TasksService.resumeInterruptedTaskTasksTaskIdResumePost).toHaveBeenCalledWith(
        'task-123'
      )
      expect(result).toEqual(mockTask)
    })
  })

  describe('cancelTask', () => {
    it('should cancel task successfully', async () => {
      vi.mocked(TasksService.cancelRunningTaskTasksTaskIdCancelPost).mockResolvedValue(undefined)

      const { useTasks } = await import('./useTasks')
      const { cancelTask } = useTasks()

      await cancelTask('task-123')

      expect(TasksService.cancelRunningTaskTasksTaskIdCancelPost).toHaveBeenCalledWith('task-123')
    })
  })
})
