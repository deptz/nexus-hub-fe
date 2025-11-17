/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Response model for MCP server.
 */
export type MCPServerResponse = {
    id: string;
    tenant_id: string;
    name: string;
    endpoint: string;
    auth_config: Record<string, any>;
    is_active: boolean;
    created_at: string;
    updated_at: string;
};

