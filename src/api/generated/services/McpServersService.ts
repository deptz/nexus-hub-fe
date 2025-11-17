/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateMCPServerRequest } from '../models/CreateMCPServerRequest';
import type { CreateMCPServerToolRequest } from '../models/CreateMCPServerToolRequest';
import type { MCPServerResponse } from '../models/MCPServerResponse';
import type { MCPServerToolResponse } from '../models/MCPServerToolResponse';
import type { UpdateMCPServerRequest } from '../models/UpdateMCPServerRequest';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class McpServersService {

    /**
     * Create Mcp Server
     * Create a new MCP (Model Context Protocol) server for a tenant.
     *
     * Requires API key authentication. MCP servers enable integration with external
     * services via the Model Context Protocol.
     *
     * **Endpoint Validation:**
     * - Must be http, https, ws, or wss protocol
     * - Cannot point to internal/private networks (SSRF protection)
     *
     * **Example Request:**
     * ```json
     * {
         * "name": "crm_server",
         * "endpoint": "https://mcp.example.com/api",
         * "auth_config": {
             * "type": "api_key",
             * "key": "secret_key_here"
             * }
             * }
             * ```
             * @param tenantId
             * @param requestBody
             * @returns MCPServerResponse Successful Response
             * @throws ApiError
             */
            public static createMcpServerTenantsTenantIdMcpServersPost(
                tenantId: string,
                requestBody: CreateMCPServerRequest,
            ): CancelablePromise<MCPServerResponse> {
                return __request(OpenAPI, {
                    method: 'POST',
                    url: '/tenants/{tenant_id}/mcp-servers',
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
             * List Mcp Servers
             * List all MCP servers for a tenant.
             *
             * Requires API key authentication. Supports optional filtering by active status.
             * @param tenantId
             * @param isActive Filter by active status
             * @returns any Successful Response
             * @throws ApiError
             */
            public static listMcpServersTenantsTenantIdMcpServersGet(
                tenantId: string,
                isActive?: (boolean | null),
            ): CancelablePromise<any> {
                return __request(OpenAPI, {
                    method: 'GET',
                    url: '/tenants/{tenant_id}/mcp-servers',
                    path: {
                        'tenant_id': tenantId,
                    },
                    query: {
                        'is_active': isActive,
                    },
                    errors: {
                        422: `Validation Error`,
                    },
                });
            }

            /**
             * Get Mcp Server
             * Get MCP server details by ID.
             *
             * Requires API key authentication. Returns 404 if not found.
             * @param tenantId
             * @param serverId
             * @returns MCPServerResponse Successful Response
             * @throws ApiError
             */
            public static getMcpServerTenantsTenantIdMcpServersServerIdGet(
                tenantId: string,
                serverId: string,
            ): CancelablePromise<MCPServerResponse> {
                return __request(OpenAPI, {
                    method: 'GET',
                    url: '/tenants/{tenant_id}/mcp-servers/{server_id}',
                    path: {
                        'tenant_id': tenantId,
                        'server_id': serverId,
                    },
                    errors: {
                        422: `Validation Error`,
                    },
                });
            }

            /**
             * Update Mcp Server
             * Update MCP server configuration.
             *
             * Requires API key authentication. Only provided fields will be updated.
             * Endpoint validation (SSRF protection) applies if endpoint is updated.
             * @param tenantId
             * @param serverId
             * @param requestBody
             * @returns MCPServerResponse Successful Response
             * @throws ApiError
             */
            public static updateMcpServerTenantsTenantIdMcpServersServerIdPut(
                tenantId: string,
                serverId: string,
                requestBody: UpdateMCPServerRequest,
            ): CancelablePromise<MCPServerResponse> {
                return __request(OpenAPI, {
                    method: 'PUT',
                    url: '/tenants/{tenant_id}/mcp-servers/{server_id}',
                    path: {
                        'tenant_id': tenantId,
                        'server_id': serverId,
                    },
                    body: requestBody,
                    mediaType: 'application/json',
                    errors: {
                        422: `Validation Error`,
                    },
                });
            }

            /**
             * Delete Mcp Server
             * Delete an MCP server.
             *
             * Requires API key authentication. Permanently deletes the MCP server and all associated tools.
             * @param tenantId
             * @param serverId
             * @returns any Successful Response
             * @throws ApiError
             */
            public static deleteMcpServerTenantsTenantIdMcpServersServerIdDelete(
                tenantId: string,
                serverId: string,
            ): CancelablePromise<any> {
                return __request(OpenAPI, {
                    method: 'DELETE',
                    url: '/tenants/{tenant_id}/mcp-servers/{server_id}',
                    path: {
                        'tenant_id': tenantId,
                        'server_id': serverId,
                    },
                    errors: {
                        422: `Validation Error`,
                    },
                });
            }

            /**
             * List Mcp Server Tools
             * List all tools for an MCP server.
             *
             * Requires API key authentication. Returns tools registered for the specified MCP server.
             * @param tenantId
             * @param serverId
             * @returns any Successful Response
             * @throws ApiError
             */
            public static listMcpServerToolsTenantsTenantIdMcpServersServerIdToolsGet(
                tenantId: string,
                serverId: string,
            ): CancelablePromise<any> {
                return __request(OpenAPI, {
                    method: 'GET',
                    url: '/tenants/{tenant_id}/mcp-servers/{server_id}/tools',
                    path: {
                        'tenant_id': tenantId,
                        'server_id': serverId,
                    },
                    errors: {
                        422: `Validation Error`,
                    },
                });
            }

            /**
             * Create Mcp Server Tool
             * Create or update a tool for an MCP server.
             *
             * Requires API key authentication. If a tool with the same name exists, it will be updated.
             * @param tenantId
             * @param serverId
             * @param requestBody
             * @returns MCPServerToolResponse Successful Response
             * @throws ApiError
             */
            public static createMcpServerToolTenantsTenantIdMcpServersServerIdToolsPost(
                tenantId: string,
                serverId: string,
                requestBody: CreateMCPServerToolRequest,
            ): CancelablePromise<MCPServerToolResponse> {
                return __request(OpenAPI, {
                    method: 'POST',
                    url: '/tenants/{tenant_id}/mcp-servers/{server_id}/tools',
                    path: {
                        'tenant_id': tenantId,
                        'server_id': serverId,
                    },
                    body: requestBody,
                    mediaType: 'application/json',
                    errors: {
                        422: `Validation Error`,
                    },
                });
            }

            /**
             * Delete Mcp Server Tool
             * Delete a tool from an MCP server.
             *
             * Requires API key authentication. Permanently removes the tool registration.
             * @param tenantId
             * @param serverId
             * @param toolName
             * @returns any Successful Response
             * @throws ApiError
             */
            public static deleteMcpServerToolTenantsTenantIdMcpServersServerIdToolsToolNameDelete(
                tenantId: string,
                serverId: string,
                toolName: string,
            ): CancelablePromise<any> {
                return __request(OpenAPI, {
                    method: 'DELETE',
                    url: '/tenants/{tenant_id}/mcp-servers/{server_id}/tools/{tool_name}',
                    path: {
                        'tenant_id': tenantId,
                        'server_id': serverId,
                        'tool_name': toolName,
                    },
                    errors: {
                        422: `Validation Error`,
                    },
                });
            }

        }
