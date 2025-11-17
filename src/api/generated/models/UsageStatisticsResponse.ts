/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Response model for usage statistics.
 */
export type UsageStatisticsResponse = {
    total_messages: number;
    total_conversations: number;
    total_tool_calls: number;
    total_llm_calls: number;
    active_conversations: number;
    period_start?: (string | null);
    period_end?: (string | null);
};

