/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Response model for detailed cost breakdown.
 */
export type CostBreakdownResponse = {
    total_cost: number;
    llm_cost: number;
    tool_cost: number;
    by_provider: Record<string, number>;
    by_model: Record<string, number>;
    by_tool: Record<string, number>;
    period_start?: (string | null);
    period_end?: (string | null);
    currency?: string;
};

