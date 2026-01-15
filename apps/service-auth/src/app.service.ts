import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import {
  compareWithHashString,
  ErrorCode,
  JwtPayload,
  LoginUserDto,
  RoleType,
  RpcErrorPayload,
  TCPCONSTANTS,
  UserDto,
  UserWithPasswordDto,
  ValidateTokenResult,
} from '@oppn/shared';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AppService {
  constructor(
    @Inject(TCPCONSTANTS.servicesNames.userService)
    private readonly usersClient: ClientProxy,
    private jwtService: JwtService,
    // eslint-disable-next-line prettier/prettier
  ) { }

  async login(credentials: LoginUserDto) {
    let userExists: UserWithPasswordDto;

    // 1. Cacheo de la consulta del ms-usuarios para saber si el usuario existe
    // 2. Se tiene que capturar cualquier error que venga del microservicio de usuarios
    // 3. Todo ms-intermediario tambien debe de mandar la RPCException para que el destino final (api-gateway) pueda interpretarlo
    try {
      userExists = await firstValueFrom(
        this.usersClient.send<UserWithPasswordDto>(
          TCPCONSTANTS.routingKeys.userProfileEmail,
          credentials.email,
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

    const isMatch = await compareWithHashString(
      credentials.password,
      userExists.password,
    );

    if (!isMatch) {
      throw new UnauthorizedException();
    }

    const jwtPayload: JwtPayload = {
      sub: userExists.id,
      email: userExists.email,
      role: userExists.role,
    };

    const user: UserDto = {
      id: userExists.id,
      email: userExists.email,
      role: userExists.role,
      name: userExists.name,
      createdAt: userExists.createdAt,
      updatedAt: userExists.updatedAt,
    };

    return {
      access_token: await this.jwtService.signAsync(jwtPayload),
      user,
    };
  }

  validateToken(token: string) {
    try {
      const payload = this.jwtService.verify<JwtPayload>(token);

      const validateT: ValidateTokenResult = {
        valid: true,
        user: {
          id: payload.sub,
          email: payload.email,
          role: payload.role as RoleType,
        },
      };
      return validateT;
    } catch {
      const validateT: ValidateTokenResult = {
        valid: false,
        user: null,
      };
      return validateT;
    }
  }
}
