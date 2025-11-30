/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Request to create a new agentic task.
 */
export type CreateTaskRequest = {
    /**
     * Task goal or objective
     */
    goal: string;
    /**
     * Optional plan ID this task is associated with
     */
    plan_id?: (string | null);
    /**
     * Optional conversation ID this task belongs to
     */
    conversation_id?: (string | null);
};

