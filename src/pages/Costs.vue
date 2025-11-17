<template>
  <ApiLayout>
    <div class="space-y-6">
      <!-- Date Range Filter -->
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-lg font-medium text-gray-900 mb-4">Cost Dashboard</h2>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <FormInput
            id="cost-start-date"
            v-model="filters.start_date"
            label="Start Date"
            type="datetime-local"
          />
          <FormInput
            id="cost-end-date"
            v-model="filters.end_date"
            label="End Date"
            type="datetime-local"
          />
          <div class="flex items-end">
            <button
              @click="loadCostData"
              :disabled="costsStore.loading"
              class="w-full px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
            >
              Load Data
            </button>
          </div>
        </div>
      </div>

      <!-- Cost Summary -->
      <div class="bg-white shadow rounded-lg p-6" v-if="costSummary">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Cost Summary</h3>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="p-4 bg-gray-50 rounded-lg">
            <div class="text-sm text-gray-600">Total Cost</div>
            <div class="text-2xl font-bold text-gray-900">
              {{ formatCurrency(costSummary.total_cost) }}
            </div>
          </div>
          <div class="p-4 bg-blue-50 rounded-lg">
            <div class="text-sm text-gray-600">LLM Cost</div>
            <div class="text-2xl font-bold text-blue-900">
              {{ formatCurrency(costSummary.llm_cost) }}
            </div>
          </div>
          <div class="p-4 bg-green-50 rounded-lg">
            <div class="text-sm text-gray-600">Tool Cost</div>
            <div class="text-2xl font-bold text-green-900">
              {{ formatCurrency(costSummary.tool_cost) }}
            </div>
          </div>
          <div class="p-4 bg-gray-50 rounded-lg">
            <div class="text-sm text-gray-600">Currency</div>
            <div class="text-2xl font-bold text-gray-900">
              {{ costSummary.currency || 'USD' }}
            </div>
          </div>
        </div>
        <div v-if="costSummary.period_start || costSummary.period_end" class="mt-4 text-sm text-gray-500">
          Period: {{ costSummary.period_start ? new Date(costSummary.period_start).toLocaleString() : 'N/A' }} - 
          {{ costSummary.period_end ? new Date(costSummary.period_end).toLocaleString() : 'N/A' }}
        </div>
      </div>

      <!-- Cost Breakdown -->
      <div class="bg-white shadow rounded-lg p-6" v-if="costBreakdown">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Cost Breakdown</h3>
        <div class="bg-gray-50 rounded-md p-4 overflow-auto">
          <pre class="text-xs">{{ JSON.stringify(costBreakdown, null, 2) }}</pre>
        </div>
      </div>

      <!-- Cost by Period -->
      <div class="bg-white shadow rounded-lg p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900">Cost by Period</h3>
          <select
            v-model="periodType"
            @change="loadCostsByPeriod"
            class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
        <div v-if="costByPeriod" class="bg-gray-50 rounded-md p-4 overflow-auto">
          <pre class="text-xs">{{ JSON.stringify(costByPeriod, null, 2) }}</pre>
        </div>
      </div>

      <!-- Cost by Conversation -->
      <div class="bg-white shadow rounded-lg p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Cost by Conversation</h3>
        <div v-if="costByConversation && costByConversation.items" class="space-y-2">
          <div
            v-for="item in costByConversation.items"
            :key="item.conversation_id || 'unknown'"
            class="border border-gray-200 rounded-lg p-4"
          >
            <div class="flex items-center justify-between">
              <div>
                <div class="font-medium text-gray-900">
                  Conversation: {{ item.conversation_id || 'N/A' }}
                </div>
                <div class="text-sm text-gray-600 mt-1">
                  Total Cost: {{ formatCurrency(item.total_cost || 0) }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-8 text-gray-500">No cost data by conversation</div>
      </div>

      <!-- Cost Estimate -->
      <div class="bg-white shadow rounded-lg p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Estimate Cost</h3>
        <form @submit.prevent="handleEstimateCost" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              id="estimate-provider"
              v-model="estimateForm.provider"
              label="Provider"
              placeholder="openai or gemini"
              required
            />
            <FormInput
              id="estimate-model"
              v-model="estimateForm.model"
              label="Model"
              placeholder="gpt-4"
              required
            />
            <FormInput
              id="estimate-prompt-tokens"
              v-model.number="estimateForm.estimated_prompt_tokens"
              label="Estimated Prompt Tokens"
              type="number"
            />
            <FormInput
              id="estimate-completion-tokens"
              v-model.number="estimateForm.estimated_completion_tokens"
              label="Estimated Completion Tokens"
              type="number"
            />
            <FormInput
              id="estimate-total-tokens"
              v-model.number="estimateForm.estimated_total_tokens"
              label="Estimated Total Tokens"
              type="number"
            />
          </div>
          <div class="flex justify-end">
            <button
              type="submit"
              :disabled="costsStore.loading"
              class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
            >
              Estimate
            </button>
          </div>
        </form>
        <div v-if="costEstimate" class="mt-4 p-4 bg-green-50 rounded-lg">
          <div class="text-sm font-medium text-green-900">Estimated Cost</div>
          <div class="text-2xl font-bold text-green-900 mt-2">
            {{ formatCurrency(costEstimate.estimated_cost || 0) }}
          </div>
          <div v-if="costEstimate.currency" class="text-sm text-green-700 mt-1">
            Currency: {{ costEstimate.currency }}
          </div>
        </div>
      </div>

      <ErrorMessage v-if="costsStore.error" :message="costsStore.error" @dismiss="clearError" />
    </div>
  </ApiLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import ApiLayout from '@/components/layout/ApiLayout.vue'
import FormInput from '@/components/common/FormInput.vue'
import ErrorMessage from '@/components/common/ErrorMessage.vue'
import { useCosts } from '@/composables/useCosts'
import { useCostsStore } from '@/stores/costs'
import { useAuth } from '@/composables/useAuth'
import type { CostEstimateRequest } from '@/api/generated/models/CostEstimateRequest'

const { tenantId } = useAuth()
const costsStore = useCostsStore()
const { getCostSummary, getCostBreakdown, getCostsByPeriod, getCostsByConversation, estimateCost, clearError } = useCosts(tenantId.value || '')

const filters = ref({
  start_date: '',
  end_date: '',
})

const periodType = ref('daily')

const estimateForm = ref<CostEstimateRequest>({
  provider: '',
  model: '',
  estimated_prompt_tokens: null,
  estimated_completion_tokens: null,
  estimated_total_tokens: null,
})

const costSummary = computed(() => costsStore.costSummary)
const costBreakdown = computed(() => costsStore.costBreakdown)
const costByPeriod = computed(() => costsStore.costByPeriod)
const costByConversation = computed(() => costsStore.costByConversation)
const costEstimate = computed(() => costsStore.costEstimate)

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: costSummary.value?.currency || 'USD',
  }).format(amount)
}

async function loadCostData() {
  try {
    await Promise.all([
      getCostSummary(filters.value.start_date || null, filters.value.end_date || null),
      getCostBreakdown(filters.value.start_date || null, filters.value.end_date || null),
      getCostsByPeriod(periodType.value, filters.value.start_date || null, filters.value.end_date || null),
      getCostsByConversation(filters.value.start_date || null, filters.value.end_date || null),
    ])
  } catch (err) {
    // Error handled by composable
  }
}

async function loadCostsByPeriod() {
  try {
    await getCostsByPeriod(periodType.value, filters.value.start_date || null, filters.value.end_date || null)
  } catch (err) {
    // Error handled by composable
  }
}

async function handleEstimateCost() {
  try {
    await estimateCost(estimateForm.value)
  } catch (err) {
    // Error handled by composable
  }
}

onMounted(() => {
  loadCostData()
})
</script>

