/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { MessageContent } from './MessageContent';
import type { MessageParty } from './MessageParty';

/**
 * Canonical message format normalized from all channels.
 */
export type CanonicalMessage = {
    /**
     * UUID of the message
     */
    id: string;
    /**
     * UUID of the tenant
     */
    tenant_id: string;
    /**
     * UUID of the conversation
     */
    conversation_id: string;
    /**
     * Channel type: 'whatsapp' | 'web' | 'slack' | 'email' | 'telegram'
     */
    channel: string;
    /**
     * 'inbound' | 'outbound'
     */
    direction: string;
    /**
     * Original message ID from channel
     */
    source_message_id?: (string | null);
    /**
     * Sender party
     */
    from: MessageParty;
    /**
     * Recipient party
     */
    to: MessageParty;
    /**
     * Message content
     */
    content: MessageContent;
    /**
     * Additional metadata
     */
    metadata?: Record<string, any>;
    /**
     * ISO8601 timestamp
     */
    timestamp: string;
};

