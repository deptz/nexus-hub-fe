/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Request model for creating/updating an MCP server tool.
 */
export type CreateMCPServerToolRequest = {
    /**
     * Tool name as exposed by MCP server
     */
    tool_name: string;
    /**
     * Tool description
     */
    description?: (string | null);
    /**
     * Tool schema (JSON Schema)
     */
    schema?: Record<string, any>;
};

