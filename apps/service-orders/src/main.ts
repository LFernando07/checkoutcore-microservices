import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';
import { RABBITMQ } from '@oppn/shared';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        // Todo se redirigira a nuestra Queue de RabbitMQ orders
        urls: [RABBITMQ.url],
        queue: RABBITMQ.queues.ordersQueue,
        queueOptions: {
          durable: true,
        },
      },
    },
  );
  await app.listen();
  Logger.log(`Aplication is running on RabbitMQ`);
}
void bootstrap();
