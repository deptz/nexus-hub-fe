/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PlanResponse } from '../models/PlanResponse';
import type { RefinePlanRequest } from '../models/RefinePlanRequest';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class PlansService {

    /**
     * Get Plan Details
     * Get plan details.
     *
     * Returns the plan structure, steps, and current status.
     * @param planId
     * @returns PlanResponse Successful Response
     * @throws ApiError
     */
    public static getPlanDetailsPlansPlanIdGet(
        planId: string,
    ): CancelablePromise<PlanResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/plans/{plan_id}',
            path: {
                'plan_id': planId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Refine Plan Endpoint
     * Refine a plan based on intermediate execution results.
     *
     * Updates the plan based on what has been executed so far,
     * allowing for dynamic plan adjustment.
     * @param planId
     * @param requestBody
     * @returns PlanResponse Successful Response
     * @throws ApiError
     */
    public static refinePlanEndpointPlansPlanIdRefinePost(
        planId: string,
        requestBody: RefinePlanRequest,
    ): CancelablePromise<PlanResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/plans/{plan_id}/refine',
            path: {
                'plan_id': planId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

}
