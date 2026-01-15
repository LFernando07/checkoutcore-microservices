import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from '../../decorators/public.decorator';
import { TCPCONSTANTS, ValidateTokenResult } from '@oppn/shared';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(TCPCONSTANTS.servicesNames.authService)
    private readonly authClient: ClientProxy,
    private reflector: Reflector,
    // eslint-disable-next-line prettier/prettier
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      // 💡 See this condition
      return true;
    }
    const request: Request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Missing Token');
    }

    // Enviar solicitud al auth-client
    const result = await firstValueFrom<ValidateTokenResult>(
      this.authClient.send(TCPCONSTANTS.routingKeys.validateToken, token),
    );

    if (!result.valid) throw new UnauthorizedException('Invalid Token');
    // 💡 We're assigning the payload to the request object here
    // so that we can access it in our route handlers
    request['user'] = result.user;

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
