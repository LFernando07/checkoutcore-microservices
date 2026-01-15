import { Controller, Inject } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import {
  OrderDto,
  RABBITMQ,
  CreatePaymentSessionResponseDto,
  NotificationPayloadDto,
  NotificationType,
} from '@oppn/shared';
import { ClientProxy, MessagePattern, Payload } from '@nestjs/microservices';

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    @Inject(RABBITMQ.servicesNames.notificationService)
    private readonly notificationClient: ClientProxy,
    // eslint-disable-next-line prettier/prettier
  ) { }

  @MessagePattern(RABBITMQ.routingKeys.processPayment)
  async handleProcessPayment(
    @Payload() order: OrderDto,
  ): Promise<CreatePaymentSessionResponseDto> {
    // console.log('[Payments Service] Processing payment for order:', order.id);

    try {
      // Crear sesión de pago en Stripe
      const paymentSession =
        await this.paymentsService.createPaymentSession(order);

      // console.log(
      //   '[Payments Service] Payment session created:',
      //   paymentSession.paymentId,
      // );

      // ✅ Notificar al usuario que debe completar el pago
      const notification: NotificationPayloadDto = {
        type: NotificationType.PAYMENT_INITIATED,
        userId: order.userId,
        orderId: order.id,
        paymentId: paymentSession.paymentId,
        total: order.total,
        checkoutUrl: paymentSession.checkoutUrl,
        message: `Your order #${order.id} has been created. Please complete your payment.`,
      };

      this.notificationClient.emit(
        RABBITMQ.routingKeys.processOrderPayment,
        notification,
      );

      return paymentSession;
    } catch (error) {
      console.error('[Payments Service] Error processing payment:', error);

      // Notificar error
      const notification: NotificationPayloadDto = {
        type: NotificationType.PAYMENT_FAILED,
        userId: order.userId,
        orderId: order.id,
        message: 'Payment processing failed. Please try again.',
        error: (error as Error).message,
      };

      this.notificationClient.emit(RABBITMQ.routingKeys.notify, notification);

      throw error;
    }
  }

  @MessagePattern(RABBITMQ.routingKeys.checkSession)
  async checkSession(@Payload() id: string) {
    const session = await this.paymentsService.retrieveSession(id);
    return session;
  }
}
