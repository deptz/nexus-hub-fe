/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LLMTraceListResponse } from '../models/LLMTraceListResponse';
import type { LLMTraceResponse } from '../models/LLMTraceResponse';
import type { LogQueryResponse } from '../models/LogQueryResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class LogsService {

    /**
     * Get Event Logs
     * Get event logs for a tenant.
     * @param tenantId
     * @param conversationId Filter by conversation ID
     * @param eventType Filter by event type
     * @param provider Filter by provider
     * @param startDate Start date (ISO8601 timestamp)
     * @param endDate End date (ISO8601 timestamp)
     * @param limit Maximum number of results
     * @param offset Offset for pagination
     * @returns LogQueryResponse Successful Response
     * @throws ApiError
     */
    public static getEventLogsTenantsTenantIdLogsEventsGet(
        tenantId: string,
        conversationId?: (string | null),
        eventType?: (string | null),
        provider?: (string | null),
        startDate?: (string | null),
        endDate?: (string | null),
        limit: number = 100,
        offset?: number,
    ): CancelablePromise<LogQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/tenants/{tenant_id}/logs/events',
            path: {
                'tenant_id': tenantId,
            },
            query: {
                'conversation_id': conversationId,
                'event_type': eventType,
                'provider': provider,
                'start_date': startDate,
                'end_date': endDate,
                'limit': limit,
                'offset': offset,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get Tool Call Logs
     * Get tool call logs for a tenant.
     * @param tenantId
     * @param conversationId Filter by conversation ID
     * @param toolName Filter by tool name
     * @param status Filter by status: 'success' or 'failure'
     * @param startDate Start date (ISO8601 timestamp)
     * @param endDate End date (ISO8601 timestamp)
     * @param limit Maximum number of results
     * @param offset Offset for pagination
     * @returns LogQueryResponse Successful Response
     * @throws ApiError
     */
    public static getToolCallLogsTenantsTenantIdLogsToolCallsGet(
        tenantId: string,
        conversationId?: (string | null),
        toolName?: (string | null),
        status?: (string | null),
        startDate?: (string | null),
        endDate?: (string | null),
        limit: number = 100,
        offset?: number,
    ): CancelablePromise<LogQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/tenants/{tenant_id}/logs/tool-calls',
            path: {
                'tenant_id': tenantId,
            },
            query: {
                'conversation_id': conversationId,
                'tool_name': toolName,
                'status': status,
                'start_date': startDate,
                'end_date': endDate,
                'limit': limit,
                'offset': offset,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * List Llm Traces
     * List LLM traces for a tenant.
     *
     * Requires API key authentication. Returns full request/response payloads for LLM API calls.
     * Useful for debugging, prompt engineering, and audit trails.
     *
     * **Security Note**: These traces may contain sensitive data. Access should be restricted.
     * @param tenantId
     * @param conversationId Filter by conversation ID
     * @param messageId Filter by message ID
     * @param provider Filter by provider: 'openai' or 'gemini'
     * @param model Filter by model name
     * @param startDate Start date (ISO8601 timestamp)
     * @param endDate End date (ISO8601 timestamp)
     * @param limit Maximum number of results
     * @param offset Offset for pagination
     * @returns LLMTraceListResponse Successful Response
     * @throws ApiError
     */
    public static listLlmTracesTenantsTenantIdTracesLlmGet(
        tenantId: string,
        conversationId?: (string | null),
        messageId?: (string | null),
        provider?: (string | null),
        model?: (string | null),
        startDate?: (string | null),
        endDate?: (string | null),
        limit: number = 100,
        offset?: number,
    ): CancelablePromise<LLMTraceListResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/tenants/{tenant_id}/traces/llm',
            path: {
                'tenant_id': tenantId,
            },
            query: {
                'conversation_id': conversationId,
                'message_id': messageId,
                'provider': provider,
                'model': model,
                'start_date': startDate,
                'end_date': endDate,
                'limit': limit,
                'offset': offset,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get Llm Trace
     * Get LLM trace details by ID.
     *
     * Requires API key authentication. Returns full request/response payload for a specific LLM trace.
     * @param tenantId
     * @param traceId
     * @returns LLMTraceResponse Successful Response
     * @throws ApiError
     */
    public static getLlmTraceTenantsTenantIdTracesLlmTraceIdGet(
        tenantId: string,
        traceId: string,
    ): CancelablePromise<LLMTraceResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/tenants/{tenant_id}/traces/llm/{trace_id}',
            path: {
                'tenant_id': tenantId,
                'trace_id': traceId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get Conversation Traces
     * Get all LLM traces for a conversation.
     *
     * Requires API key authentication. Returns all LLM traces associated with a specific conversation.
     * Useful for debugging conversation flows and understanding LLM interactions.
     * @param tenantId
     * @param conversationId
     * @param provider Filter by provider: 'openai' or 'gemini'
     * @param limit Maximum number of results
     * @param offset Offset for pagination
     * @returns LLMTraceListResponse Successful Response
     * @throws ApiError
     */
    public static getConversationTracesTenantsTenantIdConversationsConversationIdTracesGet(
        tenantId: string,
        conversationId: string,
        provider?: (string | null),
        limit: number = 100,
        offset?: number,
    ): CancelablePromise<LLMTraceListResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/tenants/{tenant_id}/conversations/{conversation_id}/traces',
            path: {
                'tenant_id': tenantId,
                'conversation_id': conversationId,
            },
            query: {
                'provider': provider,
                'limit': limit,
                'offset': offset,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get Message Trace
     * Get LLM trace for a specific message.
     *
     * Requires API key authentication. Returns the LLM trace associated with a specific message.
     * Useful for understanding how a particular message was processed.
     * @param tenantId
     * @param messageId
     * @returns LLMTraceResponse Successful Response
     * @throws ApiError
     */
    public static getMessageTraceTenantsTenantIdMessagesMessageIdTraceGet(
        tenantId: string,
        messageId: string,
    ): CancelablePromise<LLMTraceResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/tenants/{tenant_id}/messages/{message_id}/trace',
            path: {
                'tenant_id': tenantId,
                'message_id': messageId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

}
