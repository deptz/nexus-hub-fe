/**
 * Form validation utilities
 */

export interface ValidationRule {
  validator: (value: any) => boolean
  message: string
}

export function required(value: any): boolean {
  if (typeof value === 'string') {
    return value.trim().length > 0
  }
  return value !== null && value !== undefined
}

export function minLength(length: number) {
  return (value: string): boolean => {
    return value.length >= length
  }
}

export function maxLength(length: number) {
  return (value: string): boolean => {
    return value.length <= length
  }
}

export function email(value: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(value)
}

export function uuid(value: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  return uuidRegex.test(value)
}

export function validate(
  value: any,
  rules: Array<ValidationRule | ((value: any) => boolean | string)>
): string | null {
  for (const rule of rules) {
    if (typeof rule === 'function') {
      const result = rule(value)
      if (result === false) {
        return 'Validation failed'
      }
      if (typeof result === 'string') {
        return result
      }
    } else {
      if (!rule.validator(value)) {
        return rule.message
      }
    }
  }
  return null
}

export function validateForm(
  form: Record<string, any>,
  rules: Record<string, Array<ValidationRule | ((value: any) => boolean | string)>>
): Record<string, string> {
  const errors: Record<string, string> = {}
  for (const [field, fieldRules] of Object.entries(rules)) {
    const error = validate(form[field], fieldRules)
    if (error) {
      errors[field] = error
    }
  }
  return errors
}

