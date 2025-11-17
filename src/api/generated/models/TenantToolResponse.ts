/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Response model for tenant tool policy.
 */
export type TenantToolResponse = {
    tool_id: string;
    tool_name: string;
    description: string;
    provider: string;
    is_enabled: boolean;
    config_override: Record<string, any>;
    created_at: string;
    updated_at: string;
};

