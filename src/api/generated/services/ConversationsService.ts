/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ConversationListResponse } from '../models/ConversationListResponse';
import type { ConversationResponse } from '../models/ConversationResponse';
import type { ConversationStatsResponse } from '../models/ConversationStatsResponse';
import type { UpdateConversationRequest } from '../models/UpdateConversationRequest';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ConversationsService {

    /**
     * List Conversations
     * List all conversations for a tenant.
     * @param tenantId
     * @param status Filter by status: 'open', 'closed', 'archived'
     * @param channelId Filter by channel ID
     * @param startDate Start date (ISO8601 timestamp)
     * @param endDate End date (ISO8601 timestamp)
     * @param limit Maximum number of results
     * @param offset Offset for pagination
     * @param sortBy Sort field: 'created_at', 'updated_at'
     * @param sortOrder Sort order: 'asc' or 'desc'
     * @returns ConversationListResponse Successful Response
     * @throws ApiError
     */
    public static listConversationsTenantsTenantIdConversationsGet(
        tenantId: string,
        status?: (string | null),
        channelId?: (string | null),
        startDate?: (string | null),
        endDate?: (string | null),
        limit: number = 100,
        offset?: number,
        sortBy: string = 'created_at',
        sortOrder: string = 'desc',
    ): CancelablePromise<ConversationListResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/tenants/{tenant_id}/conversations',
            path: {
                'tenant_id': tenantId,
            },
            query: {
                'status': status,
                'channel_id': channelId,
                'start_date': startDate,
                'end_date': endDate,
                'limit': limit,
                'offset': offset,
                'sort_by': sortBy,
                'sort_order': sortOrder,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get Conversation
     * Get conversation details by ID.
     * @param tenantId
     * @param conversationId
     * @returns ConversationResponse Successful Response
     * @throws ApiError
     */
    public static getConversationTenantsTenantIdConversationsConversationIdGet(
        tenantId: string,
        conversationId: string,
    ): CancelablePromise<ConversationResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/tenants/{tenant_id}/conversations/{conversation_id}',
            path: {
                'tenant_id': tenantId,
                'conversation_id': conversationId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update Conversation
     * Update conversation (subject, status).
     * @param tenantId
     * @param conversationId
     * @param requestBody
     * @returns ConversationResponse Successful Response
     * @throws ApiError
     */
    public static updateConversationTenantsTenantIdConversationsConversationIdPut(
        tenantId: string,
        conversationId: string,
        requestBody: UpdateConversationRequest,
    ): CancelablePromise<ConversationResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/tenants/{tenant_id}/conversations/{conversation_id}',
            path: {
                'tenant_id': tenantId,
                'conversation_id': conversationId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Delete Conversation
     * Delete/archive a conversation.
     * @param tenantId
     * @param conversationId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static deleteConversationTenantsTenantIdConversationsConversationIdDelete(
        tenantId: string,
        conversationId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/tenants/{tenant_id}/conversations/{conversation_id}',
            path: {
                'tenant_id': tenantId,
                'conversation_id': conversationId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get Conversation Stats
     * Get conversation statistics.
     * @param tenantId
     * @param conversationId
     * @returns ConversationStatsResponse Successful Response
     * @throws ApiError
     */
    public static getConversationStatsTenantsTenantIdConversationsConversationIdStatsGet(
        tenantId: string,
        conversationId: string,
    ): CancelablePromise<ConversationStatsResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/tenants/{tenant_id}/conversations/{conversation_id}/stats',
            path: {
                'tenant_id': tenantId,
                'conversation_id': conversationId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Resolve Conversation
     * Mark conversation as resolved or unresolved.
     * @param tenantId
     * @param conversationId
     * @param resolved Set resolved status
     * @returns any Successful Response
     * @throws ApiError
     */
    public static resolveConversationTenantsTenantIdConversationsConversationIdResolvePut(
        tenantId: string,
        conversationId: string,
        resolved: boolean = true,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/tenants/{tenant_id}/conversations/{conversation_id}/resolve',
            path: {
                'tenant_id': tenantId,
                'conversation_id': conversationId,
            },
            query: {
                'resolved': resolved,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

}
