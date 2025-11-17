/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Response model for cost estimation.
 */
export type CostEstimateResponse = {
    estimated_cost: number;
    provider: string;
    model: string;
    currency?: string;
    breakdown: Record<string, any>;
};

