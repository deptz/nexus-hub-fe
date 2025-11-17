/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { LLMTraceResponse } from './LLMTraceResponse';

/**
 * Response model for listing LLM traces.
 */
export type LLMTraceListResponse = {
    items: Array<LLMTraceResponse>;
    count: number;
    has_more?: boolean;
    next_offset?: (number | null);
};

