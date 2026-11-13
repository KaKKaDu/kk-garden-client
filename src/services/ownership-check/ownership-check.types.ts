import type { SuccessDataAny } from '@kk-garden/shared/errors';
import type { VerifyRootRequest, VerifyRootResponse } from '@kk-garden/shared/schemas';

export type OwnershipCheckRequest = VerifyRootRequest;
export type OwnershipCheckResult = SuccessDataAny<VerifyRootResponse>;
export type OwnershipCheckData = VerifyRootResponse['data'];
