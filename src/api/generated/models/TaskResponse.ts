/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Task response model with current state and progress.
 */
export type TaskResponse = {
    /**
     * Unique task identifier
     */
    task_id: string;
    /**
     * Task goal
     */
    goal: string;
    /**
     * Associated plan ID
     */
    plan_id?: (string | null);
    /**
     * Associated conversation ID
     */
    conversation_id?: (string | null);
    /**
     * Task status: planning, executing, completed, failed, cancelled
     */
    status: string;
    /**
     * Current step number (0-indexed)
     */
    current_step: number;
    /**
     * Task state including step results and intermediate data
     */
    state: Record<string, any>;
    /**
     * Task creation timestamp
     */
    created_at?: (string | null);
    /**
     * Last update timestamp
     */
    updated_at?: (string | null);
    /**
     * Task completion timestamp (null if not completed)
     */
    completed_at?: (string | null);
};

