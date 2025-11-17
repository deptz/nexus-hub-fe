/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ProviderSyncStatus } from './ProviderSyncStatus';

/**
 * Response model for knowledge base.
 */
export type KnowledgeBaseResponse = {
    id: string;
    tenant_id: string;
    name: string;
    description: (string | null);
    provider: string;
    provider_config: Record<string, any>;
    is_active: boolean;
    /**
     * Sync status per provider
     */
    provider_sync_status?: (Array<ProviderSyncStatus> | null);
    created_at: string;
    updated_at: string;
};

