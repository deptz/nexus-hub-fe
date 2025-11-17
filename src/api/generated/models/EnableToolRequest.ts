/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Request model for enabling a tool for a tenant.
 */
export type EnableToolRequest = {
    /**
     * Canonical tool name
     */
    tool_name: string;
    /**
     * Optional configuration override for this tenant
     */
    config_override?: (Record<string, any> | null);
};

