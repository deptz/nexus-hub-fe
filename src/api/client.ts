import axios, { type AxiosInstance, type AxiosError } from 'axios'
import { OpenAPI } from './generated/core/OpenAPI'
import type { ApiRequestOptions } from './generated/core/ApiRequestOptions'
import { env } from '@/utils/env'

// Configure OpenAPI base URL
OpenAPI.BASE = env.API_BASE_URL

// Configure OpenAPI to use API key from localStorage via HEADERS resolver
OpenAPI.HEADERS = async (_options: ApiRequestOptions) => {
  const apiKey = localStorage.getItem('api_key')
  const headers: Record<string, string> = {}
  if (apiKey) {
    headers['X-API-Key'] = apiKey
  }
  return headers
}

// Create axios instance for the generated client (used for direct axios calls if needed)
export const apiClient: AxiosInstance = axios.create({
  baseURL: env.API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add API key (for direct axios usage)
apiClient.interceptors.request.use(
  (config) => {
    const apiKey = localStorage.getItem('api_key')
    if (apiKey) {
      config.headers['X-API-Key'] = apiKey
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle 401 Unauthorized - redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem('api_key')
      localStorage.removeItem('tenant_id')
      window.location.href = '/login'
    }
    // Handle 403 Forbidden - tenant mismatch
    if (error.response?.status === 403) {
      const detail = (error.response?.data as any)?.detail
      if (detail && typeof detail === 'string' && detail.includes('Tenant ID mismatch')) {
        // Error message will be handled by getApiErrorMessage
      }
    }
    return Promise.reject(error)
  }
)

// Export configured OpenAPI for use in generated services
export { OpenAPI }

// Helper to extract error message from API errors
export function getApiErrorMessage(error: unknown): string {
  // Check for Axios errors with response
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as AxiosError<{ detail?: string | Array<{ msg: string; loc: string[] }> }>
    const status = axiosError.response?.status
    const detail = axiosError.response?.data?.detail

    // Handle specific error cases
    if (status === 400) {
      if (typeof detail === 'string' && detail.includes('external_id')) {
        return "Message must include user external_id in 'from' field"
      }
      if (typeof detail === 'string') {
        return detail
      }
    }

    if (status === 403) {
      if (typeof detail === 'string' && detail.includes('Tenant ID mismatch')) {
        return 'Tenant ID mismatch - Tenant ID must match your API key'
      }
      if (typeof detail === 'string') {
        return detail
      }
      return 'Access forbidden - Tenant ID must match your API key'
    }

    if (detail) {
      if (typeof detail === 'string') {
        return detail
      }
      if (Array.isArray(detail)) {
        return detail.map((d) => `${d.loc.join('.')}: ${d.msg}`).join(', ')
      }
    }
  }

  if (error instanceof Error) {
    // Check if it's an ApiError from the generated client
    if ('body' in error && typeof error.body === 'object' && error.body !== null) {
      const apiError = error.body as { detail?: string | Array<{ msg: string; loc: string[] }> }
      if (apiError.detail) {
        if (typeof apiError.detail === 'string') {
          return apiError.detail
        }
        if (Array.isArray(apiError.detail)) {
          return apiError.detail.map((d) => `${d.loc.join('.')}: ${d.msg}`).join(', ')
        }
      }
    }
    return error.message
  }
  return 'An unexpected error occurred'
}

