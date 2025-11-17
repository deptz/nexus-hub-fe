/**
 * Type-safe environment variable access
 */
export const env = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  APP_TITLE: import.meta.env.VITE_APP_TITLE || 'Nexus Hub Admin',
} as const

