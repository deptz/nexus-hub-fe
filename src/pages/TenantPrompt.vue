<template>
  <ApiLayout>
    <div class="space-y-6">
      <div class="bg-white shadow rounded-lg p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-medium text-gray-900">Tenant System Prompt</h2>
          <div class="flex space-x-2">
            <button
              @click="handleViewPrompt"
              :disabled="loading"
              class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50"
            >
              View Current
            </button>
            <button
              @click="handleDeletePrompt"
              :disabled="loading"
              class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
            >
              Delete Prompt
            </button>
          </div>
        </div>

        <form @submit.prevent="handleUpdatePrompt" class="space-y-4">
          <div>
            <label for="custom-prompt" class="block text-sm font-medium text-gray-700 mb-1">
              Custom System Prompt *
            </label>
            <textarea
              id="custom-prompt"
              v-model="form.custom_system_prompt"
              rows="12"
              required
              class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm font-mono"
              placeholder="Enter your custom system prompt..."
            ></textarea>
          </div>

          <div>
            <label for="override-mode" class="block text-sm font-medium text-gray-700 mb-1">
              Override Mode
            </label>
            <select
              id="override-mode"
              v-model="form.override_mode"
              class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            >
              <option value="append">Append</option>
              <option value="replace_behavior">Replace Behavior</option>
            </select>
            <p class="mt-1 text-sm text-gray-500">
              <strong>Append:</strong> Adds to the default prompt. <strong>Replace Behavior:</strong> Replaces the default behavior prompt.
            </p>
          </div>

          <ErrorMessage v-if="error" :message="error" @dismiss="clearError" />

          <div class="flex justify-end space-x-3">
            <button
              type="button"
              @click="loadCurrentPrompt"
              :disabled="loading"
              class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50"
            >
              Reset
            </button>
            <button
              type="submit"
              :disabled="loading"
              class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
            >
              <span v-if="loading">Saving...</span>
              <span v-else>Save Prompt</span>
            </button>
          </div>
        </form>
      </div>

      <div v-if="currentPrompt" class="bg-white shadow rounded-lg p-6">
        <h2 class="text-lg font-medium text-gray-900 mb-4">Current Prompt</h2>
        <div class="bg-gray-50 p-4 rounded border">
          <pre class="text-sm whitespace-pre-wrap font-mono">{{ currentPrompt.custom_system_prompt || 'No prompt set' }}</pre>
          <div class="mt-2 text-sm text-gray-600">
            <div>Override Mode: <strong>{{ currentPrompt.override_mode || 'N/A' }}</strong></div>
            <div v-if="currentPrompt.created_at">Created: {{ new Date(currentPrompt.created_at).toLocaleString() }}</div>
            <div v-if="currentPrompt.updated_at">Updated: {{ new Date(currentPrompt.updated_at).toLocaleString() }}</div>
          </div>
        </div>
      </div>

      <div v-if="effectivePrompt" class="bg-white shadow rounded-lg p-6">
        <h2 class="text-lg font-medium text-gray-900 mb-4">Effective Prompt Preview</h2>
        <div class="bg-gray-50 p-4 rounded border">
          <pre class="text-sm whitespace-pre-wrap font-mono">{{ effectivePrompt }}</pre>
        </div>
      </div>
    </div>
  </ApiLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ApiLayout from '@/components/layout/ApiLayout.vue'
import ErrorMessage from '@/components/common/ErrorMessage.vue'
import { useTenant } from '@/composables/useTenant'
import { useAuth } from '@/composables/useAuth'
import type { UpdatePromptRequest } from '@/api/generated/models/UpdatePromptRequest'
import type { GetPromptResponse } from '@/api/generated/models/GetPromptResponse'

const { tenantId } = useAuth()
const { loading, error, updatePrompt, getPrompt, deletePrompt, clearError } = useTenant(tenantId.value || '')

const effectivePrompt = ref<string | null>(null)
const currentPrompt = ref<GetPromptResponse | null>(null)

const form = ref<UpdatePromptRequest>({
  custom_system_prompt: '',
  override_mode: 'append',
})

async function handleUpdatePrompt() {
  try {
    const result = await updatePrompt(form.value)
    if (result && typeof result === 'object' && 'effective_prompt' in result) {
      effectivePrompt.value = (result as any).effective_prompt
    }
    // Refresh current prompt after update
    await handleViewPrompt()
  } catch (err) {
    // Error handled by composable
  }
}

async function handleViewPrompt() {
  try {
    const prompt = await getPrompt()
    currentPrompt.value = prompt
    if (prompt) {
      form.value = {
        custom_system_prompt: prompt.custom_system_prompt || '',
        override_mode: prompt.override_mode || 'append',
      }
    }
  } catch (err) {
    // Error handled by composable
  }
}

async function handleDeletePrompt() {
  if (!confirm('Are you sure you want to delete the current prompt? This action cannot be undone.')) {
    return
  }
  try {
    await deletePrompt()
    currentPrompt.value = null
    form.value = {
      custom_system_prompt: '',
      override_mode: 'append',
    }
    effectivePrompt.value = null
  } catch (err) {
    // Error handled by composable
  }
}

function loadCurrentPrompt() {
  form.value = {
    custom_system_prompt: '',
    override_mode: 'append',
  }
  effectivePrompt.value = null
}
</script>

