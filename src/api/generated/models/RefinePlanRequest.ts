/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Request to refine a plan based on execution results.
 */
export type RefinePlanRequest = {
    /**
     * Results from executed steps
     */
    execution_results: Array<any>;
    /**
     * Current step number being executed
     */
    current_step: number;
};

