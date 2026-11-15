import { getApiService } from '@/services/api/api.container';
import { PaymentRepository } from './payment.repository';
import { PaymentService } from './payment.service';

const paymentRepository: PaymentRepository = new PaymentRepository(getApiService());
const paymentService: PaymentService = new PaymentService(paymentRepository);

export const getPaymentService = (): PaymentService => paymentService;
