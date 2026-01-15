import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { DatabaseModule, RABBITMQ, TCPCONSTANTS } from '@oppn/shared';
import { Payment } from './entities/payment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsWebhookController } from './payment.webhook.controller';

@Module({
  imports: [
    DatabaseModule.forRoot({ serviceName: 'payments' }),
    TypeOrmModule.forFeature([Payment]),
    // Proxy de cliente para notificacion
    ClientsModule.register([
      // Servicio TCP de transporte de ms-users
      // TODO: Verificar que se utiliza sino remover
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
      {
        name: RABBITMQ.servicesNames.notificationService,
        transport: Transport.RMQ,
        options: {
          // Todo se redirigira a nuestra Queue de RabbitMQ notifications
          urls: [RABBITMQ.url],
          queue: RABBITMQ.queues.notificationsQueue,
          queueOptions: {
            durable: true,
          },
        },
      },
      {
        name: RABBITMQ.servicesNames.orderService,
        transport: Transport.RMQ,
        options: {
          // Todo se redirigira a nuestra Queue de RabbitMQ orders
          urls: [RABBITMQ.url],
          queue: RABBITMQ.queues.ordersQueue,
          queueOptions: { durable: true },
        },
      },
    ]),
  ],
  controllers: [PaymentsController, PaymentsWebhookController],
  providers: [PaymentsService],
})
// eslint-disable-next-line prettier/prettier
export class PaymentsModule { }
