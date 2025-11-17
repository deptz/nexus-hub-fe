import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/pages/Login.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/',
      redirect: '/dashboard',
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('@/pages/Dashboard.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/messages',
      name: 'Messages',
      component: () => import('@/pages/Messages.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/messages/:jobId',
      name: 'MessageStatus',
      component: () => import('@/pages/MessageStatus.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/api-keys',
      name: 'ApiKeys',
      component: () => import('@/pages/ApiKeys.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/tenant/prompt',
      name: 'TenantPrompt',
      component: () => import('@/pages/TenantPrompt.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/knowledge-bases',
      name: 'KnowledgeBases',
      component: () => import('@/pages/KnowledgeBases.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/conversations',
      name: 'Conversations',
      component: () => import('@/pages/Conversations.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/conversations/:id',
      name: 'ConversationDetail',
      component: () => import('@/pages/ConversationDetail.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/rag/documents',
      name: 'RagDocuments',
      component: () => import('@/pages/RagDocuments.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/rag/documents/:id',
      name: 'RagDocumentDetail',
      component: () => import('@/pages/RagDocumentDetail.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/tenant/tools',
      name: 'TenantTools',
      component: () => import('@/pages/TenantTools.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/mcp-servers',
      name: 'McpServers',
      component: () => import('@/pages/McpServers.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/mcp-servers/:id',
      name: 'McpServerDetail',
      component: () => import('@/pages/McpServerDetail.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/logs',
      name: 'Logs',
      component: () => import('@/pages/Logs.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/traces',
      name: 'Traces',
      component: () => import('@/pages/Traces.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/traces/:id',
      name: 'TraceDetail',
      component: () => import('@/pages/TraceDetail.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/channels',
      name: 'Channels',
      component: () => import('@/pages/Channels.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/channels/:id',
      name: 'ChannelDetail',
      component: () => import('@/pages/ChannelDetail.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/costs',
      name: 'Costs',
      component: () => import('@/pages/Costs.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/analytics',
      name: 'Analytics',
      component: () => import('@/pages/Analytics.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/health',
      name: 'Health',
      component: () => import('@/pages/Health.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/pages/NotFound.vue'),
    },
  ],
})

// Navigation guard
router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
  } else if (to.name === 'Login' && authStore.isAuthenticated) {
    next({ name: 'Dashboard' })
  } else {
    next()
  }
})

export default router

