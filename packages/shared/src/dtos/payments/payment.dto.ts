import { PaymentStatus } from './payment-status.enum';

export class PaymentDto {
  id: string;
  orderId: string;
  userId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  stripeSessionId?: string;
  stripePaymentIntentId?: string;
  createdAt: Date;
  updatedAt: Date;
}