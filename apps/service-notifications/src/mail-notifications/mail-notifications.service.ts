import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import {
  ErrorCode,
  NotificationPayloadDto,
  RpcErrorPayload,
  TCPCONSTANTS,
  UserDto,
} from '@oppn/shared';
import { Resend } from 'resend';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class MailNotificationsService {
  private resend: Resend;
  constructor(
    @Inject(TCPCONSTANTS.servicesNames.userService)
    private readonly usersClient: ClientProxy,
  ) {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async sendEmail(
    notification: NotificationPayloadDto,
    subject: string,
    html: string,
  ) {
    let userExists: UserDto;
    try {
      userExists = await firstValueFrom(
        this.usersClient.send<UserDto>(
          TCPCONSTANTS.routingKeys.userProfileId,
          notification.userId,
        ),
      );
    } catch (error: any) {
      // Transformacion de error cualquiera a nuestro interfaz de RPC
      const errorException = error as unknown as RpcErrorPayload;

      if (errorException?.code && errorException?.statusCode) {
        throw new RpcException(errorException);
      }

      throw new RpcException({
        code: ErrorCode.SERVICE_UNAVAILABLE,
        statusCode: 503,
        message: 'User service unavailable',
      });
    }

    if (!userExists) {
      throw new NotAcceptableException('User not exists');
    }

    try {
      const { data, error } = await this.resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL as string,
        to: userExists.email,
        subject,
        html,
      });
      if (error) {
        throw new Error(error.message);
      }

      return {
        message: 'Email enviado',
        id: data.id,
      };
    } catch {
      throw new InternalServerErrorException('Error enviando email');
    }
  }
}
