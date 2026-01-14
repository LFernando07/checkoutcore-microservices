export class CreatePaymentSessionResponseDto {
  paymentId: string;
  checkoutUrl: string;
  expiresAt: number; // Unix timestamp
}