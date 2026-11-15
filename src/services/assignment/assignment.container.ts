import { getApiService } from '@/services/api/api.container';
import { AssignmentRepository } from './assignment.repository';
import { AssignmentService } from './assignment.service';

const assignmentRepository: AssignmentRepository = new AssignmentRepository(getApiService());
const assignmentService: AssignmentService = new AssignmentService(assignmentRepository);

export const getAssignmentService = (): AssignmentService => assignmentService;
