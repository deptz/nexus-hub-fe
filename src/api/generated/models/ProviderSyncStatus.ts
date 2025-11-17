/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Response model for provider sync status.
 */
export type ProviderSyncStatus = {
    /**
     * Provider name
     */
    provider: string;
    /**
     * Whether provider is active
     */
    is_active: boolean;
    /**
     * Sync status: 'enabled', 'disabled', 'syncing', 'error'
     */
    sync_status: string;
    /**
     * Store ID (vector_store_id or file_search_store_name)
     */
    store_id?: (string | null);
    /**
     * Last sync timestamp
     */
    last_sync_at?: (string | null);
    /**
     * Error message if sync failed
     */
    error_message?: (string | null);
};

