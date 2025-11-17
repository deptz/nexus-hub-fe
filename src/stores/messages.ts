import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { JobStatus } from '@/api/types'
import type { MessageResponse } from '@/api/generated/models/MessageResponse'

export const useMessagesStore = defineStore('messages', () => {
  const jobStatuses = ref<Map<string, JobStatus>>(new Map())
  const messages = ref<MessageResponse[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  function setJobStatus(jobId: string, status: JobStatus) {
    jobStatuses.value.set(jobId, status)
  }

  function getJobStatus(jobId: string): JobStatus | undefined {
    return jobStatuses.value.get(jobId)
  }

  function setMessages(msgs: MessageResponse[]) {
    messages.value = msgs
  }

  function clearError() {
    error.value = null
  }

  function setError(err: string) {
    error.value = err
  }

  return {
    jobStatuses,
    messages,
    loading,
    error,
    setJobStatus,
    getJobStatus,
    setMessages,
    clearError,
    setError,
  }
})

