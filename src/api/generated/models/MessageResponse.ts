/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Response model for message.
 */
export type MessageResponse = {
    id: string;
    tenant_id: string;
    conversation_id: string;
    channel_id: (string | null);
    direction: string;
    source_message_id: (string | null);
    from_type: string;
    from_external_id: (string | null);
    from_display_name: (string | null);
    content_type: string;
    content_text: string;
    metadata: Record<string, any>;
    created_at: string;
};

