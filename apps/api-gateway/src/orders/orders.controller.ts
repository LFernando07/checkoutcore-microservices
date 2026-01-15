import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Inject,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateOrderDto, OrderDto, RABBITMQ, UserDto } from '@oppn/shared';
import { AuthGuard } from '../common/guards/auth/auth.guard';
import { ClientProxy } from '@nestjs/microservices';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { catchError, firstValueFrom, timeout } from 'rxjs';

@UseGuards(AuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(
    @Inject(RABBITMQ.servicesNames.orderService)
    private readonly client: ClientProxy,
    // eslint-disable-next-line prettier/prettier
  ) { }
  // Llamada al protocolo amqp para enviar un mensaje de la orden
  // TODO: Definir el DTo de la orden
  @Post()
  async createOrder(
    @CurrentUser() user: UserDto,
    @Body() order: CreateOrderDto,
  ) {
    const orderPayload: CreateOrderDto = {
      userId: user.id,
      total: order.total,
    };

    // console.log('[Gateway] Sending order to Orders Service:', orderPayload);

    try {
      const createdOrder = await firstValueFrom(
        this.client
          .send<OrderDto>(RABBITMQ.routingKeys.orderCreated, orderPayload)
          .pipe(
            timeout(5000), // Timeout de 5 segundos
            catchError((error) => {
              console.error('[Gateway] Error from Orders Service:', error);
              throw new HttpException(
                'Orders service unavailable',
                HttpStatus.SERVICE_UNAVAILABLE,
              );
            }),
          ),
      );

      // console.log('[Gateway] Order created successfully:', createdOrder);
      return createdOrder;
    } catch (error) {
      console.error('[Gateway] Failed to create order:', error);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error.name === 'TimeoutError') {
        throw new HttpException(
          'Order creation timed out',
          HttpStatus.REQUEST_TIMEOUT,
        );
      }

      throw new HttpException(
        'Failed to create order',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
