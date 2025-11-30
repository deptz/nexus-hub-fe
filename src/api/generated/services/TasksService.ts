/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateTaskRequest } from '../models/CreateTaskRequest';
import type { TaskResponse } from '../models/TaskResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class TasksService {

    /**
     * Create New Task
     * Create a new agentic task.
     *
     * Tasks are used for long-running operations that may need to be resumed
     * after interruptions.
     * @param requestBody
     * @returns TaskResponse Successful Response
     * @throws ApiError
     */
    public static createNewTaskTasksPost(
        requestBody: CreateTaskRequest,
    ): CancelablePromise<TaskResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/tasks',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * List Tenant Tasks
     * List tasks for the tenant.
     *
     * Returns a paginated list of tasks, optionally filtered by status.
     * @param status Filter by status
     * @param limit Maximum number of tasks to return
     * @param offset Offset for pagination
     * @returns TaskResponse Successful Response
     * @throws ApiError
     */
    public static listTenantTasksTasksGet(
        status?: (string | null),
        limit: number = 50,
        offset?: number,
    ): CancelablePromise<Array<TaskResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/tasks',
            query: {
                'status': status,
                'limit': limit,
                'offset': offset,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get Task Status
     * Get task status and state.
     *
     * Returns the current state of a task including its progress and intermediate data.
     * @param taskId
     * @returns TaskResponse Successful Response
     * @throws ApiError
     */
    public static getTaskStatusTasksTaskIdGet(
        taskId: string,
    ): CancelablePromise<TaskResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/tasks/{task_id}',
            path: {
                'task_id': taskId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Resume Interrupted Task
     * Resume an interrupted task.
     *
     * Resumes a task that was paused or failed, continuing from the last successful step.
     * @param taskId
     * @returns TaskResponse Successful Response
     * @throws ApiError
     */
    public static resumeInterruptedTaskTasksTaskIdResumePost(
        taskId: string,
    ): CancelablePromise<TaskResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/tasks/{task_id}/resume',
            path: {
                'task_id': taskId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Cancel Running Task
     * Cancel a running task.
     *
     * Marks a task as failed and stops further execution.
     * @param taskId
     * @returns void
     * @throws ApiError
     */
    public static cancelRunningTaskTasksTaskIdCancelPost(
        taskId: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/tasks/{task_id}/cancel',
            path: {
                'task_id': taskId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

}
