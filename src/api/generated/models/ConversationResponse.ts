/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Response model for conversation.
 */
export type ConversationResponse = {
    id: string;
    tenant_id: string;
    channel_id: (string | null);
    external_thread_id: (string | null);
    subject: (string | null);
    status: string;
    created_at: string;
    updated_at: string;
};

