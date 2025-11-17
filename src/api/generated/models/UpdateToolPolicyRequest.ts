/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Request model for updating a tool policy.
 */
export type UpdateToolPolicyRequest = {
    /**
     * Enable or disable the tool
     */
    is_enabled?: (boolean | null);
    /**
     * Configuration override for this tenant
     */
    config_override?: (Record<string, any> | null);
};

