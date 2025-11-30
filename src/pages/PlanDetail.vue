<template>
  <ApiLayout>
    <div class="space-y-6">
      <div v-if="plan" class="bg-white shadow rounded-lg p-6">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h2 class="text-lg font-medium text-gray-900">Plan Details</h2>
            <p class="text-sm text-gray-500 mt-1">ID: {{ plan.plan_id }}</p>
          </div>
          <router-link
            to="/tasks"
            class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Back to Tasks
          </router-link>
        </div>

        <div class="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label class="text-sm font-medium text-gray-700">Goal</label>
            <p class="mt-1 text-sm text-gray-900">{{ plan.goal }}</p>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-700">Status</label>
            <p class="mt-1">
              <span
                class="px-2 py-1 text-xs font-semibold rounded-full"
                :class="{
                  'bg-green-100 text-green-800': plan.status === 'completed',
                  'bg-blue-100 text-blue-800': plan.status === 'executing',
                  'bg-yellow-100 text-yellow-800': plan.status === 'draft',
                  'bg-red-100 text-red-800': plan.status === 'failed',
                }"
              >
                {{ plan.status }}
              </span>
            </p>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-700">Complexity</label>
            <p class="mt-1">
              <span
                class="px-2 py-1 text-xs font-semibold rounded-full"
                :class="{
                  'bg-green-100 text-green-800': plan.complexity === 'simple',
                  'bg-yellow-100 text-yellow-800': plan.complexity === 'moderate',
                  'bg-red-100 text-red-800': plan.complexity === 'complex',
                }"
              >
                {{ plan.complexity }}
              </span>
            </p>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-700">Estimated Steps</label>
            <p class="mt-1 text-sm text-gray-900">{{ plan.estimated_steps }}</p>
          </div>
        </div>

        <div class="mt-6 border-t pt-4">
          <h3 class="text-sm font-medium text-gray-900 mb-4">Plan Steps</h3>
          <div v-if="plan.steps && plan.steps.length > 0" class="space-y-3">
            <div
              v-for="(step, index) in plan.steps"
              :key="index"
              class="border border-gray-200 rounded-lg p-4"
            >
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-2">
                    <span class="px-2 py-1 text-xs font-semibold bg-gray-100 text-gray-800 rounded">
                      Step {{ (step as any).step_number || index + 1 }}
                    </span>
                    <span v-if="(step as any).tool_name" class="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                      {{ (step as any).tool_name }}
                    </span>
                  </div>
                  <p class="text-sm text-gray-900">{{ (step as any).description || step }}</p>
                  <div v-if="(step as any).dependencies && (step as any).dependencies.length > 0" class="mt-2">
                    <p class="text-xs text-gray-600">
                      Dependencies: {{ (step as any).dependencies.join(', ') }}
                    </p>
                  </div>
                  <div v-if="(step as any).success_criteria" class="mt-2">
                    <p class="text-xs text-gray-600">
                      <strong>Success Criteria:</strong> {{ (step as any).success_criteria }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-8 text-gray-500">
            No steps defined
          </div>
        </div>
      </div>

      <ErrorMessage v-if="error" :message="error" @dismiss="clearError" />
      <LoadingSpinner v-if="loading" />
    </div>
  </ApiLayout>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import ApiLayout from '@/components/layout/ApiLayout.vue'
import ErrorMessage from '@/components/common/ErrorMessage.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import { usePlans } from '@/composables/usePlans'
import { usePlansStore } from '@/stores/plans'

const route = useRoute()
const planId = computed(() => route.params.id as string)

const plansStore = usePlansStore()
const { loading, error, getPlan, clearError } = usePlans()

const plan = computed(() => plansStore.currentPlan)

async function loadPlan() {
  try {
    await getPlan(planId.value)
  } catch (err) {
    // Error handled by composable
  }
}

onMounted(() => {
  loadPlan()
})
</script>
