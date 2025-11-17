/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Request model for cost estimation.
 */
export type CostEstimateRequest = {
    /**
     * LLM provider: 'openai' or 'gemini'
     */
    provider: string;
    /**
     * Model name
     */
    model: string;
    /**
     * Estimated prompt tokens
     */
    estimated_prompt_tokens?: (number | null);
    /**
     * Estimated completion tokens
     */
    estimated_completion_tokens?: (number | null);
    /**
     * Estimated total tokens (if prompt/completion not available)
     */
    estimated_total_tokens?: (number | null);
};

