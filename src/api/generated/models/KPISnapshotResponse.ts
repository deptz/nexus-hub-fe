/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Response model for KPI snapshot.
 */
export type KPISnapshotResponse = {
    tenant_id: string;
    period_type: string;
    period_start: string;
    period_end: string;
    metric_name: string;
    metric_value: number;
    created_at: string;
};

