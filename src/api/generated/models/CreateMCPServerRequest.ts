/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Request model for creating an MCP server.
 */
export type CreateMCPServerRequest = {
    /**
     * MCP server name (unique per tenant)
     */
    name: string;
    /**
     * MCP server endpoint (http/https/ws/wss)
     */
    endpoint: string;
    /**
     * Authentication configuration (JSONB)
     */
    auth_config: Record<string, any>;
};

