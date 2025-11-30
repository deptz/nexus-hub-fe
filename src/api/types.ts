/**
 * Custom API types and interfaces
 */

import type { InboundMessageResponse } from './generated/models/InboundMessageResponse'

export interface ApiResponse<T = any> {
  data: T
  status: number
  statusText: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}

export interface JobStatus {
  status: 'queued' | 'processing' | 'completed' | 'failed'
  job_id: string
  result?: any
  error?: string
}

export interface ApiKeyInfo {
  id: string
  name?: string
  description?: string
  created_at: string
  expires_at?: string
  is_active: boolean
  rate_limit_per_minute: number
}

export interface CreateApiKeyResponse {
  id: string
  key: string
  name?: string
  description?: string
  created_at: string
  expires_at?: string
  rate_limit_per_minute: number
}

/**
 * Extended InboundMessageResponse with metadata field
 * (metadata is returned by backend but not in OpenAPI spec yet)
 */
export interface ExtendedInboundMessageResponse extends InboundMessageResponse {
  metadata?: {
    plan_id?: string
    task_id?: string
  }
}
