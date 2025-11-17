/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Response model for conversation analytics.
 */
export type ConversationAnalyticsResponse = {
    total_conversations: number;
    open_conversations: number;
    closed_conversations: number;
    archived_conversations: number;
    resolved_conversations: number;
    resolution_rate: number;
    avg_messages_per_conversation: number;
    avg_tool_calls_per_conversation: number;
    period_start?: (string | null);
    period_end?: (string | null);
};

