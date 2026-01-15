import { Module } from '@nestjs/common';
import { MailNotificationsService } from './mail-notifications.service';
import { MailNotificationsController } from './mail-notifications.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TCPCONSTANTS } from '@oppn/shared';

@Module({
  imports: [
    ClientsModule.register([
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
  controllers: [MailNotificationsController],
  providers: [MailNotificationsService],
})
// eslint-disable-next-line prettier/prettier
export class MailNotificationsModule { }
