import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TCPCONSTANTS, LoginUserDto, LoginUserResponseDto } from '@oppn/shared';

@Controller()
export class AppController {
  // eslint-disable-next-line prettier/prettier
  constructor(private readonly appService: AppService) { }

  // Patron de mensaje para el inicio de sesion asincrono
  @MessagePattern(TCPCONSTANTS.routingKeys.authLogin)
  async login(
    @Payload() credentials: LoginUserDto,
  ): Promise<LoginUserResponseDto> {
    return await this.appService.login(credentials);
  }

  @MessagePattern(TCPCONSTANTS.routingKeys.validateToken)
  validateToken(@Payload() token: string) {
    return this.appService.validateToken(token);
  }
}
