/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Response model for LLM trace.
 */
export type LLMTraceResponse = {
    id: string;
    tenant_id: string;
    conversation_id: (string | null);
    message_id: (string | null);
    provider: string;
    model: string;
    request_payload: Record<string, any>;
    response_payload: Record<string, any>;
    created_at: string;
};

