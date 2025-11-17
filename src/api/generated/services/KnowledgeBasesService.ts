/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateKnowledgeBaseRequest } from '../models/CreateKnowledgeBaseRequest';
import type { CreateRAGDocumentRequest } from '../models/CreateRAGDocumentRequest';
import type { KnowledgeBaseResponse } from '../models/KnowledgeBaseResponse';
import type { KnowledgeBasesListResponse } from '../models/KnowledgeBasesListResponse';
import type { RAGChunkListResponse } from '../models/RAGChunkListResponse';
import type { RAGDocumentListResponse } from '../models/RAGDocumentListResponse';
import type { RAGDocumentResponse } from '../models/RAGDocumentResponse';
import type { SyncStatusResponse } from '../models/SyncStatusResponse';
import type { UpdateKnowledgeBaseRequest } from '../models/UpdateKnowledgeBaseRequest';
import type { UpdateRAGDocumentRequest } from '../models/UpdateRAGDocumentRequest';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class KnowledgeBasesService {

    /**
     * Create Knowledge Base
     * Create a new knowledge base for a tenant.
     *
     * Requires API key authentication. Automatically syncs to all enabled providers.
     * No need to specify provider or provider_config - system auto-detects enabled tools.
     *
     * **Example Request:**
     * ```json
     * {
         * "name": "support_faq",
         * "description": "Support FAQ knowledge base"
         * }
         * ```
         * @param tenantId
         * @param requestBody
         * @returns KnowledgeBaseResponse Successful Response
         * @throws ApiError
         */
        public static createKnowledgeBaseTenantsTenantIdKnowledgeBasesPost(
            tenantId: string,
            requestBody: CreateKnowledgeBaseRequest,
        ): CancelablePromise<KnowledgeBaseResponse> {
            return __request(OpenAPI, {
                method: 'POST',
                url: '/tenants/{tenant_id}/knowledge-bases',
                path: {
                    'tenant_id': tenantId,
                },
                body: requestBody,
                mediaType: 'application/json',
                errors: {
                    422: `Validation Error`,
                },
            });
        }

        /**
         * List Knowledge Bases
         * List all knowledge bases for a tenant.
         *
         * Requires API key authentication. Supports optional filtering by provider and active status.
         * @param tenantId
         * @param provider Filter by provider
         * @param isActive Filter by active status
         * @returns KnowledgeBasesListResponse Successful Response
         * @throws ApiError
         */
        public static listKnowledgeBasesTenantsTenantIdKnowledgeBasesGet(
            tenantId: string,
            provider?: (string | null),
            isActive?: (boolean | null),
        ): CancelablePromise<KnowledgeBasesListResponse> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/tenants/{tenant_id}/knowledge-bases',
                path: {
                    'tenant_id': tenantId,
                },
                query: {
                    'provider': provider,
                    'is_active': isActive,
                },
                errors: {
                    422: `Validation Error`,
                },
            });
        }

        /**
         * Get Knowledge Base
         * Get knowledge base details by ID.
         *
         * Requires API key authentication. Returns 404 if not found.
         * @param tenantId
         * @param kbId
         * @returns KnowledgeBaseResponse Successful Response
         * @throws ApiError
         */
        public static getKnowledgeBaseTenantsTenantIdKnowledgeBasesKbIdGet(
            tenantId: string,
            kbId: string,
        ): CancelablePromise<KnowledgeBaseResponse> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/tenants/{tenant_id}/knowledge-bases/{kb_id}',
                path: {
                    'tenant_id': tenantId,
                    'kb_id': kbId,
                },
                errors: {
                    422: `Validation Error`,
                },
            });
        }

        /**
         * Update Knowledge Base
         * Update knowledge base configuration.
         *
         * Requires API key authentication. Only provided fields will be updated.
         * @param tenantId
         * @param kbId
         * @param requestBody
         * @returns KnowledgeBaseResponse Successful Response
         * @throws ApiError
         */
        public static updateKnowledgeBaseTenantsTenantIdKnowledgeBasesKbIdPut(
            tenantId: string,
            kbId: string,
            requestBody: UpdateKnowledgeBaseRequest,
        ): CancelablePromise<KnowledgeBaseResponse> {
            return __request(OpenAPI, {
                method: 'PUT',
                url: '/tenants/{tenant_id}/knowledge-bases/{kb_id}',
                path: {
                    'tenant_id': tenantId,
                    'kb_id': kbId,
                },
                body: requestBody,
                mediaType: 'application/json',
                errors: {
                    422: `Validation Error`,
                },
            });
        }

        /**
         * Delete Knowledge Base
         * Delete or deactivate a knowledge base.
         *
         * Requires API key authentication. Permanently deletes the knowledge base.
         * @param tenantId
         * @param kbId
         * @returns any Successful Response
         * @throws ApiError
         */
        public static deleteKnowledgeBaseTenantsTenantIdKnowledgeBasesKbIdDelete(
            tenantId: string,
            kbId: string,
        ): CancelablePromise<any> {
            return __request(OpenAPI, {
                method: 'DELETE',
                url: '/tenants/{tenant_id}/knowledge-bases/{kb_id}',
                path: {
                    'tenant_id': tenantId,
                    'kb_id': kbId,
                },
                errors: {
                    422: `Validation Error`,
                },
            });
        }

        /**
         * Sync Knowledge Base
         * Manually sync all documents in a knowledge base to specified provider(s).
         *
         * Requires API key authentication. Syncs all documents to the specified provider,
         * or all active providers if no provider is specified.
         * @param tenantId
         * @param kbId
         * @param provider Optional provider to sync. If not specified, syncs all providers.
         * @returns SyncStatusResponse Successful Response
         * @throws ApiError
         */
        public static syncKnowledgeBaseTenantsTenantIdKnowledgeBasesKbIdSyncPost(
            tenantId: string,
            kbId: string,
            provider?: (string | null),
        ): CancelablePromise<SyncStatusResponse> {
            return __request(OpenAPI, {
                method: 'POST',
                url: '/tenants/{tenant_id}/knowledge-bases/{kb_id}/sync',
                path: {
                    'tenant_id': tenantId,
                    'kb_id': kbId,
                },
                query: {
                    'provider': provider,
                },
                errors: {
                    422: `Validation Error`,
                },
            });
        }

        /**
         * Get Sync Status
         * Get sync status for all providers in a knowledge base.
         *
         * Requires API key authentication. Returns sync status per provider.
         * @param tenantId
         * @param kbId
         * @returns any Successful Response
         * @throws ApiError
         */
        public static getSyncStatusTenantsTenantIdKnowledgeBasesKbIdSyncStatusGet(
            tenantId: string,
            kbId: string,
        ): CancelablePromise<any> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/tenants/{tenant_id}/knowledge-bases/{kb_id}/sync-status',
                path: {
                    'tenant_id': tenantId,
                    'kb_id': kbId,
                },
                errors: {
                    422: `Validation Error`,
                },
            });
        }

        /**
         * Disable Provider
         * Disable a provider for a knowledge base and optionally cleanup data.
         *
         * Requires API key authentication. Soft disables the provider (keeps data unless delete_data=true).
         * @param tenantId
         * @param kbId
         * @param provider
         * @param deleteData If true, delete data from provider store
         * @returns any Successful Response
         * @throws ApiError
         */
        public static disableProviderTenantsTenantIdKnowledgeBasesKbIdProvidersProviderDelete(
            tenantId: string,
            kbId: string,
            provider: string,
            deleteData: boolean = false,
        ): CancelablePromise<any> {
            return __request(OpenAPI, {
                method: 'DELETE',
                url: '/tenants/{tenant_id}/knowledge-bases/{kb_id}/providers/{provider}',
                path: {
                    'tenant_id': tenantId,
                    'kb_id': kbId,
                    'provider': provider,
                },
                query: {
                    'delete_data': deleteData,
                },
                errors: {
                    422: `Validation Error`,
                },
            });
        }

        /**
         * List Rag Documents
         * List RAG documents for a tenant.
         *
         * Requires API key authentication. Returns all RAG documents for the tenant,
         * optionally filtered by knowledge base name.
         * @param tenantId
         * @param kbName Filter by knowledge base name
         * @param limit Maximum number of results
         * @param offset Offset for pagination
         * @returns RAGDocumentListResponse Successful Response
         * @throws ApiError
         */
        public static listRagDocumentsTenantsTenantIdRagDocumentsGet(
            tenantId: string,
            kbName?: (string | null),
            limit: number = 100,
            offset?: number,
        ): CancelablePromise<RAGDocumentListResponse> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/tenants/{tenant_id}/rag/documents',
                path: {
                    'tenant_id': tenantId,
                },
                query: {
                    'kb_name': kbName,
                    'limit': limit,
                    'offset': offset,
                },
                errors: {
                    422: `Validation Error`,
                },
            });
        }

        /**
         * Create Rag Document
         * Create a new RAG document with automatic chunking and embedding.
         *
         * Requires API key authentication. Creates a document, splits it into chunks,
         * generates embeddings for each chunk, and stores them in the database.
         *
         * **Example Request:**
         * ```json
         * {
             * "kb_name": "support_faq",
             * "title": "FAQ: Getting Started",
             * "content": "This is a long document that will be chunked...",
             * "metadata": {"source": "website"},
             * "chunk_size": 1000,
             * "chunk_overlap": 200
             * }
             * ```
             * @param tenantId
             * @param requestBody
             * @returns RAGDocumentResponse Successful Response
             * @throws ApiError
             */
            public static createRagDocumentTenantsTenantIdRagDocumentsPost(
                tenantId: string,
                requestBody: CreateRAGDocumentRequest,
            ): CancelablePromise<RAGDocumentResponse> {
                return __request(OpenAPI, {
                    method: 'POST',
                    url: '/tenants/{tenant_id}/rag/documents',
                    path: {
                        'tenant_id': tenantId,
                    },
                    body: requestBody,
                    mediaType: 'application/json',
                    errors: {
                        422: `Validation Error`,
                    },
                });
            }

            /**
             * Get Rag Document
             * Get RAG document details by ID.
             *
             * Requires API key authentication. Returns 404 if not found.
             * @param tenantId
             * @param docId
             * @returns RAGDocumentResponse Successful Response
             * @throws ApiError
             */
            public static getRagDocumentTenantsTenantIdRagDocumentsDocIdGet(
                tenantId: string,
                docId: string,
            ): CancelablePromise<RAGDocumentResponse> {
                return __request(OpenAPI, {
                    method: 'GET',
                    url: '/tenants/{tenant_id}/rag/documents/{doc_id}',
                    path: {
                        'tenant_id': tenantId,
                        'doc_id': docId,
                    },
                    errors: {
                        422: `Validation Error`,
                    },
                });
            }

            /**
             * Update Rag Document
             * Update RAG document.
             *
             * Requires API key authentication. Only provided fields will be updated.
             * Note: Updating content does NOT automatically reindex chunks. Use /reindex endpoint for that.
             * @param tenantId
             * @param docId
             * @param requestBody
             * @returns RAGDocumentResponse Successful Response
             * @throws ApiError
             */
            public static updateRagDocumentTenantsTenantIdRagDocumentsDocIdPut(
                tenantId: string,
                docId: string,
                requestBody: UpdateRAGDocumentRequest,
            ): CancelablePromise<RAGDocumentResponse> {
                return __request(OpenAPI, {
                    method: 'PUT',
                    url: '/tenants/{tenant_id}/rag/documents/{doc_id}',
                    path: {
                        'tenant_id': tenantId,
                        'doc_id': docId,
                    },
                    body: requestBody,
                    mediaType: 'application/json',
                    errors: {
                        422: `Validation Error`,
                    },
                });
            }

            /**
             * Delete Rag Document
             * Delete a RAG document and all its chunks.
             *
             * Requires API key authentication. Permanently deletes the document and all associated chunks.
             * @param tenantId
             * @param docId
             * @returns any Successful Response
             * @throws ApiError
             */
            public static deleteRagDocumentTenantsTenantIdRagDocumentsDocIdDelete(
                tenantId: string,
                docId: string,
            ): CancelablePromise<any> {
                return __request(OpenAPI, {
                    method: 'DELETE',
                    url: '/tenants/{tenant_id}/rag/documents/{doc_id}',
                    path: {
                        'tenant_id': tenantId,
                        'doc_id': docId,
                    },
                    errors: {
                        422: `Validation Error`,
                    },
                });
            }

            /**
             * Reindex Rag Document
             * Reindex a RAG document (rechunk and regenerate embeddings).
             *
             * Requires API key authentication. Deletes existing chunks and recreates them
             * with new chunking parameters and fresh embeddings.
             *
             * Useful when:
             * - Document content was updated
             * - Chunking parameters need to change
             * - Embeddings need to be regenerated
             * @param tenantId
             * @param docId
             * @param chunkSize Character count per chunk
             * @param chunkOverlap Character overlap between chunks
             * @returns any Successful Response
             * @throws ApiError
             */
            public static reindexRagDocumentTenantsTenantIdRagDocumentsDocIdReindexPost(
                tenantId: string,
                docId: string,
                chunkSize: number = 1000,
                chunkOverlap: number = 200,
            ): CancelablePromise<any> {
                return __request(OpenAPI, {
                    method: 'POST',
                    url: '/tenants/{tenant_id}/rag/documents/{doc_id}/reindex',
                    path: {
                        'tenant_id': tenantId,
                        'doc_id': docId,
                    },
                    query: {
                        'chunk_size': chunkSize,
                        'chunk_overlap': chunkOverlap,
                    },
                    errors: {
                        422: `Validation Error`,
                    },
                });
            }

            /**
             * List Rag Document Chunks
             * List all chunks for a RAG document.
             *
             * Requires API key authentication. Returns all chunks associated with the document,
             * ordered by chunk_index.
             * @param tenantId
             * @param docId
             * @param limit Maximum number of results
             * @param offset Offset for pagination
             * @returns RAGChunkListResponse Successful Response
             * @throws ApiError
             */
            public static listRagDocumentChunksTenantsTenantIdRagDocumentsDocIdChunksGet(
                tenantId: string,
                docId: string,
                limit: number = 100,
                offset?: number,
            ): CancelablePromise<RAGChunkListResponse> {
                return __request(OpenAPI, {
                    method: 'GET',
                    url: '/tenants/{tenant_id}/rag/documents/{doc_id}/chunks',
                    path: {
                        'tenant_id': tenantId,
                        'doc_id': docId,
                    },
                    query: {
                        'limit': limit,
                        'offset': offset,
                    },
                    errors: {
                        422: `Validation Error`,
                    },
                });
            }

        }
