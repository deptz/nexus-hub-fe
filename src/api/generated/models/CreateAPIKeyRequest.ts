/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Request model for creating an API key.
 */
export type CreateAPIKeyRequest = {
    name?: (string | null);
    description?: (string | null);
    expires_in_days?: (number | null);
    rate_limit_per_minute?: number;
    metadata?: (Record<string, any> | null);
};

