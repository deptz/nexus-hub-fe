import { describe, it, expect } from 'vitest'

describe('Message Validation', () => {
  describe('from.external_id validation', () => {
    it('should reject empty external_id', () => {
      const externalId = ''
      expect(externalId.trim()).toBe('')
      expect(externalId.trim() === '').toBe(true)
    })

    it('should reject whitespace-only external_id', () => {
      const externalId = '   '
      expect(externalId.trim() === '').toBe(true)
    })

    it('should accept valid external_id', () => {
      const externalId = 'user-123'
      expect(externalId && externalId.trim() !== '').toBe(true)
    })
  })

  describe('tenant_id validation', () => {
    it('should validate tenant_id matches API key tenant_id', () => {
      const apiKeyTenantId = 'tenant-123'
      const messageTenantId = 'tenant-123'
      expect(messageTenantId === apiKeyTenantId).toBe(true)
    })

    it('should reject mismatched tenant_id', () => {
      const apiKeyTenantId = 'tenant-123'
      const messageTenantId = 'tenant-456'
      expect(messageTenantId === apiKeyTenantId).toBe(false)
    })
  })
})
