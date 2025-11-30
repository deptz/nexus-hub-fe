import { describe, it, expect, beforeEach, vi } from 'vitest'
import { getApiErrorMessage } from './client'
import type { AxiosError } from 'axios'

describe('getApiErrorMessage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return user-friendly message for 400 error with external_id', () => {
    const error = {
      response: {
        status: 400,
        data: {
          detail: 'Message must include user external_id in from field',
        },
      },
    } as unknown as AxiosError

    const result = getApiErrorMessage(error)
    expect(result).toBe("Message must include user external_id in 'from' field")
  })

  it('should return user-friendly message for 403 error with tenant mismatch', () => {
    const error = {
      response: {
        status: 403,
        data: {
          detail: 'Tenant ID mismatch - potential spoofing attempt. Tenant ID must match API key.',
        },
      },
    } as unknown as AxiosError

    const result = getApiErrorMessage(error)
    expect(result).toBe('Tenant ID mismatch - Tenant ID must match your API key')
  })

  it('should return detail string for 403 error when detail does not include tenant mismatch', () => {
    const error = {
      response: {
        status: 403,
        data: {
          detail: 'Access forbidden',
        },
      },
    } as unknown as AxiosError

    const result = getApiErrorMessage(error)
    // Should return the detail string as-is when it doesn't include tenant mismatch
    expect(result).toBe('Access forbidden')
  })

  it('should return detail string for 400 error without external_id mention', () => {
    const error = {
      response: {
        status: 400,
        data: {
          detail: 'Invalid request format',
        },
      },
    } as unknown as AxiosError

    const result = getApiErrorMessage(error)
    expect(result).toBe('Invalid request format')
  })

  it('should handle validation error array', () => {
    const error = {
      response: {
        status: 422,
        data: {
          detail: [
            { loc: ['body', 'from', 'external_id'], msg: 'field required' },
            { loc: ['body', 'tenant_id'], msg: 'field required' },
          ],
        },
      },
    } as unknown as AxiosError

    const result = getApiErrorMessage(error)
    expect(result).toBe('body.from.external_id: field required, body.tenant_id: field required')
  })

  it('should return error message for Error instance', () => {
    const error = new Error('Network error')
    const result = getApiErrorMessage(error)
    expect(result).toBe('Network error')
  })

  it('should return default message for unknown error', () => {
    const error = {} as unknown
    const result = getApiErrorMessage(error)
    expect(result).toBe('An unexpected error occurred')
  })
})
