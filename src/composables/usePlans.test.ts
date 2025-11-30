import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { PlansService } from '@/api/generated/services/PlansService'
import type { PlanResponse } from '@/api/generated/models/PlanResponse'
import type { RefinePlanRequest } from '@/api/generated/models/RefinePlanRequest'

// Mock the PlansService
vi.mock('@/api/generated/services/PlansService', () => ({
  PlansService: {
    getPlanDetailsPlansPlanIdGet: vi.fn(),
    refinePlanEndpointPlansPlanIdRefinePost: vi.fn(),
  },
}))

// Mock getApiErrorMessage
vi.mock('@/api/client', () => ({
  getApiErrorMessage: (error: unknown) => {
    if (error instanceof Error) return error.message
    return 'An unexpected error occurred'
  },
}))

describe('usePlans', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('getPlan', () => {
    it('should fetch plan details successfully', async () => {
      const mockPlan: PlanResponse = {
        plan_id: 'plan-123',
        goal: 'Test goal',
        steps: [],
        estimated_steps: 5,
        complexity: 'moderate',
        status: 'executing',
      }

      vi.mocked(PlansService.getPlanDetailsPlansPlanIdGet).mockResolvedValue(mockPlan)

      const { usePlans } = await import('./usePlans')
      const { getPlan } = usePlans()

      const result = await getPlan('plan-123')

      expect(PlansService.getPlanDetailsPlansPlanIdGet).toHaveBeenCalledWith('plan-123')
      expect(result).toEqual(mockPlan)
    })

    it('should handle error when fetching plan', async () => {
      const mockError = new Error('Plan not found')
      vi.mocked(PlansService.getPlanDetailsPlansPlanIdGet).mockRejectedValue(mockError)

      const { usePlans } = await import('./usePlans')
      const { getPlan } = usePlans()

      await expect(getPlan('plan-123')).rejects.toThrow('Plan not found')
    })
  })

  describe('refinePlan', () => {
    it('should refine plan successfully', async () => {
      const mockRefinedPlan: PlanResponse = {
        plan_id: 'plan-123',
        goal: 'Updated goal',
        steps: [],
        estimated_steps: 6,
        complexity: 'complex',
        status: 'executing',
      }

      const refineRequest: RefinePlanRequest = {
        intermediate_results: {},
      }

      vi.mocked(PlansService.refinePlanEndpointPlansPlanIdRefinePost).mockResolvedValue(
        mockRefinedPlan
      )

      const { usePlans } = await import('./usePlans')
      const { refinePlan } = usePlans()

      const result = await refinePlan('plan-123', refineRequest)

      expect(PlansService.refinePlanEndpointPlansPlanIdRefinePost).toHaveBeenCalledWith(
        'plan-123',
        refineRequest
      )
      expect(result).toEqual(mockRefinedPlan)
    })
  })
})
