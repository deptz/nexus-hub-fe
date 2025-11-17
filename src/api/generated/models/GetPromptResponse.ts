/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Response model for getting tenant prompt.
 */
export type GetPromptResponse = {
    custom_system_prompt: string;
    override_mode: string;
    created_at: string;
    updated_at: string;
    validation_status?: (string | null);
    effective_prompt?: (string | null);
};

