/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Request model for creating a channel.
 */
export type CreateChannelRequest = {
    /**
     * Channel name (unique per tenant)
     */
    name: string;
    /**
     * Channel type: 'whatsapp', 'web', 'slack', 'telegram', etc.
     */
    channel_type: string;
    /**
     * External channel ID (e.g., WhatsApp number, Slack app ID)
     */
    external_id?: (string | null);
    /**
     * Channel-specific configuration (JSONB)
     */
    config?: Record<string, any>;
    /**
     * Whether the channel is active
     */
    is_active?: boolean;
};

