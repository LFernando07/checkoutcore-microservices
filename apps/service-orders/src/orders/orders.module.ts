import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { DatabaseModule, RABBITMQ } from '@oppn/shared';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    DatabaseModule.forRoot({ serviceName: 'orders' }),
    TypeOrmModule.forFeature([Order]),
    ClientsModule.register([
      // Servicio Proxy de cliente AQMP de RabbitMQ
      {
        name: RABBITMQ.servicesNames.paymentService,
        transport: Transport.RMQ,
        options: {
          // Todo se redirigira a nuestra queue de RabbitMQ payments
          urls: [RABBITMQ.url],
          queue: RABBITMQ.queues.paymentsQueue,
          queueOptions: {
            durable: true,
          },
        },
      },
      // Servicio Proxy de cliente AQMP de RabbitMQ
      {
        name: RABBITMQ.servicesNames.notificationService,
        transport: Transport.RMQ,
        options: {
          // Todo se redirigira a nuestra queue de RabbitMQ notifications
          urls: [RABBITMQ.url],
          queue: RABBITMQ.queues.notificationsQueue,
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
// eslint-disable-next-line prettier/prettier
export class OrdersModule { }
