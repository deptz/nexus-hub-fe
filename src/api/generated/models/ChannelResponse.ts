/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Response model for channel.
 */
export type ChannelResponse = {
    id: string;
    tenant_id: string;
    name: string;
    channel_type: string;
    external_id: (string | null);
    config: Record<string, any>;
    is_active: boolean;
    created_at: string;
    updated_at: string;
};

