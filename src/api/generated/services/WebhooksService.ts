/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TelegramWebhookResponse } from '../models/TelegramWebhookResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class WebhooksService {

    /**
     * Handle Telegram Webhook
     * Handle Telegram webhook updates.
     * @param requestBody
     * @param tenantId Tenant ID (or set TELEGRAM_DEFAULT_TENANT_ID env var)
     * @returns TelegramWebhookResponse Successful Response
     * @throws ApiError
     */
    public static handleTelegramWebhookWebhooksTelegramPost(
        requestBody: Record<string, any>,
        tenantId?: (string | null),
    ): CancelablePromise<TelegramWebhookResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webhooks/telegram',
            query: {
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
