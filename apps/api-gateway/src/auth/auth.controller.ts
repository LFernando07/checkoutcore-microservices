import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  LoginUserDto,
  LoginUserResponseDto,
  sendAndHandle,
  TCPCONSTANTS,
} from '@oppn/shared';
import { Public } from '../common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(TCPCONSTANTS.servicesNames.authService)
    private readonly authClient: ClientProxy,
    // eslint-disable-next-line prettier/prettier
  ) { }

  @Public()
  @Post('login')
  async login(
    @Body() loginUserDto: LoginUserDto,
  ): Promise<LoginUserResponseDto> {
    return await sendAndHandle<LoginUserResponseDto>(
      this.authClient,
      TCPCONSTANTS.routingKeys.authLogin,
      loginUserDto,
    );
  }
}
