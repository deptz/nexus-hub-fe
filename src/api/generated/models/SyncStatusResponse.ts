/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Response model for sync status.
 */
export type SyncStatusResponse = {
    /**
     * Overall sync status
     */
    status: string;
    /**
     * Sync results per provider
     */
    results: Record<string, Record<string, any>>;
    /**
     * Total documents processed
     */
    total_documents: number;
    /**
     * Number of documents successfully synced
     */
    synced_documents: number;
    /**
     * Number of documents that failed to sync
     */
    failed_documents: number;
};

