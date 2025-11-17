/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Request model for creating a RAG document.
 */
export type CreateRAGDocumentRequest = {
    /**
     * Knowledge base name (must exist)
     */
    kb_name: string;
    /**
     * External document ID (file ID, URL, etc.)
     */
    external_id?: (string | null);
    /**
     * Document title
     */
    title?: (string | null);
    /**
     * Document content text
     */
    content: string;
    /**
     * Document metadata (JSONB)
     */
    metadata?: Record<string, any>;
    /**
     * Character count per chunk
     */
    chunk_size?: number;
    /**
     * Character overlap between chunks
     */
    chunk_overlap?: number;
};

