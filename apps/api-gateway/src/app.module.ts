import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RABBITMQ, TCPCONSTANTS } from '@oppn/shared';
import { AuthController } from './auth/auth.controller';
import { UserController } from './users/users.controller';
import { OrdersController } from './orders/orders.controller';
import { PaymentsController } from './payments/payments.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        // Servicio de AMQT de rabbit
        name: RABBITMQ.servicesNames.orderService,
        transport: Transport.RMQ,
        options: {
          // Todo se redirigira a nuestro contenedor de RabbitMQ
          urls: [RABBITMQ.url],
          queue: RABBITMQ.queues.ordersQueue,
          queueOptions: {
            durable: true,
          },
        },
      },
      {
        // Servicio de AMQT de rabbit
        name: RABBITMQ.servicesNames.paymentService,
        transport: Transport.RMQ,
        options: {
          // Todo se redirigira a nuestro contenedor de RabbitMQ
          urls: [RABBITMQ.url],
          queue: RABBITMQ.queues.paymentsQueue,
          queueOptions: {
            durable: true,
          },
        },
      },
      // Servicio TCP de transporte de microservicios -auth
      {
        name: TCPCONSTANTS.servicesNames.authService,
        transport: Transport.TCP,
        options: {
          host: '127.0.0.1',
          port: 8877,
          retryAttempts: 3,
          retryDelay: 3000,
          lazyConnect: true,
        },
      },
      // Servicio TCP de transporte de microservicios -users
      {
        name: TCPCONSTANTS.servicesNames.userService,
        transport: Transport.TCP,
        options: {
          host: '127.0.0.1',
          port: 8878,
          retryAttempts: 3,
          retryDelay: 3000,
          lazyConnect: true,
        },
      },
    ]),
  ],
  controllers: [
    AppController,
    AuthController,
    UserController,
    OrdersController,
    PaymentsController,
  ],
  providers: [AppService],
})
// eslint-disable-next-line prettier/prettier
export class AppModule { }
