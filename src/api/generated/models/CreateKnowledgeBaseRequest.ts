/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Request model for creating a knowledge base.
 */
export type CreateKnowledgeBaseRequest = {
    /**
     * Knowledge base name (unique per tenant)
     */
    name: string;
    /**
     * Knowledge base description
     */
    description?: (string | null);
    /**
     * Optional list of providers to enable. Defaults to all enabled tools.
     */
    providers?: (Array<string> | null);
};

