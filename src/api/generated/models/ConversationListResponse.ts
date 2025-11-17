/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ConversationResponse } from './ConversationResponse';

/**
 * Response model for listing conversations.
 */
export type ConversationListResponse = {
    items: Array<ConversationResponse>;
    count: number;
    has_more?: boolean;
    next_offset?: (number | null);
};

