/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Response model for conversation statistics.
 */
export type ConversationStatsResponse = {
    conversation_id: string;
    tenant_id: string;
    resolved: boolean;
    resolution_time_ms: (number | null);
    total_messages: number;
    tool_calls: number;
    risk_flags: number;
    last_event_at: (string | null);
    updated_at: string;
};

