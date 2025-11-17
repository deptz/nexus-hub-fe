/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { RAGDocumentResponse } from './RAGDocumentResponse';

/**
 * Response model for listing RAG documents.
 */
export type RAGDocumentListResponse = {
    items: Array<RAGDocumentResponse>;
    count: number;
    has_more?: boolean;
    next_offset?: (number | null);
};

