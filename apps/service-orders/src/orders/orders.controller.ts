import { Controller, Inject } from '@nestjs/common';
import { OrdersService } from './orders.service';
import {
  CreateOrderDto,
  CreatePaymentSessionResponseDto,
  NotificationPayloadDto,
  NotificationType,
  OrderDto,
  OrderStatus,
  RABBITMQ,
} from '@oppn/shared';
import { ClientProxy, MessagePattern, Payload } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    @Inject(RABBITMQ.servicesNames.paymentService)
    private readonly paymentRMQClient: ClientProxy,
    @Inject(RABBITMQ.servicesNames.notificationService)
    private readonly notificationRMQClient: ClientProxy,
    // eslint-disable-next-line prettier/prettier
  ) { }

  // Para rabbit ARMQ
  @MessagePattern(RABBITMQ.routingKeys.orderCreated)
  async handleOrderCreated(@Payload() order: CreateOrderDto) {
    //  procesamiento de order
    // console.log(`[Order Service]: Received new order:`, order);

    try {
      const createdOrder: OrderDto = await this.ordersService.create(order);
      console.log(`[Orders Service] Order created:`, createdOrder);

      this.notificationRMQClient.emit(RABBITMQ.routingKeys.orderCreated, {
        type: 'ORDER_CREATED',
        userId: createdOrder.userId,
        orderId: createdOrder.id,
        total: createdOrder.total,
        message: `Your order #${createdOrder.id} has been created successfully`,
      });

      const paymentSession =
        await firstValueFrom<CreatePaymentSessionResponseDto>(
          this.paymentRMQClient
            .send<CreatePaymentSessionResponseDto>(
              RABBITMQ.routingKeys.processPayment,
              createdOrder,
            )
            .pipe(timeout(5000)), // Timeout de 5 segundos
        );

      // console.log('[Orders Service] Payment session received:', {
      //   paymentId: paymentSession.paymentId,
      //   checkoutUrl: paymentSession.checkoutUrl,
      // });

      return {
        ...createdOrder,
        paymentId: paymentSession.paymentId,
        checkoutUrl: paymentSession.checkoutUrl,
        expiresAt: paymentSession.expiresAt,
      };
    } catch (error) {
      console.error('[Orders Service] Error creating order:', error);

      // Notificar el error
      this.notificationRMQClient.emit(RABBITMQ.routingKeys.notify, {
        type: 'ORDER_FAILED',
        userId: order.userId,
        message: 'Failed to create your order. Please try again.',
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        error: error.message,
      });

      // Re-lanzar el error para que RabbitMQ lo maneje
      throw error;
    }
  }

  @MessagePattern(RABBITMQ.routingKeys.updateOrderStatus)
  async handleUpdateOrderStatus(
    @Payload() payload: { orderId: string; status: OrderStatus },
  ): Promise<OrderDto> {
    // console.log('[Orders Service] Updating order status:', payload);

    try {
      const updatedOrder = await this.ordersService.updateStatus(
        payload.orderId,
        payload.status,
      );

      // console.log('[Orders Service] Order updated:', updatedOrder);

      // ✅ Notificar cuando la orden se marca como PAID
      if (payload.status === OrderStatus.PAID) {
        const notification: NotificationPayloadDto = {
          type: NotificationType.ORDER_PAID,
          userId: updatedOrder.userId,
          orderId: updatedOrder.id,
          total: updatedOrder.total,
          message: `Your order #${updatedOrder.id} has been paid successfully!`,
        };

        // TODO: This notification emit console.log
        this.notificationRMQClient.emit(
          RABBITMQ.routingKeys.notify,
          notification,
        );
      }

      return updatedOrder;
    } catch (error) {
      console.error('[Orders Service] Error updating order:', error);
      throw error;
    }
  }
}
