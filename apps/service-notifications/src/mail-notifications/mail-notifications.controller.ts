import { Controller } from '@nestjs/common';
import { MailNotificationsService } from './mail-notifications.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  EmailTemplates,
  type NotificationPayloadDto,
  RABBITMQ,
} from '@oppn/shared';

@Controller('mail-notifications')
export class MailNotificationsController {
  constructor(
    private readonly mailNotificationsService: MailNotificationsService,
    // eslint-disable-next-line prettier/prettier
  ) { }

  @MessagePattern(RABBITMQ.routingKeys.orderCreated)
  async sendOrderCreatedEmail(@Payload() notification: NotificationPayloadDto) {
    // console.log('[Notification Service] Sending order created', notification);
    // Creacion del template para el correo
    const htmlEmailContent = EmailTemplates.orderCreated(notification);

    await this.mailNotificationsService.sendEmail(
      notification,
      'Order Created Successfully',
      htmlEmailContent,
    );
  }

  @MessagePattern(RABBITMQ.routingKeys.paymentFailed)
  sendPaymentFailureEmail(@Payload() notification: NotificationPayloadDto) {
    console.log(
      '[Notification Service] Sending payment failure email',
      notification,
    );
  }

  @MessagePattern(RABBITMQ.routingKeys.processOrderPayment)
  sendProcessPaymentEmail(@Payload() notification: NotificationPayloadDto) {
    console.log(
      '[Notification Service] Sending process payment email',
      notification,
    );
  }

  @MessagePattern(RABBITMQ.routingKeys.paymentSucceeded)
  async sendPaymentSuccessEmail(
    @Payload() notification: NotificationPayloadDto,
  ) {
    // console.log(
    //   '[Notification Service] Sending payment success email',
    //   notification,
    // );
    const htmlEmailContent = EmailTemplates.paymentSuccess(notification);

    await this.mailNotificationsService.sendEmail(
      notification,
      'Payment Successful',
      htmlEmailContent,
    );
  }

  // Metodo general para notificaciones
  // TODO: Add using personalized
  @MessagePattern(RABBITMQ.routingKeys.notify)
  sendNotification(@Payload() notification: NotificationPayloadDto) {
    console.log(
      '[Notification Service] Sending general notification:',
      notification,
    );
  }
}
