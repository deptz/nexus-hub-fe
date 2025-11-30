/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Response model for MCP server tool.
 */
export type MCPServerToolResponse = {
    id: string;
    mcp_server_id: string;
    tool_name: string;
    description: (string | null);
    /**
     * Tool schema (JSON Schema)
     */
    schema: Record<string, any>;
    created_at: string;
    updated_at: string;
};

