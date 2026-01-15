import {
  Controller,
  Post,
  Req,
  Headers,
  BadRequestException,
  HttpCode,
  Inject,
} from '@nestjs/common';
import type { Request } from 'express';
import { PaymentsService } from './payments.service';
import { ClientProxy } from '@nestjs/microservices';
import {
  PaymentStatus,
  RABBITMQ,
  NotificationPayloadDto,
  NotificationType,
  OrderStatus,
  CheckoutMetadata,
} from '@oppn/shared';
import Stripe from 'stripe';

@Controller('payments')
export class PaymentsWebhookController {
  constructor(
    private readonly paymentService: PaymentsService,
    @Inject(RABBITMQ.servicesNames.notificationService)
    private readonly notificationClient: ClientProxy,
    @Inject(RABBITMQ.servicesNames.orderService)
    private readonly ordersClient: ClientProxy,
    // eslint-disable-next-line prettier/prettier
  ) { }

  @Post('webhook')
  @HttpCode(200)
  async handleWebhook(
    @Req() req: Request,
    @Headers('stripe-signature') signature: string,
  ) {
    const secret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!secret) {
      throw new BadRequestException('STRIPE_WEBHOOK_SECRET no definida');
    }

    let event: Stripe.Event;
    try {
      event = this.paymentService.stripe.webhooks.constructEvent(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        req.body,
        signature,
        secret,
      );
    } catch (err: any) {
      // console.error('❌ Webhook signature error:', err.message);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new BadRequestException(`Webhook Error: ${err?.message}`);
    }

    // console.log(`✅ Webhook received: ${event.type}`);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        await this.handleCheckoutCompleted(session);
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;
        await this.handlePaymentFailed(paymentIntent);
        break;
      }

      case 'checkout.session.expired': {
        const session = event.data.object;
        await this.handleSessionExpired(session);
        break;
      }

      default:
        console.log(`⚠️ Unhandled event type: ${event.type}`);
    }

    return { received: true };
  }

  /**
   * ✅ Pago exitoso - Actualiza Payment Y Order
   */
  private async handleCheckoutCompleted(session: Stripe.Checkout.Session) {
    if (!session.metadata) {
      throw new BadRequestException('Missing checkout metadata');
    }

    const { paymentId, orderId, userId } =
      session.metadata as unknown as CheckoutMetadata;

    // console.log('✅ Checkout completed for payment:', paymentId);

    // 1. Actualizar Payment
    await this.paymentService.updatePaymentStatus(
      paymentId,
      PaymentStatus.SUCCEEDED,
    );

    // 2. Actualizar Order a PAID
    this.ordersClient.emit(RABBITMQ.routingKeys.updateOrderStatus, {
      orderId,
      status: OrderStatus.PAID,
    });

    // 3. Actualizar Payment a SUCCEDED
    await this.paymentService.updatePaymentStatus(
      paymentId,
      PaymentStatus.SUCCEEDED,
    );

    // 4. Notificar al usuario
    const notification: NotificationPayloadDto = {
      type: NotificationType.PAYMENT_SUCCESS,
      userId,
      orderId,
      paymentId,
      message: `Payment successful! Your order #${orderId} is confirmed.`,
    };

    this.notificationClient.emit(
      RABBITMQ.routingKeys.paymentSucceeded,
      notification,
    );
  }

  /**
   * ✅ CORREGIDO: Usa el método público del service
   */
  private async handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
    console.log('❌ Payment failed:', paymentIntent.id);

    // ✅ Usa el método del service
    const payment = await this.paymentService.findByStripePaymentIntentId(
      paymentIntent.id,
    );

    if (payment) {
      await this.paymentService.updatePaymentStatus(
        payment.id,
        PaymentStatus.FAILED,
      );

      // Actualizar Order a CANCELED
      this.ordersClient.emit(RABBITMQ.routingKeys.updateOrderStatus, {
        orderId: payment.orderId,
        status: OrderStatus.CANCELED,
      });

      const notification: NotificationPayloadDto = {
        type: NotificationType.PAYMENT_FAILED,
        userId: payment.userId,
        orderId: payment.orderId,
        message: 'Payment failed. Your order has been canceled.',
      };

      this.notificationClient.emit(RABBITMQ.routingKeys.notify, notification);
    } else {
      console.error(
        '⚠️ Payment not found for paymentIntentId:',
        paymentIntent.id,
      );
    }
  }

  private async handleSessionExpired(session: Stripe.Checkout.Session) {
    if (!session.metadata) {
      throw new BadRequestException('Missing checkout metadata');
    }

    const { paymentId, orderId, userId } =
      session.metadata as unknown as CheckoutMetadata;

    await this.paymentService.updatePaymentStatus(
      paymentId,
      PaymentStatus.CANCELED,
    );

    // Actualizar Order a CANCELED
    this.ordersClient.emit(RABBITMQ.routingKeys.updateOrderStatus, {
      orderId,
      status: OrderStatus.CANCELED,
    });

    const notification: NotificationPayloadDto = {
      type: NotificationType.PAYMENT_EXPIRED,
      userId,
      orderId,
      message: 'Payment session expired. Your order has been canceled.',
    };

    this.notificationClient.emit(RABBITMQ.routingKeys.notify, notification);
  }
}
