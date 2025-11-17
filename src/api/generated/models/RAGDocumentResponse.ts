/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Response model for RAG document.
 */
export type RAGDocumentResponse = {
    id: string;
    tenant_id: string;
    kb_name: string;
    external_id: (string | null);
    title: (string | null);
    content: string;
    metadata: Record<string, any>;
    created_at: string;
    updated_at: string;
};

