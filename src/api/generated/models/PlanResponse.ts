/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Plan response model.
 */
export type PlanResponse = {
    /**
     * Unique plan identifier
     */
    plan_id: string;
    /**
     * The goal this plan aims to achieve
     */
    goal: string;
    /**
     * List of plan steps with execution details
     */
    steps: Array<any>;
    /**
     * Estimated number of steps to complete
     */
    estimated_steps: number;
    /**
     * Plan complexity level
     */
    complexity: string;
    /**
     * Current plan status
     */
    status: string;
};

