'use client';

import { handleError, type SuccessDataAny } from '@kk-garden/shared/errors';
import type {
  AssignRootRequest,
  AssignRootResponse,
  GenerateRootResponse,
} from '@kk-garden/shared/schemas';
import type { AssignmentRepository } from './assignment.repository';

export class AssignmentService {
  public constructor(private readonly assignmentRepository: AssignmentRepository) {}

  public generateBatch(
    count: number,
    pendingId: string | null,
  ): Promise<SuccessDataAny<GenerateRootResponse>> {
    return this.assignmentRepository.generateBatch(count, pendingId);
  }

  public async assignSelection(
    request: AssignRootRequest,
  ): Promise<SuccessDataAny<AssignRootResponse>> {
    const result: SuccessDataAny<AssignRootResponse> =
      await this.assignmentRepository.assignSelection(request);

    if (!result.success) {
      return result;
    }
    if (result.data === undefined) {
      return handleError<AssignRootResponse>(
        new Error('Assignment confirmation returned no data.'),
      );
    }
    if (!result.data.success) {
      return handleError<AssignRootResponse>(new Error('The assignment was not confirmed.'));
    }

    return result;
  }
}
