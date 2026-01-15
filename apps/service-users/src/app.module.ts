import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../../.env',
    }),
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
// eslint-disable-next-line prettier/prettier
export class AppModule { }