import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { RABBITMQ } from '@oppn/shared';
import * as express from 'express';

async function bootstrap() {
  // Apliacacion hibrida de pagos Service/Microservice (conexion)
  const app = await NestFactory.create(AppModule);

  // Configuracion de raw body : SOLO PARA STRIPE WEBHOOK
  app.use('/payments/webhook', express.raw({ type: 'application/json' }));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // Configuracion de microservicio
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      // Todo se redirigira a nuestra Queue de RabbitMQ payments
      urls: [RABBITMQ.url],
      queue: RABBITMQ.queues.paymentsQueue,
      queueOptions: { durable: true },
    },
  });

  // Al ser hibrida se inicializan aparte los microservicios
  await app.startAllMicroservices();

  await app.listen(process.env.PAYMENTS_PORT || 3002);
}

void bootstrap();
