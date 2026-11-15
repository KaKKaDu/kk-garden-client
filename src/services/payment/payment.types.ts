import type { SuccessDataAny } from '@kk-garden/shared/errors';
import type {
  CurrentGardenPaymentResponse,
  GardenPaymentResponse,
} from '@kk-garden/shared/schemas';

export type CurrentPaymentResult = SuccessDataAny<CurrentGardenPaymentResponse>;
export type PaymentResult = SuccessDataAny<GardenPaymentResponse>;
