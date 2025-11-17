/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ChannelListResponse } from '../models/ChannelListResponse';
import type { ChannelResponse } from '../models/ChannelResponse';
import type { CreateAPIKeyRequest } from '../models/CreateAPIKeyRequest';
import type { CreateChannelRequest } from '../models/CreateChannelRequest';
import type { EnableToolRequest } from '../models/EnableToolRequest';
import type { GetPromptResponse } from '../models/GetPromptResponse';
import type { PromptUpdateResponse } from '../models/PromptUpdateResponse';
import type { TenantToolResponse } from '../models/TenantToolResponse';
import type { TenantToolsListResponse } from '../models/TenantToolsListResponse';
import type { UpdateChannelRequest } from '../models/UpdateChannelRequest';
import type { UpdatePromptRequest } from '../models/UpdatePromptRequest';
import type { UpdateToolPolicyRequest } from '../models/UpdateToolPolicyRequest';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class TenantManagementService {

    /**
     * Update Tenant Prompt
     * Update tenant system prompt with validation.
     *
     * Requires API key authentication. Only the tenant owner or master key can update prompts.
     *
     * The prompt will be validated for security (e.g., no meta-instruction attempts).
     * If validation fails, a 400 error is returned with details.
     *
     * **Example Request:**
     * ```json
     * {
         * "custom_system_prompt": "You are a helpful assistant for ACME Corp.",
         * "override_mode": "append"
         * }
         * ```
         * @param tenantId
         * @param requestBody
         * @returns PromptUpdateResponse Successful Response
         * @throws ApiError
         */
        public static updateTenantPromptTenantsTenantIdPromptPut(
            tenantId: string,
            requestBody: UpdatePromptRequest,
        ): CancelablePromise<PromptUpdateResponse> {
            return __request(OpenAPI, {
                method: 'PUT',
                url: '/tenants/{tenant_id}/prompt',
                path: {
                    'tenant_id': tenantId,
                },
                body: requestBody,
                mediaType: 'application/json',
                errors: {
                    422: `Validation Error`,
                },
            });
        }

        /**
         * Get Tenant Prompt
         * Get current tenant prompt configuration.
         *
         * Requires API key authentication. Returns the current custom system prompt,
         * override mode, and timestamps.
         *
         * Returns 404 if no prompt has been configured for this tenant.
         * @param tenantId
         * @returns GetPromptResponse Successful Response
         * @throws ApiError
         */
        public static getTenantPromptTenantsTenantIdPromptGet(
            tenantId: string,
        ): CancelablePromise<GetPromptResponse> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/tenants/{tenant_id}/prompt',
                path: {
                    'tenant_id': tenantId,
                },
                errors: {
                    422: `Validation Error`,
                },
            });
        }

        /**
         * Delete Tenant Prompt
         * Delete/remove tenant prompt (revert to default).
         *
         * Requires API key authentication. Permanently removes the custom prompt
         * for this tenant, reverting to default behavior.
         *
         * Returns success even if no prompt exists (idempotent).
         * @param tenantId
         * @returns any Successful Response
         * @throws ApiError
         */
        public static deleteTenantPromptTenantsTenantIdPromptDelete(
            tenantId: string,
        ): CancelablePromise<any> {
            return __request(OpenAPI, {
                method: 'DELETE',
                url: '/tenants/{tenant_id}/prompt',
                path: {
                    'tenant_id': tenantId,
                },
                errors: {
                    422: `Validation Error`,
                },
            });
        }

        /**
         * List Tenant Tools
         * List all tools enabled for a tenant.
         *
         * Requires API key authentication. Returns all tools that have been configured
         * for this tenant, including their enabled/disabled status and configuration overrides.
         *
         * By default, only enabled tools are returned. Set `include_disabled=true` to see all tools.
         *
         * **Example Response:**
         * ```json
         * {
             * "items": [
                 * {
                     * "tool_id": "uuid",
                     * "tool_name": "openai_file_search",
                     * "description": "Search documents using OpenAI file search",
                     * "provider": "openai_file",
                     * "is_enabled": true,
                     * "config_override": {},
                     * "created_at": "2024-01-01T00:00:00Z",
                     * "updated_at": "2024-01-01T00:00:00Z"
                     * }
                     * ],
                     * "count": 1
                     * }
                     * ```
                     * @param tenantId
                     * @param includeDisabled Include disabled tools in the response
                     * @returns TenantToolsListResponse Successful Response
                     * @throws ApiError
                     */
                    public static listTenantToolsTenantsTenantIdToolsGet(
                        tenantId: string,
                        includeDisabled: boolean = false,
                    ): CancelablePromise<TenantToolsListResponse> {
                        return __request(OpenAPI, {
                            method: 'GET',
                            url: '/tenants/{tenant_id}/tools',
                            path: {
                                'tenant_id': tenantId,
                            },
                            query: {
                                'include_disabled': includeDisabled,
                            },
                            errors: {
                                422: `Validation Error`,
                            },
                        });
                    }

                    /**
                     * Enable Tool For Tenant
                     * Enable a tool for a tenant.
                     *
                     * Requires API key authentication. Enables a tool for the specified tenant.
                     * If the tool is already enabled, updates the configuration override.
                     *
                     * The tool must exist in the `tools` table. You can enable multiple tools per tenant.
                     *
                     * **Example Request:**
                     * ```json
                     * {
                         * "tool_name": "openai_file_search",
                         * "config_override": {
                             * "kb_name": "custom_kb"
                             * }
                             * }
                             * ```
                             *
                             * **Example Response:**
                             * ```json
                             * {
                                 * "tool_id": "uuid",
                                 * "tool_name": "openai_file_search",
                                 * "description": "Search documents using OpenAI file search",
                                 * "provider": "openai_file",
                                 * "is_enabled": true,
                                 * "config_override": {"kb_name": "custom_kb"},
                                 * "created_at": "2024-01-01T00:00:00Z",
                                 * "updated_at": "2024-01-01T00:00:00Z"
                                 * }
                                 * ```
                                 * @param tenantId
                                 * @param requestBody
                                 * @returns TenantToolResponse Successful Response
                                 * @throws ApiError
                                 */
                                public static enableToolForTenantTenantsTenantIdToolsPost(
                                    tenantId: string,
                                    requestBody: EnableToolRequest,
                                ): CancelablePromise<TenantToolResponse> {
                                    return __request(OpenAPI, {
                                        method: 'POST',
                                        url: '/tenants/{tenant_id}/tools',
                                        path: {
                                            'tenant_id': tenantId,
                                        },
                                        body: requestBody,
                                        mediaType: 'application/json',
                                        errors: {
                                            422: `Validation Error`,
                                        },
                                    });
                                }

                                /**
                                 * Update Tool Policy
                                 * Update a tool policy for a tenant (enable/disable or update config).
                                 *
                                 * Requires API key authentication. Updates the tool policy for the specified tenant.
                                 * You can enable/disable the tool or update its configuration override.
                                 *
                                 * **Example Request:**
                                 * ```json
                                 * {
                                     * "is_enabled": false,
                                     * "config_override": {
                                         * "kb_name": "updated_kb"
                                         * }
                                         * }
                                         * ```
                                         * @param tenantId
                                         * @param toolName
                                         * @param requestBody
                                         * @returns TenantToolResponse Successful Response
                                         * @throws ApiError
                                         */
                                        public static updateToolPolicyTenantsTenantIdToolsToolNamePut(
                                            tenantId: string,
                                            toolName: string,
                                            requestBody: UpdateToolPolicyRequest,
                                        ): CancelablePromise<TenantToolResponse> {
                                            return __request(OpenAPI, {
                                                method: 'PUT',
                                                url: '/tenants/{tenant_id}/tools/{tool_name}',
                                                path: {
                                                    'tenant_id': tenantId,
                                                    'tool_name': toolName,
                                                },
                                                body: requestBody,
                                                mediaType: 'application/json',
                                                errors: {
                                                    422: `Validation Error`,
                                                },
                                            });
                                        }

                                        /**
                                         * Disable Tool For Tenant
                                         * Disable a tool for a tenant (or delete the policy).
                                         *
                                         * Requires API key authentication. Permanently removes the tool policy for this tenant,
                                         * effectively disabling the tool. The tool itself remains in the system.
                                         *
                                         * Returns success even if the tool is not enabled for this tenant (idempotent).
                                         * @param tenantId
                                         * @param toolName
                                         * @returns any Successful Response
                                         * @throws ApiError
                                         */
                                        public static disableToolForTenantTenantsTenantIdToolsToolNameDelete(
                                            tenantId: string,
                                            toolName: string,
                                        ): CancelablePromise<any> {
                                            return __request(OpenAPI, {
                                                method: 'DELETE',
                                                url: '/tenants/{tenant_id}/tools/{tool_name}',
                                                path: {
                                                    'tenant_id': tenantId,
                                                    'tool_name': toolName,
                                                },
                                                errors: {
                                                    422: `Validation Error`,
                                                },
                                            });
                                        }

                                        /**
                                         * Create Api Key Endpoint
                                         * Create a new API key for a tenant.
                                         *
                                         * Requires API key authentication. Only the tenant owner or master key can create API keys.
                                         *
                                         * **WARNING**: The API key is only returned once in the response. Store it securely!
                                         *
                                         * Returns:
                                         * API key object with the plain text key (shown only once)
                                         * @param tenantId
                                         * @param requestBody
                                         * @returns any Successful Response
                                         * @throws ApiError
                                         */
                                        public static createApiKeyEndpointTenantsTenantIdApiKeysPost(
                                            tenantId: string,
                                            requestBody: CreateAPIKeyRequest,
                                        ): CancelablePromise<any> {
                                            return __request(OpenAPI, {
                                                method: 'POST',
                                                url: '/tenants/{tenant_id}/api-keys',
                                                path: {
                                                    'tenant_id': tenantId,
                                                },
                                                body: requestBody,
                                                mediaType: 'application/json',
                                                errors: {
                                                    422: `Validation Error`,
                                                },
                                            });
                                        }

                                        /**
                                         * List Api Keys Endpoint
                                         * List all API keys for a tenant.
                                         *
                                         * Requires API key authentication. Only the tenant owner or master key can list API keys.
                                         *
                                         * Args:
                                         * tenant_id: Tenant ID
                                         * include_inactive: Whether to include inactive/expired keys
                                         *
                                         * Returns:
                                         * List of API key info (without the actual keys)
                                         * @param tenantId
                                         * @param includeInactive Include inactive/expired keys
                                         * @returns any Successful Response
                                         * @throws ApiError
                                         */
                                        public static listApiKeysEndpointTenantsTenantIdApiKeysGet(
                                            tenantId: string,
                                            includeInactive: boolean = false,
                                        ): CancelablePromise<any> {
                                            return __request(OpenAPI, {
                                                method: 'GET',
                                                url: '/tenants/{tenant_id}/api-keys',
                                                path: {
                                                    'tenant_id': tenantId,
                                                },
                                                query: {
                                                    'include_inactive': includeInactive,
                                                },
                                                errors: {
                                                    422: `Validation Error`,
                                                },
                                            });
                                        }

                                        /**
                                         * Revoke Api Key Endpoint
                                         * Revoke or delete an API key.
                                         *
                                         * Requires API key authentication. Only the tenant owner or master key can revoke API keys.
                                         *
                                         * Args:
                                         * tenant_id: Tenant ID
                                         * key_id: API key ID to revoke
                                         * permanent: If True, permanently delete the key. If False, just deactivate it.
                                         *
                                         * Returns:
                                         * Success message
                                         * @param tenantId
                                         * @param keyId
                                         * @param permanent If True, permanently delete the key. If False, just deactivate it.
                                         * @returns any Successful Response
                                         * @throws ApiError
                                         */
                                        public static revokeApiKeyEndpointTenantsTenantIdApiKeysKeyIdDelete(
                                            tenantId: string,
                                            keyId: string,
                                            permanent: boolean = false,
                                        ): CancelablePromise<any> {
                                            return __request(OpenAPI, {
                                                method: 'DELETE',
                                                url: '/tenants/{tenant_id}/api-keys/{key_id}',
                                                path: {
                                                    'tenant_id': tenantId,
                                                    'key_id': keyId,
                                                },
                                                query: {
                                                    'permanent': permanent,
                                                },
                                                errors: {
                                                    422: `Validation Error`,
                                                },
                                            });
                                        }

                                        /**
                                         * List Channels
                                         * List all channels for a tenant.
                                         *
                                         * Requires API key authentication. Returns all channels configured for the tenant.
                                         * @param tenantId
                                         * @param channelType Filter by channel type
                                         * @param isActive Filter by active status
                                         * @returns ChannelListResponse Successful Response
                                         * @throws ApiError
                                         */
                                        public static listChannelsTenantsTenantIdChannelsGet(
                                            tenantId: string,
                                            channelType?: (string | null),
                                            isActive?: (boolean | null),
                                        ): CancelablePromise<ChannelListResponse> {
                                            return __request(OpenAPI, {
                                                method: 'GET',
                                                url: '/tenants/{tenant_id}/channels',
                                                path: {
                                                    'tenant_id': tenantId,
                                                },
                                                query: {
                                                    'channel_type': channelType,
                                                    'is_active': isActive,
                                                },
                                                errors: {
                                                    422: `Validation Error`,
                                                },
                                            });
                                        }

                                        /**
                                         * Create Channel
                                         * Create a new channel for a tenant.
                                         *
                                         * Requires API key authentication. Creates a new channel configuration.
                                         *
                                         * **Example Request:**
                                         * ```json
                                         * {
                                             * "name": "whatsapp-main",
                                             * "channel_type": "whatsapp",
                                             * "external_id": "+1234567890",
                                             * "config": {
                                                 * "webhook_url": "https://example.com/webhook"
                                                 * },
                                                 * "is_active": true
                                                 * }
                                                 * ```
                                                 * @param tenantId
                                                 * @param requestBody
                                                 * @returns ChannelResponse Successful Response
                                                 * @throws ApiError
                                                 */
                                                public static createChannelTenantsTenantIdChannelsPost(
                                                    tenantId: string,
                                                    requestBody: CreateChannelRequest,
                                                ): CancelablePromise<ChannelResponse> {
                                                    return __request(OpenAPI, {
                                                        method: 'POST',
                                                        url: '/tenants/{tenant_id}/channels',
                                                        path: {
                                                            'tenant_id': tenantId,
                                                        },
                                                        body: requestBody,
                                                        mediaType: 'application/json',
                                                        errors: {
                                                            422: `Validation Error`,
                                                        },
                                                    });
                                                }

                                                /**
                                                 * Get Channel
                                                 * Get channel details by ID.
                                                 *
                                                 * Requires API key authentication. Returns 404 if not found.
                                                 * @param tenantId
                                                 * @param channelId
                                                 * @returns ChannelResponse Successful Response
                                                 * @throws ApiError
                                                 */
                                                public static getChannelTenantsTenantIdChannelsChannelIdGet(
                                                    tenantId: string,
                                                    channelId: string,
                                                ): CancelablePromise<ChannelResponse> {
                                                    return __request(OpenAPI, {
                                                        method: 'GET',
                                                        url: '/tenants/{tenant_id}/channels/{channel_id}',
                                                        path: {
                                                            'tenant_id': tenantId,
                                                            'channel_id': channelId,
                                                        },
                                                        errors: {
                                                            422: `Validation Error`,
                                                        },
                                                    });
                                                }

                                                /**
                                                 * Update Channel
                                                 * Update channel configuration.
                                                 *
                                                 * Requires API key authentication. Only provided fields will be updated.
                                                 * @param tenantId
                                                 * @param channelId
                                                 * @param requestBody
                                                 * @returns ChannelResponse Successful Response
                                                 * @throws ApiError
                                                 */
                                                public static updateChannelTenantsTenantIdChannelsChannelIdPut(
                                                    tenantId: string,
                                                    channelId: string,
                                                    requestBody: UpdateChannelRequest,
                                                ): CancelablePromise<ChannelResponse> {
                                                    return __request(OpenAPI, {
                                                        method: 'PUT',
                                                        url: '/tenants/{tenant_id}/channels/{channel_id}',
                                                        path: {
                                                            'tenant_id': tenantId,
                                                            'channel_id': channelId,
                                                        },
                                                        body: requestBody,
                                                        mediaType: 'application/json',
                                                        errors: {
                                                            422: `Validation Error`,
                                                        },
                                                    });
                                                }

                                                /**
                                                 * Delete Channel
                                                 * Delete or deactivate a channel.
                                                 *
                                                 * Requires API key authentication. Permanently deletes the channel.
                                                 * Note: This will set channel_id to NULL in related conversations and messages (due to ON DELETE SET NULL).
                                                 * @param tenantId
                                                 * @param channelId
                                                 * @returns any Successful Response
                                                 * @throws ApiError
                                                 */
                                                public static deleteChannelTenantsTenantIdChannelsChannelIdDelete(
                                                    tenantId: string,
                                                    channelId: string,
                                                ): CancelablePromise<any> {
                                                    return __request(OpenAPI, {
                                                        method: 'DELETE',
                                                        url: '/tenants/{tenant_id}/channels/{channel_id}',
                                                        path: {
                                                            'tenant_id': tenantId,
                                                            'channel_id': channelId,
                                                        },
                                                        errors: {
                                                            422: `Validation Error`,
                                                        },
                                                    });
                                                }

                                            }
