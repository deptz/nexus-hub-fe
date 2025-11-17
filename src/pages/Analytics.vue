<template>
  <ApiLayout>
    <div class="space-y-6">
      <!-- Date Range Filter -->
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-lg font-medium text-gray-900 mb-4">Analytics Dashboard</h2>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <FormInput
            id="analytics-start-date"
            v-model="filters.start_date"
            label="Start Date"
            type="datetime-local"
          />
          <FormInput
            id="analytics-end-date"
            v-model="filters.end_date"
            label="End Date"
            type="datetime-local"
          />
          <div class="flex items-end">
            <button
              @click="loadAnalyticsData"
              :disabled="analyticsStore.loading"
              class="w-full px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
            >
              Load Data
            </button>
          </div>
        </div>
      </div>

      <!-- Conversation Analytics -->
      <div class="bg-white shadow rounded-lg p-6" v-if="conversationAnalytics">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Conversation Analytics</h3>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="p-4 bg-gray-50 rounded-lg">
            <div class="text-sm text-gray-600">Total Conversations</div>
            <div class="text-2xl font-bold text-gray-900">
              {{ conversationAnalytics.total_conversations }}
            </div>
          </div>
          <div class="p-4 bg-blue-50 rounded-lg">
            <div class="text-sm text-gray-600">Open</div>
            <div class="text-2xl font-bold text-blue-900">
              {{ conversationAnalytics.open_conversations }}
            </div>
          </div>
          <div class="p-4 bg-green-50 rounded-lg">
            <div class="text-sm text-gray-600">Closed</div>
            <div class="text-2xl font-bold text-green-900">
              {{ conversationAnalytics.closed_conversations }}
            </div>
          </div>
          <div class="p-4 bg-purple-50 rounded-lg">
            <div class="text-sm text-gray-600">Resolution Rate</div>
            <div class="text-2xl font-bold text-purple-900">
              {{ (conversationAnalytics.resolution_rate * 100).toFixed(1) }}%
            </div>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div class="p-4 bg-gray-50 rounded-lg">
            <div class="text-sm text-gray-600">Avg Messages/Conversation</div>
            <div class="text-xl font-bold text-gray-900">
              {{ conversationAnalytics.avg_messages_per_conversation.toFixed(2) }}
            </div>
          </div>
          <div class="p-4 bg-gray-50 rounded-lg">
            <div class="text-sm text-gray-600">Avg Tool Calls/Conversation</div>
            <div class="text-xl font-bold text-gray-900">
              {{ conversationAnalytics.avg_tool_calls_per_conversation.toFixed(2) }}
            </div>
          </div>
          <div class="p-4 bg-gray-50 rounded-lg">
            <div class="text-sm text-gray-600">Resolved</div>
            <div class="text-xl font-bold text-gray-900">
              {{ conversationAnalytics.resolved_conversations }}
            </div>
          </div>
        </div>
      </div>

      <!-- Cost Analytics -->
      <div class="bg-white shadow rounded-lg p-6" v-if="costAnalytics">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Cost Analytics</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="p-4 bg-gray-50 rounded-lg">
            <div class="text-sm text-gray-600">Total Cost</div>
            <div class="text-2xl font-bold text-gray-900">
              {{ formatCurrency(costAnalytics.total_cost) }}
            </div>
          </div>
          <div class="p-4 bg-blue-50 rounded-lg">
            <div class="text-sm text-gray-600">LLM Cost</div>
            <div class="text-2xl font-bold text-blue-900">
              {{ formatCurrency(costAnalytics.llm_cost) }}
            </div>
          </div>
          <div class="p-4 bg-green-50 rounded-lg">
            <div class="text-sm text-gray-600">Tool Cost</div>
            <div class="text-2xl font-bold text-green-900">
              {{ formatCurrency(costAnalytics.tool_cost) }}
            </div>
          </div>
        </div>
      </div>

      <!-- Usage Statistics -->
      <div class="bg-white shadow rounded-lg p-6" v-if="usageStatistics">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Usage Statistics</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="p-4 bg-gray-50 rounded-lg">
            <div class="text-sm text-gray-600">Total Messages</div>
            <div class="text-2xl font-bold text-gray-900">
              {{ usageStatistics.total_messages }}
            </div>
          </div>
          <div class="p-4 bg-blue-50 rounded-lg">
            <div class="text-sm text-gray-600">Total Conversations</div>
            <div class="text-2xl font-bold text-blue-900">
              {{ usageStatistics.total_conversations }}
            </div>
          </div>
          <div class="p-4 bg-green-50 rounded-lg">
            <div class="text-sm text-gray-600">Total Tool Calls</div>
            <div class="text-2xl font-bold text-green-900">
              {{ usageStatistics.total_tool_calls }}
            </div>
          </div>
          <div class="p-4 bg-purple-50 rounded-lg">
            <div class="text-sm text-gray-600">Total LLM Calls</div>
            <div class="text-2xl font-bold text-purple-900">
              {{ usageStatistics.total_llm_calls }}
            </div>
          </div>
          <div class="p-4 bg-yellow-50 rounded-lg">
            <div class="text-sm text-gray-600">Active Conversations</div>
            <div class="text-2xl font-bold text-yellow-900">
              {{ usageStatistics.active_conversations }}
            </div>
          </div>
        </div>
      </div>

      <!-- KPIs -->
      <div class="bg-white shadow rounded-lg p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900">KPI Snapshots</h3>
          <div class="flex items-center space-x-4">
            <select
              v-model="kpiPeriodType"
              @change="loadKpis"
              class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">All Periods</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
            <button
              @click="handleComputeKpis"
              :disabled="analyticsStore.loading"
              class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
            >
              Compute KPIs
            </button>
          </div>
        </div>
        <div v-if="kpiSnapshots && kpiSnapshots.items" class="space-y-2">
          <div
            v-for="(snapshot, index) in kpiSnapshots.items"
            :key="index"
            class="border border-gray-200 rounded-lg p-4"
          >
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <div class="text-sm text-gray-600">Period Type</div>
                <div class="font-medium text-gray-900">{{ snapshot.period_type }}</div>
              </div>
              <div>
                <div class="text-sm text-gray-600">Period Start</div>
                <div class="font-medium text-gray-900">
                  {{ snapshot.period_start ? new Date(snapshot.period_start).toLocaleDateString() : 'N/A' }}
                </div>
              </div>
              <div>
                <div class="text-sm text-gray-600">Created At</div>
                <div class="font-medium text-gray-900">
                  {{ snapshot.created_at ? new Date(snapshot.created_at).toLocaleString() : 'N/A' }}
                </div>
              </div>
            </div>
            <div class="mt-4 bg-gray-50 rounded-md p-4">
              <pre class="text-xs overflow-auto">{{ JSON.stringify(snapshot, null, 2) }}</pre>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-8 text-gray-500">No KPI snapshots found</div>
      </div>

      <ErrorMessage v-if="analyticsStore.error" :message="analyticsStore.error" @dismiss="clearError" />
    </div>
  </ApiLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import ApiLayout from '@/components/layout/ApiLayout.vue'
import FormInput from '@/components/common/FormInput.vue'
import ErrorMessage from '@/components/common/ErrorMessage.vue'
import { useAnalytics } from '@/composables/useAnalytics'
import { useAnalyticsStore } from '@/stores/analytics'
import { useAuth } from '@/composables/useAuth'

const { tenantId } = useAuth()
const analyticsStore = useAnalyticsStore()
const {
  getConversationAnalytics,
  getCostAnalytics,
  getUsageStatistics,
  listKpiSnapshots,
  computeKpis,
  clearError,
} = useAnalytics(tenantId.value || '')

const filters = ref({
  start_date: '',
  end_date: '',
})

const kpiPeriodType = ref('')

const conversationAnalytics = computed(() => analyticsStore.conversationAnalytics)
const costAnalytics = computed(() => analyticsStore.costAnalytics)
const usageStatistics = computed(() => analyticsStore.usageStatistics)
const kpiSnapshots = computed(() => analyticsStore.kpiSnapshots)

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

async function loadAnalyticsData() {
  try {
    await Promise.all([
      getConversationAnalytics(filters.value.start_date || null, filters.value.end_date || null),
      getCostAnalytics(filters.value.start_date || null, filters.value.end_date || null),
      getUsageStatistics(filters.value.start_date || null, filters.value.end_date || null),
      loadKpis(),
    ])
  } catch (err) {
    // Error handled by composable
  }
}

async function loadKpis() {
  try {
    await listKpiSnapshots(
      kpiPeriodType.value || null,
      filters.value.start_date || null,
      filters.value.end_date || null
    )
  } catch (err) {
    // Error handled by composable
  }
}

async function handleComputeKpis() {
  try {
    await computeKpis(kpiPeriodType.value || 'daily')
  } catch (err) {
    // Error handled by composable
  }
}

onMounted(() => {
  loadAnalyticsData()
})
</script>

