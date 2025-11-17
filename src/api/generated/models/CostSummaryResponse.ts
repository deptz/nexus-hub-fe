/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Response model for cost summary.
 */
export type CostSummaryResponse = {
    total_cost: number;
    llm_cost: number;
    tool_cost: number;
    period_start?: (string | null);
    period_end?: (string | null);
    currency?: string;
};

