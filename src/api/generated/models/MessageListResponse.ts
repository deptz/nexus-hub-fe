/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { MessageResponse } from './MessageResponse';

/**
 * Response model for listing messages.
 */
export type MessageListResponse = {
    items: Array<MessageResponse>;
    count: number;
    has_more?: boolean;
    next_offset?: (number | null);
};

