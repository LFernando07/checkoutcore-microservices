import { NotificationType } from "./notificaciones-status.enun";

export interface NotificationPayloadDto {
  type: NotificationType;
  userId: string;
  message: string;

  // Campos opcionales
  orderId?: string;
  paymentId?: string;
  checkoutUrl?: string;
  total?: number;
  error?: string;
  metadata?: Record<string, any>;
}