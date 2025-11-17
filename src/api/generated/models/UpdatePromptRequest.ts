/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Request model for tenant prompt update.
 */
export type UpdatePromptRequest = {
    /**
     * Custom system prompt text
     */
    custom_system_prompt: string;
    /**
     * Override mode: 'append' or 'replace_behavior'
     */
    override_mode?: string;
};

