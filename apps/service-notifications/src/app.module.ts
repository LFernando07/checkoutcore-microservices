import { Module } from '@nestjs/common';
import { MailNotificationsModule } from './mail-notifications/mail-notifications.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../../.env',
    }),
    MailNotificationsModule,
  ],
})
// eslint-disable-next-line prettier/prettier
export class AppModule { }
