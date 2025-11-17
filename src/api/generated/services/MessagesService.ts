/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CanonicalMessage } from '../models/CanonicalMessage';
import type { InboundMessageResponse } from '../models/InboundMessageResponse';
import type { MessageListResponse } from '../models/MessageListResponse';
import type { MessageResponse } from '../models/MessageResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class MessagesService {

    /**
     * Handle Inbound Message
     * Handle inbound canonical message.
     *
     * Requires API key authentication via X-API-Key header or api_key query parameter.
     *
     * Processes an inbound message through the orchestrator pipeline:
     * 1. Resolves tenant context
     * 2. Gets/creates conversation
     * 3. Persists inbound message
     * 4. Builds prompts with conversation history
     * 5. Calls LLM with tools
     * 6. Executes tool calls if needed
     * 7. Generates and persists outbound message
     * 8. Returns response with latency and tool call count
     *
     * **Example Request:**
     * ```json
     * {
         * "tenant_id": "uuid",
         * "channel": "web",
         * "direction": "inbound",
         * "from": {"type": "user", "external_id": "user-123"},
         * "to": {"type": "bot", "external_id": ""},
         * "content": {"type": "text", "text": "Hello"}
         * }
         * ```
         *
         * **Query Parameters:**
         * - `async_processing`: If True, queues message for background processing and returns job ID
         * @param requestBody
         * @param asyncProcessing If True, queue for async processing
         * @returns InboundMessageResponse Successful Response
         * @throws ApiError
         */
        public static handleInboundMessageMessagesInboundPost(
            requestBody: CanonicalMessage,
            asyncProcessing: boolean = false,
        ): CancelablePromise<InboundMessageResponse> {
            return __request(OpenAPI, {
                method: 'POST',
                url: '/messages/inbound',
                query: {
                    'async_processing': asyncProcessing,
                },
                body: requestBody,
                mediaType: 'application/json',
                errors: {
                    422: `Validation Error`,
                },
            });
        }

        /**
         * Get Message Status
         * Get status of a queued message processing job.
         *
         * Returns the current status of an asynchronously processed message.
         * Status can be: 'queued', 'processing', 'completed', or 'failed'.
         *
         * **Returns:**
         * - If completed: Full response with outbound message
         * - If failed: Error details
         * - If queued/processing: Current status
         * @param jobId
         * @returns any Successful Response
         * @throws ApiError
         */
        public static getMessageStatusMessagesStatusJobIdGet(
            jobId: string,
        ): CancelablePromise<any> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/messages/status/{job_id}',
                path: {
                    'job_id': jobId,
                },
                errors: {
                    422: `Validation Error`,
                },
            });
        }

        /**
         * List Messages
         * List all messages for a tenant.
         * @param tenantId
         * @param conversationId Filter by conversation ID
         * @param direction Filter by direction: 'inbound' or 'outbound'
         * @param contentType Filter by content type
         * @param startDate Start date (ISO8601 timestamp)
         * @param endDate End date (ISO8601 timestamp)
         * @param limit Maximum number of results
         * @param offset Offset for pagination
         * @param sortBy Sort field: 'created_at'
         * @param sortOrder Sort order: 'asc' or 'desc'
         * @returns MessageListResponse Successful Response
         * @throws ApiError
         */
        public static listMessagesTenantsTenantIdMessagesGet(
            tenantId: string,
            conversationId?: (string | null),
            direction?: (string | null),
            contentType?: (string | null),
            startDate?: (string | null),
            endDate?: (string | null),
            limit: number = 100,
            offset?: number,
            sortBy: string = 'created_at',
            sortOrder: string = 'desc',
        ): CancelablePromise<MessageListResponse> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/tenants/{tenant_id}/messages',
                path: {
                    'tenant_id': tenantId,
                },
                query: {
                    'conversation_id': conversationId,
                    'direction': direction,
                    'content_type': contentType,
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
         * Get Message
         * Get message details by ID.
         * @param tenantId
         * @param messageId
         * @returns MessageResponse Successful Response
         * @throws ApiError
         */
        public static getMessageTenantsTenantIdMessagesMessageIdGet(
            tenantId: string,
            messageId: string,
        ): CancelablePromise<MessageResponse> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/tenants/{tenant_id}/messages/{message_id}',
                path: {
                    'tenant_id': tenantId,
                    'message_id': messageId,
                },
                errors: {
                    422: `Validation Error`,
                },
            });
        }

        /**
         * List Conversation Messages
         * List all messages in a conversation.
         * @param tenantId
         * @param conversationId
         * @param direction Filter by direction: 'inbound' or 'outbound'
         * @param limit Maximum number of results
         * @param offset Offset for pagination
         * @param sortOrder Sort order: 'asc' (chronological) or 'desc'
         * @returns MessageListResponse Successful Response
         * @throws ApiError
         */
        public static listConversationMessagesTenantsTenantIdConversationsConversationIdMessagesGet(
            tenantId: string,
            conversationId: string,
            direction?: (string | null),
            limit: number = 100,
            offset?: number,
            sortOrder: string = 'asc',
        ): CancelablePromise<MessageListResponse> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/tenants/{tenant_id}/conversations/{conversation_id}/messages',
                path: {
                    'tenant_id': tenantId,
                    'conversation_id': conversationId,
                },
                query: {
                    'direction': direction,
                    'limit': limit,
                    'offset': offset,
                    'sort_order': sortOrder,
                },
                errors: {
                    422: `Validation Error`,
                },
            });
        }

    }
