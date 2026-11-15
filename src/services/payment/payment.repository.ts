'use client';

import { handleError, type SuccessDataAny } from '@kk-garden/shared/errors';
import {
  CreateGardenPaymentRequestSchema,
  CurrentGardenPaymentResponseSchema,
  GardenPaymentResponseSchema,
  type CreateGardenPaymentRequest,
} from '@kk-garden/shared/schemas';
import type { ZodType } from 'zod';
import type { ApiService } from '@/services/api/api.service';
import type { ApiUrlResult } from '@/services/api/api.types';
import type { CurrentPaymentResult, PaymentResult } from './payment.types';

export class PaymentRepository {
  public constructor(private readonly apiService: ApiService) {}

  public getCurrentPayment(): Promise<CurrentPaymentResult> {
    return this.request('/payments/current', 'GET', CurrentGardenPaymentResponseSchema);
  }

  public createPayment(): Promise<PaymentResult> {
    const request: CreateGardenPaymentRequest = {};
    CreateGardenPaymentRequestSchema.parse(request);
    return this.request('/payments', 'POST', GardenPaymentResponseSchema, request);
  }

  public getPayment(paymentId: string): Promise<PaymentResult> {
    return this.request(
      `/payments/${encodeURIComponent(paymentId)}`,
      'GET',
      GardenPaymentResponseSchema,
    );
  }

  public confirmMockPayment(paymentId: string): Promise<PaymentResult> {
    return this.request(
      `/payments/${encodeURIComponent(paymentId)}/mock-confirm`,
      'POST',
      GardenPaymentResponseSchema,
    );
  }

  private async request<Data extends object>(
    path: string,
    method: 'GET' | 'POST',
    schema: ZodType<Data>,
    body?: object,
  ): Promise<SuccessDataAny<Data>> {
    try {
      const urlResult: ApiUrlResult = this.apiService.getUrl(path);

      if (!urlResult.success) {
        throw new Error(urlResult.errors[0]?.message ?? 'Payment URL resolution failed.');
      }

      if (urlResult.data === undefined) {
        throw new Error('Payment URL resolution returned no data.');
      }

      const response: Response = await fetch(urlResult.data, {
        method,
        credentials: 'include',
        cache: 'no-store',
        ...(body === undefined
          ? {}
          : {
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(body),
            }),
      });

      if (!response.ok) {
        throw new Error(`The payment request failed (${response.status}).`);
      }

      const responseBody: unknown = await response.json();
      const data: Data = schema.parse(responseBody);

      return { success: true, data };
    } catch (error: unknown) {
      return handleError<Data>(error);
    }
  }
}
