/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Response model for RAG chunk.
 */
export type RAGChunkResponse = {
    id: string;
    tenant_id: string;
    kb_name: string;
    document_id: string;
    chunk_index: number;
    content: string;
    metadata: Record<string, any>;
    created_at: string;
};

