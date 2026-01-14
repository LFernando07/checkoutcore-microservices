import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModuleOptions } from './database.interfaces';
import { ConfigModule } from '@nestjs/config';

@Module({}) export class DatabaseModule {
  static forRoot(options: DatabaseModuleOptions): DynamicModule {
    const prefix = options.serviceName.toUpperCase();

    return {
      module: DatabaseModule,
      imports: [
        ConfigModule.forRoot({ isGlobal: true, envFilePath: '../../.env', }),
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: Number(process.env[`${prefix}_DB_PORT`]),
          username: process.env[`${prefix}_DB_USER`] || 'postgres',
          password: process.env[`${prefix}_DB_PASSWORD`],
          database: process.env[`${prefix}_DB_NAME`],
          autoLoadEntities: true,
          synchronize: process.env.NODE_ENV === 'development', // ⚠️ Solo en dev
          //logging: process.env.NODE_ENV === 'development', // Muestra loggers
        }),
      ],
    };
  }
}