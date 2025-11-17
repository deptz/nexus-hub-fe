/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CostBreakdownResponse } from '../models/CostBreakdownResponse';
import type { CostByConversationResponse } from '../models/CostByConversationResponse';
import type { CostByPeriodResponse } from '../models/CostByPeriodResponse';
import type { CostEstimateRequest } from '../models/CostEstimateRequest';
import type { CostEstimateResponse } from '../models/CostEstimateResponse';
import type { CostSummaryResponse } from '../models/CostSummaryResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class CostsService {

    /**
     * Get Cost Summary
     * Get cost summary for a tenant. Alias for /analytics/costs.
     * @param tenantId
     * @param startDate Start date (ISO8601 timestamp)
     * @param endDate End date (ISO8601 timestamp)
     * @returns CostSummaryResponse Successful Response
     * @throws ApiError
     */
    public static getCostSummaryTenantsTenantIdCostsGet(
        tenantId: string,
        startDate?: (string | null),
        endDate?: (string | null),
    ): CancelablePromise<CostSummaryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/tenants/{tenant_id}/costs',
            path: {
                'tenant_id': tenantId,
            },
            query: {
                'start_date': startDate,
                'end_date': endDate,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get Cost Breakdown
     * Get detailed cost breakdown for a tenant.
     * @param tenantId
     * @param startDate Start date (ISO8601 timestamp)
     * @param endDate End date (ISO8601 timestamp)
     * @returns CostBreakdownResponse Successful Response
     * @throws ApiError
     */
    public static getCostBreakdownTenantsTenantIdCostsBreakdownGet(
        tenantId: string,
        startDate?: (string | null),
        endDate?: (string | null),
    ): CancelablePromise<CostBreakdownResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/tenants/{tenant_id}/costs/breakdown',
            path: {
                'tenant_id': tenantId,
            },
            query: {
                'start_date': startDate,
                'end_date': endDate,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get Costs By Period
     * Get costs grouped by time period.
     * @param tenantId
     * @param periodType Period type: 'daily', 'weekly', 'monthly'
     * @param startDate Start date (ISO8601 date)
     * @param endDate End date (ISO8601 date)
     * @returns CostByPeriodResponse Successful Response
     * @throws ApiError
     */
    public static getCostsByPeriodTenantsTenantIdCostsByPeriodGet(
        tenantId: string,
        periodType: string = 'daily',
        startDate?: (string | null),
        endDate?: (string | null),
    ): CancelablePromise<CostByPeriodResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/tenants/{tenant_id}/costs/by-period',
            path: {
                'tenant_id': tenantId,
            },
            query: {
                'period_type': periodType,
                'start_date': startDate,
                'end_date': endDate,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get Costs By Conversation
     * Get costs per conversation.
     * @param tenantId
     * @param startDate Start date (ISO8601 timestamp)
     * @param endDate End date (ISO8601 timestamp)
     * @param limit Maximum number of results
     * @param offset Offset for pagination
     * @returns CostByConversationResponse Successful Response
     * @throws ApiError
     */
    public static getCostsByConversationTenantsTenantIdCostsByConversationGet(
        tenantId: string,
        startDate?: (string | null),
        endDate?: (string | null),
        limit: number = 100,
        offset?: number,
    ): CancelablePromise<CostByConversationResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/tenants/{tenant_id}/costs/by-conversation',
            path: {
                'tenant_id': tenantId,
            },
            query: {
                'start_date': startDate,
                'end_date': endDate,
                'limit': limit,
                'offset': offset,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Estimate Cost
     * Estimate cost for an LLM API call.
     * @param tenantId
     * @param requestBody
     * @returns CostEstimateResponse Successful Response
     * @throws ApiError
     */
    public static estimateCostTenantsTenantIdCostsEstimatePost(
        tenantId: string,
        requestBody: CostEstimateRequest,
    ): CancelablePromise<CostEstimateResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/tenants/{tenant_id}/costs/estimate',
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

}
