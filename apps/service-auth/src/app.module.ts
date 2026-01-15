import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtModule } from '@nestjs/jwt';
import { TCPCONSTANTS } from '@oppn/shared';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../../.env',
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: Number(process.env.JWT_EXPIRES_IN),
      },
    }),
    ClientsModule.register([
      // Servicio TCP de transporte de ms-users
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
  controllers: [AppController],
  providers: [AppService],
})
// eslint-disable-next-line prettier/prettier
export class AppModule { }
