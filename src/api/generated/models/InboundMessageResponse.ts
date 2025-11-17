/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Response model for inbound message processing.
 */
export type InboundMessageResponse = {
    status: string;
    /**
     * Outbound message details
     */
    message: Record<string, any>;
    /**
     * Total processing latency in milliseconds
     */
    latency_ms: number;
    /**
     * Number of tool calls executed
     */
    tool_calls_executed?: number;
};

