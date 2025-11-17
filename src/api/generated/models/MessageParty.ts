/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Represents a party (user or bot) in a message.
 */
export type MessageParty = {
    /**
     * 'user' | 'bot'
     */
    type: string;
    /**
     * External identifier from channel
     */
    external_id: string;
    display_name?: (string | null);
};

