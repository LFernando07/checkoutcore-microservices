import { Module } from '@nestjs/common';
import { OrdersModule } from './orders/orders.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    // Configuracion de variables de entorno
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../../.env',
    }),
    OrdersModule,
  ],
  controllers: [],
  providers: [],
})
// eslint-disable-next-line prettier/prettier
export class AppModule { }
