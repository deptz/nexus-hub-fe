/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ConversationAnalyticsResponse } from '../models/ConversationAnalyticsResponse';
import type { CostSummaryResponse } from '../models/CostSummaryResponse';
import type { KPISnapshotsListResponse } from '../models/KPISnapshotsListResponse';
import type { UsageStatisticsResponse } from '../models/UsageStatisticsResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class AnalyticsService {

    /**
     * Get Conversation Analytics
     * Get conversation analytics for a tenant.
     * @param tenantId
     * @param startDate Start date (ISO8601 timestamp)
     * @param endDate End date (ISO8601 timestamp)
     * @returns ConversationAnalyticsResponse Successful Response
     * @throws ApiError
     */
    public static getConversationAnalyticsTenantsTenantIdAnalyticsConversationsGet(
        tenantId: string,
        startDate?: (string | null),
        endDate?: (string | null),
    ): CancelablePromise<ConversationAnalyticsResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/tenants/{tenant_id}/analytics/conversations',
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
     * Get Cost Analytics
     * Get cost analytics summary for a tenant.
     * @param tenantId
     * @param startDate Start date (ISO8601 timestamp)
     * @param endDate End date (ISO8601 timestamp)
     * @returns CostSummaryResponse Successful Response
     * @throws ApiError
     */
    public static getCostAnalyticsTenantsTenantIdAnalyticsCostsGet(
        tenantId: string,
        startDate?: (string | null),
        endDate?: (string | null),
    ): CancelablePromise<CostSummaryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/tenants/{tenant_id}/analytics/costs',
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
     * List Kpi Snapshots
     * List KPI snapshots for a tenant.
     * @param tenantId
     * @param periodType Filter by period type: 'daily', 'weekly', 'monthly'
     * @param startDate Start date (ISO8601 date)
     * @param endDate End date (ISO8601 date)
     * @param limit Maximum number of results
     * @param offset Offset for pagination
     * @returns KPISnapshotsListResponse Successful Response
     * @throws ApiError
     */
    public static listKpiSnapshotsTenantsTenantIdAnalyticsKpisGet(
        tenantId: string,
        periodType?: (string | null),
        startDate?: (string | null),
        endDate?: (string | null),
        limit: number = 100,
        offset?: number,
    ): CancelablePromise<KPISnapshotsListResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/tenants/{tenant_id}/analytics/kpis',
            path: {
                'tenant_id': tenantId,
            },
            query: {
                'period_type': periodType,
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
     * Get Kpis By Period
     * Get KPI snapshots for a specific period.
     * @param tenantId
     * @param periodType
     * @param periodStart Period start date (ISO8601 date)
     * @returns KPISnapshotsListResponse Successful Response
     * @throws ApiError
     */
    public static getKpisByPeriodTenantsTenantIdAnalyticsKpisPeriodTypeGet(
        tenantId: string,
        periodType: string,
        periodStart?: (string | null),
    ): CancelablePromise<KPISnapshotsListResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/tenants/{tenant_id}/analytics/kpis/{period_type}',
            path: {
                'tenant_id': tenantId,
                'period_type': periodType,
            },
            query: {
                'period_start': periodStart,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Compute Kpis
     * Trigger KPI computation for a tenant.
     * @param tenantId
     * @param periodType Period type: 'daily', 'weekly', 'monthly'
     * @param periodStart Period start date (ISO8601 date)
     * @returns any Successful Response
     * @throws ApiError
     */
    public static computeKpisTenantsTenantIdAnalyticsKpisComputePost(
        tenantId: string,
        periodType: string = 'daily',
        periodStart?: (string | null),
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/tenants/{tenant_id}/analytics/kpis/compute',
            path: {
                'tenant_id': tenantId,
            },
            query: {
                'period_type': periodType,
                'period_start': periodStart,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get Usage Statistics
     * Get usage statistics for a tenant.
     * @param tenantId
     * @param startDate Start date (ISO8601 timestamp)
     * @param endDate End date (ISO8601 timestamp)
     * @returns UsageStatisticsResponse Successful Response
     * @throws ApiError
     */
    public static getUsageStatisticsTenantsTenantIdAnalyticsUsageGet(
        tenantId: string,
        startDate?: (string | null),
        endDate?: (string | null),
    ): CancelablePromise<UsageStatisticsResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/tenants/{tenant_id}/analytics/usage',
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

}
